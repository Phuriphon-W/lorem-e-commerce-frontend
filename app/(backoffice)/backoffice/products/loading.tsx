"use client";

import { Skeleton, Card } from "antd";

export default function Loading() {
  return (
    <div className="p-6 flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-2">
        <Skeleton.Input active size="large" style={{ width: 250, height: 32 }} />
        <Skeleton.Button active size="large" style={{ width: 150 }} />
      </div>

      {/* Table Filters */}
      <div className="flex justify-between gap-4 items-center">
        <Skeleton.Input active size="default" style={{ width: "30%", height: 32 }} />
        <Skeleton.Input active size="default" style={{ width: "20%", height: 32 }} />
      </div>

      {/* Table Skeleton */}
      <Card className="shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4">
          {/* Header Row */}
          <div className="flex justify-between border-b border-gray-200 pb-3 items-center">
            <Skeleton.Input active size="small" style={{ width: 80, height: 18 }} />
            <Skeleton.Input active size="small" style={{ width: 180, height: 18 }} />
            <Skeleton.Input active size="small" style={{ width: 100, height: 18 }} />
            <Skeleton.Input active size="small" style={{ width: 80, height: 18 }} />
            <Skeleton.Input active size="small" style={{ width: 80, height: 18 }} />
            <Skeleton.Input active size="small" style={{ width: 120, height: 18 }} />
          </div>
          {/* Body Rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex justify-between border-b border-gray-100 last:border-0 py-3 items-center">
              <Skeleton.Avatar active size={48} shape="square" className="shrink-0" />
              <div className="flex-1 ml-4 flex flex-col gap-1">
                <Skeleton.Input active size="small" style={{ width: "40%", height: 16 }} />
                <Skeleton.Input active size="small" style={{ width: "70%", height: 12 }} />
              </div>
              <Skeleton.Input active size="small" style={{ width: 80, height: 16 }} />
              <Skeleton.Input active size="small" style={{ width: 60, height: 16 }} />
              <Skeleton.Input active size="small" style={{ width: 80, height: 16 }} />
              <div className="flex gap-2">
                <Skeleton.Button active size="small" style={{ width: 32 }} />
                <Skeleton.Button active size="small" style={{ width: 32 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
