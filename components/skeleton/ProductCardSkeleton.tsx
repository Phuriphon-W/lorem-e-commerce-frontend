"use client";

import { Skeleton } from "antd";

export default function ProductCardSkeleton() {
  return (
    <div className="w-full h-75 md:h-112.5 rounded-lg flex flex-col overflow-hidden shadow-md bg-white border border-gray-100">
      {/* Image Section Skeleton */}
      <div className="h-3/4 w-full bg-gray-50 flex items-center justify-center relative overflow-hidden">
        <Skeleton.Image active style={{ width: "100%", height: "100%" }} className="opacity-60 scale-110" />
      </div>

      {/* Text Section Skeleton */}
      <div className="h-1/4 p-4 bg-white flex flex-col justify-center gap-2">
        <Skeleton.Input active size="small" block style={{ height: 20 }} />
        <Skeleton.Input active size="small" style={{ width: "45%", height: 16 }} />
      </div>
    </div>
  );
}
