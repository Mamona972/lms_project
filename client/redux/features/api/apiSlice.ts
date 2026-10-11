import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl:
      typeof window === "undefined"
        ? process.env.SERVER_URI || "http://localhost:8000/api/v1/"
        : process.env.NEXT_PUBLIC_SERVER_URI || "/api/v1/",
        credentials: "include",
  }),

  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          if (typeof window !== "undefined") {
            console.warn("Could not load user:", error);
          }
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;