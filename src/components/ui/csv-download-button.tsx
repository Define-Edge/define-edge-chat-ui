import { Download, Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from './button';

export type CSVDownloadButtonProps = {
    /**
     * Handler function called when the download button is clicked
     */
    onDownload: () => void;
    /**
     * Whether the button should be disabled
     */
    disabled?: boolean;
    /**
     * Whether the button is in a loading state
     */
    isLoading?: boolean;
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
 * A reusable button component for downloading CSV files
 */
export function CSVDownloadButton({
    onDownload,
    disabled = false,
    isLoading = false,
    variant = 'outline',
    size = 'sm',
    label = 'CSV',
    className,
}: CSVDownloadButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            onClick={onDownload}
            disabled={disabled || isLoading}
            title="Download results as CSV"
            className={className}
        >
            {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <Download className="size-4" />
            )}
            {label}
        </Button>
    );
}
