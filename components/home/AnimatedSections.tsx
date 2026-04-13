"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type AnimatedSectionsProps = {
  apparelUrl: string,
  accessoryUrl: string,
}

export default function AnimatedSections({
  apparelUrl,
  accessoryUrl,
}: AnimatedSectionsProps
) {
  return (
    <div className="flex flex-col gap-16 my-16 overflow-hidden">
      
      {/* Accessories Element */}
      <motion.div
        initial={{ opacity: 0, x: 100 }} // Starts 100px to the right and invisible
        whileInView={{ opacity: 1, x: 0 }} // Animates to normal position when scrolled into view
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }} // Triggers when 30% of the element is visible
        className="flex flex-col md:flex-row items-center justify-center gap-10"
      >
        <div className="w-full md:w-1/2">
          <Image 
            src={accessoryUrl} 
            alt="home accessory image" 
            width={500}
            height={500} 
            className="w-full md:rounded-r-lg object-cover" 
          />
        </div>
        <div className="w-full md:w-1/2 px-[15px] md:pr-2">
          <h2 className="text-4xl font-bold mb-4">Discover Our New Collection</h2>
          <p className="text-gray-600 text-lg">
            Experience the perfect blend of style and comfort. Our latest arrivals are designed to make you stand out while keeping you relaxed all day long.
          </p>
        </div>
      </motion.div>

      {/* Apparel Element */}
      <motion.div
        initial={{ opacity: 0, x: -100 }} // Starts 100px to the left and invisible
        whileInView={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-center gap-10 mx-auto"
      >
        {/* We use flex order to swap sides on desktop, keeping image on top on mobile */}
        <div className="w-full md:w-1/2 text-left order-2 md:order-1 md:text-right px-[15px] md:pl-2">
          <h2 className="text-4xl font-bold mb-4">Premium Quality Materials</h2>
          <p className="text-gray-600 text-lg">
            We source only the finest materials to ensure our products are not just beautiful, but built to last. Quality you can feel in every thread.
          </p>
        </div>
        <div className="w-full md:w-1/2 order-1 md:order-2">
          <Image 
            src={apparelUrl}
            alt="Feature 2" 
            width={500}
            height={500} 
            className="w-full md:rounded-l-lg object-cover" 
          />
        </div>
      </motion.div>

    </div>
  );
}