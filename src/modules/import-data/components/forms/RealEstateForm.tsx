import { useState } from "react";
import { Home, MapPin, Calendar, DollarSign, Building, Users, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface RealEstateFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function RealEstateForm({ onSubmit, onCancel, initialData }: RealEstateFormProps) {
  const [formData, setFormData] = useState(initialData || {
    propertyType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    purchaseDate: "",
    purchasePrice: "",
    currentValue: "",
    area: "",
    areaUnit: "sq-ft",
    isRented: false,
    monthlyRental: "",
    tenantDetails: "",
    leaseStartDate: "",
    leaseEndDate: "",
    mortgageOutstanding: "",
    bankName: "",
    monthlyEMI: "",
    interestRate: "",
    propertyTax: "",
    maintenanceCharges: "",
    insurancePremium: "",
    registrationNumber: "",
    stampDutyPaid: "",
    ageOfProperty: "",
    possession: "self-occupied",
    description: ""
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.propertyType || !formData.address || !formData.purchasePrice || !formData.city || !formData.state) {
      toast.error("Please fill in all required fields (Property Type, Address, City, State, Purchase Price)");
      return;
    }

    // Validate rental details if property is rented
    if (formData.possession === "rented" && !formData.monthlyRental) {
      toast.error("Please enter monthly rental income for rented property");
      return;
    }

    // Validate loan details if loan checkbox is checked
    if (formData.mortgageOutstanding && (!formData.monthlyEMI || !formData.interestRate)) {
      toast.error("Please enter EMI and interest rate for home loan");
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      propertyType: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      purchaseDate: "",
      purchasePrice: "",
      currentValue: "",
      area: "",
      areaUnit: "sq-ft",
      isRented: false,
      monthlyRental: "",
      tenantDetails: "",
      leaseStartDate: "",
      leaseEndDate: "",
      mortgageOutstanding: "",
      bankName: "",
      monthlyEMI: "",
      interestRate: "",
      propertyTax: "",
      maintenanceCharges: "",
      insurancePremium: "",
      registrationNumber: "",
      stampDutyPaid: "",
      ageOfProperty: "",
      possession: "self-occupied",
      description: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Type */}
          <div>
            <Label>Property Type *</Label>
            <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential-house">Residential House</SelectItem>
                <SelectItem value="residential-apartment">Residential Apartment</SelectItem>
                <SelectItem value="commercial-office">Commercial Office</SelectItem>
                <SelectItem value="commercial-retail">Commercial Retail</SelectItem>
                <SelectItem value="industrial">Industrial Property</SelectItem>
                <SelectItem value="land">Land/Plot</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address Details */}
          <div className="space-y-3">
            <div>
              <Label>Property Address *</Label>
              <Textarea
                placeholder="Enter full property address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>City *</Label>
                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label>PIN Code</Label>
              <Input
                placeholder="PIN Code"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
              />
            </div>
          </div>

          {/* Purchase Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Purchase Date</Label>
              <Input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
              />
            </div>
            <div>
              <Label>Purchase Price *</Label>
              <Input
                type="number"
                placeholder="₹ Amount"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
              />
            </div>
          </div>

          {/* Current Valuation */}
          <div>
            <Label>Current Market Value</Label>
            <Input
              type="number"
              placeholder="₹ Current estimated value"
              value={formData.currentValue}
              onChange={(e) => handleInputChange("currentValue", e.target.value)}
            />
          </div>

          {/* Property Area */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Label>Property Area</Label>
              <Input
                type="number"
                placeholder="Area"
                value={formData.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Select value={formData.areaUnit} onValueChange={(value) => handleInputChange("areaUnit", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sq-ft">Sq. Ft.</SelectItem>
                  <SelectItem value="sq-m">Sq. M.</SelectItem>
                  <SelectItem value="acres">Acres</SelectItem>
                  <SelectItem value="sq-yards">Sq. Yards</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Possession */}
          <div>
            <Label>Property Possession</Label>
            <Select value={formData.possession} onValueChange={(value) => handleInputChange("possession", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select possession type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self-occupied">Self Occupied</SelectItem>
                <SelectItem value="rented">Rented Out</SelectItem>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="under-construction">Under Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Property Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Age of Property (Years)</Label>
              <Input
                type="number"
                placeholder="Years"
                value={formData.ageOfProperty}
                onChange={(e) => handleInputChange("ageOfProperty", e.target.value)}
              />
            </div>
            <div>
              <Label>Registration Number</Label>
              <Input
                placeholder="Property registration no."
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
              />
            </div>
          </div>

          {/* Rental Information */}
          {formData.possession === "rented" && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Rental Details</h4>
              
              <div>
                <Label>Monthly Rental Income</Label>
                <Input
                  type="number"
                  placeholder="₹ Monthly rent"
                  value={formData.monthlyRental}
                  onChange={(e) => handleInputChange("monthlyRental", e.target.value)}
                />
              </div>
              
              <div>
                <Label>Tenant Details</Label>
                <Input
                  placeholder="Tenant name or company"
                  value={formData.tenantDetails}
                  onChange={(e) => handleInputChange("tenantDetails", e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Lease Start Date</Label>
                  <Input
                    type="date"
                    value={formData.leaseStartDate}
                    onChange={(e) => handleInputChange("leaseStartDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Lease End Date</Label>
                  <Input
                    type="date"
                    value={formData.leaseEndDate}
                    onChange={(e) => handleInputChange("leaseEndDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Loan Details */}
          {formData.mortgageOutstanding && (
            <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-2">Home Loan Details</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Outstanding Amount</Label>
                  <Input
                    type="number"
                    placeholder="₹ Loan amount"
                    value={formData.mortgageOutstanding}
                    onChange={(e) => handleInputChange("mortgageOutstanding", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Bank/Lender Name</Label>
                  <Input
                    placeholder="Bank name"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Monthly EMI</Label>
                  <Input
                    type="number"
                    placeholder="₹ EMI amount"
                    value={formData.monthlyEMI}
                    onChange={(e) => handleInputChange("monthlyEMI", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Rate %"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange("interestRate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasLoan"
              checked={!!formData.mortgageOutstanding}
              onCheckedChange={(checked) => {
                if (!checked) {
                  handleInputChange("mortgageOutstanding", "");
                  handleInputChange("bankName", "");
                  handleInputChange("monthlyEMI", "");
                  handleInputChange("interestRate", "");
                } else {
                  handleInputChange("mortgageOutstanding", "1");
                }
              }}
            />
            <Label htmlFor="hasLoan">Property has an active home loan</Label>
          </div>

          {/* Additional Costs */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Additional Costs & Charges</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Annual Property Tax</Label>
                <Input
                  type="number"
                  placeholder="₹ Tax amount"
                  value={formData.propertyTax}
                  onChange={(e) => handleInputChange("propertyTax", e.target.value)}
                />
              </div>
              <div>
                <Label>Monthly Maintenance</Label>
                <Input
                  type="number"
                  placeholder="₹ Maintenance"
                  value={formData.maintenanceCharges}
                  onChange={(e) => handleInputChange("maintenanceCharges", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Annual Insurance Premium</Label>
                <Input
                  type="number"
                  placeholder="₹ Insurance"
                  value={formData.insurancePremium}
                  onChange={(e) => handleInputChange("insurancePremium", e.target.value)}
                />
              </div>
              <div>
                <Label>Stamp Duty Paid</Label>
                <Input
                  type="number"
                  placeholder="₹ Stamp duty"
                  value={formData.stampDutyPaid}
                  onChange={(e) => handleInputChange("stampDutyPaid", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label>Additional Notes</Label>
            <Textarea
              placeholder="Any additional information about the property"
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
          {initialData ? "Update Property" : "Add Property"}
        </Button>
      </div>
    </form>
  );
}