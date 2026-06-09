"use client";

import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";
import { Skeleton } from "antd";

export default function Loading() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
        <Skeleton.Input active size="large" style={{ width: 150, height: 32 }} />
        <Skeleton.Button active size="medium" style={{ width: 120 }} />
      </div>
      {/* Slide Carousel placeholder */}
      <div className="w-full h-80 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 mb-8">
        <Skeleton.Image active style={{ width: "100%", height: "100%" }} className="opacity-40" />
      </div>
      <ProductGridSkeleton count={6} />
    </div>
  );
}
