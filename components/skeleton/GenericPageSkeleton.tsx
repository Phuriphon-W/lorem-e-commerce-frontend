"use client";

import { Skeleton } from "antd";

export default function GenericPageSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <Skeleton.Input active size="large" style={{ width: "35%", height: 32, marginBottom: 16 }} />
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
  );
}
