import { jwtDecode } from "jwt-decode";

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const isTokenExpired = (token: string) => {
  const decoded: any = jwtDecode(token);
  return decoded.exp * 1000 < Date.now();
};
