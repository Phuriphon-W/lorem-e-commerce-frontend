"use client";

import { getProducts } from "@/apis/product";
import ProductCardContainer from "@/components/global/ProductCardContainer";
import SearchBar from "@/components/global/SearchBar";
import { Category } from "@/shared/enums/category";
import { OrderBy } from "@/shared/enums/orderBy";
import {
  GetProductsResponse,
  GetProductsRequest,
} from "@/shared/types/product";
import { Pagination } from "antd";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PAGE_SIZE } from "@/shared/constants";

function ProductContent() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<GetProductsResponse>({
    products: [],
    total: 0,
  });

  const searchKeyword = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const category = (searchParams.get("category") as Category) || Category.Empty;
  const orderBy = (searchParams.get("orderBy") as OrderBy) || OrderBy.DateDsc;

  const updateURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, String(value));
      if (key === "category") params.set("page", "1");
    } else {
      params.delete(key); 
    }

    router.push(`${pathName}?${params.toString()}`);
  };

  useEffect(() => {
    const fetchProducts = async ({
      pageNumber,
      pageSize,
      category,
      search,
      orderBy,
    }: GetProductsRequest) => {
      const response = await getProducts({
        pageNumber,
        pageSize,
        category,
        search,
        orderBy,
      });
      setProducts(response);
    };

    fetchProducts({
      pageNumber: page,
      pageSize: PAGE_SIZE,
      category,
      search: searchKeyword,
      orderBy,
    });

  }, [searchKeyword, category, orderBy, page]);

  return (
    <div className="flex flex-col items-center py-10 w-full">
      <h1 className="mb-4 font-medium text-[40px]">Our Products</h1>
      <SearchBar
        currentSearch={searchKeyword}
        currentCategory={category}
        currentOrderBy={orderBy}
        onSearchChange={(val) => updateURL("search", val)}
        onCategoryChange={(val) => {updateURL("category", val)}}
        onOrderByChange={(val) => updateURL("orderBy", val)}
      />
      <ProductCardContainer columns={3} products={products.products} />
      <Pagination 
        total={products.total} 
        pageSize={PAGE_SIZE} 
        current={page} 
        onChange={(val) => updateURL("page", val)} 
        showQuickJumper 
      />
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-xl"></div>}>
      <ProductContent />
    </Suspense>
  );
}