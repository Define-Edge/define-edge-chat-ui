import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RelaxCriteriaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback?: string) => void;
  loading: boolean;
}

export function RelaxCriteriaModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: RelaxCriteriaModalProps) {
  const [feedback, setFeedback] = useState("");

  // Reset feedback when modal closes
  useEffect(() => {
    if (!open) {
      setFeedback("");
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit(feedback.trim() || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Relax Criteria</DialogTitle>
          <DialogDescription>
            The system will generate a less restrictive query. You can
            optionally provide feedback to guide the relaxation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Textarea
            placeholder="E.g., 'Allow higher P/E ratios', 'Include more sectors'..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            disabled={loading}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Relax Criteria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
