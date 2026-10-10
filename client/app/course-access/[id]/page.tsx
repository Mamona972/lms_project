'use client'
import Loader from '@/app/components/Loader/Loader';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { redirect } from 'next/dist/server/api-utils';
import React, { useEffect, useState } from 'react'
import CourseContent from "../../components/Course/CourseContent"
import { useRouter } from 'next/navigation';
type Props = {
    params: Promise<{
        id: string;
    }>;
}

const Page = ({params}: Props) => {
    const router= useRouter();
    const { id } = React.use(params);
    const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);
    const { isLoading, error, data } = useLoadUserQuery(undefined, {
  skip: !mounted,
});

    useEffect(()=>{
        if(data){
        const isPurchased = data.user.courses.find((item:any)=>item._id ===id);
        if(!isPurchased){
            router.push("/")
        }
        if(error){
            router.push("/")
        }
        }
    },[data,error])
  return (
   <>{
    isLoading ?(
     <Loader/>
    ):(
        <div>
            <CourseContent  id={id} user={data.user}/>
        </div>
    )
   }
   </>
  )
}

export default Page