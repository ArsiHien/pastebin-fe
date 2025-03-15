// API client for interacting with the backend using Axios
import axios from "axios"

// Types
export interface Paste {
  url: string
  content: string
  totalViews: number
  remainingTime: string
}

export interface CreatePasteRequest {
  content: string
  policyType: string
  duration: string
}

export interface CreatePasteResponse {
  url: string
}

export interface TimeSeriesPoint {
  timestamp: string
  viewCount: number
}

export interface AnalyticsResponse {
  pasteUrl: string
  totalViews: number
  timeSeries: TimeSeriesPoint[]
}

// Create Axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// API functions
export async function fetchPaste(url: string): Promise<Paste> {
  try {
    const response = await api.get<Paste>(`/pastes/${url}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch paste: ${error.response?.statusText || error.message}`)
    }
    throw error
  }
}

export async function createPasteApi(data: CreatePasteRequest): Promise<CreatePasteResponse> {
  try {
    const response = await api.post<CreatePasteResponse>("/pastes", data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to create paste: ${error.response?.statusText || error.message}`)
    }
    throw error
  }
}

// Analytics API functions
export async function fetchHourlyAnalytics(pasteUrl: string): Promise<AnalyticsResponse> {
  try {
    const response = await api.get<AnalyticsResponse>(`/analytics/hourly/${pasteUrl}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch hourly data: ${error.response?.statusText || error.message}`)
    }
    throw error
  }
}

export async function fetchWeeklyAnalytics(pasteUrl: string): Promise<AnalyticsResponse> {
  try {
    const response = await api.get<AnalyticsResponse>(`/analytics/weekly/${pasteUrl}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch weekly data: ${error.response?.statusText || error.message}`)
    }
    throw error
  }
}

export async function fetchMonthlyAnalytics(pasteUrl: string): Promise<AnalyticsResponse> {
  try {
    const response = await api.get<AnalyticsResponse>(`/analytics/monthly/${pasteUrl}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch monthly data: ${error.response?.statusText || error.message}`)
    }
    throw error
  }
}

