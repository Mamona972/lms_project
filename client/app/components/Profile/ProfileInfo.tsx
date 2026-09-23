'use client'
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import avatarIcon from "../../../public/assets/avatar.jpg";
import { AiOutlineCamera } from "react-icons/ai";
import { styles } from "../../styles/style";
import { useEditProfileMutation, useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [scroll, setScroll] = useState(false);
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, {isSuccess:success ,error:updateError}] = useEditProfileMutation();
  const [loadUser, setLoadUser]= useState(false);
  const {} = useLoadUserQuery(undefined, {skip: loadUser ? false : true})

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log("🔥 IMAGE HANDLER FIRED");

  const file = e.target.files?.[0];

  console.log("📁 SELECTED FILE:", file);

  if (!file) {
    console.log("❌ No file selected");
    return;
  }

  console.log("🔥 CALLING UPDATE AVATAR");

  const fileReader = new FileReader();

  fileReader.onload = () => {
    if (fileReader.readyState === 2) {
      const avatar = fileReader.result;

      console.log("🖼️ IMAGE READY:", avatar);

      updateAvatar(avatar);
    }
  };

  fileReader.readAsDataURL(file);
};

  useEffect(()=>{
     if(isSuccess || success){
        setLoadUser(true)
     }
     if(error || updateError){
        console.log(error)
     }
     if(success){
      toast.success("Profile updated successfully")
     }
  },[isSuccess,error, success, updateError])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(name !== ""){
      await editProfile({
        name:name,
      });
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
            alt=""
            width={120}
            height={120}
            loading="eager"
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] dark:bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1 dark:text-white" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />

      <div className="w-full pl-6 md:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="md:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block pb-2 dark:text-white">Full Name</label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 md:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2 dark:text-white">
                Email Address
              </label>
              <input
                type="text"
                readOnly
                className={`${styles.input} !w-[95%] mb-4 md:mb-0`}
                required
                value={user?.email}
              />
            </div>

            <input
            className={`w-[95%] h-[40px] border border-[#37a39a] text-center text-black dark:text-[#fff] rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
