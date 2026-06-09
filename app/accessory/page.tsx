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
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";
import { Skeleton } from "antd";
import { PAGE_SIZE } from "@/shared/constants";

function AccessoryContent() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<GetProductsResponse>({
    products: [],
    total: 0,
  });

  const searchKeyword = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const category = Category.Accessory;
  const orderBy = (searchParams.get("orderBy") as OrderBy) || OrderBy.DateDsc;

  const updateURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, String(value));
    } else {
      params.delete(key); 
    }

    if (key === "category" || key === "search" || key === "orderBy") {
      params.set("page", "1");
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
  }, [searchKeyword, orderBy, page, category]);

  return (
    <div className="flex flex-col items-center py-10 w-full">
      <h1 className="mb-4 font-medium text-[30px] md:text-[40px]">Accessories</h1>
      <SearchBar
        currentSearch={searchKeyword}
        currentCategory={category}
        currentOrderBy={orderBy}
        onSearchChange={(val) => updateURL("search", val)}
        onCategoryChange={(val) => {updateURL("category", val)}}
        onOrderByChange={(val) => updateURL("orderBy", val)}
        categorySelect={false}
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
    <Suspense
      fallback={
        <div className="flex flex-col items-center py-10 w-full">
          <Skeleton.Input active size="large" style={{ width: 200, height: 40, marginBottom: 16 }} />
          <div className="w-[90%] flex flex-col md:flex-row gap-2 mb-8">
            <Skeleton.Input active size="default" block style={{ height: 32 }} className="flex-1" />
            <Skeleton.Input active size="default" style={{ width: 150, height: 32 }} className="w-full md:w-[18%]" />
          </div>
          <ProductGridSkeleton count={6} />
        </div>
      }
    >
      <AccessoryContent />
    </Suspense>
  );
}