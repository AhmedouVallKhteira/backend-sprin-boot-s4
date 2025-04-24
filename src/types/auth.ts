export interface RegisterRequest {
  nom: string;
  email: string;
  motDePasse: string;
}

export interface RegisterResponse {
    id:number;
    nom: string;
    email: string;
}

export interface ActivateAccountRequest {
  email: string;
  otp: number;
}

export interface ActivateAccountResponse {
  email: string;
  message:string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    type: string;
    id: number;
    nom: string;
    email: string;
    role: string;
}

export interface forgotPasswordRequest {
  email: string;
}
export interface forgotPasswordResponse {
    email: string;
    message: string;
}

export interface ConfirmOtpAndNewPasswordRequest {
  email: string;
  otp: number;
  newPassword: string;
}
export interface ConfirmOtpAndNewPasswordResponse{
    email: string;
    message: string;
}
export interface ResentOtpRequest {
    email: string;
    type: string;
}

export interface ResentOtpResponse {
    message: string;
}

export interface CheckAuthRequest {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  nom: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
}



export interface CheckAuthResponse extends User {
  accessToken: string;
  refreshToken: string;
  type: string;
}

export interface LogoutRequest {
    email: string;
}

export interface LogoutResponse {
    message: string;
}

export type Role = "USER" | "ADMIN" | "SUPERADMIN";
