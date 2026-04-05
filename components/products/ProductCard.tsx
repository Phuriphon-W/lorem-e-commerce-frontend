'use client'

import { Product } from "@/shared/interfaces/product";
import { Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ProductCardProps = {
    product: Product
}

// For display in grid. The width will grows proportionally to grid size
export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();

    return (
        <div className="w-full h-75 md:h-112.5 rounded-lg flex flex-col overflow-hidden 
                        shadow-md hover:cursor-pointer duration-300 hover:-translate-y-2 
                        hover:shadow-xl"
            onClick={() => router.push(`/product/${product.id}`)}
        >
            {/* Image Section */}
            <div className="relative h-3/4 w-full">
                <Image 
                    alt={`${product.name}-image`}
                    src={product.image_url}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Recommended for performance
                />
            </div>

            {/* Text Section */}
            <div className="h-1/4 p-4 bg-white rounded-b-lg">
                <Typography.Title level={5}>
                    {product.name}
                </Typography.Title>
                <Typography.Text strong={true}>
                    {`$${(product.price.toFixed(2))}`}
                </Typography.Text>
            </div>
        </div>
    )
}