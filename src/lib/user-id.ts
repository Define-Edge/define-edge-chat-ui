"use client";
import { v4 as uuidv4 } from "uuid";

const USER_ID_KEY = "lg:chat:userId";

export function getUserId(): string | null {
  try {
    if (typeof window === "undefined") return null;

    let userId = window.localStorage.getItem(USER_ID_KEY);

    if (!userId) {
      userId = uuidv4();
      window.localStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
  } catch {
    // no-op - localStorage may not be available
  }

  return null;
}
