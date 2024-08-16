"use client";

import React, { Suspense } from "react";
import "../globals.css";
import { Header } from "../../components/header";
import { useState } from "react";
export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div>
      <Header />
      <div className="flex flex-row">
        <main className="core-layout">{children}</main>
      </div>
    </div>
  );
}
