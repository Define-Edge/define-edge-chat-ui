"use client";

import { Check, CircleDashed, Clock, X } from "lucide-react";
import React, { useMemo } from "react";

import { cn } from "@/lib/utils";

/**
 * Type definitions matching the backend schema
 */
export interface ReportStep {
    name: string;
    status: "pending" | "in_progress" | "completed" | "error";
    message?: string;
}

export interface ReportStatusProps {
    title: string;
    steps: ReportStep[];
    is_complete: boolean;
    report_id?: string;
}

export function ReportStatus(props: ReportStatusProps) {
    const { title, steps, is_complete, report_id } = props;
    // If the entire report is complete, we might want to hide this or just show a success message
    // But for now, let's keep showing the completed steps until the final report message replaces it
    // or until the user navigates away.

    const completedCount = useMemo(
        () => steps.filter((s) => s.status === "completed").length,
        [steps]
    );
    const totalCount = steps.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    return (
        <div className="w-full max-w-md rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold leading-none tracking-tight">
                    {title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        {completedCount} of {totalCount} steps completed
                    </span>
                    <span>{progressPercent}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <div className="space-y-3">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            {step.status === "completed" && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                            )}
                            {step.status === "in_progress" && (
                                <div className="flex h-6 w-6 items-center justify-center">
                                    <CircleDashed className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                                </div>
                            )}
                            {step.status === "pending" && (
                                <div className="flex h-6 w-6 items-center justify-center">
                                    <Clock className="h-4 w-4 text-muted-foreground/40" />
                                </div>
                            )}
                            {step.status === "error" && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                    <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span
                                className={cn(
                                    "text-sm font-medium",
                                    step.status === "pending" && "text-muted-foreground/60",
                                    step.status === "in_progress" && "text-foreground",
                                    step.status === "completed" && "text-muted-foreground"
                                )}
                            >
                                {step.name}
                            </span>
                            {step.message && (
                                <span className="text-xs text-muted-foreground">
                                    {step.message}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReportStatus;
