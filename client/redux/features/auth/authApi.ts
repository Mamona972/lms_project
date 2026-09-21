
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse={
    message: string;
    activationToken: string;
}

type RegistrationDate = {};

export const authApi= apiSlice.injectEndpoints({
    endpoints:(builder)=>({
      //endpoints here
      register: builder.mutation<RegistrationResponse,RegistrationDate>({
        query:(data)=>({
            url:"registration",
            method: "POST",
            body: data,
            credentials:"include" as const,
        }),
       async onQueryStarted(arg, {queryFulfilled, dispatch}){
        try{
          const result= await queryFulfilled;
          dispatch(
            userRegistration({
                token: result.data.activationToken,
            })
          )
        }catch(error){
            console.log(error);
        }
       }
      }),
      //activation
      activation: builder.mutation({
        query: ({activation_token, activation_code})=>({
            url:"activate-user",
            method:"POST",
            body:{
              activation_token,
              activation_code
            },
        }),
      }),
      //login
      login:builder.mutation({
        query:({email, password})=>({
            url:"login",
            method:"POST",
            body:{
                email,
                password
            },
            credentials:"include" as const 
        }),
        async onQueryStarted(arg, {queryFulfilled, dispatch}){
        try{
          const result= await queryFulfilled;
          dispatch(
            userLoggedIn({
                accessToken: result.data.accessToken,
                user: result.data.user,
            })
          )
        }catch(error){
            console.log(error);
        }
       }
      }),
    //socail auth 
    socialAuth:builder.mutation({
        query:({email, name, avatar})=>({
            url:"social-auth",
            method:"POST",
            body:{
                email,
                name,
                avatar,
            },
            credentials:"include" as const 
        }),
        async onQueryStarted(arg, {queryFulfilled, dispatch}){
        try{
          const result= await queryFulfilled;
          dispatch(
            userLoggedIn({
                accessToken: result.data.accessToken,
                user: result.data.user,
            })
          )
        }catch(error){
            console.log(error);
        }
       }
      }),

      //logout query
      logOut:builder.query({
        query:()=>({
            url:"logout",
            method:"get",
            credentials:"include" as const 
        }),
        async onQueryStarted(arg, {queryFulfilled, dispatch}){
        try{
          dispatch(
            userLoggedOut()
          )
        }catch(error){
            console.log(error);
        }
       }
      })

    })
})

export const {useRegisterMutation, useActivationMutation, useLoginMutation, useSocialAuthMutation, useLogOutQuery}= authApi;