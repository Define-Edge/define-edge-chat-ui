import { Download } from 'lucide-react';
import { Button, type ButtonProps } from './button';
import { downloadCSV, generateCsvFilename } from '@/lib/csv-utils';

export type CSVDownloadButtonProps = {
    /**
     * The data to be exported as CSV
     */
    data: Record<string, any>[];
    /**
     * The filename for the downloaded CSV file (without .csv extension)
     * Can be a string or a function that returns a string
     */
    filename: string | (() => string);
    /**
     * Whether the button should be disabled
     */
    disabled?: boolean;
    /**
     * Button variant (defaults to "outline")
     */
    variant?: ButtonProps['variant'];
    /**
     * Button size (defaults to "sm")
     */
    size?: ButtonProps['size'];
    /**
     * Optional button label (defaults to "CSV")
     */
    label?: string;
    /**
     * Optional className for additional styling
     */
    className?: string;
};

/**
 * A reusable button component for downloading data as CSV
 */
export function CSVDownloadButton({
    data,
    filename,
    disabled = false,
    variant = 'outline',
    size = 'sm',
    label = 'CSV',
    className,
}: CSVDownloadButtonProps) {
    const handleDownload = () => {
        if (!data || data.length === 0) return;

        const baseFilename = typeof filename === 'function' ? filename() : filename;
        const csvFilename = generateCsvFilename(baseFilename);

        downloadCSV(data, csvFilename);
    };

    const isDisabled = disabled || !data || data.length === 0;

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleDownload}
            disabled={isDisabled}
            title="Download results as CSV"
            className={className}
        >
            <Download className="size-4" />
            {label}
        </Button>
    );
}
