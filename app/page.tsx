import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { downloadStaticFile } from "@/apis/file";
import { getProducts } from "@/apis/product";
import { neuton } from "@/shared/fonts/font";
import AnimatedSections from "@/components/home/AnimatedSections";
import Carousel from "@/components/slide/ImageCarousel";
import { getServerCookies } from "@/shared/utils/cookies";

export default async function Page() {
  const cookieString = await getServerCookies();

  const [heroUrl, heroSmUrl, apparelUrl, accessoryUrl] = await Promise.all([
    downloadStaticFile({ key: "static/hero.jpg" }),
    downloadStaticFile({ key: "static/hero-sm.jpg" }),
    downloadStaticFile({ key: "static/home-apparel.jpg" }),
    downloadStaticFile({ key: "static/home-accessory.jpg" }),
  ]);

  const latestProducts = await getProducts(
    { pageSize: 9, pageNumber: 1 },
    cookieString,
  );

  const apparelSlides = await Promise.all([
    downloadStaticFile({ key: "static/apparelSlide1.jpg" }),
    downloadStaticFile({ key: "static/apparelSlide2.jpg" }),
    downloadStaticFile({ key: "static/apparelSlide3.jpg" }),
  ]);

  const accessorySlides = await Promise.all([
    downloadStaticFile({ key: "static/accessorySlide1.jpg" }),
    downloadStaticFile({ key: "static/accessorySlide2.jpg" }),
    downloadStaticFile({ key: "static/accessorySlide3.jpg" }),
  ]);

  return (
    <main className="bg-white rounded-b-2xl">
      {/* Hero Image */}
      <div className="relative h-[420px] md:min-h-screen ">
        {/* MOBILE IMAGE: Shows by default, hides on 'md' (768px) and up */}
        <Image
          src={heroSmUrl.downloadUrl}
          alt="hero image mobile"
          fill
          className="md:hidden object-cover"
          priority // Pro-tip: Always prioritize hero images so they load instantly
        />

        {/* DESKTOP IMAGE: Hidden by default, shows on 'md' (768px) and up */}
        <Image
          src={heroUrl.downloadUrl}
          alt="hero image desktop"
          fill
          className="hidden md:block object-cover"
          priority
        />

        {/* Centered text */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          text-gray-50 md:text-white ${neuton.className} w-full`}
        >
          <div className="text-[80px] md:text-[104px] font-extralight text-center leading-none">
            Lorem
          </div>
          <div className="text-[40px] md:text-[42px] font-light text-center w-full">
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
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>

      {/* Product Category */}
      <h1 className="text-2xl font-bold text-center mb-7">
        Check out our catalog
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 mb-10 round">
        <Link href={"/apparel"}>
          <Carousel elements={apparelSlides} />
          <div className="text-center mt-3 font-bold text-xl">Apparels</div>
        </Link>
        <Link href={"/accessory"}>
          <Carousel elements={accessorySlides} />
          <div className="text-center mt-3 font-bold text-xl">Accessories</div>
        </Link>
      </div>
    </main>
  );
}
