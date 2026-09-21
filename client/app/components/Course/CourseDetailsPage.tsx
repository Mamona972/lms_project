import { useGetCourseDetailsQuery } from '@/redux/features/courses/coursesApi';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import Header from '../Header';
import Footer from '../Footer';
import CourseDetails from "./CourseDetails"
import { useCreatePaymentIntentMutation, useGetStripePublishablekeyQuery } from '@/redux/features/orders/ordersApi';
type Props = {
    id:string;
}

const CourseDetailsPage = ({id}: Props) => {
const[route, setRoute]= useState("Login");
const[open, setOpen]= useState(false);
const {data, isLoading}=useGetCourseDetailsQuery(id);
const {data: config}= useGetStripePublishablekeyQuery({})
const [createPaymentIntent, {data:paymentIntentData}] = useCreatePaymentIntentMutation();
const [stripePromise, setStripePromise] = useState<any>(null);
const [clientSecret, setClientSecret] = useState('');

useEffect(() => {
  if(config){
    const publishablekey = config?.publishableKey;
    setStripePromise(loadStripe(publishablekey));
  }
  if(data){
    const amount = Math.round(data.course.price * 100);
    createPaymentIntent(amount);
  };
}, [config,data]);

useEffect(() => {
  if(paymentIntentData){
    setClientSecret(paymentIntentData?.clientSecret);
  }
}, [paymentIntentData]);

  return (
   <>
   {
    isLoading ?(
        <Loader />
    ):(
     <div>
       <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} /> 
       {
        stripePromise && (
            <CourseDetails data={data.course} stripePromise={stripePromise} clientSecret={clientSecret}/>
        )
       }
       <Footer/>
     </div>
    )
   }
   </>
  )
}

export default CourseDetailsPage

function loadStripe(publishablekey: any): any {
    throw new Error('Function not implemented.');
}
