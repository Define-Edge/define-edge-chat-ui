export interface ImportMethodProps {
  icon: React.ElementType;
  title: string;
  description: string;
  status: "available" | "connected" | "pending";
  lastUpdated?: string;
  onConnect?: () => void;
  onAnalyse?: () => void;
  onRefresh?: () => void;
}

export interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisType: string;
  analysisData: any;
}

export interface CollapsibleInstructionsProps {
  title: string;
  description: string;
  icon: React.ElementType;
  bgColor: string;
  iconBgColor: string;
  textColor: string;
  iconColor: string;
  defaultExpanded?: boolean;
}

export interface FormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export interface EditingItem {
  type: string;
  index: number;
  data: any;
}
