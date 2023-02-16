import { Page } from "@shopify/polaris";
import { useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import Home from "./pagename";

export default function HomePage() {
  const fetch = useAuthenticatedFetch();
  const [orderId, setOrderId] = useState(null);

  const [selected, setSelected] = useState(0);
  const fetchOrder = async () => {
    try {
      const response = await fetch("/api/orders");
      const getOrderId = await response.json();
      setOrderId(getOrderId[0].id);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(orderId);
  fetchOrder();

  const cancelOrder = async () => {
    try {
      const response = await fetch("/api/orders/cancel", {
        method: "POST",
        body: orderId,
      });
      const getOrderId = await response.json();
      setOrderId(getOrderId[0].id);
    } catch (err) {
      console.log(err);
    }
  };
  cancelOrder();

  const addOrderTag = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        body: orderId,
      });
      const getOrderId = await response.json();
      setOrderId(getOrderId[0].id);
    } catch (err) {
      console.log(err);
    }
  };
  addOrderTag();

  return <Home />;
}
