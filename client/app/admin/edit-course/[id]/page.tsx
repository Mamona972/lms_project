"use client"
import React, { use } from 'react'
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar"
//import CreateCourse from "../../../components/Admin/Course/CreateCourse"
import DashboardHeader from '@/app/components/Admin/DashboardHeader'
import EditCourse from "../../../components/Admin/Course/EditCourse"

type Props = {}

const page = ({ params }: { params: Promise<{ id: string }> }) => {
   const { id } = use(params);
  
   
  return (
    <div>
       <div className='flex'>
       <div className='1500px:w-[16%] w-1/5'>
             <AdminSidebar/>
       </div>
       <div className='w-[85%]'>
         <DashboardHeader/>
         <EditCourse id={id} />
       </div>
    </div>
    </div>
  )
}

export default page