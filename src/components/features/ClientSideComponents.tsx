"use client";

import dynamic from "next/dynamic";

// Dynamically import client-side components
const KnowledgeBot = dynamic(() => import("@/components/features/KnowledgeBot"), {
  ssr: false,
});

const ImageOptimizer = dynamic(() => import("@/components/features/optimization/ImageOptimizer"), {
  ssr: false,
});

export default function ClientSideComponents() {
  return (
    <>
      <KnowledgeBot />
      <ImageOptimizer />
    </>
  );
}