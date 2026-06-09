"use client";

import { Skeleton, Card } from "antd";

export default function Loading() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 mb-4">
        <Skeleton.Input active size="large" style={{ width: "30%", height: 32 }} />
        <Skeleton.Input active size="small" style={{ width: "50%", height: 16 }} />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton.Input active size="small" style={{ width: "40%", height: 18 }} />
                <Skeleton.Input active size="small" style={{ width: "60%", height: 14 }} />
              </div>
              <div className="flex gap-4 items-center shrink-0">
                <Skeleton.Input active size="small" style={{ width: 80, height: 20 }} />
                <Skeleton.Button active size="default" style={{ width: 100 }} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
