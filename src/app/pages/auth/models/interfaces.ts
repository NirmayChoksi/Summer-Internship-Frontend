import { UserRole } from './enums';

export interface Register {
  email: string;
  role: UserRole;
}

export interface VerifyOtp {
  id: string;
  otp: string;
}

export interface CreatePassword {
  id: string;
  password: string;
  confirmPassword: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  isOtpVerified: boolean;
  isProfileComplete: boolean;
  role: UserRole;
}

export interface RegisterResponse {
  message: string;
  id: string;
  isOtpVerified: boolean;
  isProfileComplete: boolean;
  isPasswordCreated: boolean;
}
