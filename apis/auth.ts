"use server";

import { AuthRequest, AuthResponse } from "@/shared/types/auth";
import axios from "axios";
import { AUTH_BASE_URL } from "@/shared/constants/auth";
import { cookies } from "next/headers";
import { parseAndSetCookies } from "@/shared/utils/cookies";

export const signin = async ({
  email,
  password,
}: AuthRequest): Promise<AuthResponse> => {
  const options = {
    url: `${AUTH_BASE_URL}/signin`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    data: {
      email,
      password,
    },
  };

  try {
    const response = await axios.request(options);

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      const cookieStore = await cookies();
      parseAndSetCookies(cookieStore, setCookieHeader);
    }

    return {
      id: response.data.id,
      username: response.data.username,
    };
  } catch (err) {
    throw err;
  }
};

export const signup = async ({
  email,
  password,
  firstName,
  lastName,
  username,
}: AuthRequest): Promise<AuthResponse> => {
  const options = {
    url: `${AUTH_BASE_URL}/register`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: {
      email,
      password,
      firstName,
      lastName,
      username,
    },
  };
  try {
    const response = await axios.request(options);

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      const cookieStore = await cookies();
      parseAndSetCookies(cookieStore, setCookieHeader);
    }

    return {
      id: response.data.id,
      username: response.data.username,
    };
  } catch (err) {
    throw err;
  }
};

export const signout = async () => {
  const options = {
    url: `${AUTH_BASE_URL}/signout`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };

  try {
    const res = await axios.request(options);
    
    const setCookieHeader = res.headers["set-cookie"];
    if (setCookieHeader) {
      const cookieStore = await cookies();
      parseAndSetCookies(cookieStore, setCookieHeader);
    }
    
    return;
  } catch (err) {
    throw err;
  }
};
