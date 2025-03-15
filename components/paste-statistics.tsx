"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, AreaChart, Area, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Eye } from "lucide-react"
import { formatTimeRemaining } from "@/lib/utils"
import {
  type ChartDataPoint,
  fetchHourlyChartData,
  fetchMonthlyChartData,
  fetchWeeklyChartData,
} from "@/lib/api-client"
import { ChartSkeleton } from "./chart-skeleton"

interface PasteStatisticsProps {
  pasteId: string
  views: number
  expiresAt: string | null
  createdAt: string
}

export function PasteStatistics({ pasteId, views, expiresAt, createdAt }: PasteStatisticsProps) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(
    expiresAt ? formatTimeRemaining(new Date(expiresAt)) : null,
  )
  const [selectedPeriod, setSelectedPeriod] = useState("hourly")
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch chart data when period changes
  useEffect(() => {
    async function fetchChartData() {
      setIsLoading(true)
      try {
        let data: ChartDataPoint[]

        switch (selectedPeriod) {
          case "hourly":
            data = await fetchHourlyChartData(pasteId)
            break
          case "weekly":
            data = await fetchWeeklyChartData(pasteId)
            break
          case "monthly":
            data = await fetchMonthlyChartData(pasteId)
            break
          default:
            data = await fetchHourlyChartData(pasteId)
        }

        setChartData(data)
      } catch (error) {
        console.error("Error fetching chart data:", error)
        // Fallback to empty data
        setChartData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [pasteId, selectedPeriod])

  // Update expiration countdown
  useEffect(() => {
    if (!expiresAt) return

    const interval = setInterval(() => {
      const remaining = formatTimeRemaining(new Date(expiresAt))
      setTimeRemaining(remaining)
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  const getChartType = () => {
    switch (selectedPeriod) {
      case "hourly":
        return "line"
      case "weekly":
        return "area"
      case "monthly":
        return "bar"
      default:
        return "line"
    }
  }

  const renderChart = () => {
    if (isLoading) {
      return <ChartSkeleton />
    }

    const chartType = getChartType()

    switch (chartType) {
      case "line":
        return (
          <ChartContainer
            config={{
              views: {
                label: "Views",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="views"
                stroke="var(--color-views)"
                strokeWidth={2}
                dot={{ fill: "var(--color-views)", r: 3 }}
                activeDot={{ fill: "var(--color-views)", r: 5, strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        )
      case "area":
        return (
          <ChartContainer
            config={{
              views: {
                label: "Views",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--color-views)"
                fill="url(#colorViews)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )
      case "bar":
      default:
        return (
          <ChartContainer
            config={{
              views: {
                label: "Views",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ChartContainer>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{views}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{expiresAt ? "Expires In" : "Expiration"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{timeRemaining || "Never"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">View Statistics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hourly" value={selectedPeriod} onValueChange={setSelectedPeriod} className="mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hourly">Last Hour</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>

          {renderChart()}
        </CardContent>
      </Card>
    </div>
  )
}

