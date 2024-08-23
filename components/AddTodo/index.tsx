
import React, { useReducer } from 'react';
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon } from "lucide-react"
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Label } from "@/components/ui/label";
import { initialTodoState, todoReducer } from "@/reducers/todoReducer";
import { useToast } from "@/components/ToastContainer";

const AddTodo = ({ onSuccess }: { onSuccess: () => void }) => {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState)
  const { title, dueDate, priority, isCreatingTodo } = state;
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_IS_CREATING_TODO', payload: true });
    if (!title) {
      addToast("Please enter Todo title", 'error');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, 'todos'), {
        title,
        completed: false,
        createdAt: Timestamp.now(),
        dueDate: Timestamp.fromDate(dueDate),
        userId: user.uid,
        priority,
      });
      if (onSuccess) onSuccess();
      addToast("Todo added successfully", 'success');
      dispatch({ type: "RESET_FORM" })
    } catch (error) {
      addToast("Something went wrong", 'error');
    } finally {
      dispatch({ type: 'SET_IS_CREATING_TODO', payload: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <Label htmlFor="title" className='mb-2'>Title</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}
          placeholder="Add a new todo"
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
        <Popover>
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
              onSelect={(value) => dispatch({ type: "SET_DUE_DATE", payload: value as any })}
              initialFocus
              className="w-full"
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button type="submit" className="w-full">
        {isCreatingTodo ? <Loader /> : "Add Todo"}
      </Button>
    </form>
  );
};

export default AddTodo;