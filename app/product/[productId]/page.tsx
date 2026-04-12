import { getProductById } from "@/apis/product";
import { getServerCookies } from "@/shared/utils/cookies";
import { Breadcrumb, ConfigProvider } from "antd";
import ProductDetails from "@/components/products/ProductDetails";
import Link from "next/link";
import { faGem } from "@fortawesome/free-regular-svg-icons";
import { faStore, faShirt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MAIN_THEME } from "@/shared/colors";

export default async function ProductItemPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const cookieString = await getServerCookies();
  const productId = (await params).productId;

  const product = await getProductById({ id: productId }, cookieString);

  return (
    <>
      <div className="pl-8 pt-8">
        <ConfigProvider
          theme={{
            components: {
              Breadcrumb: {
                linkHoverColor: MAIN_THEME.primary,
                colorBgTextHover: MAIN_THEME.primaryHover,
              },
            },
          }}
        >
          <Breadcrumb
            className="text-md md:text-xl!"
            items={[
              {
                title: (
                  <Link href="/product">
                    <FontAwesomeIcon icon={faStore} />
                    Products
                  </Link>
                ),
              },
              {
                title: (
                  <Link href={`/${product.category.name === "Apparel" ? "apparel" : "accessory"}`}>
                    <FontAwesomeIcon
                      icon={
                        product.category.name === "Apparel" ? faShirt : faGem
                      }
                    />
                    {product.category.name === "Apparel"
                      ? "Apparels"
                      : "Accessories"}
                  </Link>
                ),
              },
              {
                title: product.name,
              },
            ]}
          />
        </ConfigProvider>
      </div>
      <div className="w-full min-h-[calc(100vh-100px)] flex flex-col md:flex-row p-6 md:p-10 gap-8 lg:gap-16 bg-white rounded-2xl">
        <ProductDetails product={product} />
      </div>
    </>
  );
}
