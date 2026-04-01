import { Product } from "@/shared/types/product";
import { Card, Typography } from "antd";

type ProductCardProps = {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card title={product.name} style={{ width: "30%" }}>
            <div>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum voluptas modi facilis perferendis officiis iure asperiores quo obcaecati, nemo temporibus ex, illo repellat tempora deserunt veritatis et voluptatem maxime accusamus.
            </div>
            <div>
                
            </div>
        </Card>
    )
}