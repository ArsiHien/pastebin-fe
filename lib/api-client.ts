export interface Paste {
  id: string
  content: string
  createdAt: string
  expiresAt: string | null
  views: number
}

export interface CreatePasteRequest {
  content: string
  expiration: string
}

export interface CreatePasteResponse {
  id: string
}

export interface ChartDataPoint {
  label: string
  views: number
}

// Base API URL
const API_BASE_URL = "http://localhost:8080/api"

// API functions
export async function fetchPaste(id: string): Promise<Paste> {
  const response = await fetch(`${API_BASE_URL}/pastes/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch paste: ${response.statusText}`)
  }

  return response.json()
}

export async function createPasteApi(data: CreatePasteRequest): Promise<CreatePasteResponse> {
  const response = await fetch(`${API_BASE_URL}/pastes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create paste: ${response.statusText}`)
  }

  return response.json()
}

export async function incrementPasteViewsApi(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/pastes/${id}/views`, {
    method: "POST",
  })

  if (!response.ok) {
    console.error(`Failed to increment views: ${response.statusText}`)
  }
}

// Chart data API functions
export async function fetchHourlyChartData(pasteId: string): Promise<ChartDataPoint[]> {
  const response = await fetch(`${API_BASE_URL}/pastes/${pasteId}/stats/hourly`)

  if (!response.ok) {
    throw new Error(`Failed to fetch hourly data: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchWeeklyChartData(pasteId: string): Promise<ChartDataPoint[]> {
  const response = await fetch(`${API_BASE_URL}/pastes/${pasteId}/stats/weekly`)

  if (!response.ok) {
    throw new Error(`Failed to fetch weekly data: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchMonthlyChartData(pasteId: string): Promise<ChartDataPoint[]> {
  const response = await fetch(`${API_BASE_URL}/pastes/${pasteId}/stats/monthly`)

  if (!response.ok) {
    throw new Error(`Failed to fetch monthly data: ${response.statusText}`)
  }

  return response.json()
}

