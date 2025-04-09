"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute left-4 top-4 rounded-full md:left-8 md:top-8"
      onClick={() => router.back()}
      aria-label="Go back"
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  )
}
