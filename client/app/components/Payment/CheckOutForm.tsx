import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });


type Props = {
  setOpen: any;
  data: any;
  user:any;
};

const CheckOutForm: FC<Props> = ({ setOpen, data ,user}: Props) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<any>("");
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery({ skip: loadUser ? false : true });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!stripe || !elements){
      return
    }
    setIsLoading(true);
    const {error, paymentIntent}= await stripe.confirmPayment({
      elements,
      redirect:"if_required",
    });
    if(error){
      setMessage(error.message);
      setIsLoading(false);
    }else if( paymentIntent && paymentIntent.status === "succeeded"){
      setIsLoading(false);
      createOrder({courseId: data._id, payment_info: paymentIntent})
    }
  };

  useEffect(()=>{
    if(orderData){
      setLoadUser(true);
      socketId.emit("notification", {
         title: "New order" ,
         message: `New order for ${data.name}`,
         userId: user._id,
        });
      router.push(`/course-access/${data._id}`);
    }
    if(error){
      if("data" in error){
        const errorMessage = error as any;
        toast.error(errorMessage.data.message)
      }
    }
  },[orderData, error])

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="w-full" > 
    {/* Scrollable Payment Area */} 
    <div className="max-h-[380px] overflow-y-auto pr-2 space-y-4"> 
      <div className="w-full"> 
        <LinkAuthenticationElement id="link-authentication-element"  /> 
        </div>
         <div className="w-full"> 
          <PaymentElement id="payment-element" /> 
          </div>
           </div> 
           {/* Message */} 
           {message && ( <div id="payment-message" className="text-[red] font-Poppins pt-2 text-sm" > 
            {message} </div> 
            )} 
            {/* Fixed Button Area */} 
            <div className="mt-4 pt-3 border-t border-gray-200"> 
              <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full" > 
                <span id="button-text" className={`${styles.button} !h-[40px] w-full flex items-center justify-center rounded-md`} > 
                  {isLoading ? "Paying..." : "Pay now"} </span> 
                  </button> </div>
                   </form>
  )
};

export default CheckOutForm;
