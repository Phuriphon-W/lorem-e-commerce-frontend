import { serverAddr } from "@/shared/constants";
import {
  GetProductsRequest,
  GetProductsResponse,
} from "@/shared/types/product";
import axios from "axios";

export const getProducts = async (
  { pageSize, pageNumber }: GetProductsRequest,
  cookieString?: string,
): Promise<GetProductsResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  const options = {
    method: "GET",
    url: `${serverAddr}/api/product`,
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
    headers: headers,
    withCredentials: true,
  };

  try {
    const response = await axios.request(options);

    return {
      products: response.data.products,
      total: response.data.total,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        return { products: [], total: 0 };
      }

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
