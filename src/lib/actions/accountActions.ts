export const makeAccountSuccess = (accountData: any) => ({
  type: "MAKE_ACCOUNT_SUCCESS",
  payload: {
    account: accountData.account,
    balance: accountData.balance,
  },
});

export const setAccountLogout = () => ({
  type: "SET_ACCOUNT_LOGOUT",
  payload: {
    account: null,
    balance: null,
  },
});
