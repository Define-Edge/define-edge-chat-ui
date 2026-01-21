import { Card } from "@/components/ui/card";
import { Thread } from "@langchain/langgraph-sdk";
import { Bookmark, BookmarkCheck, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BookmarkManager } from "../utils/BookmarkManager";
import { getThreadInfo } from "../utils/threadUtils";

interface ThreadCardProps {
  thread: Thread;
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  const { title, preview, messageCount, timestamp } = getThreadInfo(thread);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setIsBookmarked(BookmarkManager.isBookmarked(thread.thread_id));
    };

    updateState();
    window.addEventListener("bookmarks-updated", updateState);
    return () => window.removeEventListener("bookmarks-updated", updateState);
  }, [thread.thread_id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = BookmarkManager.toggleBookmark(thread.thread_id);
    setIsBookmarked(newState);
  };

  return (
    <Link
      href={`/?threadId=${thread.thread_id}`}
      className="block h-full"
    >
      <Card className="flex h-full cursor-pointer flex-col justify-between border-gray-200 p-4 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="min-w-0 flex-shrink truncate font-medium text-gray-900">
                {title}
              </h3>
            </div>
            <p className="mb-2 line-clamp-2 text-sm break-words text-gray-600">
              {preview}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              {timestamp && (
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span>{timestamp}</span>
                </div>
              )}
              <div className="flex items-center gap-1 whitespace-nowrap">
                <MessageSquare className="h-3 w-3 flex-shrink-0" />
                <span>{messageCount} messages</span>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              className="rounded-full p-1 transition-colors hover:bg-gray-100"
              title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
              onClick={handleBookmark}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-yellow-500" />
              ) : (
                <Bookmark className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
              )}
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
