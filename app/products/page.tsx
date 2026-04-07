"use client";

import { getProducts } from "@/apis/product";
import ProductCardContainer from "@/components/global/ProductCardContainer";
import SearchBar from "@/components/global/SearchBar";
import { Category } from "@/shared/enums/category";
import { OrderBy } from "@/shared/enums/orderBy";
import { GetProductsResponse, GetProductsRequest } from "@/shared/types/product";
import { Pagination } from "antd";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const [products, setProducts] = useState<GetProductsResponse>({products: [], total: 0})
  const [searchKeyword, setSearchKeyword] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [category, setCategory] = useState<Category>(Category.Empty);
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.DateDsc);

  useEffect(() => {
    const fetchProducts = async ({
      pageNumber,
      pageSize,
      category,
      search,
      orderBy
    }: GetProductsRequest) => {
      const response = await getProducts({ pageNumber, pageSize, category, search, orderBy })
      setProducts(response)
    }
    
    fetchProducts({ pageNumber: page, pageSize: 12, category, search: searchKeyword, orderBy })
  }, [searchKeyword, category, orderBy])

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="mb-4 font-medium text-[40px]">Our Products</h1>
        <SearchBar 
          setSearchKeyword={setSearchKeyword}
          setCategory={setCategory}
          setOrderBy={setOrderBy}
        />
        <ProductCardContainer
          columns={3}
          products={products.products}
        />
        <Pagination
          total={products.total}
          defaultCurrent={1}
          showQuickJumper
        />
    </div>
  );
}
