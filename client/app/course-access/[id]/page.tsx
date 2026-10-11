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

    
useEffect(() => {
  if (!mounted || isLoading) return;

  if (error || !data?.user) {
    router.push("/");
    return;
  }

  const isPurchased = data.user.courses?.some(
    (item: any) =>
      String(item.courseId || item._id || item.id) === String(id)
  );

  if (!isPurchased) {
    router.push("/");
  }
}, [mounted, isLoading, data, error, id, router]);


  return (
   <>{
    isLoading ?(
     <Loader/>
    ):(
        <div>
            <CourseContent  id={id} user={data?.user}/>
        </div>
    )
   }
   </>
  )
}

export default Page