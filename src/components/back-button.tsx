"use client"

import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  // Only hide on home page
  if (pathname === "/") return null

  return (
    <Button
      variant="default"
      size="icon"
      onClick={() => router.back()}
      className="mr-2"
      aria-label="Go back to previous page"
    >
      <ArrowLeft />
    </Button>
  )
}
