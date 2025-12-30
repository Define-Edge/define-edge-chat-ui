"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useModalState from "@/hooks/useModalState";
import { useFiDataConsentFlow } from "@/modules/import-data/hooks/useFiData";
import { useSearchParams } from "next/navigation";
import FiDataAnimation from "./FiDataAnimation";

export default function FetchingFiDataModal() {
  const { open, handleClose, handleOpen } = useModalState();
  const searchParams = useSearchParams();
  const consentID = searchParams.get("consentID");
  const consentType = searchParams.get("consentType");

  const { isLoading, data } = useFiDataConsentFlow(
    consentID,
    consentType,
    () => {
      handleClose();
    }
  );

  // Open modal when query starts
  if (isLoading && !open) {
    handleOpen();
  }

  // Derive fetch status from query state
  const fetchStatus: "fetching" | "success" =
    isLoading || !data ? "fetching" : "success";

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="flex min-w-[200px] flex-col items-center justify-center p-8 text-center focus:outline-none focus-visible:ring-0 focus-visible:outline-none sm:max-w-md">
        <DialogTitle className="sr-only">Fetching Financial Data</DialogTitle>
        <FiDataAnimation status={fetchStatus} />
      </DialogContent>
    </Dialog>
  );
}
