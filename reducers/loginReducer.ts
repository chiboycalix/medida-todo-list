export type LoginState = {
  email: string;
  password: string;
  confirmPassword: string;
  isCreatingTodo: boolean;
};

export type LoginAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string }
  | { type: "SET_IS_CREATING_TODO"; payload: boolean }
  | { type: "RESET_FORM" };

export const initialLoginState: LoginState = {
  email: "",
  password: "",
  confirmPassword: "",
  isCreatingTodo: false,
};

export function loginReducer(
  state: LoginState,
  action: LoginAction
): LoginState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    case "SET_IS_CREATING_TODO":
      return { ...state, isCreatingTodo: action.payload };
    case "RESET_FORM":
      return initialLoginState;
    default:
      return state;
  }
}
