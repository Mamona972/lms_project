import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";

type Props = {};

const Hero: FC<Props> = (props) => {
const {data}= useGetHeroDataQuery("Banner");


  return (
    <div className="w-full lg:flex items-center min-h-screen px-4 lg:px-12">
      {/* Left Column (Image & Animated Circle) */}
      <div className="lg:w-[50%] flex items-center justify-center relative min-h-[400px] lg:min-h-[600px]">
        {/* Animated Background Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] lg:h-[550px] lg:w-[550px] xl:h-[650px] xl:w-[650px] hero_animation rounded-full z-10" />
        
        <Image
          src={data?.layout?.banner?.image?.url}
          width={400}
          height={400}
          alt="Hero Banner"
          className="object-contain w-[80%] max-w-[500px] lg:max-w-[90%] h-auto relative z-10"
        />
      </div>

      {/* Right Column (Text Content) */}
      <div className="lg:w-[50%] flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0 z-10">
        <h2 className="dark:text-white text-[#000000c7] text-[28px] sm:text-[40px] lg:text-[52px] xl:text-[64px] font-[600] font-Josefin leading-tight lg:leading-[1.15]">
          {data?.layout?.banner?.title}
        </h2>

        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[16px] sm:text-[18px] mt-4 max-w-[550px]">
          {data?.layout?.banner?.subtitle}
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-[550px] h-[50px] bg-transparent relative mt-6">
          <input
            type="search"
            placeholder="Search Courses..."
            className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-3 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[18px] font-[500] font-Josefin"
          />
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
            <BiSearch className="text-white" size={28} />
          </div>
        </div>

        {/* Social Proof */}
        <div className="w-full max-w-[550px] flex items-center justify-center lg:justify-start mt-8">
          <Image
            src={require("../../../public/assets/client-1.jpg")}
            alt="Client 1"
            className="rounded-full w-[40px] h-[40px] object-cover"
          />
          <Image
            src={require("../../../public/assets/client-2.jpg")}
            alt="Client 2"
            className="rounded-full w-[40px] h-[40px] object-cover -ml-3"
          />
          <Image
            src={require("../../../public/assets/client-3.jpg")}
            alt="Client 3"
            className="rounded-full w-[40px] h-[40px] object-cover -ml-3"
          />

          <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] pl-3 text-[15px] sm:text-[16px] font-[600]">
            500K+ People already trusted us.{" "}
            <Link
              href="/courses"
              className="dark:text-[#46e256] text-[crimson]"
            >
              View Courses
            </Link>
          </p>
        </div> 
      </div>
    </div>
  );
};

export default Hero;