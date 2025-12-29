"use client";
import { Button } from "@/components/ui/button";
import { ImportHoldingsContextType } from "@/lib/moneyone/moneyone.types";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CreateConsentModel from "./CreateConsentModel";
import { ImportHoldingsProvider } from "./import-holdings.context";
import { useCheckConsentMut } from "./useCheckConsentMut";

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
        size="sm"
        variant="outline"
        className="text-xs"
        disabled={checkConsentMut.isPending}
      >
        {checkConsentMut.isPending ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
          </>
        ) : (
          "Connect"
        )}
      </Button>
      <CreateConsentModel
        open={showCreateConsentModal}
        onClose={() => setShowCreateConsentModal(false)}
      />
    </ImportHoldingsProvider>
  );
}
