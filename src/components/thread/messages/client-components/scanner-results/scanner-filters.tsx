"use client";

import { Control, Controller } from 'react-hook-form';
import { useGroupOptions, useRatioOptions } from '@/hooks/use-scanner-data';
import type { Segment } from '@/types/definedge-scanner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';

export type ScannerFilterFormValues = {
    pageNumber: number;
    pageSize: number;
    segment: Segment;
    group: string;
    sortRatio: string;
    sortDirection: 'asc' | 'desc';
};

type ScannerFiltersProps = {
    control: Control<ScannerFilterFormValues>;
};

export function ScannerFilters({ control }: ScannerFiltersProps) {
    const { options: groupOptions, isLoading: groupsLoading } = useGroupOptions();
    const { options: ratioOptions, isLoading: ratiosLoading } = useRatioOptions();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Segment Select */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                    Exchange
                </label>
                <Controller
                    name="segment"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select exchange" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">NSE</SelectItem>
                                <SelectItem value="2">BSE</SelectItem>
                                <SelectItem value="-1">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Group Combobox */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                    Group
                </label>
                <Controller
                    name="group"
                    control={control}
                    render={({ field }) => (
                        <SearchableSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            options={groupOptions}
                            placeholder="Select group..."
                            searchPlaceholder="Search group..."
                            emptyText="No group found."
                            clearLabel="All Groups"
                            disabled={groupsLoading}
                        />
                    )}
                />
            </div>

            {/* Sort Ratio Combobox */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                    Sort By
                </label>
                <Controller
                    name="sortRatio"
                    control={control}
                    render={({ field }) => (
                        <SearchableSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            options={ratioOptions}
                            placeholder="Select ratio..."
                            searchPlaceholder="Search ratio..."
                            emptyText="No ratio found."
                            clearLabel="None"
                            disabled={ratiosLoading}
                        />
                    )}
                />
            </div>

            {/* Sort Direction */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                    Direction
                </label>
                <Controller
                    name="sortDirection"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
    );
}
