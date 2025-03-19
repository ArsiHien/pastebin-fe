"use server";
import {
  createPasteApi,
  fetchPasteContent,
  fetchPastePolicy,
  fetchPasteStats,
} from "./api-client";

export async function createPaste({
  content,
  policyType,
  duration,
}: {
  content: string;
  policyType: "TIMED" | "NEVER" | "BURN_AFTER_READ";
  duration: string | null;
}) {
  try {
    const response = await createPasteApi({
      content,
      policyType,
      duration,
    });

    return { id: response.url };
  } catch (error) {
    console.error("Error creating paste:", error);
    throw error;
  }
}

export async function getPastePolicy(url: string) {
  try {
    return await fetchPastePolicy(url);
  } catch (error) {
    console.error(`Error fetching paste policy ${url}:`, error);
    return null;
  }
}

export async function getPasteContent(url: string) {
  try {
    return await fetchPasteContent(url);
  } catch (error) {
    console.error(`Error fetching paste content ${url}:`, error);
    return null;
  }
}

export async function getPasteStats(url: string) {
  try {
    return await fetchPasteStats(url);
  } catch (error) {
    console.error(`Error fetching paste stats ${url}:`, error);
    return null;
  }
}
