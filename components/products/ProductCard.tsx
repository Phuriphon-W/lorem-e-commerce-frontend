'use client'

import { Product } from "@/shared/interfaces/product";
import { formatNumber } from "@/shared/utils/number";
import { Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ProductCardProps = {
    product: Product;
    priority?: boolean;
}

// For display in grid. The width will grows proportionally to grid size
export default function ProductCard({ product, priority = false }: ProductCardProps) {
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
                    priority={priority}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Recommended for performance
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4="
                />
            </div>

            {/* Text Section */}
            <div className="h-1/4 p-4 bg-white rounded-b-lg mb-4 md:mb-0">
                <Typography.Title level={5}>
                    {product.name}
                </Typography.Title>
                <Typography.Text strong={true}>
                    {`$${formatNumber(product.price)}`}
                </Typography.Text>
            </div>
        </div>
    )
}