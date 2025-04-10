export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  rate_discount: number;
  wallet: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateParams {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface UserUpdateParams {
  name: string;
  phoneNumber: string;
}
