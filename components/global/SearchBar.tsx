"use client";

import { Category } from "@/shared/enums/category";
import { OrderBy } from "@/shared/enums/orderBy";
import { Input, Select } from "antd";

type SearchBarProps = {
  currentSearch: string;
  currentCategory: Category;
  currentOrderBy: OrderBy;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onOrderByChange: (value: string) => void;
  categorySelect?: boolean;
  orderSelect?: boolean;
};

export default function SearchBar({
  currentSearch,
  currentCategory,
  currentOrderBy,
  onSearchChange,
  onCategoryChange,
  onOrderByChange,
  categorySelect = true,
  orderSelect = true,
}: SearchBarProps) {
  return (
    <div className="w-[90%] flex flex-col md:flex-row gap-2">
      {/* Keyword Search */}
      <Input.Search
        placeholder="Enter Product Name"
        defaultValue={currentSearch}
        onSearch={onSearchChange}
        allowClear
      />

      {/* Category Filter */}
      {categorySelect && (
        <Select
          value={currentCategory} // Tie the displayed value to the URL state
          className="w-full md:w-[15%]"
          options={[
            { value: "", label: "All Products" },
            { value: Category.Apparel, label: "Apparels" },
            { value: Category.Accessory, label: "Accessories" },
          ]}
          onChange={onCategoryChange}
        />
      )}

      {/* Order By Filter */}
      {orderSelect && (
        <Select
          value={currentOrderBy} // Tie the displayed value to the URL state
          className="w-full md:w-[18%]"
          options={[
            { value: OrderBy.DateDsc, label: "Newest Arrivals" },
            { value: OrderBy.DateAsc, label: "Oldest First" },
            { value: OrderBy.NameAsc, label: "Name: A to Z" },
            { value: OrderBy.NameDsc, label: "Name: Z to A" },
            { value: OrderBy.PriceAsc, label: "Price: Low to High" },
            { value: OrderBy.PriceDesc, label: "Price: High to Low" },
          ]}
          onChange={onOrderByChange}
        />
      )}
    </div>
  );
}
