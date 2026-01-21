import { useThreadsQuery } from "@/hooks/useThreadsQuery";
import { Thread } from "@langchain/langgraph-sdk";
import { useEffect, useState } from "react";
import { BookmarkManager } from "../utils/BookmarkManager";

export function useBookmarkedThreads() {
  const { data: threads, isLoading } = useThreadsQuery();
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    const loadBookmarks = () => {
      setBookmarkedIds(BookmarkManager.getBookmarks());
    };
    loadBookmarks();
    window.addEventListener("bookmarks-updated", loadBookmarks);
    return () => window.removeEventListener("bookmarks-updated", loadBookmarks);
  }, []);

  const bookmarkedThreads: Thread[] = threads
    ? threads.filter((t) => bookmarkedIds.includes(t.thread_id))
    : [];

  return {
    bookmarkedThreads,
    isLoading,
  };
}
