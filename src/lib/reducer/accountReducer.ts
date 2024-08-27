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

    default:
      return state;
  }
};
export default accountReducer;
