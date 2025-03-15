"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Eye, RefreshCw } from "lucide-react";
import {
  type AnalyticsResponse,
  type TimeSeriesPoint,
  fetchHourlyAnalytics,
  fetchMonthlyAnalytics,
  fetchWeeklyAnalytics,
} from "@/lib/api-client";
import { ChartSkeleton } from "./chart-skeleton";
import { formatTimestamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "./error-message";

interface PasteStatisticsProps {
  pasteUrl: string;
  totalViews: number;
  remainingTime: string;
}

export function PasteStatistics({
  pasteUrl,
  totalViews,
  remainingTime,
}: PasteStatisticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("hourly");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format the remaining time for display
  const formatRemainingTime = (time: string) => {
    if (time === "NEVER") return "Never";
    if (time === "BURN_AFTER_READ") return "After viewing";
    return time;
  };

  // Fetch analytics data when period changes
  const fetchAnalyticsData = async () => {
    console.log(remainingTime)
    console.log('________________')
    if (remainingTime === "After viewing") {
      setAnalyticsData(null);
      setIsLoading(false);
      return;
    }

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
      // Fallback to empty data
      setAnalyticsData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [pasteUrl, selectedPeriod]);

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

  const formatChartData = (timeSeries: TimeSeriesPoint[]) => {
    return timeSeries.map((point) => ({
      label: formatTimestamp(point.timestamp, selectedPeriod),
      views: point.viewCount,
    }));
  };

  const renderChart = () => {
    if (remainingTime === "After viewing") {
      return (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          Analytics unavailable for this paste
        </div>
      );
    }

    if (isLoading) {
      return <ChartSkeleton />;
    }

    if (error) {
      return (
        <div className="space-y-4">
          <ErrorMessage message={error} />
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={fetchAnalyticsData}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      );
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
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
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
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="views"
                fill="var(--color-views)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ChartContainer>
        );
    }
  };

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
              <span className="text-2xl font-bold">{totalViews}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              {remainingTime ? "Expires In" : "Expiration"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {formatRemainingTime(remainingTime)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              View Statistics
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
