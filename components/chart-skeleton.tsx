export function ChartSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-1/3 bg-muted rounded"></div>
      <div className="h-[250px] bg-muted rounded flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart data...</div>
      </div>
    </div>
  )
}

