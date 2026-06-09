"use client";

import { Skeleton, Card } from "antd";

export default function Loading() {
  return (
    <div className="p-6 flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4 mb-2">
        <Skeleton.Input active size="large" style={{ width: 200, height: 32 }} />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-sm border border-gray-100">
            <div className="flex flex-col gap-2">
              <Skeleton.Input active size="small" style={{ width: "60%", height: 14 }} />
              <Skeleton.Input active size="large" style={{ width: "40%", height: 28 }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Large table or layout skeleton */}
      <div className="mt-4 flex flex-col gap-4">
        <Skeleton.Input active size="medium" style={{ width: "15%", height: 20 }} />
        <Card className="shadow-sm border border-gray-100">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <Skeleton.Input active size="small" style={{ width: "20%" }} />
              <Skeleton.Input active size="small" style={{ width: "10%" }} />
              <Skeleton.Input active size="small" style={{ width: "15%" }} />
              <Skeleton.Input active size="small" style={{ width: "15%" }} />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between border-b border-gray-50 last:border-0 py-3">
                <Skeleton.Input active size="small" style={{ width: "25%" }} />
                <Skeleton.Input active size="small" style={{ width: "8%" }} />
                <Skeleton.Input active size="small" style={{ width: "12%" }} />
                <Skeleton.Input active size="small" style={{ width: "10%" }} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
