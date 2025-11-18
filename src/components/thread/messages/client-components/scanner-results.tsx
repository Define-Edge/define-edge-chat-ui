"use client";

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    useScannerResults,
    useExistingScannerResults,
} from '@/hooks/use-scanner-data';
import { ScannerFilters, type ScannerFilterFormValues } from './scanner-filters';
import { ScannerPagination } from './scanner-pagination';
import { ScannerGrid } from './scanner-grid';

import type { ScannerResultsResponse } from '@/types/definedge-scanner';

type ScannerResultsProps = {
    scanner_type?: string;
    scanner_id?: number;
    results?: ScannerResultsResponse;
    total_elements?: number;
    total_pages?: number;
    page_number?: number;
    page_size?: number;
    user_actual_query?: string;
};

export default function ScannerResults({
    scanner_type,
    scanner_id,
    results: initialResults,
    total_elements,
    total_pages,
    page_number,
    page_size,
    user_actual_query,
}: ScannerResultsProps) {
    // Initialize form with default values
    const { control, watch, setValue } = useForm<ScannerFilterFormValues>({
        defaultValues: {
            pageNumber: page_number || 1,
            pageSize: page_size || 50,
            segment: "0",
            group: "",
            sortRatio: "",
            sortDirection: "desc",
        },
    });

    // Watch form values for query params
    const formValues = watch();

    // Check if filters have changed from defaults
    const filtersChanged = useMemo(() => {
        return Boolean(
            formValues.segment !== "0" ||
            formValues.group !== "" ||
            formValues.sortRatio !== "" ||
            formValues.pageNumber !== (page_number || 1) ||
            formValues.pageSize !== (page_size || 50)
        );
    }, [formValues, page_number, page_size]);

    // Build query params based on form values
    const queryParams = useMemo(() => {
        const sort = formValues.sortRatio
            ? `${formValues.sortRatio},${formValues.sortDirection}`
            : undefined;

        return {
            pageNumber: formValues.pageNumber,
            pageSize: formValues.pageSize,
            segment: formValues.segment,
            group: formValues.group || undefined,
            groupType: "predefined" as const,
            showOnlyLatestQuarterData: "0" as const,
            sort,
        };
    }, [formValues]);

    // Determine scanner type and fetch appropriate data
    const isExistingScanner = Boolean(scanner_type === 'saved' && scanner_id);

    const {
        data: existingScannerData,
        isLoading: existingLoading,
        error: existingError,
    } = useExistingScannerResults(
        { id: scanner_id!, ...queryParams },
        isExistingScanner && filtersChanged, // Only fetch if filters changed
        filtersChanged ? undefined : initialResults // Only use initial data if filters haven't changed
    );

    const {
        data: searchScannerData,
        isLoading: searchLoading,
        error: searchError,
    } = useScannerResults(
        { searchQuery: initialResults?.searchQuery || '', ...queryParams },
        !isExistingScanner && !!initialResults?.searchQuery && filtersChanged, // Only fetch if filters changed
        filtersChanged ? undefined : initialResults // Only use initial data if filters haven't changed
    );

    // Use fetched data if available, otherwise fall back to initial results
    const results = isExistingScanner
        ? existingScannerData || initialResults
        : searchScannerData || initialResults;

    // Show loading state when fetching
    const isLoading = isExistingScanner ? existingLoading : searchLoading;
    const error = isExistingScanner ? existingError : searchError;

    // Extract data from results
    const rowData = useMemo(() =>
        results?.paginationResult?.content || [],
        [results?.paginationResult?.content]
    );

    const userQuery = results?.userActualQuery || user_actual_query;
    const totalElements = results?.paginationResult?.totalElements || total_elements || 0;
    const totalPages = results?.paginationResult?.totalPages || total_pages || 0;
    const currentPage = results?.paginationResult?.pageNumber || formValues.pageNumber;

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setValue('pageNumber', page);
    };

    const handlePageSizeChange = (pageSize: number) => {
        setValue('pageSize', pageSize);
        setValue('pageNumber', 1); // Reset to page 1 when changing page size
    };

    // Empty state (no initial results and not loading)
    if (!results && !isLoading) {
        return (
            <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">No results found</p>
            </div>
        );
    }

    return (
        <div className="mt-4 w-full space-y-4 chat-container">
            {/* Error Banner */}
            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">
                        Error loading scanner results: {error instanceof Error ? error.message : 'Unknown error'}
                    </p>
                </div>
            )}

            {/* Header */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">
                        Scanner Results
                        {scanner_id && (
                            <span className="ml-2 text-muted-foreground">
                                (ID: {scanner_id})
                            </span>
                        )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        {totalElements} {totalElements === 1 ? 'result' : 'results'}
                        {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                    </p>
                </div>

                {/* Show user query only if scanner_type is not "saved" */}
                {scanner_type !== 'saved' && userQuery && (
                    <div className="rounded-md border bg-background p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                            Query
                        </p>
                        <p className="text-sm text-foreground font-mono break-words">
                            {userQuery}
                        </p>
                    </div>
                )}

                {/* Filters */}
                <div className="pt-3 border-t">
                    <ScannerFilters control={control} />
                </div>

                {/* Pagination Controls */}
                <div className="pt-3 border-t">
                    <ScannerPagination
                        control={control}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        isLoading={isLoading}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </div>
            </div>

            {/* Grid */}
            <ScannerGrid
                rowData={rowData}
                isLoading={isLoading}
            />
        </div>
    );
}
