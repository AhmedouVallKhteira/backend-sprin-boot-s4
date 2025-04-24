import { apiClient } from "./apiClient";
import {
  RegisterRequest,
  RegisterResponse,
  ActivateAccountRequest,
  ActivateAccountResponse,
  LoginRequest,
  LoginResponse,
  forgotPasswordRequest,
  forgotPasswordResponse,
  ConfirmOtpAndNewPasswordRequest,
  ConfirmOtpAndNewPasswordResponse,
  ResentOtpRequest,
  ResentOtpResponse,
  CheckAuthRequest,
  CheckAuthResponse,
  LogoutRequest,
  LogoutResponse,
} from "../types/auth";

export const AuthApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>("/auth/register", data),

  activateAccount: (data: ActivateAccountRequest) =>
    apiClient.post<ActivateAccountResponse>("/auth/activate-account", data),

  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>("/auth/login", data),

  checkAuth: (data: CheckAuthRequest) =>{
    return apiClient.post<CheckAuthResponse>("/auth/check-auth", data);
    // apiClient.post<CheckAuthResponse>("/auth/check-auth", data),
  }
    ,

  logout: (data: LogoutRequest) =>
    apiClient.post<LogoutResponse>("/auth/logout", data),

  forgotPassword: (data: forgotPasswordRequest) =>
    apiClient.post<forgotPasswordResponse>("/auth/forgot-password", data),

  resetPassword: (data: ConfirmOtpAndNewPasswordRequest) =>
    apiClient.post<ConfirmOtpAndNewPasswordResponse>(
      "/auth/reset-password",
      data
    ),

  resendOtp: (data: ResentOtpRequest) =>
    apiClient.post<ResentOtpResponse>("/auth/resent-otp", data),
};
