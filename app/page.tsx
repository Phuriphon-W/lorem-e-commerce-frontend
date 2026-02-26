import { lusitana } from '@/ui/font'
import Image from 'next/image';
import Link from 'next/link';
// import ProductCard from '@/app/ui/products/card';
// import { getProductByName } from '@/app/lib/data';
import { DEFAULT_PRODUCT_NAMES } from '@/utils/defaultProductLanding';

export default async function Page() {
  //const products = await Promise.all(DEFAULT_PRODUCT_NAMES.map(name => getProductByName(name)));

  return (
    <main>
      <Image
        src='/home/hero.png'
        alt='hero image'
        width={1220}
        height={1220}
      />

      <div className='border-black border-[1px] mb-10' />

      {/* Home Advertise Image */}
      <div className="flex justify-center mb-9">
          <Image 
              src='/home/Slides_1.png' 
              alt='slider image 1'
              width={1220}
              height={1220}
          />
      </div>

      {/* Product Category */}
      <div className='flex justify-center'>
        <div className='flex flex-row max-w-[1220px] justify-between gap-4'>
          <div>
            <Link href={'/lorem/category/apparel'} prefetch={true}>
              <Image 
                  src='/home/apparel.png' 
                  alt='slider image 1'
                  width={610}
                  height={610}
                  className='hover:cursor-pointer hover:opacity-65 transition-opacity duration-300'
              />
            </Link>
          </div>
          <div>
            <Link href={'/lorem/category/accessory'} prefetch={true}>
              <Image 
                  src='/home/accessories_edited.png' 
                  alt='slider image 1'
                  width={610}
                  height={610}
                  className='hover:cursor-pointer hover:opacity-65 transition-opacity duration-300'
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Home Page Product Preview */}
      <div className='flex justify-center mt-9'>
        <div className="grid grid-cols-3 gap-5 w-[1220px] justify-between">
          {/* {products.map((product) => (
              <ProductCard key={product.id} product={product} />
          ),)} */}
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum voluptate laboriosam voluptatibus placeat molestias neque facilis temporibus quos praesentium! Corrupti molestiae dolorem autem eligendi quia molestias quae non quos qui.
        </div>
      </div>
      
    </main>
  );
}