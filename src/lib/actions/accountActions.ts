export const makeAccountSuccess = (accountData: any) => ({
  type: "MAKE_ACCOUNT_SUCCESS",
  payload: {
    account: accountData.account,
    balance: accountData.balance,
  },
});

export const makeAccountFail = () => ({
  type: "MAKE_ACCOUNT_FAIL",
  payload: {
    account: null,
    balance: null,
  },
});
