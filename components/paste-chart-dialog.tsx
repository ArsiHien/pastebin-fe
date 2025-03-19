"use client";

import { useState, useEffect } from "react";
import { BarChartIcon } from "lucide-react";
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
import { ChartSkeleton } from "./chart-skeleton";
import { ErrorMessage } from "./error-message";
import {
  type AnalyticsResponse,
  fetchHourlyAnalytics,
  fetchWeeklyAnalytics,
  fetchMonthlyAnalytics,
} from "@/lib/api-client";
import { formatTimestamp } from "@/lib/utils";

interface PasteChartDialogProps {
  pasteUrl: string;
}

export function PasteChartDialog({ pasteUrl }: PasteChartDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("hourly");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data when period changes or dialog opens
  useEffect(() => {
    if (open) {
      fetchAnalyticsData();
    }
  }, [pasteUrl, selectedPeriod, open]);

  const fetchAnalyticsData = async () => {
    if (!open) return;

    setIsLoading(true);
    setError(null);

    try {
      let data: AnalyticsResponse;

      switch (selectedPeriod) {
        case "hourly":
          data = await fetchHourlyAnalytics(pasteUrl);
          break;
        case "weekly":
          data = await fetchWeeklyAnalytics(pasteUrl);
          break;
        case "monthly":
          data = await fetchMonthlyAnalytics(pasteUrl);
          break;
        default:
          data = await fetchHourlyAnalytics(pasteUrl);
      }

      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load analytics data"
      );
      setAnalyticsData(null);
    } finally {
      setIsLoading(false);
    }
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
      return <ChartSkeleton />;
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChartIcon className="h-4 w-4" />
          View Chart
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Paste Analytics</DialogTitle>
        </DialogHeader>
        <div className="py-4">
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
      </DialogContent>
    </Dialog>
  );
}
