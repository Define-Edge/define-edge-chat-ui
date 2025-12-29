import { useState } from "react";
import { toast } from "sonner";
import { importMethods } from "../constants/import-methods";
import { EditingItem } from "../types/import-data.types";

export function useImportData() {
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<{type: string; data: any}>({type: "", data: null});
  const [refreshingData, setRefreshingData] = useState<string | null>(null);

  // Form visibility states
  const [showRealEstateForm, setShowRealEstateForm] = useState(false);
  const [showCommoditiesForm, setShowCommoditiesForm] = useState(false);
  const [showOtherInvestmentsForm, setShowOtherInvestmentsForm] = useState(false);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [showFixedDepositsForm, setShowFixedDepositsForm] = useState(false);

  // Investment data states
  const [realEstateHoldings, setRealEstateHoldings] = useState<any[]>([]);
  const [commoditiesHoldings, setCommoditiesHoldings] = useState<any[]>([]);
  const [otherInvestments, setOtherInvestments] = useState<any[]>([]);
  const [insurancePolicies, setInsurancePolicies] = useState<any[]>([]);
  const [fixedDeposits, setFixedDeposits] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  const handleAnalysis = (type: string) => {
    setCurrentAnalysis({ type, data: {} });
    setShowAnalysisModal(true);
    toast.success(`Starting ${type.toLowerCase()} analysis...`);
  };

  const handleRefreshData = (title: string) => {
    setRefreshingData(title);
    toast.success(`Refreshing ${title.toLowerCase()} data...`);

    setTimeout(() => {
      setRefreshingData(null);
      toast.success(`${title} data refreshed successfully`);
    }, 2000);
  };

  const handleComprehensiveAnalysis = () => {
    const connectedSources = importMethods.filter(method => method.status === "connected").length;

    if (connectedSources === 0) {
      toast.error("Please connect at least one data source to run comprehensive analysis");
      return;
    }

    handleAnalysis("Comprehensive Analysis");
  };

  const handleConnect = (title: string) => {
    setEditingItem(null);
    if (title === "Real Estate") {
      setShowRealEstateForm(true);
    } else if (title === "Commodities") {
      setShowCommoditiesForm(true);
    } else if (title === "Other Investments") {
      setShowOtherInvestmentsForm(true);
    } else if (title === "Insurance") {
      setShowInsuranceForm(true);
    } else if (title === "Fixed Deposits") {
      setShowFixedDepositsForm(true);
    } else {
      toast.success(`Connecting to ${title}...`);
    }
  };

  // Submit handlers
  const handleRealEstateSubmit = (data: any) => {
    if (editingItem && editingItem.type === "realEstate") {
      setRealEstateHoldings(prev => prev.map((item, idx) =>
        idx === editingItem.index ? { ...data, id: item.id } : item
      ));
      toast.success("Real estate investment updated successfully!");
    } else {
      setRealEstateHoldings(prev => [...prev, { ...data, id: Date.now() }]);
      toast.success("Real estate investment added successfully!");
    }
    setEditingItem(null);
  };

  const handleCommoditiesSubmit = (data: any) => {
    if (editingItem && editingItem.type === "commodities") {
      setCommoditiesHoldings(prev => prev.map((item, idx) =>
        idx === editingItem.index ? { ...data, id: item.id } : item
      ));
      toast.success("Commodities investment updated successfully!");
    } else {
      setCommoditiesHoldings(prev => [...prev, { ...data, id: Date.now() }]);
      toast.success("Commodities investment added successfully!");
    }
    setEditingItem(null);
  };

  const handleOtherInvestmentsSubmit = (data: any) => {
    if (editingItem && editingItem.type === "other") {
      setOtherInvestments(prev => prev.map((item, idx) =>
        idx === editingItem.index ? { ...data, id: item.id } : item
      ));
      toast.success("Other investment updated successfully!");
    } else {
      setOtherInvestments(prev => [...prev, { ...data, id: Date.now() }]);
      toast.success("Other investment added successfully!");
    }
    setEditingItem(null);
  };

  const handleInsuranceSubmit = (data: any) => {
    if (editingItem && editingItem.type === "insurance") {
      setInsurancePolicies(prev => prev.map((item, idx) =>
        idx === editingItem.index ? { ...data, id: item.id } : item
      ));
      toast.success("Insurance policy updated successfully!");
    } else {
      setInsurancePolicies(prev => [...prev, { ...data, id: Date.now() }]);
      toast.success("Insurance policy added successfully!");
    }
    setEditingItem(null);
  };

  const handleFixedDepositsSubmit = (data: any) => {
    if (editingItem && editingItem.type === "fixedDeposit") {
      setFixedDeposits(prev => prev.map((item, idx) =>
        idx === editingItem.index ? { ...data, id: item.id } : item
      ));
      toast.success("Fixed deposit updated successfully!");
    } else {
      setFixedDeposits(prev => [...prev, { ...data, id: Date.now() }]);
      toast.success("Fixed deposit added successfully!");
    }
    setEditingItem(null);
  };

  // Delete handlers
  const handleDelete = (type: string, index: number) => {
    if (type === "realEstate") {
      setRealEstateHoldings(prev => prev.filter((_, idx) => idx !== index));
      toast.success("Real estate investment deleted");
    } else if (type === "commodities") {
      setCommoditiesHoldings(prev => prev.filter((_, idx) => idx !== index));
      toast.success("Commodities investment deleted");
    } else if (type === "other") {
      setOtherInvestments(prev => prev.filter((_, idx) => idx !== index));
      toast.success("Other investment deleted");
    } else if (type === "insurance") {
      setInsurancePolicies(prev => prev.filter((_, idx) => idx !== index));
      toast.success("Insurance policy deleted");
    } else if (type === "fixedDeposit") {
      setFixedDeposits(prev => prev.filter((_, idx) => idx !== index));
      toast.success("Fixed deposit deleted");
    }
  };

  // Edit handlers
  const handleEdit = (type: string, index: number, data: any) => {
    setEditingItem({ type, index, data });
    if (type === "realEstate") {
      setShowRealEstateForm(true);
    } else if (type === "commodities") {
      setShowCommoditiesForm(true);
    } else if (type === "other") {
      setShowOtherInvestmentsForm(true);
    } else if (type === "insurance") {
      setShowInsuranceForm(true);
    } else if (type === "fixedDeposit") {
      setShowFixedDepositsForm(true);
    }
  };

  return {
    // Modal states
    showAnalysisModal,
    setShowAnalysisModal,
    currentAnalysis,

    // Form visibility
    showRealEstateForm,
    setShowRealEstateForm,
    showCommoditiesForm,
    setShowCommoditiesForm,
    showOtherInvestmentsForm,
    setShowOtherInvestmentsForm,
    showInsuranceForm,
    setShowInsuranceForm,
    showFixedDepositsForm,
    setShowFixedDepositsForm,

    // Investment data
    realEstateHoldings,
    commoditiesHoldings,
    otherInvestments,
    insurancePolicies,
    fixedDeposits,
    editingItem,
    setEditingItem,

    // Handlers
    handleAnalysis,
    handleRefreshData,
    handleComprehensiveAnalysis,
    handleConnect,
    handleRealEstateSubmit,
    handleCommoditiesSubmit,
    handleOtherInvestmentsSubmit,
    handleInsuranceSubmit,
    handleFixedDepositsSubmit,
    handleDelete,
    handleEdit,
  };
}
