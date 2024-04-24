import axios from "axios";
import toast from "react-hot-toast";

const APIS_BASE_URL = process.env.NEXT_PUBLIC_APIS_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: APIS_BASE_URL,
});

// Add request interceptor to attach access token to outgoing requests
axiosInstance.interceptors.request.use((request) => {
  // let token = globalThis.localStorage?.getItem("a_t");
  // if (token) {
  //   request.headers.Authorization = `Bearer ${token}`;
  // }
  // Assuming you have access to the cookie value
//   const authToken = "refresh_token";
// console.log(request);

//   // Set the cookie in the header
//   request.headers["Cookie"] = `refresh_token=${authToken}`;

  return request;
});

// Add response interceptor to handle token expiration and refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Return a successful response directly
    return response;
  },
  async (error) => {
    // Check if the error response status is 401 (Unauthorized)
    // if (error.response && error.response.status === 401) {
    //   try {
    //     // Make a request to refresh the token
    //     const refreshTokenResponse = await axios.post("/api/refresh-token", {});

    //     // Extract the new access token from the response
    //     const newAccessToken = refreshTokenResponse.data.accessToken;

    //     // Retry the original request with the new access token
    //     error.config.headers.Authorization = `Bearer ${newAccessToken}`;
    //     return axiosInstance.request(error.config);
    //   } catch (refreshTokenError) {
    //     // Handle the refresh token error, e.g., redirect to login page
    //     console.error("Error refreshing token:", refreshTokenError);
    //     // Redirect to login page or perform other actions
    //   }
    // }

    // Return the error if it's not a 401 error or if token refresh failed
    return Promise.reject(error);
  }
);
