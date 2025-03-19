// API client for interacting with the backend using Axios
import axios from "axios";

// Types
export interface RetrievePasteResponse {
  url: string;
  content: string;
  remainingTime: string;
}

export interface StatsResponse {
  viewCount: number;
}

export interface CreatePasteRequest {
  content: string;
  policyType: string; // "TIMED", "NEVER", "BURN_AFTER_READ"
  duration: string | null; // Required for TIMED policy
}

export interface CreatePasteResponse {
  url: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  viewCount: number;
}

export interface AnalyticsResponse {
  pasteUrl: string;
  totalViews: number;
  timeSeries: TimeSeriesPoint[];
}

// Get API base URL from environment variables with fallback
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Create Axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API functions
export async function fetchPastePolicy(url: string): Promise<string> {
  try {
    const response = await api.get<string>(`/pastes/${url}/policy`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch paste policy: ${
          error.response?.statusText || error.message
        }`
      );
    }
    throw error;
  }
}

export async function fetchPasteContent(
  url: string
): Promise<RetrievePasteResponse> {
  try {
    const response = await api.get<RetrievePasteResponse>(
      `/pastes/${url}/content`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch paste content: ${
          error.response?.statusText || error.message
        }`
      );
    }
    throw error;
  }
}

export async function fetchPasteStats(url: string): Promise<StatsResponse> {
  try {
    const response = await api.get<StatsResponse>(`/pastes/${url}/stats`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch paste stats: ${
          error.response?.statusText || error.message
        }`
      );
    }
    throw error;
  }
}

export async function createPasteApi(
  data: CreatePasteRequest
): Promise<CreatePasteResponse> {
  try {
    console.log("Creating paste with data:", data); // Debug log
    const response = await api.post<CreatePasteResponse>("/pastes", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error Response:", error.response?.data); // Debug log
      throw new Error(
        `Failed to create paste: ${error.response?.statusText || error.message}`
      );
    }
    throw error;
  }
}

// Analytics API functions
export async function fetchHourlyAnalytics(
  pasteUrl: string
): Promise<AnalyticsResponse> {
  try {
    const response = await api.get<AnalyticsResponse>(
      `/analytics/hourly/${pasteUrl}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch hourly data: ${
          error.response?.statusText || error.message
        }`
      );
    }
    throw error;
  }
}

export async function fetchWeeklyAnalytics(
  pasteUrl: string
): Promise<AnalyticsResponse> {
  try {
    const response = await api.get<AnalyticsResponse>(
      `/analytics/weekly/${pasteUrl}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch weekly data: ${
          error.response?.statusText || error.message
        }`
      );
    }
    throw error;
  }
}

export async function fetchMonthlyAnalytics(
  pasteUrl: string
): Promise<AnalyticsResponse> {
  try {
    const response = await api.get<AnalyticsResponse>(
      `/analytics/monthly/${pasteUrl}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch monthly data: ${
          error.response?.statusText || error.message
        }`
      );
    }
    throw error;
  }
}
