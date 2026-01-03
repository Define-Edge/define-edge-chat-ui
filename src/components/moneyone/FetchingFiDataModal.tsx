"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useFiDataConsentFlow } from "@/modules/import-data/hooks/useFiData";
import FiDataAnimation from "./FiDataAnimation";

export default function FetchingFiDataModal() {
  const { fetchStatus, modalOpen, handleClose } = useFiDataConsentFlow();

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="flex min-w-[200px] flex-col items-center justify-center p-8 text-center focus:outline-none focus-visible:ring-0 focus-visible:outline-none sm:max-w-md">
        <DialogTitle className="sr-only">Fetching Financial Data</DialogTitle>
        <FiDataAnimation status={fetchStatus} />
      </DialogContent>
    </Dialog>
  );
}
