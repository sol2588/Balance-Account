interface UserProps {
  isLoggedIn: boolean;
  userName: string | null;
  userId: string | null;
  accessToken: string | null;
}
const initialState: UserProps = {
  isLoggedIn: false,
  userName: "",
  userId: "",
  accessToken: "",
};

// reducer
const userReducer = (state = initialState, action: any): UserProps => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.id,
        accessToken: action.payload.token,
      };
    case "LOG_OUT":
      return {
        ...state,
        isLoggedIn: false,
        userName: null,
        userId: null,
        accessToken: null,
      };
    default:
      return state;
  }
};

export default userReducer;
