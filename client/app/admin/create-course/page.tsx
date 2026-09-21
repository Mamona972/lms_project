"use client"
import React from 'react'
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar"
import CreateCourse from "../../components/Admin/Course/CreateCourse"
import DashboardHeader from '@/app/components/Admin/DashboardHeader'


type Props = {}

const page = (props: Props) => {
  return (
    <div>
       <div className='flex'>
       <div className='1500px:w-[16%] w-1/5'>
             <AdminSidebar/>
       </div>
       <div className='w-[85%]'>
         <DashboardHeader/>
         <CreateCourse/>
       </div>
    </div>
    </div>
  )
}

export default page