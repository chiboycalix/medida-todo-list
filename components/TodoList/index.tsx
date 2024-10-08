"use client"
import React, { useEffect, useMemo, useState } from 'react'
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import dynamic from 'next/dynamic'
import { startOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, isWithinInterval, endOfDay } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useLogout } from '@/hooks/useLogout';
import { Plus } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Todo } from '@/types/Todo';

const TodoItem = dynamic(() => import('@/components/TodoItem'), {
  loading: () => <p>Loading...</p>,
});

const AddTodo = dynamic(() => import('@/components/AddTodo'))

type FilterOption = 'all' | 'today' | 'week' | 'month';

const TodoList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterOption>('all');
  const { user, loading } = useAuth();
  const logout = useLogout();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setTodos([]);
      return;
    }
    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid),
      where('dueDate', '>=', startOfMonth(new Date())),
      orderBy('dueDate', 'asc'),
      orderBy('priority', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todoList: Todo[] = [];
      querySnapshot.forEach((doc) => {
        todoList.push({ id: doc.id, ...doc.data() } as Todo);
      });
      setTodos(todoList);
    });
    return () => unsubscribe();
  }, [user, loading]);

  const filterTodos = (todos: Todo[], filter: FilterOption): Todo[] => {
    const today = new Date();
    switch (filter) {
      case 'today':
        return todos.filter(todo => isWithinInterval(todo.dueDate.toDate(), {
          start: startOfDay(today),
          end: endOfDay(today)
        }));
      case 'week':
        return todos.filter(todo => isWithinInterval(todo.dueDate.toDate(), {
          start: startOfWeek(today),
          end: endOfWeek(today)
        }));
      case 'month':
        return todos.filter(todo => isWithinInterval(todo.dueDate.toDate(), {
          start: startOfMonth(today),
          end: endOfMonth(today)
        }));
      default:
        return todos;
    }
  };

  const groupTodosByDay = (todos: Todo[]) => {
    const grouped: { [key: string]: Todo[] } = {};
    todos.forEach((todo) => {
      const dayKey = format(todo.dueDate.toDate(), 'EEEE, do MMMM');
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(todo);
    });
    return grouped;
  };

  const filteredTodos = useMemo(() => filterTodos(todos, filter), [todos, filter]);
  const groupedTodos = useMemo(() => groupTodosByDay(filteredTodos), [filteredTodos]);

  if (loading) {
    return <div className='flex items-center justify-center h-screen'>
      <Loader size='large' color='text-black' />
    </div>;
  }

  return (
    <div className='relative bg-white mx-auto rounded-2xl p-8 border shadow-sm lg:w-[40%] ipad:w-[60%] sm:w-[70%] w-[100%]'>
      <div className="w-full mb-4 flex flex-col lg:flex-row items-center justify-between">
        <h2 className="text-2xl font-black p-2 text-center lg:text-left">
          <span className='text-green-500'>{user?.displayName}&apos;s</span> Todo List
        </h2>
        <Button onClick={logout} size="sm">Sign Out</Button>
      </div>
      <div className="mb-4 p-2">
        <Select value={filter} onValueChange={(value: FilterOption) => setFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Todos</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='mt-5'>
        <ScrollArea className="h-[500px]" scrollHideDelay={0}>
          {filteredTodos?.length === 0 ?
            <div className='flex items-center justify-center'>No Todo(s) available</div> :
            Object.entries(groupedTodos).map(([day, dayTodos]) => (
              <div key={day} className="rounded mb-0 p-2">
                <h2 className="md:text-xl text-md font-bold mb-2 text-[#E53170]">{day}</h2>
                {dayTodos.map((todo, idx) => (
                  <TodoItem key={idx} todo={todo} />
                ))}
              </div>
            ))
          }
        </ScrollArea>
      </div>

      <div className='flex items-center justify-between mt-10'>
        <div></div>
        <div>

          <Modal isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} title='Add Todo'>
            <AddTodo onSuccess={() => setIsOpen(false)} />
          </Modal>
          <Button
            className="rounded-full w-14 h-14 shadow-lg bg-[#E53170] hover:bg-[#E53170]"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TodoList;