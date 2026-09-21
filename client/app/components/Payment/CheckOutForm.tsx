import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import React, { FC, useState } from "react";

type Props = {
  setOpen: any;
  data: any;
};

const CheckOutForm: FC<Props> = ({ setOpen, data }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<any>("");
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery({ skip: loadUser ? false : true });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  };

  return <div>CheckOutForm</div>;
};

export default CheckOutForm;
