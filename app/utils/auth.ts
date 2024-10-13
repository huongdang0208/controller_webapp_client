import { jwtDecode } from "jwt-decode";
import  jwt  from "jsonwebtoken"

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const isTokenExpired = (token: string) => {
  const decoded = jwtDecode(token);
  if (!decoded.exp) {
    return 1 * 1000 < Date.now();
  }
  return decoded?.exp * 1000 < Date.now();
};

export const getTokenExpirationDate = (token: string) => {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
        return undefined;
    }

    if (typeof decoded.payload === "string") {
        return undefined;
    }

    return decoded.payload.exp;
};

