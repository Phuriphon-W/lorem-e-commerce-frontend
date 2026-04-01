import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/shared/types/product";

export default function ProductPage() {
    const mockProduct: Product = {
        id: "mock_id",
        name: "mock_product",
        description: "mock_description",
        price: 20,
        available: 10,
        imageUrl: "mock_url"
    }

    return (
        <div>
            <ProductCard product={mockProduct}/>
        </div>
    )
}