import { serverAddr } from "@/shared/constants";
import { UpdateProfilePayload, UpdateProfileResponse, UserProfile } from "@/shared/interfaces/user";
import axios from "axios";

// Format null strings returned by the backend
export const formatUserProfile = (profile: any): UserProfile => {
  const formatted = { ...profile };
  for (const key in formatted) {
    if (formatted[key] === "null") {
      formatted[key] = "";
    }
  }
  if (formatted.address) {
    formatted.address = { ...formatted.address };
    for (const key in formatted.address) {
      if (formatted.address[key] === "null") {
        formatted.address[key] = "";
      }
    }
  }
  return formatted as UserProfile;
};

export const getProfile = async (): Promise<UserProfile> => {
  const options = {
    url: `${serverAddr}/api/user/me`,
    method: "get",
    withCredentials: true,
  };

  try {
    const response = await axios.request(options);
    return formatUserProfile(response.data);
  } catch (err) {
    throw err;
  }
};

export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
  const options = {
    url: `${serverAddr}/api/user/me`,
    method: "put", 
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    data: payload,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    throw err;
  }
};