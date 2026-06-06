"use client";

import React, { useState } from "react";
import { Drawer } from "antd";
import BackOfficeSidebar from "@/components/backoffice/BackOfficeSidebar";
import BackOfficeTopbar from "@/components/backoffice/BackOfficeTopbar";

export default function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-amber-50/20 overflow-hidden">
      {/* Desktop Sidebar (visible on md screens and up) */}
      <aside className="hidden md:block w-64 h-full shrink-0">
        <BackOfficeSidebar />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        placement="left"
        onClose={closeSidebar}
        open={mobileOpen}
        styles={{ body: { padding: 0 } }}
        width={256}
        closable={false}
      >
        <BackOfficeSidebar onClose={closeSidebar} />
      </Drawer>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <BackOfficeTopbar onToggleSidebar={toggleSidebar} />
        
        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
