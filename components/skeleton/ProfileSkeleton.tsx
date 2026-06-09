"use client";

import { Skeleton, Card } from "antd";

export default function ProfileSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
        <Skeleton.Input active size="large" style={{ width: "30%", height: 32 }} />
      </div>
      <Card className="shadow-sm border border-gray-100">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton.Input active size="small" style={{ width: "20%", height: 16 }} />
            <Skeleton.Input active size="large" block style={{ height: 40 }} />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton.Input active size="small" style={{ width: "20%", height: 16 }} />
            <Skeleton.Input active size="large" block style={{ height: 40 }} />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton.Input active size="small" style={{ width: "25%", height: 16 }} />
            <Skeleton.Input active size="large" block style={{ height: 40 }} />
          </div>
          <div className="flex gap-4 mt-4">
            <Skeleton.Button active size="large" style={{ width: 120 }} />
          </div>
        </div>
      </Card>
    </div>
  );
}
