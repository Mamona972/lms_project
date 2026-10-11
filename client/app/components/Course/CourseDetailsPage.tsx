"use client";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishablekeyQuery,
} from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: config } = useGetStripePublishablekeyQuery({});
  const [
    createPaymentIntent,
    { data: paymentIntentData, error: paymentError },
  ] = useCreatePaymentIntentMutation();
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (config) {
      const publishablekey = config?.publishableKey;
      setStripePromise(loadStripe(publishablekey));
    }
    if (data?.course?._id && data?.course?.price != null) {
      const amount = Math.round(Number(data.course.price) * 100);

      createPaymentIntent({
        amount,
        courseId: data.course._id,
      });
    }
  }, [config, data]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.client_secret);
    }
     
  }, [paymentIntentData]);

    useEffect(()=>{
        if (paymentError && "data" in paymentError) {
    const message = (paymentError.data as { message?: string })?.message;

    if (message === "You have already purchased this course") {
      toast.error("You already own this course. Open it from My Courses.");
    }
  }
    },[ paymentError])
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          {stripePromise && (
            <CourseDetails
              data={data.course}
              stripePromise={stripePromise}
              clientSecret={clientSecret}
              setRoute={setRoute}
              setOpen={setOpen}
            />
          )}
          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;
