import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building, Car, FileText, Heart, Plane, Shield, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface InsuranceFormData {
  // Basic Policy Information
  insuranceType: string;
  insuranceCompany: string;
  policyNumber: string;
  policyName: string;
  sumAssured: string;
  annualPremium: string;
  premiumFrequency: string;
  policyStartDate: string;
  policyMaturityDate: string;
  policyTerm: string;

  // Life Insurance Specific
  lifeInsuranceType: string;
  bonusAmount: string;
  surrenderValue: string;
  loanAgainst: string;

  // Health Insurance Specific
  familyFloater: boolean;
  membersCount: string;
  membersDetails: string;
  copayPercentage: string;
  deductible: string;
  roomRentLimit: string;
  preMedicalCheckup: boolean;
  networkHospitals: string;

  // Auto Insurance Specific
  vehicleType: string;
  vehicleNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  manufactureYear: string;
  coverageType: string;

  // Home Insurance Specific
  propertyValue: string;
  propertyType: string;
  propertyAddress: string;
  coverageItems: string;

  // Travel Insurance Specific
  destinationType: string;
  coverageDays: string;
  travelType: string;

  // Nominee Information
  nomineePresent: boolean;
  nomineeName: string;
  nomineeRelation: string;
  nomineeAge: string;
  nomineeShare: string;

  // Agent/Advisor Details
  hasAgent: boolean;
  agentName: string;
  agentContact: string;
  agentCode: string;

  // Claim History
  claimsMade: boolean;
  claimsCount: string;
  totalClaimsAmount: string;
  lastClaimDate: string;

  // Payment Details
  paymentMode: string;
  nextDueDate: string;

  // Additional Information
  isActive: boolean;
  renewalAlert: boolean;
  description: string;
}

interface InsuranceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function InsuranceForm({ onSubmit, onCancel, initialData }: InsuranceFormProps) {
  const [formData, setFormData] = useState<InsuranceFormData>(initialData || {
    // Basic Policy Information
    insuranceType: "",
    insuranceCompany: "",
    policyNumber: "",
    policyName: "",
    sumAssured: "",
    annualPremium: "",
    premiumFrequency: "annual",
    policyStartDate: "",
    policyMaturityDate: "",
    policyTerm: "",
    
    // Life Insurance Specific
    lifeInsuranceType: "",
    bonusAmount: "",
    surrenderValue: "",
    loanAgainst: "",
    
    // Health Insurance Specific
    familyFloater: false,
    membersCount: "",
    membersDetails: "",
    copayPercentage: "",
    deductible: "",
    roomRentLimit: "",
    preMedicalCheckup: false,
    networkHospitals: "",
    
    // Auto Insurance Specific
    vehicleType: "",
    vehicleNumber: "",
    vehicleMake: "",
    vehicleModel: "",
    manufactureYear: "",
    coverageType: "",
    
    // Home Insurance Specific
    propertyValue: "",
    propertyType: "",
    propertyAddress: "",
    coverageItems: "",
    
    // Travel Insurance Specific
    destinationType: "",
    coverageDays: "",
    travelType: "",
    
    // Nominee Information
    nomineePresent: false,
    nomineeName: "",
    nomineeRelation: "",
    nomineeAge: "",
    nomineeShare: "",
    
    // Agent/Advisor Details
    hasAgent: false,
    agentName: "",
    agentContact: "",
    agentCode: "",
    
    // Claim History
    claimsMade: false,
    claimsCount: "",
    totalClaimsAmount: "",
    lastClaimDate: "",
    
    // Payment Details
    paymentMode: "",
    nextDueDate: "",
    
    // Additional Information
    isActive: true,
    renewalAlert: true,
    description: ""
  });

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.insuranceType || !formData.insuranceCompany || !formData.policyNumber || !formData.sumAssured || !formData.annualPremium) {
      toast.error("Please fill in all required fields (Insurance Type, Company, Policy Number, Sum Assured, Premium)");
      return;
    }

    // Type-specific validation
    if (formData.insuranceType === "life" && !formData.lifeInsuranceType) {
      toast.error("Please select life insurance type");
      return;
    }

    if (formData.insuranceType === "health" && formData.familyFloater && !formData.membersCount) {
      toast.error("Please specify number of family members for family floater policy");
      return;
    }

    if (formData.insuranceType === "auto" && (!formData.vehicleNumber || !formData.vehicleMake)) {
      toast.error("Please enter vehicle number and make for auto insurance");
      return;
    }

    if (formData.nomineePresent && (!formData.nomineeName || !formData.nomineeRelation)) {
      toast.error("Please fill in nominee details");
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      insuranceType: "",
      insuranceCompany: "",
      policyNumber: "",
      policyName: "",
      sumAssured: "",
      annualPremium: "",
      premiumFrequency: "annual",
      policyStartDate: "",
      policyMaturityDate: "",
      policyTerm: "",
      lifeInsuranceType: "",
      bonusAmount: "",
      surrenderValue: "",
      loanAgainst: "",
      familyFloater: false,
      membersCount: "",
      membersDetails: "",
      copayPercentage: "",
      deductible: "",
      roomRentLimit: "",
      preMedicalCheckup: false,
      networkHospitals: "",
      vehicleType: "",
      vehicleNumber: "",
      vehicleMake: "",
      vehicleModel: "",
      manufactureYear: "",
      coverageType: "",
      propertyValue: "",
      propertyType: "",
      propertyAddress: "",
      coverageItems: "",
      destinationType: "",
      coverageDays: "",
      travelType: "",
      nomineePresent: false,
      nomineeName: "",
      nomineeRelation: "",
      nomineeAge: "",
      nomineeShare: "",
      hasAgent: false,
      agentName: "",
      agentContact: "",
      agentCode: "",
      claimsMade: false,
      claimsCount: "",
      totalClaimsAmount: "",
      lastClaimDate: "",
      paymentMode: "",
      nextDueDate: "",
      isActive: true,
      renewalAlert: true,
      description: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Insurance Type */}
      <div>
        <Label>Insurance Type *</Label>
        <Select value={formData.insuranceType} onValueChange={(value) => handleInputChange("insuranceType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select insurance type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="life">Life Insurance</SelectItem>
            <SelectItem value="health">Health Insurance</SelectItem>
            <SelectItem value="auto">Auto/Vehicle Insurance</SelectItem>
            <SelectItem value="home">Home/Property Insurance</SelectItem>
            <SelectItem value="travel">Travel Insurance</SelectItem>
            <SelectItem value="disability">Disability Insurance</SelectItem>
            <SelectItem value="critical-illness">Critical Illness</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Basic Policy Information */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Insurance Company *</Label>
            <Input
              placeholder="Company name"
              value={formData.insuranceCompany}
              onChange={(e) => handleInputChange("insuranceCompany", e.target.value)}
            />
          </div>
          <div>
            <Label>Policy Number *</Label>
            <Input
              placeholder="Policy number"
              value={formData.policyNumber}
              onChange={(e) => handleInputChange("policyNumber", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Policy Name</Label>
          <Input
            placeholder="Policy/Plan name"
            value={formData.policyName}
            onChange={(e) => handleInputChange("policyName", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Sum Assured *</Label>
            <Input
              type="number"
              placeholder="₹ Coverage amount"
              value={formData.sumAssured}
              onChange={(e) => handleInputChange("sumAssured", e.target.value)}
            />
          </div>
          <div>
            <Label>Annual Premium *</Label>
            <Input
              type="number"
              placeholder="₹ Premium amount"
              value={formData.annualPremium}
              onChange={(e) => handleInputChange("annualPremium", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Premium Frequency</Label>
          <Select value={formData.premiumFrequency} onValueChange={(value) => handleInputChange("premiumFrequency", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="semi-annual">Semi-Annual</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="single">Single Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Policy Start Date</Label>
            <Input
              type="date"
              value={formData.policyStartDate}
              onChange={(e) => handleInputChange("policyStartDate", e.target.value)}
            />
          </div>
          <div>
            <Label>Policy Maturity Date</Label>
            <Input
              type="date"
              value={formData.policyMaturityDate}
              onChange={(e) => handleInputChange("policyMaturityDate", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Policy Term (Years)</Label>
          <Input
            type="number"
            placeholder="Policy duration in years"
            value={formData.policyTerm}
            onChange={(e) => handleInputChange("policyTerm", e.target.value)}
          />
        </div>
      </div>

      {/* Life Insurance Specific Fields */}
      {formData.insuranceType === "life" && (
        <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Life Insurance Details
          </h4>
          
          <div>
            <Label>Life Insurance Type</Label>
            <Select value={formData.lifeInsuranceType} onValueChange={(value) => handleInputChange("lifeInsuranceType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select life insurance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="term">Term Life Insurance</SelectItem>
                <SelectItem value="whole-life">Whole Life Insurance</SelectItem>
                <SelectItem value="endowment">Endowment Policy</SelectItem>
                <SelectItem value="ulip">ULIP (Unit Linked)</SelectItem>
                <SelectItem value="money-back">Money Back Policy</SelectItem>
                <SelectItem value="child-plan">Child Insurance Plan</SelectItem>
                <SelectItem value="pension">Pension Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Bonus Amount (if applicable)</Label>
              <Input
                type="number"
                placeholder="₹ Bonus amount"
                value={formData.bonusAmount}
                onChange={(e) => handleInputChange("bonusAmount", e.target.value)}
              />
            </div>
            <div>
              <Label>Current Surrender Value</Label>
              <Input
                type="number"
                placeholder="₹ Surrender value"
                value={formData.surrenderValue}
                onChange={(e) => handleInputChange("surrenderValue", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Loan Against Policy</Label>
            <Input
              type="number"
              placeholder="₹ Loan amount (if any)"
              value={formData.loanAgainst}
              onChange={(e) => handleInputChange("loanAgainst", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Health Insurance Specific Fields */}
      {formData.insuranceType === "health" && (
        <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Health Insurance Details
          </h4>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="familyFloater"
              checked={formData.familyFloater}
              onCheckedChange={(checked) => handleInputChange("familyFloater", checked)}
            />
            <Label htmlFor="familyFloater">Family Floater Policy</Label>
          </div>

          {formData.familyFloater && (
            <div className="space-y-3">
              <div>
                <Label>Number of Family Members</Label>
                <Input
                  type="number"
                  placeholder="Total members covered"
                  value={formData.membersCount}
                  onChange={(e) => handleInputChange("membersCount", e.target.value)}
                />
              </div>
              <div>
                <Label>Family Members Details</Label>
                <Textarea
                  placeholder="List family members covered (names, ages, relation)"
                  value={formData.membersDetails}
                  onChange={(e) => handleInputChange("membersDetails", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Co-pay Percentage (%)</Label>
              <Input
                type="number"
                placeholder="Co-pay %"
                value={formData.copayPercentage}
                onChange={(e) => handleInputChange("copayPercentage", e.target.value)}
              />
            </div>
            <div>
              <Label>Deductible Amount</Label>
              <Input
                type="number"
                placeholder="₹ Deductible"
                value={formData.deductible}
                onChange={(e) => handleInputChange("deductible", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Room Rent Limit (per day)</Label>
            <Input
              type="number"
              placeholder="₹ Room rent limit"
              value={formData.roomRentLimit}
              onChange={(e) => handleInputChange("roomRentLimit", e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="preMedical"
              checked={formData.preMedicalCheckup}
              onCheckedChange={(checked) => handleInputChange("preMedicalCheckup", checked)}
            />
            <Label htmlFor="preMedical">Pre-medical checkup completed</Label>
          </div>

          <div>
            <Label>Network Hospitals Info</Label>
            <Input
              placeholder="Network hospital count or specific hospitals"
              value={formData.networkHospitals}
              onChange={(e) => handleInputChange("networkHospitals", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Auto Insurance Specific Fields */}
      {formData.insuranceType === "auto" && (
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Car className="w-4 h-4" />
            Auto Insurance Details
          </h4>

          <div>
            <Label>Vehicle Type</Label>
            <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange("vehicleType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bike">Motorcycle/Scooter</SelectItem>
                <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                <SelectItem value="three-wheeler">Three Wheeler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Vehicle Number</Label>
              <Input
                placeholder="Registration number"
                value={formData.vehicleNumber}
                onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
              />
            </div>
            <div>
              <Label>Manufacturing Year</Label>
              <Input
                type="number"
                placeholder="Year"
                value={formData.manufactureYear}
                onChange={(e) => handleInputChange("manufactureYear", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Vehicle Make</Label>
              <Input
                placeholder="e.g., Maruti, Honda, Bajaj"
                value={formData.vehicleMake}
                onChange={(e) => handleInputChange("vehicleMake", e.target.value)}
              />
            </div>
            <div>
              <Label>Vehicle Model</Label>
              <Input
                placeholder="Model name"
                value={formData.vehicleModel}
                onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Coverage Type</Label>
            <Select value={formData.coverageType} onValueChange={(value) => handleInputChange("coverageType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select coverage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                <SelectItem value="third-party">Third Party Only</SelectItem>
                <SelectItem value="own-damage">Own Damage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Home Insurance Specific Fields */}
      {formData.insuranceType === "home" && (
        <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Home Insurance Details
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Property Value</Label>
              <Input
                type="number"
                placeholder="₹ Property value"
                value={formData.propertyValue}
                onChange={(e) => handleInputChange("propertyValue", e.target.value)}
              />
            </div>
            <div>
              <Label>Property Type</Label>
              <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="independent-house">Independent House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="shop">Shop/Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Property Address</Label>
            <Textarea
              placeholder="Property address"
              value={formData.propertyAddress}
              onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label>Coverage Items</Label>
            <Textarea
              placeholder="Items/risks covered (fire, theft, natural disasters, contents, etc.)"
              value={formData.coverageItems}
              onChange={(e) => handleInputChange("coverageItems", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Travel Insurance Specific Fields */}
      {formData.insuranceType === "travel" && (
        <div className="space-y-3 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
          <h4 className="font-medium text-cyan-900 mb-2 flex items-center gap-2">
            <Plane className="w-4 h-4" />
            Travel Insurance Details
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Destination Type</Label>
              <Select value={formData.destinationType} onValueChange={(value) => handleInputChange("destinationType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domestic">Domestic</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                  <SelectItem value="worldwide">Worldwide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Coverage Days</Label>
              <Input
                type="number"
                placeholder="Number of days"
                value={formData.coverageDays}
                onChange={(e) => handleInputChange("coverageDays", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Travel Type</Label>
            <Select value={formData.travelType} onValueChange={(value) => handleInputChange("travelType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select travel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leisure">Leisure/Vacation</SelectItem>
                <SelectItem value="business">Business Travel</SelectItem>
                <SelectItem value="study">Student Travel</SelectItem>
                <SelectItem value="medical">Medical Tourism</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

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
          </div>
        )}
      </div>

      {/* Agent/Advisor Details */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasAgent"
            checked={formData.hasAgent}
            onCheckedChange={(checked) => handleInputChange("hasAgent", checked)}
          />
          <Label htmlFor="hasAgent">Insurance agent/advisor involved</Label>
        </div>

        {formData.hasAgent && (
          <div className="space-y-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <h4 className="font-medium text-indigo-900 mb-2">Agent/Advisor Details</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Agent Name</Label>
                <Input
                  placeholder="Agent/advisor name"
                  value={formData.agentName}
                  onChange={(e) => handleInputChange("agentName", e.target.value)}
                />
              </div>
              <div>
                <Label>Contact Number</Label>
                <Input
                  placeholder="Phone number"
                  value={formData.agentContact}
                  onChange={(e) => handleInputChange("agentContact", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Agent Code/ID</Label>
              <Input
                placeholder="Agent identification code"
                value={formData.agentCode}
                onChange={(e) => handleInputChange("agentCode", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Claim History */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="claimsMade"
            checked={formData.claimsMade}
            onCheckedChange={(checked) => handleInputChange("claimsMade", checked)}
          />
          <Label htmlFor="claimsMade">Claims made on this policy</Label>
        </div>

        {formData.claimsMade && (
          <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Claim History
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Number of Claims</Label>
                <Input
                  type="number"
                  placeholder="Total claims"
                  value={formData.claimsCount}
                  onChange={(e) => handleInputChange("claimsCount", e.target.value)}
                />
              </div>
              <div>
                <Label>Total Claims Amount</Label>
                <Input
                  type="number"
                  placeholder="₹ Total amount"
                  value={formData.totalClaimsAmount}
                  onChange={(e) => handleInputChange("totalClaimsAmount", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Last Claim Date</Label>
              <Input
                type="date"
                value={formData.lastClaimDate}
                onChange={(e) => handleInputChange("lastClaimDate", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Payment Information</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Payment Mode</Label>
            <Select value={formData.paymentMode} onValueChange={(value) => handleInputChange("paymentMode", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="auto-debit">Auto Debit</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit-card">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Next Due Date</Label>
            <Input
              type="date"
              value={formData.nextDueDate}
              onChange={(e) => handleInputChange("nextDueDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Policy Status */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Policy Status</h4>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
            <Label htmlFor="isActive">Policy is currently active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="renewalAlert"
              checked={formData.renewalAlert}
              onCheckedChange={(checked) => handleInputChange("renewalAlert", checked)}
            />
            <Label htmlFor="renewalAlert">Set renewal reminder alerts</Label>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <Label>Additional Notes</Label>
        <Textarea
          placeholder="Any additional information about the policy"
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
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {initialData ? "Update Insurance Policy" : "Add Insurance Policy"}
        </Button>
      </div>
    </form>
  );
}