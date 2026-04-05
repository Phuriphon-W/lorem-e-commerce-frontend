import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/shared/interfaces/product";

export default function ProductPage() {
    const mockProduct: Product = {
        id: "mock_id",
        name: "mock_product",
        description: "mock_description",
        price: 20,
        available: 10,
        image_url: "mock_url",
        category: {
            id: "mock_cat_id",
            name: "mock_vat_name"
        }
    }

    return (
        <div>
            <ProductCard product={mockProduct}/>
        </div>
    )
}