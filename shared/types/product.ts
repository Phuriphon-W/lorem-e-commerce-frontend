import { Product } from "../interfaces/product"
import { Category } from "../enums/category"

export type GetProductsRequest = {
    pageNumber?: number,
    pageSize?: number,
    category?: Category | string,
    search?: string,
    orderBy?: string,
}

export type GetProductsResponse = {
    products: Product[],
    total: number,
}