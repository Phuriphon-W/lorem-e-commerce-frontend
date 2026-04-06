'use server'

import { getProducts } from "@/apis/product"
import ProductCardContainer from "@/components/global/ProductCardContainer"
import { getServerCookies } from "@/shared/utils/cookies"

export default async function ProductPage() {
    const cookieString = await getServerCookies();
    const initialProducts = await getProducts({ pageNumber:1, pageSize: 12 }, cookieString);
    
    return (
        <div className="flex flex-col items-center">
            <ProductCardContainer columns={3} initialProducts={initialProducts.products}/>
        </div>
    )
}