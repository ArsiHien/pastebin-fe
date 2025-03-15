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

export function formatTimeRemaining(expirationDate: Date): string {
  const now = new Date()

  if (expirationDate <= now) {
    return "Expired"
  }

  const diffMs = expirationDate.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h ${diffMinutes}m`
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m ${diffSeconds}s`
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ${diffSeconds}s`
  } else {
    return `${diffSeconds}s`
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

