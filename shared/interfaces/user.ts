export interface UserAddress {
  zip: string;
  road: string;
  district: string;
  subDistrict: string;
  houseNumber: string;
  province: string;
}

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address: UserAddress;
}

export interface UpdateProfilePayload {
  firstName: string; 
  lastName: string; 
  telephone: string;
  address: UserAddress;
}

export interface UpdateProfileResponse {
  message: string;
}