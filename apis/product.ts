import { serverAddr } from "@/shared/constants";
import {
  GetProductsRequest,
  GetProductsResponse,
} from "@/shared/types/product";
import { cookies } from "next/headers";
import axios from "axios";

export const getProducts = async ({
  pageSize,
  pageNumber,
}: GetProductsRequest): Promise<GetProductsResponse> => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  const options = {
    method: "GET",
    url: `${serverAddr}/api/product`,
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
    headers: {
      Accept: "application/json, application/problem+json",
      Cookie: authToken ? `authToken=${authToken}` : "",
    },
  };

  try {
    const response = await axios.request(options);

    return {
      products: response.data.products,
      total: response.data.total,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Axios error:", err.response?.data || err.message);
      return { products: [], total: 0 };
    }

    // standard JavaScript Error
    if (err instanceof Error) {
      console.error("Standard error:", err.message);
      return { products: [], total: 0 };
    }

    console.error("An unknown error occurred:", err);
    return { products: [], total: 0 };
  }
};
