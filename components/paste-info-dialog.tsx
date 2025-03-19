"use client"

import { useState, useEffect } from "react"
import { Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { fetchPasteStats, type StatsResponse } from "@/lib/api-client"

interface PasteInfoDialogProps {
  pasteUrl: string
}

export function PasteInfoDialog({ pasteUrl }: PasteInfoDialogProps) {
  const [open, setOpen] = useState(false)
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch stats when dialog opens
  useEffect(() => {
    if (open) {
      fetchStats()
    }
  }, [open])

  const fetchStats = async () => {
    if (!open) return

    setLoading(true)
    setError(null)

    try {
      const data = await fetchPasteStats(pasteUrl)
      setStats(data)
    } catch (error) {
      console.error("Error fetching paste stats:", error)
      setError(error instanceof Error ? error.message : "Failed to load paste stats")
    } finally {
      setLoading(false)
    }
  }

  // Format the remaining time for display
  const formatRemainingTime = (time: string) => {
    if (time === "NEVER") return "Never"
    if (time === "BURN_AFTER_READ") return "After viewing"
    return time
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          View Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Paste Information</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              <p>{error}</p>
              <Button variant="outline" className="mt-2" onClick={fetchStats}>
                Retry
              </Button>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <Eye className="h-8 w-8 text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                    <p className="text-3xl font-bold">{stats.viewCount}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-8 w-8 text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Expires In</p>
                    {/* <p className="text-3xl font-bold">{formatRemainingTime(stats.remainingTime)}</p> */}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">No stats available</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

