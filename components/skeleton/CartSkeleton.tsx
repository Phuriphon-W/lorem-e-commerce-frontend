"use client";

import { Skeleton, Card } from "antd";

export default function CartSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto p-4 md:p-8">
      {/* Cart Items List */}
      <div className="flex-[2] flex flex-col gap-4">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <Skeleton.Input active size="large" style={{ width: "30%", height: 32 }} />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-4 border-b border-gray-100 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <Skeleton.Avatar active size={64} shape="square" className="shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton.Input active size="small" style={{ width: "50%", height: 18 }} />
                <Skeleton.Input active size="small" style={{ width: "30%", height: 14 }} />
              </div>
            </div>
            <div className="flex gap-6 items-center shrink-0">
              <Skeleton.Input active size="small" style={{ width: 60, height: 20 }} />
              <Skeleton.Button active size="small" style={{ width: 80 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="flex-1 shrink-0">
        <Card className="shadow-sm border border-gray-100 mt-12">
          <div className="flex flex-col gap-4">
            <Skeleton.Input active size="large" block style={{ height: 24 }} />
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between">
                <Skeleton.Input active size="small" style={{ width: "40%", height: 14 }} />
                <Skeleton.Input active size="small" style={{ width: "20%", height: 14 }} />
              </div>
              <div className="flex justify-between">
                <Skeleton.Input active size="small" style={{ width: "40%", height: 14 }} />
                <Skeleton.Input active size="small" style={{ width: "20%", height: 14 }} />
              </div>
            </div>
            <Skeleton.Button active size="large" block style={{ marginTop: 12 }} />
          </div>
        </Card>
      </div>
    </div>
  );
}
