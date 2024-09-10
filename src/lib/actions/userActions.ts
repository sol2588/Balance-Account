export const setLoginSuccess = (userData: any) => ({
  type: "LOGIN_SUCCESS",
  payload: { id: userData.id, token: userData.token, name: userData.name },
});

export const setLogoutSuccess = () => ({
  type: "LOGOUT_SUCCESS",
});
