import { Page } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import Home from "./pagename";

export default function HomePage() {
  const fetch = useAuthenticatedFetch();
  const [orderId, setOrderId] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [cancelOrders, setCancelOrders] = useState(null);
  const [random, setRandom] = useState(null);

  const [selected, setSelected] = useState(0);

  const fetchOrder = async () => {
    try {
      const response = await fetch("/api/orders");
      const getOrderId = await response.json();
      setOrderId(getOrderId[0].id);
      console.log("Get Data", getOrderId);
      if (getOrderId[0]?.line_items?.length > 1) {
        setOrderData(getOrderId);
      }
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
      setCancelOrders(res);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const orderCreate = async (id) => {
    const data = {
      variant_id: orderData[0]?.line_items[id]?.variant_id,
      customer_id: orderData[0]?.customer?.default_address?.customer_id,
      quantity: orderData[0]?.line_items[id]?.quantity,
      address1: orderData[0]?.line_items[id]?.properties[0]?.value,
      company: orderData[0]?.shipping_address?.company,
      country: orderData[0]?.shipping_address?.country,
      province: orderData[0]?.billing_address?.province,
      currency: orderData[0]?.currency,
      first_name: orderData[0]?.billing_address?.first_name,
      last_name: orderData[0]?.billing_address?.last_name,
      address2: orderData[0]?.shipping_address?.address2,
      city: orderData[0]?.billing_address?.city,
      zip: orderData[0]?.billing_address?.zip,
      phone: orderData[0]?.line_items[0]?.properties[1]?.value,
    };
    try {
      const response = await fetch("/api/orders/create", {
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

  //update order

  useEffect(() => {
    fetchOrder();
  }, [random]);

  useEffect(() => {
    const checkAdd = orderData[0]?.line_items[0]?.properties.includes("Empty");
    console.log("checkAdd", checkAdd);
    if (orderData[0]?.line_items?.length > 1 && checkAdd == false) {
      cancelOrder();
      addOrderTag();
    }
  }, [orderData, random]);

  useEffect(() => {
    if (orderData[0]?.tags === "cancelled") {
      orderData[0]?.line_items?.map((item, index) => {
        const checkAdd =
          orderData[0]?.line_items[index]?.properties.includes("Empty");
        if (!checkAdd) {
          orderCreate(index);
        }
      });
      setOrderData([]);
    }
  }, [cancelOrders, random]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("seconds", 1);
      setRandom(Math.random());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // const orderUpdate = async (id) => {
  //   const data = {
  //     variant_id: orderData[0]?.line_items[id]?.variant_id,
  //     customer_id: orderData[0]?.customer?.default_address?.customer_id,
  //     quantity: orderData[0]?.line_items[id]?.quantity,
  //     company: orderData[0]?.shipping_address?.company,
  //     country: orderData[0]?.shipping_address?.country,
  //     country_code: orderData[0]?.shipping_address?.country_code,
  //     province: orderData[0]?.shipping_address?.province,
  //     province_code: orderData[0]?.shipping_address?.province_code,
  //     currency: orderData[0]?.currency,
  //     first_name: orderData[0]?.shipping_address?.first_name,
  //     last_name: orderData[0]?.shipping_address?.last_name,
  //     address1: orderData[0]?.shipping_address?.address1,
  //     address2: orderData[0]?.shipping_address?.address2,
  //     city: orderData[0]?.shipping_address?.city,
  //     zip: orderData[0]?.shipping_address?.zip,
  //     phone: orderData[0]?.shipping_address?.phone,
  //   };
  //   try {
  //     const response = await fetch("/api/orders/update", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     const res = await response.json();
  //     console.log(res);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   orderUpdate();
  // }, [orderData]);

  console.log("order data", orderData);
  console.log("adress", orderData[0]?.line_items[0]?.properties[0]?.value);
  console.log("adress", orderData[0]?.line_items[0]?.properties[1]?.value);

  return <Home />;
}
