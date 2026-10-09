import { useGetCourseContentQuery } from '@/redux/features/courses/coursesApi';
import React, { useState } from 'react'
import Loader from '../Loader/Loader';
import CourseContentMedia from "./CourseContentMedia"
import CourseContentList from "./CourseContentList"
import Header from '../Header';
type Props = {
    id: string;
    user:any;

}

const CourseContent = ({id, user}: Props) => {
    const {data:contentData, isLoading, refetch}= useGetCourseContentQuery(id, {refetchOnMountOrArgChange:true});
    const data=contentData?.content;
    const[activeVideo, setActiveVideo] = useState(0);
    const [open, setOpen]= useState(false);
    const[route, setRoute]= useState("Login");

  return (
    <>
    {
      isLoading ?(
        <Loader />
      ):(
       <>
      <Header activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute}/>

       <div className='w-full grid md:grid-cols-10'>
        <div className='col-span-7'>
          <CourseContentMedia
            data={data}
            id={id}
            user={user}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
            refetch={refetch}
          />
          </div> 
           <div className="hidden 800px:block 800px:col-span-3">
           <CourseContentList
             setActiveVideo={setActiveVideo}
             data={data}
             activeVideo={activeVideo}
             />
            </div>
       </div>
       </>

      )
    }
    </>
  )
}
export default CourseContent;