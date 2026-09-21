"use client";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import { useState } from "react";
import Courses from "./components/Route/Courses"
import Reviews from "./components/Route/Reviews"
import FAQ from "./components/FAQ/FAQ"
import Footer from "./components/Footer"

export default function Page() {
  const [open, setOpen] = useState(false);
  const [activateItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  return (
    <div>
      <Header open={open} 
      setOpen={setOpen} 
      activeItem={activateItem} 
      setRoute={setRoute}
      route={route}
      />
      <Hero />
      <Courses/>
      <Reviews/>
      <FAQ/>
      <Footer/>
    </div>
  );
}
