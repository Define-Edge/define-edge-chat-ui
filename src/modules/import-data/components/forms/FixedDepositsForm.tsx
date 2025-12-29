import { useState } from "react";
import { Landmark, Calendar, DollarSign, Users, RotateCcw, FileText, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface FixedDepositsFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function FixedDepositsForm({ onSubmit, onCancel, initialData }: FixedDepositsFormProps) {
  const [formData, setFormData] = useState(initialData || {
    // Basic FD Information
    fdType: "",
    bankName: "",
    branchName: "",
    fdNumber: "",
    accountNumber: "",
    principalAmount: "",
    interestRate: "",
    compoundingFrequency: "quarterly",
    
    // Tenure and Maturity
    fdTenure: "",
    tenureUnit: "years",
    startDate: "",
    maturityDate: "",
    maturityAmount: "",
    
    // Interest Options
    interestPayoutMode: "",
    interestPayoutFrequency: "",
    interestPayoutAccount: "",
    cumulativeInterest: "",
    
    // FD Renewal and Instructions
    autoRenewal: false,
    renewalInstructions: "",
    renewalTenure: "",
    partialWithdrawal: false,
    minWithdrawalAmount: "",
    
    // Tax Information
    tdsDeducted: false,
    tdsRate: "",
    form15G_15H: false,
    taxSavingFD: false,
    section80C: "",
    
    // Nominee Information
    nomineePresent: false,
    nomineeName: "",
    nomineeRelation: "",
    nomineeAge: "",
    nomineeShare: "",
    guardianName: "",
    
    // Additional Charges and Features
    prematurePenalty: "",
    loanAgainstFD: false,
    loanAmount: "",
    loanInterestRate: "",
    overdraftFacility: false,
    overdraftLimit: "",
    
    // Digital/Physical Certificate
    certificateType: "digital",
    certificateNumber: "",
    lockerLocation: "",
    
    // Linked Services
    linkedSavingsAccount: "",
    onlineAccess: true,
    mobileBanking: true,
    smsAlerts: true,
    emailStatements: true,
    
    // Special Features
    seniorCitizenRate: false,
    specialRate: "",
    promotionalRate: false,
    rateType: "fixed",
    
    // Investment Goals
    investmentPurpose: "",
    riskProfile: "low",
    
    // Contact and Documentation
    contactPerson: "",
    relationshipManager: "",
    documentStatus: "",
    kycStatus: "completed",
    
    // Status and Alerts
    fdStatus: "active",
    maturityAlert: true,
    renewalAlert: true,
    interestCreditAlert: true,
    
    // Additional Information
    description: ""
  });

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Auto-calculate maturity amount when principal, rate, or tenure changes
  const calculateMaturityAmount = () => {
    const principal = parseFloat(formData.principalAmount) || 0;
    const rate = parseFloat(formData.interestRate) || 0;
    const tenure = parseFloat(formData.fdTenure) || 0;
    
    if (principal > 0 && rate > 0 && tenure > 0) {
      // Convert tenure to years if in months
      const tenureInYears = formData.tenureUnit === "months" ? tenure / 12 : tenure;
      
      // Compound interest calculation based on frequency
      const compoundingPerYear = {
        "monthly": 12,
        "quarterly": 4,
        "half-yearly": 2,
        "yearly": 1
      }[formData.compoundingFrequency] || 4;
      
      const maturityAmount = principal * Math.pow(
        (1 + (rate / 100) / compoundingPerYear), 
        compoundingPerYear * tenureInYears
      );
      
      handleInputChange("maturityAmount", maturityAmount.toFixed(2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fdType || !formData.bankName || !formData.principalAmount || !formData.interestRate || !formData.fdTenure) {
      toast.error("Please fill in all required fields (FD Type, Bank Name, Principal Amount, Interest Rate, Tenure)");
      return;
    }

    // Validate amounts
    if (parseFloat(formData.principalAmount) <= 0) {
      toast.error("Principal amount must be greater than 0");
      return;
    }

    if (parseFloat(formData.interestRate) <= 0 || parseFloat(formData.interestRate) > 20) {
      toast.error("Please enter a valid interest rate between 0.1% and 20%");
      return;
    }

    // Validate nominee details if present
    if (formData.nomineePresent && (!formData.nomineeName || !formData.nomineeRelation)) {
      toast.error("Please fill in nominee details");
      return;
    }

    // Validate minor nominee
    if (formData.nomineePresent && parseInt(formData.nomineeAge) < 18 && !formData.guardianName) {
      toast.error("Guardian name is required for minor nominee");
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      fdType: "",
      bankName: "",
      branchName: "",
      fdNumber: "",
      accountNumber: "",
      principalAmount: "",
      interestRate: "",
      compoundingFrequency: "quarterly",
      fdTenure: "",
      tenureUnit: "years",
      startDate: "",
      maturityDate: "",
      maturityAmount: "",
      interestPayoutMode: "",
      interestPayoutFrequency: "",
      interestPayoutAccount: "",
      cumulativeInterest: "",
      autoRenewal: false,
      renewalInstructions: "",
      renewalTenure: "",
      partialWithdrawal: false,
      minWithdrawalAmount: "",
      tdsDeducted: false,
      tdsRate: "",
      form15G_15H: false,
      taxSavingFD: false,
      section80C: "",
      nomineePresent: false,
      nomineeName: "",
      nomineeRelation: "",
      nomineeAge: "",
      nomineeShare: "",
      guardianName: "",
      prematurePenalty: "",
      loanAgainstFD: false,
      loanAmount: "",
      loanInterestRate: "",
      overdraftFacility: false,
      overdraftLimit: "",
      certificateType: "digital",
      certificateNumber: "",
      lockerLocation: "",
      linkedSavingsAccount: "",
      onlineAccess: true,
      mobileBanking: true,
      smsAlerts: true,
      emailStatements: true,
      seniorCitizenRate: false,
      specialRate: "",
      promotionalRate: false,
      rateType: "fixed",
      investmentPurpose: "",
      riskProfile: "low",
      contactPerson: "",
      relationshipManager: "",
      documentStatus: "",
      kycStatus: "completed",
      fdStatus: "active",
      maturityAlert: true,
      renewalAlert: true,
      interestCreditAlert: true,
      description: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* FD Type and Bank Information */}
      <div className="space-y-3">
        <div>
          <Label>Fixed Deposit Type *</Label>
          <Select value={formData.fdType} onValueChange={(value) => handleInputChange("fdType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select FD type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular Fixed Deposit</SelectItem>
              <SelectItem value="tax-saving">Tax Saving FD (5 Years)</SelectItem>
              <SelectItem value="senior-citizen">Senior Citizen FD</SelectItem>
              <SelectItem value="corporate">Corporate Fixed Deposit</SelectItem>
              <SelectItem value="cumulative">Cumulative Fixed Deposit</SelectItem>
              <SelectItem value="non-cumulative">Non-Cumulative Fixed Deposit</SelectItem>
              <SelectItem value="flexible">Flexible Fixed Deposit</SelectItem>
              <SelectItem value="special-tenure">Special Tenure FD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Bank Name *</Label>
            <Input
              placeholder="Bank name"
              value={formData.bankName}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
            />
          </div>
          <div>
            <Label>Branch Name</Label>
            <Input
              placeholder="Branch name"
              value={formData.branchName}
              onChange={(e) => handleInputChange("branchName", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>FD Number/Receipt Number</Label>
            <Input
              placeholder="FD receipt number"
              value={formData.fdNumber}
              onChange={(e) => handleInputChange("fdNumber", e.target.value)}
            />
          </div>
          <div>
            <Label>Linked Account Number</Label>
            <Input
              placeholder="Savings account number"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange("accountNumber", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Principal Amount and Interest Details */}
      <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Investment Details
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Principal Amount *</Label>
            <Input
              type="number"
              placeholder="₹ Investment amount"
              value={formData.principalAmount}
              onChange={(e) => {
                handleInputChange("principalAmount", e.target.value);
                setTimeout(calculateMaturityAmount, 100);
              }}
            />
          </div>
          <div>
            <Label>Interest Rate (% p.a.) *</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Rate %"
              value={formData.interestRate}
              onChange={(e) => {
                handleInputChange("interestRate", e.target.value);
                setTimeout(calculateMaturityAmount, 100);
              }}
            />
          </div>
        </div>

        <div>
          <Label>Interest Compounding Frequency</Label>
          <Select value={formData.compoundingFrequency} onValueChange={(value) => {
            handleInputChange("compoundingFrequency", value);
            setTimeout(calculateMaturityAmount, 100);
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="half-yearly">Half-Yearly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="seniorCitizenRate"
            checked={formData.seniorCitizenRate}
            onCheckedChange={(checked) => handleInputChange("seniorCitizenRate", checked)}
          />
          <Label htmlFor="seniorCitizenRate">Senior Citizen Rate (Additional 0.5%)</Label>
        </div>

        {formData.seniorCitizenRate && (
          <div>
            <Label>Special Rate (% p.a.)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Special rate"
              value={formData.specialRate}
              onChange={(e) => handleInputChange("specialRate", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Tenure and Maturity Details */}
      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Maturity Details
        </h4>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <Label>FD Tenure *</Label>
            <Input
              type="number"
              placeholder="Duration"
              value={formData.fdTenure}
              onChange={(e) => {
                handleInputChange("fdTenure", e.target.value);
                setTimeout(calculateMaturityAmount, 100);
              }}
            />
          </div>
          <div>
            <Label>Unit</Label>
            <Select value={formData.tenureUnit} onValueChange={(value) => {
              handleInputChange("tenureUnit", value);
              setTimeout(calculateMaturityAmount, 100);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="years">Years</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
            />
          </div>
          <div>
            <Label>Maturity Date</Label>
            <Input
              type="date"
              value={formData.maturityDate}
              onChange={(e) => handleInputChange("maturityDate", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Estimated Maturity Amount</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="₹ Maturity amount"
              value={formData.maturityAmount}
              onChange={(e) => handleInputChange("maturityAmount", e.target.value)}
              className="pr-20"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="absolute right-1 top-1 h-7 text-xs"
              onClick={calculateMaturityAmount}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Calculate
            </Button>
          </div>
        </div>
      </div>

      {/* Interest Payout Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Interest Payout Options</h4>
        
        <div>
          <Label>Interest Payout Mode</Label>
          <Select value={formData.interestPayoutMode} onValueChange={(value) => handleInputChange("interestPayoutMode", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payout mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cumulative">Cumulative (On Maturity)</SelectItem>
              <SelectItem value="periodic">Periodic Payout</SelectItem>
              <SelectItem value="reinvest">Auto Reinvestment</SelectItem>
              <SelectItem value="transfer">Transfer to Account</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.interestPayoutMode === "periodic" && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <Label>Payout Frequency</Label>
              <Select value={formData.interestPayoutFrequency} onValueChange={(value) => handleInputChange("interestPayoutFrequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Interest Payout Account</Label>
              <Input
                placeholder="Account number for interest credit"
                value={formData.interestPayoutAccount}
                onChange={(e) => handleInputChange("interestPayoutAccount", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Auto Renewal Settings */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="autoRenewal"
            checked={formData.autoRenewal}
            onCheckedChange={(checked) => handleInputChange("autoRenewal", checked)}
          />
          <Label htmlFor="autoRenewal">Auto-renewal on maturity</Label>
        </div>

        {formData.autoRenewal && (
          <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Auto-Renewal Settings
            </h4>

            <div>
              <Label>Renewal Instructions</Label>
              <Select value={formData.renewalInstructions} onValueChange={(value) => handleInputChange("renewalInstructions", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select renewal option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal-only">Renew Principal Only</SelectItem>
                  <SelectItem value="principal-interest">Renew Principal + Interest</SelectItem>
                  <SelectItem value="same-tenure">Same Tenure</SelectItem>
                  <SelectItem value="different-tenure">Different Tenure</SelectItem>
                  <SelectItem value="prevailing-rates">At Prevailing Rates</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Renewal Tenure (if different)</Label>
              <Input
                placeholder="Renewal tenure in years"
                value={formData.renewalTenure}
                onChange={(e) => handleInputChange("renewalTenure", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tax Information */}
      <div className="space-y-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Tax Information
        </h4>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="taxSavingFD"
            checked={formData.taxSavingFD}
            onCheckedChange={(checked) => handleInputChange("taxSavingFD", checked)}
          />
          <Label htmlFor="taxSavingFD">Tax Saving FD (Section 80C)</Label>
        </div>

        {formData.taxSavingFD && (
          <div>
            <Label>Section 80C Benefit Amount</Label>
            <Input
              type="number"
              placeholder="₹ Tax benefit amount"
              value={formData.section80C}
              onChange={(e) => handleInputChange("section80C", e.target.value)}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tdsDeducted"
              checked={formData.tdsDeducted}
              onCheckedChange={(checked) => handleInputChange("tdsDeducted", checked)}
            />
            <Label htmlFor="tdsDeducted">TDS Deducted</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="form15G_15H"
              checked={formData.form15G_15H}
              onCheckedChange={(checked) => handleInputChange("form15G_15H", checked)}
            />
            <Label htmlFor="form15G_15H">Form 15G/15H Submitted</Label>
          </div>
        </div>

        {formData.tdsDeducted && (
          <div>
            <Label>TDS Rate (%)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="TDS rate"
              value={formData.tdsRate}
              onChange={(e) => handleInputChange("tdsRate", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Nominee Information */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="nomineePresent"
            checked={formData.nomineePresent}
            onCheckedChange={(checked) => handleInputChange("nomineePresent", checked)}
          />
          <Label htmlFor="nomineePresent">Nominee details available</Label>
        </div>

        {formData.nomineePresent && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Nominee Details
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nominee Name</Label>
                <Input
                  placeholder="Nominee full name"
                  value={formData.nomineeName}
                  onChange={(e) => handleInputChange("nomineeName", e.target.value)}
                />
              </div>
              <div>
                <Label>Relation</Label>
                <Input
                  placeholder="Relationship"
                  value={formData.nomineeRelation}
                  onChange={(e) => handleInputChange("nomineeRelation", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nominee Age</Label>
                <Input
                  type="number"
                  placeholder="Age"
                  value={formData.nomineeAge}
                  onChange={(e) => handleInputChange("nomineeAge", e.target.value)}
                />
              </div>
              <div>
                <Label>Share Percentage (%)</Label>
                <Input
                  type="number"
                  placeholder="Share %"
                  value={formData.nomineeShare}
                  onChange={(e) => handleInputChange("nomineeShare", e.target.value)}
                />
              </div>
            </div>

            {parseInt(formData.nomineeAge) < 18 && (
              <div>
                <Label>Guardian Name (for minor nominee)</Label>
                <Input
                  placeholder="Guardian full name"
                  value={formData.guardianName}
                  onChange={(e) => handleInputChange("guardianName", e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Special Features */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Special Features & Services</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="loanAgainstFD"
              checked={formData.loanAgainstFD}
              onCheckedChange={(checked) => handleInputChange("loanAgainstFD", checked)}
            />
            <Label htmlFor="loanAgainstFD">Loan Against FD</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="overdraftFacility"
              checked={formData.overdraftFacility}
              onCheckedChange={(checked) => handleInputChange("overdraftFacility", checked)}
            />
            <Label htmlFor="overdraftFacility">Overdraft Facility</Label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="partialWithdrawal"
            checked={formData.partialWithdrawal}
            onCheckedChange={(checked) => handleInputChange("partialWithdrawal", checked)}
          />
          <Label htmlFor="partialWithdrawal">Partial withdrawal allowed</Label>
        </div>

        {formData.partialWithdrawal && (
          <div>
            <Label>Minimum Withdrawal Amount</Label>
            <Input
              type="number"
              placeholder="₹ Minimum amount"
              value={formData.minWithdrawalAmount}
              onChange={(e) => handleInputChange("minWithdrawalAmount", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Digital Services */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Digital Services</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="onlineAccess"
              checked={formData.onlineAccess}
              onCheckedChange={(checked) => handleInputChange("onlineAccess", checked)}
            />
            <Label htmlFor="onlineAccess" className="text-sm">Online Banking</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mobileBanking"
              checked={formData.mobileBanking}
              onCheckedChange={(checked) => handleInputChange("mobileBanking", checked)}
            />
            <Label htmlFor="mobileBanking" className="text-sm">Mobile Banking</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="smsAlerts"
              checked={formData.smsAlerts}
              onCheckedChange={(checked) => handleInputChange("smsAlerts", checked)}
            />
            <Label htmlFor="smsAlerts" className="text-sm">SMS Alerts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailStatements"
              checked={formData.emailStatements}
              onCheckedChange={(checked) => handleInputChange("emailStatements", checked)}
            />
            <Label htmlFor="emailStatements" className="text-sm">Email Statements</Label>
          </div>
        </div>
      </div>

      {/* Status and Alerts */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Alerts & Status</h4>
        
        <div>
          <Label>FD Status</Label>
          <Select value={formData.fdStatus} onValueChange={(value) => handleInputChange("fdStatus", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="matured">Matured</SelectItem>
              <SelectItem value="renewed">Auto-Renewed</SelectItem>
              <SelectItem value="closed">Prematurely Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="maturityAlert"
              checked={formData.maturityAlert}
              onCheckedChange={(checked) => handleInputChange("maturityAlert", checked)}
            />
            <Label htmlFor="maturityAlert" className="text-sm">Maturity Alert</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="renewalAlert"
              checked={formData.renewalAlert}
              onCheckedChange={(checked) => handleInputChange("renewalAlert", checked)}
            />
            <Label htmlFor="renewalAlert" className="text-sm">Renewal Alert</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="interestCreditAlert"
              checked={formData.interestCreditAlert}
              onCheckedChange={(checked) => handleInputChange("interestCreditAlert", checked)}
            />
            <Label htmlFor="interestCreditAlert" className="text-sm">Interest Credit Alert</Label>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <Label>Additional Notes</Label>
        <Textarea
          placeholder="Any additional information about the fixed deposit"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={2}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
          {initialData ? "Update Fixed Deposit" : "Add Fixed Deposit"}
        </Button>
      </div>
    </form>
  );
}