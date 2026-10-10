
"use client";

import React, { useEffect, useState } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

type Props = {
  children: React.ReactNode;
};

const Custom = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);

  // Run the user query only in the browser, after mounting.
  const { isLoading } = useLoadUserQuery(undefined, {
    skip: !mounted,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Connect the socket in the browser and clean it up on unmount.
  useEffect(() => {
    if (!mounted || !ENDPOINT) return;

    const socket = socketIO(ENDPOINT, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [mounted]);

  if (!mounted || isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default Custom;