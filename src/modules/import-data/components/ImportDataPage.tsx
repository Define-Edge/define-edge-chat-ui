"use client";
import FetchingFiDataModal from "@/components/moneyone/FetchingFiDataModal";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import {
  AlertCircle,
  BarChart3,
  Building,
  Coins,
  CreditCard,
  Database,
  Globe,
  Home,
  Landmark,
  PieChart,
  Shield,
  TrendingUp,
} from "lucide-react";
import dynamic from "next/dynamic";
import { handleDummyFormSubmit } from "../utils/form-handlers";
import { AccountTypeCard } from "./account-types/AccountTypeCard";
import { ComprehensiveAnalysisCard } from "./ComprehensiveAnalysisCard";
import { DataSecurityInfo } from "./DataSecurityInfo";
import { CommoditiesForm } from "./forms/CommoditiesForm";
import { FixedDepositsForm } from "./forms/FixedDepositsForm";
import { InsuranceForm } from "./forms/InsuranceForm";
import { OtherInvestmentsForm } from "./forms/OtherInvestmentsForm";
import { RealEstateForm } from "./forms/RealEstateForm";
import { BankAccountsPreviewModal } from "./modals/BankAccountsPreviewModal";
import { EquitiesPreviewModal } from "./modals/EquitiesPreviewModal";
import { EtfPreviewModal } from "./modals/EtfPreviewModal";
import { MutualFundsPreviewModal } from "./modals/MutualFundsPreviewModal";
import { NetworthGraph } from "./NetworthGraph";
import { QuickUpload } from "./QuickUpload";
import { CollapsibleInstructions } from "../../core/common/ui/CollapsibleInstructions";

// Import with ssr: false to prevent hydration errors from localStorage usage
const MoneyOneHoldingsCard = dynamic(
  () =>
    import("./account-types/MoneyOneHoldingsCard").then(
      (mod) => mod.MoneyOneHoldingsCard,
    ),
  { ssr: false },
);

export function ImportDataPage() {
  return (
    <div className="mx-auto max-w-5xl pb-24">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Import Data
          </h2>
          <p className="text-sm text-gray-600">
            Connect your financial accounts for personalized insights
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        {/* Connect Accounts */}
        <div>
          <h3 className="mb-4 font-medium text-gray-900">Connect Accounts</h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Equity Holdings - MoneyOne */}
            <MoneyOneHoldingsCard
              consentType={ConsentType.EQUITIES}
              icon={BarChart3}
              title="Equity Holdings"
              description="Connect your demat account to sync equity stocks and derivatives"
              AnalysisModal={EquitiesPreviewModal}
            />

            {/* Mutual Fund Holdings - MoneyOne */}
            <MoneyOneHoldingsCard
              consentType={ConsentType.MUTUAL_FUNDS}
              icon={PieChart}
              title="Mutual Fund Holdings"
              description="Import mutual fund portfolios from AMCs and platforms"
              AnalysisModal={MutualFundsPreviewModal}
            />

            {/* Bank Accounts - MoneyOne */}
            <MoneyOneHoldingsCard
              consentType={ConsentType.BANK_ACCOUNTS}
              icon={CreditCard}
              title="Bank Accounts"
              description="Import savings, current account statements and transactions"
              AnalysisModal={BankAccountsPreviewModal}
            />

            {/* ETF Holdings - MoneyOne */}
            <MoneyOneHoldingsCard
              consentType={ConsentType.ETF}
              icon={TrendingUp}
              title="ETF Holdings"
              description="Connect to sync Exchange Traded Fund holdings"
              AnalysisModal={EtfPreviewModal}
            />

            {/* Fixed Deposits - Manual */}
            <AccountTypeCard
              icon={Landmark}
              title="Fixed Deposits"
              description="Connect bank FDs, corporate bonds, and term deposits"
              formDescription="Add details about your fixed deposits including bank FDs, corporate bonds, and term deposits with comprehensive tracking features."
              formIcon="🏦"
              formComponent={
                <FixedDepositsForm
                  onSubmit={(data) =>
                    handleDummyFormSubmit("Fixed Deposit", data)
                  }
                  onCancel={() => {}}
                />
              }
            />

            {/* NPS - Pending */}
            <AccountTypeCard
              icon={Building}
              title="NPS"
              description="Import National Pension System contributions and NAV data"
              formDescription=""
              formIcon=""
              status="not-connected"
              statusIcon={AlertCircle}
            />

            {/* Insurance - Manual */}
            <AccountTypeCard
              icon={Shield}
              title="Insurance"
              description="Connect life, health, and general insurance policies"
              formDescription="Add details about your insurance policies including life, health, auto, home, travel, and other insurance coverage."
              formIcon="🛡️"
              formComponent={
                <InsuranceForm
                  onSubmit={(data) => handleDummyFormSubmit("Insurance", data)}
                  onCancel={() => {}}
                />
              }
            />

            {/* Real Estate - Manual */}
            <AccountTypeCard
              icon={Home}
              title="Real Estate"
              description="Add property details, rental income, and market valuations"
              formDescription="Enter details about your property investments including residential, commercial, and land holdings."
              formIcon="🏠"
              formComponent={
                <RealEstateForm
                  onSubmit={(data) =>
                    handleDummyFormSubmit("Real Estate", data)
                  }
                  onCancel={() => {}}
                />
              }
            />

            {/* Commodities - Manual */}
            <AccountTypeCard
              icon={Coins}
              title="Commodities"
              description="Connect gold, silver, and other commodity investments"
              formDescription="Add your commodity investments including gold, silver, and other precious metals or commodities."
              formIcon="🪙"
              formComponent={
                <CommoditiesForm
                  onSubmit={(data) =>
                    handleDummyFormSubmit("Commodities", data)
                  }
                  onCancel={() => {}}
                />
              }
            />

            {/* Other Investments - Manual */}
            <AccountTypeCard
              icon={Globe}
              title="Other Investments"
              description="Add unlisted shares, global stocks, crypto, bonds, and alternative investments"
              formDescription="Add miscellaneous investments like unlisted shares, global stocks, cryptocurrency, bonds, and alternative investments."
              formIcon="🌐"
              formComponent={
                <OtherInvestmentsForm
                  onSubmit={(data) =>
                    handleDummyFormSubmit("Other Investment", data)
                  }
                  onCancel={() => {}}
                />
              }
            />
          </div>
        </div>

        {/* My Networth Graph */}
        <NetworthGraph />

        {/* Quick Upload */}
        <QuickUpload />

        {/* Comprehensive Analysis Banner */}
        <ComprehensiveAnalysisCard />

        {/* How We Use Your Data Section */}
        <DataSecurityInfo />
      </div>

      {/* FetchingFiDataModal - MoneyOne import flow */}
      <FetchingFiDataModal />
    </div>
  );
}
