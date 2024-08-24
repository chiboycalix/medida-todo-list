
import React, { useReducer, useState } from 'react';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import { todoReducer } from '@/reducers/todoReducer';
import Loader from '../Loader';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, startOfDay } from "date-fns"
import { cn } from '@/lib/utils';

interface UpdateTodoProps {
  todo: any;
  onCancel: () => void;
}

const UpdateTodo: React.FC<UpdateTodoProps> = ({ todo, onCancel }) => {
  const today = startOfDay(new Date());
  const [open, setOpen] = useState(false)
  const [state, dispatch] = useReducer(todoReducer, {
    title: todo.title,
    priority: todo.priority,
    dueDate: todo.dueDate.toDate(),
    isCreatingTodo: false,
    isDeletingTodo: false,
    isEditingTodo: false
  });

  const { title, dueDate, priority, isEditingTodo } = state;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_IS_EDITING_TODO', payload: true });

    try {
      await updateDoc(doc(db, 'todos', todo.id), {
        title,
        priority,
        dueDate: Timestamp.fromDate(dueDate),
      });
      onCancel();
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      dispatch({ type: 'SET_IS_EDITING_TODO', payload: false });
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div className="flex flex-col">
        <Label htmlFor="title" className='mb-2'>Title</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}
          placeholder="Todo title"
          required
        />
      </div>
      <div className="flex flex-col">
        <Label htmlFor="priority" className='mb-2'>Select Priority</Label>
        <Select value={priority} onValueChange={(value) => dispatch({ type: "SET_PRIORITY", payload: value as any })}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col">
        <Label htmlFor="dueDate" className='mb-2'>Select Due date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              size="lg"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(value) => {
                dispatch({ type: "SET_DUE_DATE", payload: value as any })
                setOpen(false)
              }}
              initialFocus
              className="w-full"
              disabled={(date) => date < today || date < dueDate}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="mt-8 flex flex-col justify-center gap-2">
        <Button type="submit"> {isEditingTodo ? <Loader /> : "Update Todo"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default UpdateTodo;