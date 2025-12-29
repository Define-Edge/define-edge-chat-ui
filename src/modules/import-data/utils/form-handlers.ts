import { toast } from "sonner";

/**
 * Generic form submission handler for UI-only forms
 * Logs data to console and shows "not implemented" message
 */
export function handleDummyFormSubmit(formType: string, data: any) {
  console.log(`${formType} data:`, data);
  toast.info(`${formType} form submission is not yet implemented`);
}
