import { Category } from "../types/category";

export interface CartItem {
  productId: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: Category;
  quantity: number;
}
