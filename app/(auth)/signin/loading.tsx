"use client";

import { Skeleton, Card } from "antd";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-100 p-4 md:p-8">
        <div className="flex flex-col gap-6 items-center">
          <Skeleton.Input active size="large" style={{ width: 120, height: 32 }} />
          <Skeleton.Input active size="small" style={{ width: "80%", height: 16 }} />
          
          <div className="w-full flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Skeleton.Input active size="small" style={{ width: "30%", height: 16 }} />
              <Skeleton.Input active size="large" block style={{ height: 40 }} />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton.Input active size="small" style={{ width: "30%", height: 16 }} />
              <Skeleton.Input active size="large" block style={{ height: 40 }} />
            </div>
          </div>
          
          <Skeleton.Button active size="large" block style={{ height: 40, marginTop: 8 }} />
          <Skeleton.Input active size="small" style={{ width: "60%", height: 14 }} />
        </div>
      </Card>
    </div>
  );
}
