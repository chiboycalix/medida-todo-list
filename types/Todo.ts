import { Priority } from "./Priority";

export type Todo = {
  id: string;
  title: string;
  dueDate: Date | any;
  completed: boolean;
  priority: Priority;
};
