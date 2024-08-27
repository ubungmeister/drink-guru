"use client";

import React, { Suspense } from "react";
import "../globals.css";
import { Header } from "../../components/header";

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="flex flex-row">
        <main className="core-layout">{children}</main>
      </div>
    </div>
  );
}
