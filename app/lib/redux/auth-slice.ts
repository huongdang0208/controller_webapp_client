import { getTokenExpirationDate } from "@/app/utils/auth";
import { User } from "@/app/utils/types/user";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { setCookie } from "cookies-next";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setCookieTokens: (state) => {
      const exp = getTokenExpirationDate(state.accessToken || "");
      setCookie(
        "harmonyCookie",
        JSON.stringify({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
        {
          expires: new Date((exp || 1) * 1000), // 1 week
        },
      );
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { setTokens, setUser, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
