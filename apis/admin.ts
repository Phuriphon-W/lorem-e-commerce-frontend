import { serverAddr } from "@/shared/constants";
import axios from "axios";
import { Product } from "@/shared/interfaces/product";
import { Category } from "@/shared/types/category";
import { UserProfile } from "@/shared/interfaces/user";
import { formatUserProfile } from "./user";
import { getProducts } from "./product";

// Product DTOs
export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  available: number;
  imageFile: File;
  categoryId: string;
}

export interface UpdateProductPayload {
  name: string;
  description: string;
  price: number;
  available: number;
  imageFile?: File;
  categoryId: string;
}

// Category DTOs
export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name: string;
}

export const getAllProducts = getProducts;

export const createProduct = async (payload: CreateProductPayload): Promise<{ id: string }> => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("price", payload.price.toString());
  formData.append("available", payload.available.toString());
  formData.append("image_file", payload.imageFile);
  formData.append("categoryId", payload.categoryId);

  const options = {
    url: `${serverAddr}/api/product`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
    data: formData,
  };

  const response = await axios.request(options);
  return response.data;
};

export const updateProduct = async (id: string, payload: UpdateProductPayload): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("price", payload.price.toString());
  formData.append("available", payload.available.toString());
  if (payload.imageFile) {
    formData.append("image_file", payload.imageFile);
  }
  formData.append("categoryId", payload.categoryId);

  const options = {
    url: `${serverAddr}/api/product/${id}`,
    method: "PUT",
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
    data: formData,
  };

  const response = await axios.request(options);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const options = {
    url: `${serverAddr}/api/product/${id}`,
    method: "DELETE",
    withCredentials: true,
  };

  const response = await axios.request(options);
  return response.data;
};

export const createCategory = async (payload: CreateCategoryPayload): Promise<{ id: string }> => {
  const options = {
    url: `${serverAddr}/api/category`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    data: payload,
  };

  const response = await axios.request(options);
  return response.data;
};

export const updateCategory = async (id: string, payload: UpdateCategoryPayload): Promise<{ name: string }> => {
  const options = {
    url: `${serverAddr}/api/category/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    data: payload,
  };

  const response = await axios.request(options);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<{ message: string }> => {
  const options = {
    url: `${serverAddr}/api/category/${id}`,
    method: "DELETE",
    withCredentials: true,
  };

  const response = await axios.request(options);
  return response.data;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const options = {
    url: `${serverAddr}/api/category`,
    method: "GET",
    withCredentials: true,
  };

  const response = await axios.request(options);
  return response.data;
};

export const getAllUsers = async (
  pageNumber?: number,
  pageSize?: number,
  search?: string,
  orderBy?: string
): Promise<{ users: UserProfile[]; total: number }> => {
  const options = {
    url: `${serverAddr}/api/user`,
    method: "GET",
    params: {
      pageNumber,
      pageSize,
      search,
      orderBy,
    },
    withCredentials: true,
  };

  const response = await axios.request(options);
  const data = response.data || {};
  const users = (data.users || []).map((user: any) => formatUserProfile(user));
  return {
    users,
    total: data.total || 0,
  };
};
