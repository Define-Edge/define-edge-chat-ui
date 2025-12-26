"use client";
import { useState } from "react";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { ImportHoldingsContextType } from "@/lib/moneyone/moneyone.types";
import { ImportHoldingsProvider } from "./import-holdings.context";
import CreateConsentModel from "./CreateConsentModel";
import { Button } from "@/components/ui/button";
import { useCheckConsentMut } from "./useCheckConsentMut";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = Omit<
  ImportHoldingsContextType,
  "showCreateConsentModal" | "setShowCreateConsentModal"
>;

export default function ImportHoldings({
  consentType,
  handlePfAction,
}: Props) {
  const [showCreateConsentModal, setShowCreateConsentModal] = useState(false);
  const checkConsentMut = useCheckConsentMut(consentType);

  const handleImportClick = () => {
    checkConsentMut.mutate(undefined, {
      onSettled: (data, error) => {
        if (data) {
          setShowCreateConsentModal(false);
          handlePfAction(data, consentType);
        } else if (!error) {
          setShowCreateConsentModal(true);
        }
      },
      onError: (error: any) => {
        if ("error" in error && typeof error.error === "string") {
          toast.error(error.error);
        } else {
          toast.error("Failed to check consent");
        }
      },
    });
  };

  return (
    <ImportHoldingsProvider
      consentType={consentType}
      handlePfAction={handlePfAction}
      showCreateConsentModal={showCreateConsentModal}
      setShowCreateConsentModal={setShowCreateConsentModal}
    >
      <Button
        onClick={handleImportClick}
        className="flex w-full items-center justify-center gap-2"
        variant="default"
        disabled={checkConsentMut.isPending}
      >
        {checkConsentMut.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            Import{" "}
            {consentType === ConsentType.EQUITIES
              ? "Eq-Portfolio"
              : "Mf-Portfolio"}
          </>
        )}
      </Button>
      <CreateConsentModel
        open={showCreateConsentModal}
        onClose={() => setShowCreateConsentModal(false)}
      />
    </ImportHoldingsProvider>
  );
}
