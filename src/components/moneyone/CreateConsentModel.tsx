"use client";
import { createNewConsentFormSchema } from "@/lib/moneyone/moneyone.types";
import { useCreateConsentAndRedirectMut } from "./useCreateConsentAndRedirectMut";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateConsentModel({ open, onClose }: Props) {
  const createConsentAndRedirectMut = useCreateConsentAndRedirectMut();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    const parsedData = createNewConsentFormSchema.parse(data);

    await createConsentAndRedirectMut.mutateAsync(parsedData);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Consent
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Mobile Number</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">+91</span>
              <Input
                id="number"
                name="number"
                type="tel"
                placeholder="Enter mobile number"
                maxLength={10}
                required
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pan">PAN</Label>
            <Input
              id="pan"
              name="pan"
              placeholder="Enter PAN"
              maxLength={10}
              required
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={createConsentAndRedirectMut.isPending}
          >
            {createConsentAndRedirectMut.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Consent...
              </>
            ) : (
              "Create Consent"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
