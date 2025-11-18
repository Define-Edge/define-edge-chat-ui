import { useQuery } from '@tanstack/react-query';
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
