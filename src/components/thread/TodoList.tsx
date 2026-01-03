import { Todo } from "@/lib/extract-todos";
import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoListProps {
  todos: Todo[];
  className?: string;
}

function TodoStatusIcon({ status }: { status: Todo["status"] }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />;
    case "in_progress":
      return <LoaderCircle className="h-4 w-4 text-blue-600 animate-spin flex-shrink-0" />;
    case "pending":
      return <Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />;
  }
}

export function TodoList({ todos, className }: TodoListProps) {
  if (!todos || todos.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-muted/50 w-fit max-w-xl rounded-2xl border border-gray-200 px-4 py-3",
        className
      )}
    >
      <div className="mb-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
        Tasks
      </div>
      <div className="flex flex-col gap-2">
        {todos.map((todo, index) => (
          <div
            key={index}
            className="flex items-start gap-2"
          >
            <TodoStatusIcon status={todo.status} />
            <span
              className={cn(
                "text-sm",
                todo.status === "completed"
                  ? "text-gray-500 line-through"
                  : "text-gray-800"
              )}
            >
              {todo.content}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
