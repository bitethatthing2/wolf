"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ReservationSection from '@/components/features/social/ReservationSection'
import PageHeader from '@/components/common/PageHeader'

export default function ReservationsPage() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <PageHeader 
        title="Reservations"
        description="Book a table, request catering, or plan your next celebration with us"
      />
      
      <ReservationSection />
    </main>
  )
}