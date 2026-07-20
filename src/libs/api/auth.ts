// src/libs/api/auth.ts

import axios, { AxiosError } from "axios";
import api from "./axiosInstance";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterOwnerPayload {
  fullname: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

interface BasicResponse {
  message: string;
}

/* ========== LOGIN ========== */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/owner/login`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    let msg = "Login failed.";
    if (error instanceof AxiosError) msg = error.response?.data?.message ?? msg;
    throw new Error(msg);
  }
}

/* ========== LOGOUT ========== */
export async function logout(): Promise<BasicResponse | null> {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/owner/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch {
    return null;
  }
}

/* ========== REGISTER OWNER ========== */
export async function registerOwner(payload: RegisterOwnerPayload): Promise<BasicResponse> {
  try {
    const response = await axios.post<BasicResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/owner/register`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    let msg = "Owner registration failed.";
    if (error instanceof AxiosError) msg = error.response?.data?.message ?? msg;
    throw new Error(msg);
  }
}

interface VerifyOTPPayload {
  email: string;
  otp: string;
}

interface ResendOTPPayload {
  email: string;
}

/* ========== VERIFY EMAIL OTP ========== */
export async function verifyEmailOTP(payload: VerifyOTPPayload): Promise<BasicResponse> {
  try {
    const response = await axios.post<BasicResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/owner/verify-email`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    let msg = "OTP verification failed.";
    if (error instanceof AxiosError) msg = error.response?.data?.message ?? msg;
    throw new Error(msg);
  }
}

/* ========== RESEND EMAIL OTP ========== */
export async function resendEmailOTP(payload: ResendOTPPayload): Promise<BasicResponse> {
  try {
    const response = await axios.post<BasicResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/owner/resend-otp`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    let msg = "Failed to resend OTP.";
    if (error instanceof AxiosError) msg = error.response?.data?.message ?? msg;
    throw new Error(msg);
  }
}

// ========= CLAIMING ACCOUNT =========
export interface ClaimPreview {
    fullname: string;
    email: string;
    phoneNumber: string;
}

export async function getClaimPreview(token: string): Promise<ClaimPreview> {
    try {
        const response = await api.get(`/auth/owner/claim/${token}`);
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error fetching claim preview:", error.response?.data || error.message);
        } else {
            console.error("Error fetching claim preview:", error);
        }
        throw error;
    }
}

export async function claimAccount(token: string, password: string): Promise<void> {
    try {
        await api.post(`/auth/owner/claim/${token}`, { password });
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error claiming account:", error.response?.data || error.message);
        } else {
            console.error("Error claiming account:", error);
        }
        throw error;
    }
}