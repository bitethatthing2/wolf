"use client";

import dynamic from "next/dynamic";

// Dynamically import client-side components

const ImageOptimizer = dynamic(() => import("@/components/features/optimization/ImageOptimizer"), {
  ssr: false,
});

export default function ClientSideComponents() {
  return (
    <>
      <ImageOptimizer />
    </>
  );
}