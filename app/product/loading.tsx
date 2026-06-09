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
      <ProductGridSkeleton count={6} />
    </div>
  );
}
