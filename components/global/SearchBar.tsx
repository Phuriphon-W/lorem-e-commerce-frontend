"use client";

import { Category } from "@/shared/enums/category";
import { OrderBy } from "@/shared/enums/orderBy";
import { Input, Select } from "antd";

type SearchBarProps = {
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<Category>>;
  setOrderBy: React.Dispatch<React.SetStateAction<OrderBy>>;
};

export default function SearchBar({ 
  setSearchKeyword,
  setCategory,
  setOrderBy,
}: SearchBarProps) {
  const onSearch = (value: any) => {
    setSearchKeyword(value);
  };

  const onCategoryChange = (value: any) => {
    setCategory(value);
  }

  const onOrderByChange = (value: any) => {
    setOrderBy(value);
  }

  return (
    <div className="w-[90%] flex gap-2">
      {/* Keyword Search */}
      <Input.Search
        size="large"
        placeholder="Enter Product Name"
        onSearch={onSearch}
      />

      {/* Category Filter */}
      <Select 
        placeholder="Choose a Category"
        style={{ width: "15%" }}
        options={[
          { value: "", label: "All Products" },
          { value: Category.Apparel, label: "Apparels" },
          { value: Category.Accessory, label: "Accessories" },
        ]}
        onChange={onCategoryChange}
      />

      {/* Order By Filter */}
      <Select 
        placeholder="Order By"
        style={{ width: "18%" }}
        options={[
          { value: OrderBy.DateAsc, label: "Oldest First" },
          { value: OrderBy.DateDsc, label: "Newest Arrivals" },
          { value: OrderBy.NameAsc, label: "Name: A to Z" },
          { value: OrderBy.NameDsc, label: "Name: Z to A" },
          { value: OrderBy.PriceAsc, label: "Price: Low to High" },
          { value: OrderBy.PriceDesc, label: "Price: High to Low" },
        ]}
        onChange={onOrderByChange}
      />
    </div>
  );
}
