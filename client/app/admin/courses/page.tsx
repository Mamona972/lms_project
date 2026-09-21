"use client"
import DashboardHero from '@/app/components/Admin/DashboardHero'
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar'
import AdminProtected from '@/app/hooks/AdminProtected'
import AllCourses from "../../components/Admin/Course/AllCourses";
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
         <AdminProtected>
            <div className='flex h-screen'>
              <div className='1500px:w-[16%] w-1/5'>
                 <AdminSidebar/>
              </div>
              <div className='w-[85%] dark:text-white text-black'>
               <DashboardHero />
               <AllCourses/>
              </div>
          </div>
         </AdminProtected>
        </div>
  )
}

export default page