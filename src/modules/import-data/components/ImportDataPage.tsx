import { Database, Shield, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ImportHeader } from "./ImportHeader";
import { NetworthGraph } from "./NetworthGraph";
import { QuickUpload } from "./QuickUpload";
import { ConnectAccounts } from "./ConnectAccounts";
import { ComprehensiveAnalysisCard } from "./ComprehensiveAnalysisCard";
import { AddedInvestments } from "./AddedInvestments";
import { AnalysisModal } from "./modals/AnalysisModal";
import { CollapsibleInstructions } from "./shared/CollapsibleInstructions";
import { RealEstateForm } from "./forms/RealEstateForm";
import { CommoditiesForm } from "./forms/CommoditiesForm";
import { OtherInvestmentsForm } from "./forms/OtherInvestmentsForm";
import { InsuranceForm } from "./forms/InsuranceForm";
import { FixedDepositsForm } from "./forms/FixedDepositsForm";
import { useImportData } from "../hooks/useImportData";

export function ImportDataPage() {
  const {
    showAnalysisModal,
    setShowAnalysisModal,
    currentAnalysis,
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
    realEstateHoldings,
    commoditiesHoldings,
    otherInvestments,
    insurancePolicies,
    fixedDeposits,
    editingItem,
    setEditingItem,
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
  } = useImportData();

  const handleAddNew = (type: string) => {
    setEditingItem(null);
    if (type === "realEstate") setShowRealEstateForm(true);
    else if (type === "commodities") setShowCommoditiesForm(true);
    else if (type === "other") setShowOtherInvestmentsForm(true);
    else if (type === "insurance") setShowInsuranceForm(true);
    else if (type === "fixedDeposit") setShowFixedDepositsForm(true);
  };

  return (
    <div className="space-y-6 p-6 pb-24">
      <ImportHeader />

      <div className="flex flex-col md:flex-row gap-2 items-stretch justify-center">
        {/* What is Import Section */}
        <CollapsibleInstructions
          title="Personal Investment Data Import"
          description="This functionality will enable you to import personal investment data such as Equity Holdings, Mutual Fund Holdings, Bank spending data, and transaction history from RBI approved Accounts Aggregator framework."
          icon={Database}
          bgColor="bg-purple-50 border-purple-200"
          iconBgColor="bg-purple-100"
          textColor="text-purple-900"
          iconColor="text-purple-600"
          defaultExpanded={true}
        />

        {/* Security Notice */}
        <CollapsibleInstructions
          title="RBI Approved & Bank-Level Security"
          description="All connections use 256-bit encryption and read-only access through RBI approved Accounts Aggregator framework. We never store your login credentials."
          icon={Shield}
          bgColor="bg-blue-50 border-blue-200"
          iconBgColor="bg-blue-100"
          textColor="text-blue-900"
          iconColor="text-blue-500"
          defaultExpanded={true}
        />
      </div>
      {/* My Networth Graph */}
      <NetworthGraph />

      {/* Quick Upload */}
      <QuickUpload />

      {/* Connect Accounts */}
      <ConnectAccounts
        onConnect={handleConnect}
        onAnalyse={handleAnalysis}
        onRefresh={handleRefreshData}
      />

      {/* Manually Added Assets */}
      <AddedInvestments
        fixedDeposits={fixedDeposits}
        realEstateHoldings={realEstateHoldings}
        commoditiesHoldings={commoditiesHoldings}
        insurancePolicies={insurancePolicies}
        otherInvestments={otherInvestments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />

      {/* Comprehensive Analysis Banner */}
      <ComprehensiveAnalysisCard onAnalyse={handleComprehensiveAnalysis} />

      {/* How We Use Your Data Section */}
      <Card className="border-green-200 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-lg bg-green-100 p-2">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-2 font-medium text-green-900">
              How We Use Your Data
            </h3>
            <div className="space-y-2 text-sm text-green-800">
              <p className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>
                  Your data is processed locally and encrypted with bank-level
                  security
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>
                  We analyze patterns to provide personalized investment
                  recommendations
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>
                  No data is shared with third parties without your explicit
                  consent
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>
                  You maintain full control and can disconnect accounts anytime
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Analysis Modal */}
      <AnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        analysisType={currentAnalysis.type}
        analysisData={currentAnalysis.data}
      />

      {/* Form Modals */}
      <FormModal
        open={showRealEstateForm}
        onOpenChange={setShowRealEstateForm}
        title={
          editingItem?.type === "realEstate"
            ? "Edit Real Estate Investment"
            : "Add Real Estate Investment"
        }
        description={
          editingItem?.type === "realEstate"
            ? "Update your property investment details"
            : "Enter details about your property investments including residential, commercial, and land holdings."
        }
        icon="🏠"
      >
        <RealEstateForm
          initialData={
            editingItem?.type === "realEstate" ? editingItem.data : null
          }
          onSubmit={(data) => {
            handleRealEstateSubmit(data);
            setShowRealEstateForm(false);
          }}
          onCancel={() => {
            setShowRealEstateForm(false);
            setEditingItem(null);
          }}
        />
      </FormModal>

      <FormModal
        open={showCommoditiesForm}
        onOpenChange={setShowCommoditiesForm}
        title={
          editingItem?.type === "commodities"
            ? "Edit Commodities Investment"
            : "Add Commodities Investment"
        }
        description={
          editingItem?.type === "commodities"
            ? "Update your commodity investment details"
            : "Add your commodity investments including gold, silver, and other precious metals or commodities."
        }
        icon="🪙"
      >
        <CommoditiesForm
          initialData={
            editingItem?.type === "commodities" ? editingItem.data : null
          }
          onSubmit={(data) => {
            handleCommoditiesSubmit(data);
            setShowCommoditiesForm(false);
          }}
          onCancel={() => {
            setShowCommoditiesForm(false);
            setEditingItem(null);
          }}
        />
      </FormModal>

      <FormModal
        open={showOtherInvestmentsForm}
        onOpenChange={setShowOtherInvestmentsForm}
        title={
          editingItem?.type === "other"
            ? "Edit Other Investment"
            : "Add Other Investments"
        }
        description={
          editingItem?.type === "other"
            ? "Update your investment details"
            : "Add miscellaneous investments like unlisted shares, global stocks, cryptocurrency, bonds, and alternative investments."
        }
        icon="🌐"
      >
        <OtherInvestmentsForm
          initialData={editingItem?.type === "other" ? editingItem.data : null}
          onSubmit={(data) => {
            handleOtherInvestmentsSubmit(data);
            setShowOtherInvestmentsForm(false);
          }}
          onCancel={() => {
            setShowOtherInvestmentsForm(false);
            setEditingItem(null);
          }}
        />
      </FormModal>

      <FormModal
        open={showInsuranceForm}
        onOpenChange={setShowInsuranceForm}
        title={
          editingItem?.type === "insurance"
            ? "Edit Insurance Policy"
            : "Add Insurance Policy"
        }
        description={
          editingItem?.type === "insurance"
            ? "Update your insurance policy details"
            : "Add details about your insurance policies including life, health, auto, home, travel, and other insurance coverage."
        }
        icon="🛡️"
      >
        <InsuranceForm
          initialData={
            editingItem?.type === "insurance" ? editingItem.data : null
          }
          onSubmit={(data) => {
            handleInsuranceSubmit(data);
            setShowInsuranceForm(false);
          }}
          onCancel={() => {
            setShowInsuranceForm(false);
            setEditingItem(null);
          }}
        />
      </FormModal>

      <FormModal
        open={showFixedDepositsForm}
        onOpenChange={setShowFixedDepositsForm}
        title={
          editingItem?.type === "fixedDeposit"
            ? "Edit Fixed Deposit"
            : "Add Fixed Deposit"
        }
        description={
          editingItem?.type === "fixedDeposit"
            ? "Update your fixed deposit details"
            : "Add details about your fixed deposits including bank FDs, corporate bonds, and term deposits with comprehensive tracking features."
        }
        icon="🏦"
      >
        <FixedDepositsForm
          initialData={
            editingItem?.type === "fixedDeposit" ? editingItem.data : null
          }
          onSubmit={(data) => {
            handleFixedDepositsSubmit(data);
            setShowFixedDepositsForm(false);
          }}
          onCancel={() => {
            setShowFixedDepositsForm(false);
            setEditingItem(null);
          }}
        />
      </FormModal>
    </div>
  );
}

// Helper component for form modals
function FormModal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[80vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{icon}</span>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
