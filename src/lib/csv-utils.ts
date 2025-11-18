import { startCase } from 'lodash';

/**
 * Extracts the column header from a dotted key path.
 * For "Shpsummary.tpftotalpromoter.latestQuarter" returns "latestQuarter"
 * For "FdDerivedRatio.pb" returns "pb"
 */
export const extractColumnName = (key: string): string => {
    const parts = key.split('.');
    return parts[parts.length - 1];
};

/**
 * Converts a camelCase string to Title Case.
 * Uses lodash startCase for conversion.
 */
export const formatColumnHeader = (key: string): string => {
    const columnName = extractColumnName(key);
    return startCase(columnName);
};

/**
 * Escapes a CSV cell value by wrapping in quotes if it contains special characters
 */
export const escapeCsvValue = (value: any): string => {
    if (value === null || value === undefined) return '';

    const stringValue = String(value);

    // Wrap in quotes if contains comma, quote, or newline
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        // Escape quotes by doubling them
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
};

/**
 * Converts row data to CSV format
 */
export const convertToCSV = (data: Record<string, any>[]): string => {
    if (!data || data.length === 0) return '';

    // Extract all unique column keys from the data, excluding columns with "code" in the name
    const allKeys = Array.from(
        new Set(data.flatMap(row => Object.keys(row)))
    ).filter(key => !key.toLowerCase().includes('code'));

    // Create header row with formatted column names
    const headers = allKeys.map(key => formatColumnHeader(key));
    const headerRow = headers.map(h => escapeCsvValue(h)).join(',');

    // Create data rows
    const dataRows = data.map(row => {
        return allKeys.map(key => escapeCsvValue(row[key])).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
};

/**
 * Downloads CSV data as a file
 */
export const downloadCSV = (data: Record<string, any>[], filename: string): void => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

/**
 * Generates a timestamped filename for CSV downloads
 */
export const generateCsvFilename = (baseName: string): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `${baseName}-${timestamp}.csv`;
};
