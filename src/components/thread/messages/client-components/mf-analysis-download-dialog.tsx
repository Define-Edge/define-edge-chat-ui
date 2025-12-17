"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DownloadIcon, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

type MfAnalysisSection = {
  key: string;
  label: string;
};

const MF_SECTIONS: MfAnalysisSection[] = [
  { key: "scheme_overview", label: "Scheme Overview" },
  { key: "performance_analysis", label: "Performance Analysis" },
  { key: "risk_metrics", label: "Risk Metrics" },
  { key: "asset_allocation", label: "Asset Allocation" },
  { key: "portfolio_holdings", label: "Portfolio Holdings" },
  { key: "sector_distribution", label: "Sector Distribution" },
  { key: "fund_manager_profile", label: "Fund Manager Profile" },
  { key: "cost_analysis", label: "Cost Analysis" },
  { key: "peer_comparison", label: "Peer Comparison" },
  { key: "valuation_metrics", label: "Valuation Metrics" },
  { key: "conclusion", label: "Conclusion" },
  { key: "summary", label: "Summary" },
];

interface MfAnalysisDownloadDialogProps {
  threadId: string | null;
  analysisId: string;
  schemeName?: string;
}

export function MfAnalysisDownloadDialog({
  threadId,
  analysisId,
  schemeName,
}: MfAnalysisDownloadDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>(
    MF_SECTIONS.map((s) => s.key)
  );
  const [personalComment, setPersonalComment] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/download-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId: threadId,
          analysisId: analysisId,
          analysisType: "mf_analysis",
          selectedSections: selectedSections,
          personalComment: personalComment,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to generate PDF: ${response.statusText}${errorText ? ` - ${errorText}` : ""}`
        );
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${schemeName || "mutual_fund"}_analysis.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    },
    onSuccess: () => {
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error("PDF generation error:", error);
      // Error will be shown in the UI via mutation.error
    },
  });

  const handleToggleSection = (sectionKey: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionKey)
        ? prev.filter((key) => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const handleSelectAll = () => {
    setSelectedSections(MF_SECTIONS.map((s) => s.key));
  };

  const handleDeselectAll = () => {
    setSelectedSections([]);
  };

  const isAllSelected = selectedSections.length === MF_SECTIONS.length;
  const isNoneSelected = selectedSections.length === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <DownloadIcon className="h-4 w-4" />
          Download Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Report</DialogTitle>
          <DialogDescription>
            Select which sections to include in your PDF report and add a
            personal comment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Select/Deselect All */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={isAllSelected}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              disabled={isNoneSelected}
            >
              Deselect All
            </Button>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Report Sections</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MF_SECTIONS.map((section) => (
                <div key={section.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={section.key}
                    checked={selectedSections.includes(section.key)}
                    onCheckedChange={() => handleToggleSection(section.key)}
                  />
                  <label
                    htmlFor={section.key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {section.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Comment */}
          <div className="space-y-2">
            <Label htmlFor="personal-comment" className="text-base font-semibold">
              Personal Comment (Optional)
            </Label>
            <Textarea
              id="personal-comment"
              placeholder="Add your personal notes or comments to include in the report..."
              value={personalComment}
              onChange={(e) => setPersonalComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter className="flex-col gap-2">
          {mutation.error && (
            <div className="w-full rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <p className="font-medium">Error generating PDF</p>
              <p className="mt-1 text-xs">{mutation.error.message}</p>
            </div>
          )}
          <div className="flex w-full justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || isNoneSelected}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <DownloadIcon className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
