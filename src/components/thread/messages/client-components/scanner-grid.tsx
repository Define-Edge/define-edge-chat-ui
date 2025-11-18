"use client";

import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { startCase } from 'lodash';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

type ScannerGridProps = {
    rowData: Record<string, any>[];
    isLoading?: boolean;
};

/**
 * Extracts the column header from a dotted key path.
 * For "Shpsummary.tpftotalpromoter.latestQuarter" returns "latestQuarter"
 * For "FdDerivedRatio.pb" returns "pb"
 */
const extractColumnName = (key: string): string => {
    const parts = key.split('.');
    return parts[parts.length - 1];
};

/**
 * Converts a camelCase string to Title Case.
 * Uses lodash startCase for conversion.
 */
const formatColumnHeader = (key: string): string => {
    const columnName = extractColumnName(key);
    return startCase(columnName);
};

export function ScannerGrid({ rowData, isLoading = false }: ScannerGridProps) {
    // Generate column definitions from the first row of data
    const columnDefs = useMemo(() => {
        if (!rowData || rowData.length === 0) return [];

        const firstRow = rowData[0];
        return Object.keys(firstRow)
            .filter((key) => !key.toLowerCase().includes('code'))
            .map((key) => ({
                colId: key,
                headerName: formatColumnHeader(key),
                valueGetter: (params: any) => params.data?.[key],
                sortable: true,
                filter: true,
                resizable: true,
                minWidth: 150,
            }));
    }, [rowData]);

    const onGridReady = (params: any) => {
        params.api.sizeColumnsToFit();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 rounded-lg border bg-background">
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!rowData || rowData.length === 0) {
        return (
            <div className="flex items-center justify-center p-12 rounded-lg border bg-background">
                <p className="text-sm text-muted-foreground">No results found</p>
            </div>
        );
    }

    return (
        <div className="w-full rounded-lg border bg-background overflow-hidden">
            <div className="w-full" style={{ height: Math.min(600, 60 + rowData.length * 42) }}>
                <AgGridReact
                    theme={themeQuartz}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    defaultColDef={{
                        sortable: true,
                        filter: true,
                        resizable: true,
                    }}
                    pagination={false}
                />
            </div>
        </div>
    );
}
