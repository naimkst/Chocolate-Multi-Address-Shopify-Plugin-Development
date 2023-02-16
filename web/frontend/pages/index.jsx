import { Page } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import Home from "./pagename";

export default function HomePage() {
  const fetch = useAuthenticatedFetch();
  const [orderId, setOrderId] = useState(null);
  const [orderData, setOrderData] = useState([]);

  const [selected, setSelected] = useState(0);

  const fetchOrder = async () => {
    try {
      const response = await fetch("/api/orders");
      const getOrderId = await response.json();
      setOrderId(getOrderId[0].id);
      console.log(getOrderId);
      setOrderData(getOrderId);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelOrder = async () => {
    const data = { id: orderId };
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const addOrderTag = async () => {
    const data = { id: orderId };
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const orderCreate = async () => {
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
      });
      const res = await response.json();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrder();
    if (orderData[0]?.line_items?.length > 1) {
      cancelOrder();
      addOrderTag();
    }
    if (orderData[0]?.tags === "cancelled") {
      orderCreate();
    }
  }, []);

  console.log("order data", orderData);

  return <Home />;
}
