"use client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import FiDataAnimation from "./FiDataAnimation";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import useModalState from "@/hooks/useModalState";
import { getAllFiData } from "@/lib/moneyone/moneyone.actions";
import { updateConsent, completePendingConsent } from "@/lib/moneyone/moneyone.storage";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FiDataResponse } from "@/lib/moneyone/moneyone.types";

export default function FetchingFiDataModal({
  handleImportHoldings,
}: {
  handleImportHoldings: (
    data: FiDataResponse,
    consentType: ConsentType,
  ) => void;
}) {
  const { open, handleClose, handleOpen } = useModalState();
  const searchParams = useSearchParams();
  const consentID = searchParams.get("consentID");
  const consentType = searchParams.get("consentType");

  const { isLoading, data } = useQuery({
    queryKey: ["fi-data", consentID],
    queryFn: async () => {
      if (!consentID || !consentType)
        throw new Error("Invalid consent ID or consent type");
      handleOpen();

      // Complete pending consent by saving with real consentID
      const mobileNo = searchParams.get("mobileNo");
      const consentCreationData = searchParams.get("consentCreationData");

      completePendingConsent(
        consentID,
        consentType as ConsentType,
        mobileNo,
        consentCreationData
      );

      const data = await getAllFiData(consentID, 3000);

      if ("error" in data) {
        throw new Error(data.error);
      }

      // handleImportHoldings(data, consentType as ConsentType);

      // Mark data as ready after successful fetch
      updateConsent(consentID, { isDataReady: true });
      console.log("Marked consent data as ready:", consentID);

      setTimeout(() => {
        handleClose();
      }, 1500);

      // Remove search params from url
      const url = new URL(window.location.href);
      url.searchParams.delete("consentID");
      url.searchParams.delete("consentType");
      url.searchParams.delete("mobileNo");
      url.searchParams.delete("consentCreationData");
      // if (!url.searchParams.has("threadId")) {
      //   url.search = "";
      // }
      history.pushState(null, "", url.toString());

      return data;
    },
    enabled:
      !!consentID &&
      !!consentType &&
      Object.values(ConsentType).includes(consentType as ConsentType),
    retry: true,
    retryDelay: 3000,
    refetchOnWindowFocus: false,
  });

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
