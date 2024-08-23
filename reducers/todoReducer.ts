import { Priority } from "@/types/Priority";

export type TodoState = {
  title: string;
  dueDate: Date;
  priority: Priority;
  isCreatingTodo: boolean;
  isEditingTodo: boolean;
  isDeletingTodo: boolean;
};

export type TodoAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_DUE_DATE"; payload: Date }
  | { type: "SET_PRIORITY"; payload: Priority }
  | { type: "SET_IS_CREATING_TODO"; payload: boolean }
  | { type: "SET_IS_EDITING_TODO"; payload: boolean }
  | { type: "SET_IS_DELETING_TODO"; payload: boolean }
  | { type: "RESET_FORM" };

export const initialTodoState: TodoState = {
  title: "",
  dueDate: new Date(),
  priority: "medium",
  isCreatingTodo: false,
  isEditingTodo: false,
  isDeletingTodo: false,
};

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_DUE_DATE":
      return { ...state, dueDate: action.payload };
    case "SET_PRIORITY":
      return { ...state, priority: action.payload };
    case "SET_IS_CREATING_TODO":
      return { ...state, isCreatingTodo: action.payload };
    case "SET_IS_EDITING_TODO":
      return { ...state, isEditingTodo: action.payload };
    case "SET_IS_DELETING_TODO":
      return { ...state, isDeletingTodo: action.payload };
    case "RESET_FORM":
      return initialTodoState;
    default:
      return state;
  }
}
