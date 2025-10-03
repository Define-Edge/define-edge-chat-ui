import React, { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

type Source = {
    title: string
    url: string
    date?: string
    description?: string
}

type Props = {
    sources?: Source[]
}

export default function Sources({ sources }: Props) {
    const [isExpanded, setIsExpanded] = useState(false)

    if (!sources || sources.length === 0) return null

    const displayLimit = 5
    const hasMore = sources.length > displayLimit
    const displayedSources = isExpanded ? sources : sources.slice(0, displayLimit)

    return (
        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">
                    Sources ({sources.length})
                </h4>
            </div>

            <div className="space-y-2">
                {displayedSources.map((source, index) => (
                    <a
                        key={`${source.url}-${index}`}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 rounded-md border bg-background p-3 transition-colors hover:bg-accent"
                    >
                        <div className="flex-shrink-0">
                            <img
                                src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(source.url)}&sz=32`}
                                alt=""
                                className="size-8 rounded"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2">
                                <p className="flex-1 text-sm font-medium text-foreground group-hover:text-primary line-clamp-2">
                                    {source.title}
                                </p>
                                <ExternalLink className="size-4 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                            </div>
                            {source.description && (
                                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                    {source.description}
                                </p>
                            )}
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="truncate">
                                    {(() => {
                                        try {
                                            return new URL(source.url).hostname
                                        } catch {
                                            return source.url
                                        }
                                    })()}
                                </span>
                                {source.date && (
                                    <>
                                        <span>•</span>
                                        <span>{source.date}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {hasMore && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                >
                    <span>
                        {isExpanded ? 'Show less' : `Show ${sources.length - displayLimit} more`}
                    </span>
                    <ChevronDown
                        className={cn(
                            'size-4 transition-transform',
                            isExpanded && 'rotate-180'
                        )}
                    />
                </button>
            )}
        </div>
    )
}