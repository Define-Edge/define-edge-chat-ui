"use client";

import { Control, Controller } from 'react-hook-form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { ScannerFilterFormValues } from './scanner-filters';

type ScannerPaginationProps = {
    control: Control<ScannerFilterFormValues>;
    currentPage: number;
    totalPages: number;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
};

export function ScannerPagination({
    control,
    currentPage,
    totalPages,
    isLoading = false,
    onPageChange,
    onPageSizeChange,
}: ScannerPaginationProps) {
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                    Page Size
                </label>
                <Controller
                    name="pageSize"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={String(field.value)}
                            onValueChange={(value) => {
                                const pageSize = Number(value);
                                field.onChange(pageSize);
                                onPageSizeChange(pageSize);
                            }}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages || isLoading}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
