"use client";

import React, { useEffect, useState } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"; // use your correct path
import Loader from "./components/Loader/Loader"
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  children: React.ReactNode;
};

const Custom = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);

  const { isLoading } = useLoadUserQuery({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(()=>{
    socketId.on("connect", () => {})
  })

  if (!mounted || isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};
export default Custom;