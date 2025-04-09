"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { Loader2, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Attempt to dynamically import the Scanner component with no SSR
// But provide a manual fallback if it fails
const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner)
    .catch(() => {
      // Return a placeholder component if the import fails
      return function PlaceholderScanner() {
        return (
          <div className="flex items-center justify-center w-full h-full min-h-[250px] bg-slate-100 dark:bg-slate-900 flex-col p-4">
            <QrCode className="h-16 w-16 mb-4 text-black dark:text-white opacity-20" />
            <p className="text-sm text-center text-black dark:text-white mb-4">
              QR scanner could not be loaded. Please enter your table code manually.
            </p>
          </div>
        )
      }
    }),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full min-h-[250px] bg-slate-100 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
      </div>
    )
  }
)

interface QrCodeScannerProps {
  onScanSuccessAction: (tableId: string) => Promise<void>
}

export function QrCodeScanner({ onScanSuccessAction }: QrCodeScannerProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [scannerError, setScannerError] = useState<boolean>(false)
  const [manualTableId, setManualTableId] = useState<string>("")
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle manual table ID submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (manualTableId) {
      // Add the table_ prefix if user didn't include it
      const formattedId = manualTableId.startsWith("table_") 
        ? manualTableId 
        : `table_${manualTableId}`
      await onScanSuccessAction(formattedId)
    }
  }
  
  if (!isMounted) {
    return (
      <div className="aspect-square w-full max-w-xs mx-auto">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-center w-full h-full min-h-[250px] bg-slate-100 dark:bg-slate-900">
            <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <Card className="overflow-hidden p-4">
        {!scannerError ? (
          <div className="aspect-square w-full">
            <Scanner
              onScan={async (detectedCodes) => {
                try {
                  // Get the first detected code
                  const result = detectedCodes[0]?.rawValue
                  // Validate that the QR code contains a valid table ID
                  if (result && result.startsWith("table_")) {
                    await onScanSuccessAction(result)
                  }
                } catch (err) {
                  console.error("Error processing QR code:", err)
                  setScannerError(true)
                }
              }}
              onError={(error: unknown) => {
                console.error("QR Scanner error:", error)
                setScannerError(true)
              }}
              formats={["qr_code"]} // Only scan QR codes
              scanDelay={500} // Add a small delay between scans
            />
          </div>
        ) : (
          <div className="py-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tableId">Enter your table number</Label>
                <Input 
                  id="tableId"
                  type="text" 
                  placeholder="e.g. 42" 
                  value={manualTableId}
                  onChange={(e) => setManualTableId(e.target.value)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Submit
              </Button>
            </form>
          </div>
        )}
      </Card>
      
      {/* Always provide manual entry option even if scanner is working */}
      <div className="mt-4 text-center">
        <button 
          onClick={() => setScannerError(prev => !prev)} 
          className="text-sm underline text-black dark:text-white"
        >
          {scannerError ? "Try scanner again" : "Enter table number manually"}
        </button>
      </div>
    </div>
  )
}
