interface AccountProps {
  created: boolean;
  account: string | null;
  balance: string | null;
}

const initialState: AccountProps = {
  created: false,
  account: "",
  balance: "0",
};

const accountReducer = (state = initialState, action: any): AccountProps => {
  switch (action.type) {
    case "MAKE_ACCOUNT_SUCCESS":
      return {
        ...state,
        created: true,
        account: action.payload.account,
        balance: action.payload.balance,
      };
    case "GET_ACCOUNT_SUCCESS":
      return {
        ...state,
      };
    case "SET_ACCOUNT_CHARGE":
      return {
        ...state,
        balance: action.payload.balance,
      };
    case "SET_ACCOUNT_LOGOUT":
      return {
        ...state,
        account: "",
        balance: "",
      };

    default:
      return state;
  }
};
export default accountReducer;
