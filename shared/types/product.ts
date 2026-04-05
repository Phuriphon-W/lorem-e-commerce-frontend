import { Product } from "../interfaces/product"

export type GetProductsRequest = {
    pageNumber?: number,
    pageSize?: number,
}

export type GetProductsResponse = {
    products: Product[],
    total: number,
}