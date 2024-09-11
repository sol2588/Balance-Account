export const makeAccountSuccess = (accountData: any) => ({
  type: "MAKE_ACCOUNT_SUCCESS",
  payload: {
    account: accountData.account,
    balance: accountData.balance,
  },
});

export const getAccountSuccess = () => ({
  type: "GET_ACCOUNT_SUCCESS",
});

export const setAccountCharge = (accountData: string) => ({
  type: "SET_ACCOUNT_CHARGE",
  payload: {
    balance: accountData,
  },
});

export const setAccountLogout = () => ({
  type: "SET_ACCOUNT_LOGOUT",
  payload: {
    account: null,
    balance: null,
  },
});
