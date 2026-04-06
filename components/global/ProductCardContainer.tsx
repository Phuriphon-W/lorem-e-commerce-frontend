'use client'

import { Product } from "@/shared/interfaces/product"
import ProductCard from "../products/ProductCard"
import { useEffect, useState } from "react"
import { getProducts } from "@/apis/product"

type ProductCardContainerProps = {
    columns: number,
    initialProducts: Product[],
}

export default function ProductCardContainer({ columns, initialProducts }: ProductCardContainerProps) {
    const gridCols = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-4",
    }[columns] || "md:grid-cols-3"; // Fallback to 3
    const [products, setProducts] = useState<Product[]>(initialProducts);

    return (
        <div className={`grid grid-cols-1 ${gridCols} gap-x-4 gap-y-5 my-8 w-[75%] md:w-[90%]`}>
            {products.map((product) => (
                <ProductCard product={product} key={product.id}/>
            ))}
        </div>
    )
}