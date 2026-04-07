"use server";

import { getProducts } from "@/apis/product";
import ProductCardContainer from "@/components/global/ProductCardContainer";
import SearchBar from "@/components/global/SearchBar";
import { getServerCookies } from "@/shared/utils/cookies";
import { Pagination, Input, ConfigProvider } from "antd";
import { MAIN_THEME } from "@/shared/colors";

export default async function ProductPage() {
  const cookieString = await getServerCookies();
  const initialProducts = await getProducts(
    { pageNumber: 1, pageSize: 12 },
    cookieString,
  );

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="mb-4 font-medium text-[40px]">Our Products</h1>
        <SearchBar />
        <ProductCardContainer
          columns={3}
          initialProducts={initialProducts.products}
        />
        <Pagination
          total={initialProducts.total}
          defaultCurrent={1}
          showQuickJumper
        />
    </div>
  );
}
