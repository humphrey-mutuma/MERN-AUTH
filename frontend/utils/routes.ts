const APIS_BASE_URL = process.env.NEXT_PUBLIC_APIS_BASE_URL;

export const USER_ROUTES = {
  GET_ALL_USERS: `${APIS_BASE_URL}/users`,
  GET_USER_INFO: `${APIS_BASE_URL}/users`,
  UPDATE_USER_INFO: `${APIS_BASE_URL}/users`,
  DELETE_USER: `${APIS_BASE_URL}/users`,
};
export const AUTH_ROUTES = {
  REGISTER: `${APIS_BASE_URL}/register`,
  LOGIN: `${APIS_BASE_URL}/login`,
  VERIFY_OTP: `${APIS_BASE_URL}/verify-otp`,
  RESEND_OTP: `${APIS_BASE_URL}/resend-otp`,
  RESET_PASSWORD: `${APIS_BASE_URL}/reset-password`,
  REFRESH_TOKEN: `${APIS_BASE_URL}/refresh_token`,
  LOGOUT: `${APIS_BASE_URL}/logout`,
  DELETE_ACCOUNT: `${APIS_BASE_URL}/delete_account`,
};
// others ...
