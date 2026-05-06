import { Database } from "../types";

export async function fetchDb(): Promise<Database> {
  const response = await fetch("/api/db");
  if (!response.ok) throw new Error("Failed to fetch database");
  return response.json();
}

export async function saveDb(db: Database): Promise<void> {
  const response = await fetch("/api/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(db),
  });
  if (!response.ok) throw new Error("Failed to save database");
}
