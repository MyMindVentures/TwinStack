/**
 * AI Request Restructuring Service
 *
 * Calls the server-side endpoint that runs Gemini.
 * The API key is NEVER exposed to the client.
 */

export interface RestructuredRequest {
  nonTechDescription: string;
  techDescription: string;
}

export async function restructureRequest(
  rawText: string
): Promise<RestructuredRequest> {
  const response = await fetch("/api/ai/restructure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text: rawText }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "AI restructuring failed");
  }

  return response.json();
}
