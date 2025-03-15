"use server";
import { createPasteApi, fetchPaste } from "./api-client";

export async function createPaste({
  content,
  policyType,
  duration,
}: {
  content: string;
  policyType: string;
  duration: string;
}) {
  try {
    console.log("content:", content);
    console.log("policyType:", policyType);
    console.log("duration:", duration);

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

export async function getPaste(url: string) {
  try {
    return await fetchPaste(url);
  } catch (error) {
    console.error(`Error fetching paste ${url}:`, error);
    return null;
  }
}
