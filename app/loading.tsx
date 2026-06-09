"use client";

import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";
import { Skeleton } from "antd";

export default function Loading() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-8">
      {/* Hero Skeleton */}
      <div className="w-full h-[420px] rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
        <Skeleton.Image active style={{ width: "100%", height: "100%" }} className="opacity-40 scale-125" />
      </div>
      
      {/* Catalog Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
        <div className="h-64 rounded-xl bg-gray-50 flex flex-col items-center justify-center p-4 border border-gray-100">
          <Skeleton.Image active />
          <Skeleton.Input active size="small" style={{ width: 120, marginTop: 12 }} />
        </div>
        <div className="h-64 rounded-xl bg-gray-50 flex flex-col items-center justify-center p-4 border border-gray-100">
          <Skeleton.Image active />
          <Skeleton.Input active size="small" style={{ width: 120, marginTop: 12 }} />
        </div>
      </div>

      {/* Latest Products Title & Grid */}
      <div className="mt-8 flex flex-col items-center w-full">
        <Skeleton.Input active size="large" style={{ width: 200, height: 32, marginBottom: 24 }} />
        <ProductGridSkeleton count={3} />
      </div>
    </div>
  );
}
