"use client";

import React from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"; // use your correct path
import Loader from "./components/Loader/Loader"

type Props = {
  children: React.ReactNode;
};

const Custom = ({ children }: Props) => {
 const {isLoading} = useLoadUserQuery({});
  return(
    <>
    {
      isLoading ? <Loader/>  : <>{children} </>
    }
    </>
  )
};

export default Custom;