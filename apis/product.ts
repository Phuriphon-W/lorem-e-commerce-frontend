import { serverAddr } from "@/shared/constants";
import { Product } from "@/shared/interfaces/product";
import {
  GetProductsRequest,
  GetProductsResponse,
  GetProductByIdRequest,
} from "@/shared/types/product";
import axios from "axios";

export const getProducts = async (
  { pageSize, pageNumber, category, search, orderBy }: GetProductsRequest,
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
      category: category,
      search: search,
      orderBy: orderBy,
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
    throw err
  }
};

export const getProductById = async (
  { id }: GetProductByIdRequest,
  cookieString?: string,
): Promise<Product> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  }

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  const options = {
    method: "GET",
    url: `${serverAddr}/api/product/${id}`,
    headers: headers,
    withCredentials: true,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    throw err;
  }
};
