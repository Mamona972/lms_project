"use client"
import React from 'react'
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar"
import AdminProtected from '../../hooks/AdminProtected'
import DashboardHero from "../../components/Admin/DashboardHero"
import EditCategories from "../../components/Admin/Customization/EditCategories"

type Props={}

const Page = (props:Props) => {
  return (
    <div>
     <AdminProtected>
        <div className='flex h-[200vh]'>
          <div className='1500px:w-[16%] w-1/5'>
             <AdminSidebar/>
          </div>
          <div className='w-[85%]'>
           <DashboardHero />
           <EditCategories/>
          </div>
      </div>
     </AdminProtected>
    </div>
  )
}

export default Page;
