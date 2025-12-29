import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickUpload() {
  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4">Quick Upload</h3>
      <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
        <div className="text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h4 className="font-medium text-gray-900 mb-1">Upload Documents</h4>
          <p className="text-sm text-gray-600 mb-4">
            Drop your bank statements, portfolio reports, or insurance documents here
          </p>
          <Button size="sm">Choose Files</Button>
        </div>
      </Card>
    </div>
  );
}
