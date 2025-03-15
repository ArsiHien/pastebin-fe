"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, AreaChart, Area, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"

// Mock data for different time periods
const mockHourlyData = [
  { time: "60m", visits: 42 },
  { time: "50m", visits: 38 },
  { time: "40m", visits: 56 },
  { time: "30m", visits: 64 },
  { time: "20m", visits: 72 },
  { time: "10m", visits: 85 },
  { time: "now", visits: 92 },
]

const mockWeeklyData = [
  { day: "Mon", visits: 1240 },
  { day: "Tue", visits: 1380 },
  { day: "Wed", visits: 1520 },
  { day: "Thu", visits: 1290 },
  { day: "Fri", visits: 1490 },
  { day: "Sat", visits: 980 },
  { day: "Sun", visits: 870 },
]

const mockMonthlyData = [
  { month: "Jan", visits: 2340 },
  { month: "Feb", visits: 3201 },
  { month: "Mar", visits: 4312 },
  { month: "Apr", visits: 3890 },
  { month: "May", visits: 5432 },
  { month: "Jun", visits: 6210 },
]

export function StatsCard() {
  const [totalPastes, setTotalPastes] = useState(0)
  const [activeVisitors, setActiveVisitors] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // Simulate fetching stats
    setTotalPastes(12458)

    // Simulate active visitors with a random number that changes occasionally
    const interval = setInterval(() => {
      setActiveVisitors(Math.floor(Math.random() * 50) + 20)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getChartData = () => {
    switch (selectedPeriod) {
      case "hourly":
        return {
          data: mockHourlyData,
          dataKey: "time",
          valueKey: "visits",
          formatter: (value: number) => `${value}`,
          chartType: "line",
        }
      case "weekly":
        return {
          data: mockWeeklyData,
          dataKey: "day",
          valueKey: "visits",
          formatter: (value: number) => `${value}`,
          chartType: "area",
        }
      case "monthly":
      default:
        return {
          data: mockMonthlyData,
          dataKey: "month",
          valueKey: "visits",
          formatter: (value: number) => `${value / 1000}k`,
          chartType: "bar",
        }
    }
  }

  const { data, dataKey, chartType } = getChartData()

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <ChartContainer
            config={{
              visits: {
                label: "Visits",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={dataKey} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="var(--color-visits)"
                strokeWidth={2}
                dot={{ fill: "var(--color-visits)", r: 4 }}
                activeDot={{ fill: "var(--color-visits)", r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        )
      case "area":
        return (
          <ChartContainer
            config={{
              visits: {
                label: "Visits",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-visits)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-visits)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={dataKey} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="var(--color-visits)"
                fill="url(#colorVisits)"
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
              visits: {
                label: "Visits",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={dataKey} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="visits" fill="var(--color-visits)" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ChartContainer>
        )
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Pastes</p>
              <p className="text-2xl font-bold">{totalPastes.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Visitors</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{activeVisitors}</p>
                <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Visits</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly" value={selectedPeriod} onValueChange={setSelectedPeriod} className="mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hourly">1 Hour</TabsTrigger>
              <TabsTrigger value="weekly">1 Week</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>

          {renderChart()}
        </CardContent>
      </Card>
    </>
  )
}

