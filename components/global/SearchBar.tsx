"use client";

import { Input } from "antd";

type SearchBarProps = {
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchBar({
  setSearchKeyword,
}: SearchBarProps) {
  const onSearch = (value: any) => {
    setSearchKeyword(value)
  }

  return (
    <div className="w-[90%]">
        <Input.Search size="large" placeholder="Enter Product Name" onSearch={onSearch}/>
    </div>
  );
}
