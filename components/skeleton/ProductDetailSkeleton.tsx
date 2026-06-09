"use client";

import { Skeleton } from "antd";

export default function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto p-4 md:p-8">
      {/* Image Section Skeleton */}
      <div className="w-full md:w-1/2 shrink-0 aspect-square bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner relative">
        <Skeleton.Image active style={{ width: "100%", height: "100%" }} className="opacity-60 scale-110" />
      </div>

      {/* Text Section Skeleton */}
      <div className="flex flex-col w-full flex-1 h-full justify-between gap-6">
        <div className="flex flex-col gap-4">
          <Skeleton.Input active size="large" style={{ width: "60%", height: 32 }} />
          <Skeleton.Input active size="medium" style={{ width: "30%", height: 24, marginTop: 8 }} />
          
          <div className="flex flex-col mt-6 gap-3">
            <div className="flex gap-4">
              <Skeleton.Input active size="small" style={{ width: "20%", height: 16 }} />
              <Skeleton.Input active size="small" style={{ width: "40%", height: 16 }} />
            </div>
            <div className="flex gap-4">
              <Skeleton.Input active size="small" style={{ width: "20%", height: 16 }} />
              <Skeleton.Input active size="small" style={{ width: "40%", height: 16 }} />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Skeleton.Input active size="small" block style={{ height: 14 }} />
              <Skeleton.Input active size="small" block style={{ height: 14 }} />
              <Skeleton.Input active size="small" style={{ width: "70%", height: 14 }} />
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center mt-6">
          <Skeleton.Button active size="large" style={{ width: 100 }} />
          <Skeleton.Button active size="large" style={{ width: 160 }} />
        </div>
      </div>
    </div>
  );
}
