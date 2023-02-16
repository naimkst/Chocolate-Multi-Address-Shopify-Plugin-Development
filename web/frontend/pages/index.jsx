import { Page } from "@shopify/polaris";
import { useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import Home from "./pagename";

export default function HomePage() {
  const fetch = useAuthenticatedFetch();

  const [selected, setSelected] = useState(0);
  const fetchCollection = async () => {
    try {
      const response = await fetch("/api/orders");
      console.log(await response.json());
    } catch (err) {
      console.log(err);
    }
  };

  fetchCollection();

  return <Home />;
}
