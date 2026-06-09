"use client";

import { Skeleton } from "antd";

export default function OrderSkeleton() {
  return (
    <div className="flex flex-col p-4 md:p-8 w-full max-w-6xl mx-auto h-full gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
        <Skeleton.Input active size="large" style={{ width: "25%", height: 32 }} />
        <Skeleton.Input active size="small" style={{ width: "40%", height: 16 }} />
      </div>

      {/* Filter tags skeleton */}
      <div className="flex flex-wrap gap-2 items-center">
        <Skeleton.Input active size="small" style={{ width: 60, height: 18 }} />
        <Skeleton.Button active size="small" style={{ width: 80 }} />
        <Skeleton.Button active size="small" style={{ width: 80 }} />
        <Skeleton.Button active size="small" style={{ width: 80 }} />
        <Skeleton.Button active size="small" style={{ width: 80 }} />
      </div>

      {/* Order cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-5 border border-gray-100 rounded-lg shadow-sm bg-white flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <Skeleton.Input active size="small" style={{ width: "50%", height: 18 }} />
              <Skeleton.Button active size="small" style={{ width: 60 }} />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton.Input active size="small" style={{ width: "80%", height: 14 }} />
              <Skeleton.Input active size="small" style={{ width: "40%", height: 14 }} />
            </div>
            <Skeleton.Button active size="default" block style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
