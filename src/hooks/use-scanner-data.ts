import { useQuery, useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
    getScannerResults,
    getExistingScannerResults,
    getPredefinedGroups,
    getScannerRatios,
} from '@/lib/definedge-api';
import type {
    ScannerResultsParams,
    ScannerResultsResponse,
    ScannerRatio,
    PredefinedGroups,
} from '@/types/definedge-scanner';
import type { SearchableSelectOption } from '@/components/ui/searchable-select';

/**
 * Hook to fetch scanner results based on search query
 */
export function useScannerResults(
    params: ScannerResultsParams,
    enabled = true,
    initialData?: ScannerResultsResponse
) {
    return useQuery<ScannerResultsResponse>({
        queryKey: ['scanner-results', params],
        queryFn: () => getScannerResults(params),
        enabled: enabled && !!params.searchQuery,
        initialData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch existing scanner results by ID
 */
export function useExistingScannerResults(
    params: ScannerResultsParams & { id: number },
    enabled = true,
    initialData?: ScannerResultsResponse
) {
    return useQuery<ScannerResultsResponse>({
        queryKey: ['existing-scanner-results', params],
        queryFn: () => getExistingScannerResults(params),
        enabled: enabled && !!params.id,
        initialData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch predefined groups
 */
export function usePredefinedGroups() {
    return useQuery<PredefinedGroups>({
        queryKey: ['predefined-groups'],
        queryFn: () => getPredefinedGroups(),
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
    });
}

/**
 * Hook to fetch scanner ratios
 */
export function useScannerRatios() {
    return useQuery<ScannerRatio[]>({
        queryKey: ['scanner-ratios'],
        queryFn: () => getScannerRatios(),
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
    });
}

/**
 * Hook to get formatted group options for select components
 */
export function useGroupOptions() {
    const { data: predefinedGroups, isLoading } = usePredefinedGroups();

    const options = useMemo<SearchableSelectOption[]>(() => {
        if (!predefinedGroups) return [];

        return Object.keys(predefinedGroups).map((gName) =>
        ({
            value: gName,
            label: gName,
            searchTerms: gName.toLowerCase(),
        }))

    }, [predefinedGroups]);

    return { options, isLoading };
}

/**
 * Hook to get formatted ratio options for select components
 */
export function useRatioOptions() {
    const { data: scannerRatios, isLoading } = useScannerRatios();

    const options = useMemo<SearchableSelectOption[]>(() => {
        if (!scannerRatios) return [];

        return scannerRatios.map(ratio => ({
            value: ratio.ratio,
            label: ratio.currentAlias,
            searchTerms: `${ratio.currentAlias} ${ratio.aliases}`.toLowerCase(),
        }));
    }, [scannerRatios]);

    return { options, isLoading };
}

/**
 * Hook to get ratio alias map for column headers
 * Maps ratio keys (e.g., "FdDerivedRatio.pb") to their display names (currentAlias)
 */
export function useRatioAliasMap() {
    const { data: scannerRatios } = useScannerRatios();

    const ratioAliasMap = useMemo(() => {
        if (!scannerRatios) return undefined;

        const map = new Map<string, string>();
        scannerRatios.forEach((ratio) => {
            map.set(ratio.ratio, ratio.currentAlias);
        });
        return map;
    }, [scannerRatios]);

    return ratioAliasMap;
}

/**
 * Hook to fetch all scanner results for CSV download
 * Uses mutation to fetch all data when download is triggered
 */
export function useDownloadAllScannerResults() {
    return useMutation({
        mutationFn: async ({
            params,
            totalElements,
            scannerId,
        }: {
            params: Omit<ScannerResultsParams, 'pageNumber' | 'pageSize'>;
            totalElements: number;
            scannerId?: number;
        }) => {
            const fullParams: ScannerResultsParams = {
                ...params,
                pageNumber: 1,
                pageSize: totalElements,
            };

            let response: ScannerResultsResponse;

            if (scannerId) {
                response = await getExistingScannerResults({ ...fullParams, id: scannerId });
            } else {
                response = await getScannerResults(fullParams);
            }

            return response.paginationResult?.content || [];
        },
    });
}
