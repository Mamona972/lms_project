"use client";
import React, { FC, useState } from "react";
import Header from "../components/Header";
import Protected from "../hooks/useProtected";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";

type Props = {};

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activateItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div>
      <Protected>
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activateItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
      </Protected>
    </div>
  );
};

export default Page;
