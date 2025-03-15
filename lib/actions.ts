"use server"

import { revalidatePath } from "next/cache"
import { createPasteApi, fetchPaste, incrementPasteViewsApi } from "./api-client"

// Expiration mapping
const expirationMap: Record<string, number> = {
  never: 0,
  "10m": 10 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "1w": 7 * 24 * 60 * 60 * 1000,
  "1m": 30 * 24 * 60 * 60 * 1000,
}

export async function createPaste(content: string, expiration = "never") {
  try {
    const response = await createPasteApi({
      content,
      expiration,
    })

    return { id: response.id }
  } catch (error) {
    console.error("Error creating paste:", error)
    throw error
  }
}

export async function getPaste(id: string) {
  try {
    return await fetchPaste(id)
  } catch (error) {
    console.error(`Error fetching paste ${id}:`, error)
    return null
  }
}

export async function incrementPasteViews(id: string) {
  try {
    await incrementPasteViewsApi(id)
    revalidatePath(`/paste/${id}`)
    return true
  } catch (error) {
    console.error(`Error incrementing views for paste ${id}:`, error)
    return false
  }
}

