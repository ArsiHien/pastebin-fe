"use client";

import { useState, useEffect } from "react";
import { BarChartIcon, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ErrorMessage } from "./error-message";
import { Card, CardContent } from "@/components/ui/card";
import {
  type AnalyticsResponse,
  fetchHourlyAnalytics,
  fetchWeeklyAnalytics,
  fetchMonthlyAnalytics,
  fetchPasteStats,
  type StatsResponse,
} from "@/lib/api-client";
import { formatTimestamp } from "@/lib/utils";

interface PasteStatsDialogProps {
  pasteUrl: string;
  remainingTime: string;
}

export function PasteStatsDialog({
  pasteUrl,
  remainingTime,
}: PasteStatsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("hourly");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(
    null
  );
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if this is a burn-after-read paste
  const isBurnAfterRead = remainingTime === "BURN_AFTER_READ";

  // Fetch data when dialog opens
  useEffect(() => {
    if (open && !isBurnAfterRead) {
      fetchData();
    }
  }, [pasteUrl, selectedPeriod, open, isBurnAfterRead]);

  const fetchData = async () => {
    if (!open || isBurnAfterRead) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch stats
      const statsData = await fetchPasteStats(pasteUrl);
      setStats(statsData);

      // Fetch analytics based on selected period
      let analyticsData: AnalyticsResponse;
      switch (selectedPeriod) {
        case "hourly":
          analyticsData = await fetchHourlyAnalytics(pasteUrl);
          break;
        case "weekly":
          analyticsData = await fetchWeeklyAnalytics(pasteUrl);
          break;
        case "monthly":
          analyticsData = await fetchMonthlyAnalytics(pasteUrl);
          break;
        default:
          analyticsData = await fetchHourlyAnalytics(pasteUrl);
      }
      setAnalyticsData(analyticsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // Format the remaining time for display
  const formatRemainingTime = (time: string) => {
    if (time === "NEVER") return "Never";
    if (time === "BURN_AFTER_READ") return "After viewing";
    return time;
  };

  const getChartType = () => {
    switch (selectedPeriod) {
      case "hourly":
        return "line";
      case "weekly":
        return "area";
      case "monthly":
        return "bar";
      default:
        return "line";
    }
  };

  const formatChartData = (timeSeries: any[] = []) => {
    return timeSeries.map((point) => ({
      label: formatTimestamp(point.timestamp, selectedPeriod),
      views: point.viewCount,
    }));
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-[250px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (
      !analyticsData ||
      !analyticsData.timeSeries ||
      analyticsData.timeSeries.length === 0
    ) {
      return (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          No data available for this time period
        </div>
      );
    }

    const chartData = formatChartData(analyticsData.timeSeries);
    const chartType = getChartType();

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
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-views)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-views)", r: 3 }}
                  activeDot={{
                    fill: "var(--color-views)",
                    r: 5,
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
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
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-views)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-views)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-views)"
                  fill="url(#colorViews)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="views"
                  fill="var(--color-views)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
    }
  };

  // Render different content based on whether it's a burn-after-read paste
  const renderDialogContent = () => {
    if (isBurnAfterRead) {
      return (
        <div className="py-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-2">
                <Clock className="h-8 w-8 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  Expires In
                </p>
                <p className="text-3xl font-bold">After viewing</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="py-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-2">
                <Eye className="h-8 w-8 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  Total Views
                </p>
                {isLoading ? (
                  <div className="h-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <p className="text-3xl font-bold">{stats?.viewCount || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-2">
                <Clock className="h-8 w-8 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  Expires In
                </p>
                <p className="text-3xl font-bold">
                  {formatRemainingTime(remainingTime)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div>
          <Tabs
            defaultValue="hourly"
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            className="mb-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hourly">Hourly</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
          {renderChart()}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChartIcon className="h-4 w-4" />
          View Stats
        </Button>
      </DialogTrigger>
      <DialogContent
        className={isBurnAfterRead ? "sm:max-w-[400px]" : "sm:max-w-[600px]"}
      >
        <DialogHeader>
          <DialogTitle>Paste Statistics</DialogTitle>
        </DialogHeader>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
}
