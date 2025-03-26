"use server"
import { cookies } from 'next/headers';

// JWT Token Management
export const setAuthCookie = async (token: string) => {
  (await cookies()).set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  });
};

export const removeAuthCookie = async () => {
  (await cookies()).delete('auth_token');
};

export const getAuthToken = async () => {
  return (await cookies()).get('auth_token')?.value;
};

export const isAuthenticated = async () => {
  return !!getAuthToken();
};