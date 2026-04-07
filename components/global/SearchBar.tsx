"use client";

import { Input } from "antd";
import { ConfigProvider } from "antd";
import { MAIN_THEME } from "@/shared/colors";

export default function SearchBar() {
  return (
    <div className="w-[90%]">
        <Input.Search size="large" placeholder="Enter Product Name"/>
    </div>
  );
}
