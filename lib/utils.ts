import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  }
  return date.toLocaleDateString("en-US", options)
}

export function formatTimestamp(timestamp: string, period: string): string {
  const date = new Date(timestamp)

  switch (period) {
    case "hourly":
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    case "weekly":
      return date.toLocaleDateString([], { weekday: "short" })
    case "monthly":
      return date.toLocaleDateString([], { month: "short" })
    default:
      return date.toLocaleString()
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

