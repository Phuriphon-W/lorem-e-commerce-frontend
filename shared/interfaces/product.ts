import { Category } from "../types/category";

export interface Product {
    id: string,
    name: string,
    description: string,
    price: number,
    available: number,
    image_url: string,
    category: Category,
}