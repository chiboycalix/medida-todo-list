export type RegisterState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isCreatingTodo: boolean;
};

export type RegisterAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string }
  | { type: "SET_IS_CREATING_TODO"; payload: boolean }
  | { type: "RESET_FORM" };

export const initialRegisterState: RegisterState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  isCreatingTodo: false,
};

export function registerReducer(
  state: RegisterState,
  action: RegisterAction
): RegisterState {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    case "SET_IS_CREATING_TODO":
      return { ...state, isCreatingTodo: action.payload };
    case "RESET_FORM":
      return initialRegisterState;
    default:
      return state;
  }
}
