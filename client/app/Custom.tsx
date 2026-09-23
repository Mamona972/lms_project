"use client";

import React, { useEffect, useState } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"; // use your correct path
import Loader from "./components/Loader/Loader"

type Props = {
  children: React.ReactNode;
};

const Custom = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);

  const { isLoading } = useLoadUserQuery({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};
export default Custom;