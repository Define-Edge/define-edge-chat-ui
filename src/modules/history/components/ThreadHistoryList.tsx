import { Input } from "@/components/ui/input";
import { useThreadsQuery } from "@/hooks/useThreadsQuery";
import { Thread } from "@langchain/langgraph-sdk";
import {
  isThisMonth,
  isThisWeek,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import { Search } from "lucide-react";
import { useState } from "react";
import ThreadGroupSection from "./ThreadGroupSection";
import ThreadHistoryLoading from "./ThreadHistoryLoading";
import { getThreadInfo } from "../utils/threadUtils";
import { useBookmarkedThreads } from "../hooks/useBookmarkedThreads";
import BookmarkedChatsSlider from "./BookmarkedChatsSlider";

export default function ThreadHistoryList() {
  const { data: threads, isLoading } = useThreadsQuery();
  const { bookmarkedThreads } = useBookmarkedThreads();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return <ThreadHistoryLoading />;
  }

  if (!threads || threads.length === 0) {
    return (
      <div className="text-muted-foreground mt-8 text-center text-sm">
        No conversation history found.
      </div>
    );
  }

  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery) return true;
    const { title, preview } = getThreadInfo(thread);
    const query = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(query) ||
      preview.toLowerCase().includes(query)
    );
  });

  // Group threads by date
  const groups: Record<string, Thread[]> = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    "This Month": [],
    Older: [],
  };

  filteredThreads.forEach((thread) => {
    if (!thread.created_at) {
      groups.Older.push(thread);
      return;
    }
    const date = parseISO(thread.created_at);
    if (isToday(date)) {
      groups.Today.push(thread);
    } else if (isYesterday(date)) {
      groups.Yesterday.push(thread);
    } else if (isThisWeek(date)) {
      groups["This Week"].push(thread);
    } else if (isThisMonth(date)) {
      groups["This Month"].push(thread);
    } else {
      groups.Older.push(thread);
    }
  });

  return (
    <div className="min-w-0 space-y-6">
      {/* Bookmarked Chats Slider */}
      <BookmarkedChatsSlider threads={bookmarkedThreads} />

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Search your chats..."
          className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredThreads.length === 0 ? (
        <div className="text-muted-foreground mt-8 text-center text-sm">
          No threads found matching "{searchQuery}".
        </div>
      ) : (
        <>
          <ThreadGroupSection
            title="Today"
            threads={groups.Today}
          />
          <ThreadGroupSection
            title="Yesterday"
            threads={groups.Yesterday}
          />
          <ThreadGroupSection
            title="This Week"
            threads={groups["This Week"]}
          />
          <ThreadGroupSection
            title="This Month"
            threads={groups["This Month"]}
          />
          <ThreadGroupSection
            title="Older"
            threads={groups.Older}
          />
        </>
      )}
    </div>
  );
}
