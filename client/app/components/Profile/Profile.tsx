import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogOutQuery } from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword  from "./ChangePassword "
import CourseCard from "../Course/CourseCard";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar]= useState(null);
  const [active, setActive] =useState(1);
  const [logout, setLogout]= useState(false);
  const [courses, setCourses]= useState<any[]>([])
  const {data, isLoading}= useGetAllCoursesQuery(undefined,{})
 
  const {}= useLogOutQuery(undefined,{
    skip: !logout ? true : false ,
  });

  const logOutHandler= async()=>{
   setLogout(true);
   await signOut();
  }

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

 
useEffect(() => {
  const allCourses = Array.isArray(data)
    ? data
    : data?.courses;

  if (!Array.isArray(allCourses) || !Array.isArray(user?.courses)) {
    return;
  }

  const purchasedCourseIds = user.courses.map(
    (item: any) => String(item.courseId || item._id || item.id)
  );

  const filteredCourses = allCourses.filter((course: any) =>
    purchasedCourseIds.includes(String(course._id))
  );

  console.log("FILTERED PURCHASED COURSES:", filteredCourses);

  setCourses(filteredCourses);
}, [data, user?.courses]);
  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] md:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000014] rounded-[5px] dark:shadow-sm shadow-sm mt-[80px] mb-[80px] sticky
         ${scroll ? "top-[120px]" : "top-[30px]"} left-[30px]`}
      >
        <SideBarProfile user={user} active={active} avatar={avatar} setActive={setActive} logOutHandler={logOutHandler} />
        </div>
        {active ===1 && (
                <div className="w-full h-full bg-transparent mt-[80px]">
                  <ProfileInfo  avatar={avatar} user={user}/>
                </div>
            )}
        {active ===2 && (
                <div className="w-full h-full bg-transparent mt-[80px]">
                  <ChangePassword  />
                </div>
            )}

        
{active === 3 && (
  <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8">
    {Array.isArray(courses) && courses.length > 0 ? (
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-3 xl:gap-[35px]">
        {courses.map((item: any) => (
          <CourseCard
            item={item}
            key={item._id || item.id}
            isProfile={true}
          />
        ))}
      </div>
    ) : (
      <h1 className="text-center text-[18px] font-Poppins">
        You don't have any purchased courses!
      </h1>
    )}
  </div>
)}

    </div>
  );
};
export default Profile;
