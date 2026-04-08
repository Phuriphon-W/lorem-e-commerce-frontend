import { getProductById } from "@/apis/product";
import { getServerCookies } from "@/shared/utils/cookies";
import ProductDetails from "@/components/products/ProductDetails";

export default async function ProductItemPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const cookieString = await getServerCookies();
  const productId = (await params).productId;

  const product = await getProductById({ id: productId }, cookieString);

  return (
    <ProductDetails product={product} />
  );
}
