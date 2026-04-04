import { Category } from "./category"

export interface Product {
    id: string,
    name: string,
    description: string,
    price: number,
    available: number,
    image_url: string,
    category: Category,
}

export type GetProductsRequest = {
    pageNumber?: number,
    pageSize?: number,
}

export type GetProductsResponse = {
    products: Product[],
    total: number,
}