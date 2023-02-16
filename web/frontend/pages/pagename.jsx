import {
  Card,
  Page,
  Layout,
  Stack,
  Select,
  Button,
  ButtonGroup,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback } from "react";
import { Redirect } from "@shopify/app-bridge/actions";
import { useNavigate } from "@shopify/app-bridge-react";
import CustomSidebar from "../components/CustomSidebar";

export default function Home() {
  const [selected, setSelected] = useState("today");
  const [selected2, setSelected2] = useState("is");
  const [selected3, setSelected3] = useState("");

  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const handleSelectChange2 = useCallback((value) => setSelected2(value), []);

  const options = [
    { label: "Collections", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 days", value: "lastWeek" },
  ];

  const condition = [
    { label: "is", value: "is" },
    { label: "is not", value: "is not" },
  ];

  return (
    <>
      <h2>Working..</h2>
    </>
  );
}
