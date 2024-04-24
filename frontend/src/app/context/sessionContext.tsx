"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  NewUserProps,
  SessionContextType,
  User,
  Session,
} from "@/src/utils/types";
import toast from "react-hot-toast";
import { AUTH_ROUTES } from "@/src/utils/routes";
import { useRouter } from "next/navigation";
import { axiosInstance } from "../lib/axios-instance";
import { fetcher } from "@/src/utils/fetcher";
import jwt from "jsonwebtoken";

// Create the context
export const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);

// Define the provider
export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>({
    user: null,
    expires: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // auto log in user from token.
  const access_token = localStorage.getItem("a_t");
  // Retrieve the refresh token from cookies

  useEffect(() => {
    if (access_token) {
      const decodedToken = jwt.decode(access_token);

      // If the token is expired  refresh else set user to token result
      if (decodedToken.exp <= Date.now() / 1000) {
        refreshToken();
      } else {
        setSession((prevSession) => ({
          ...prevSession,
          user: {
            _id: decodedToken._id,
            email: decodedToken.email,
            name: decodedToken.name,
          },
          expires: decodedToken.exp,
        }));
      }
    }
  }, [access_token]);

  // refresh access token
  const refreshToken = async () => {
    // setIsLoading(true);
    try {
      const res = await axiosInstance.post(`${AUTH_ROUTES.REFRESH_TOKEN}`, {
        withCredentials: true, // Ensure credentials are sent with every request
      });

      if (res.status == 200) {
        localStorage.setItem("a_t", res.data.accessToken);
        //
      } else {
        // sign out
        // signOut()
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      // setIsLoading(false);
    }
  };

  // create a new account here
  const createAccount = async (data: NewUserProps) => {
    const user_data = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    try {
      const res = await axiosInstance.post(
        `${AUTH_ROUTES.REGISTER}`,
        user_data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (res.status == 201) {
        toast.success("Successfully Registered!");
        // initiate login
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // log in user here
  const signIn = async (data: NewUserProps) => {
    const user_data = {
      email: data.email,
      password: data.password,
    };
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(`${AUTH_ROUTES.LOGIN}`, user_data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (res.status == 200) {
        localStorage.setItem("a_t", res.data.accessToken);
        const decodedToken = jwt.decode(res.data.accessToken);

        setSession((prevSession) => ({
          ...prevSession,
          user: {
            _id: res.data._id,
            email: res.data.email,
            name: res.data.name,
          },
          expires: decodedToken.exp,
        }));

        toast.success("Successfully Signed In!");
        // initiate login
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // sign users out here
  const signOut = async () => {
    if (!session) {
      toast.error("You are not Logged in!");
      // remove access
      localStorage.removeItem("a_t");
      // redirect
      router.replace("/login");
      router.refresh();
      return;
    }

    const user_data = {
      _id: session.user._id,
    };
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(`${AUTH_ROUTES.LOGOUT}`, user_data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (res.status == 200) {
        setSession(null);
        toast.success("Successfully Signed Out!");
        // redirect
        router.replace("/login");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
      // remove token
      localStorage.removeItem("a_t");
      // redirect
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading,
        createAccount,
        signIn,
        signOut,
        refreshToken,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// Define a custom hook to use the context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
