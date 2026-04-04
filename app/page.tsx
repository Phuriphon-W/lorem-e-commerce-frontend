"use server";

import { Image } from "antd";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { downloadStaticFile } from "@/apis/file";
import { getProducts } from "@/apis/product";
import { neuton } from "./layout";
import AnimatedSections from "@/components/home/AnimatedSections";

export default async function Page() {
  const [heroUrl, apparelUrl, accessoryUrl] = await Promise.all([
    downloadStaticFile({ key: "static/hero.jpg" }),
    downloadStaticFile({ key: "static/home-apparel.jpg" }),
    downloadStaticFile({ key: "static/home-accessory.jpg" }),
  ]);
  const latestProducts = await getProducts({ pageSize: 9, pageNumber: 1 });

  return (
    <main className="bg-white">
      {/* Hero Image */}
      <div className="relative ">
        <Image
          src={heroUrl.downloadUrl}
          alt="hero image"
          width="100%"
          height="100%"
          preview={false}
        />

        {/* Centered text */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          text-white ${neuton.className}`}
        >
          <div className="text-[104px] font-extralight text-center leading-none">
            Lorem
          </div>
          <div className="text-[42px] font-light text-center">
            Define your style
          </div>
        </div>
      </div>

      <AnimatedSections
        accessoryUrl={accessoryUrl.downloadUrl}
        apparelUrl={apparelUrl.downloadUrl}
      />

      {/* Latest Product */}
      <div className="mb-16 w-full flex flex-col items-center">
        <div className="text-2xl font-bold text-center">
          Our Latest Products
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-5 mt-8 w-[75%] md:w-[90%]">
          {latestProducts.products.map((product) => (
            <ProductCard product={product} key={product.id}/>
          ))}
        </div>
      </div>

      {/* Product Category */}
      <div className="flex justify-center mb-16">
        <div className="flex flex-row max-w-305 justify-between gap-4">
          <div>
            <Link href={"/lorem/category/apparel"} prefetch={true}>
              <Image
                src="/home/apparel.png"
                alt="slider image 1"
                width={610}
                height={610}
                className="hover:cursor-pointer hover:opacity-65 transition-opacity duration-300"
                preview={false}
              />
            </Link>
          </div>
          <div>
            <Link href={"/lorem/category/accessory"} prefetch={true}>
              <Image
                src="/home/accessories_edited.png"
                alt="slider image 1"
                width={610}
                height={610}
                className="hover:cursor-pointer hover:opacity-65 transition-opacity duration-300"
                preview={false}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Home Page Product Preview */}
      <div className="flex justify-center mt-9 mb-16">
        <div className="grid grid-cols-3 gap-5 w-305 justify-between">
          {/* {products.map((product) => (
              <ProductCard key={product.id} product={product} />
          ),)} */}
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
          voluptate laboriosam voluptatibus placeat molestias neque facilis
          temporibus quos praesentium! Corrupti molestiae dolorem autem eligendi
          quia molestias quae non quos qui.
        </div>
      </div>
    </main>
  );
}
