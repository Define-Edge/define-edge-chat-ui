import { useState } from "react";
import { Coins, Calendar, Weight, MapPin, Building, Shield, FileText, TrendingUp, Banknote, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface CommoditiesFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function CommoditiesForm({ onSubmit, onCancel, initialData }: CommoditiesFormProps) {
  const [formData, setFormData] = useState(initialData || {
    // Basic Commodity Information
    commodityType: "",
    customCommodity: "",
    commodityCategory: "",
    holdingForm: "physical",
    
    // Purchase Details
    purchaseDate: "",
    quantity: "",
    unit: "",
    purchasePrice: "",
    purchasePricePerUnit: "",
    currentPrice: "",
    currentPricePerUnit: "",
    
    // Quality and Specifications
    purity: "",
    grade: "",
    brand: "",
    manufacturer: "",
    certificateNumber: "",
    hallmarkNumber: "",
    
    // Physical Holdings Details
    storageLocation: "",
    storageType: "",
    storageCharges: "",
    insuranceValue: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    
    // ETF/Digital Holdings Details
    platformName: "",
    folioNumber: "",
    dpId: "",
    clientId: "",
    isin: "",
    
    // Trading and Transaction Details
    brokerName: "",
    tradingAccount: "",
    exchangeName: "",
    contractDetails: "",
    marginRequired: "",
    
    // Valuation and Performance
    lastValuationDate: "",
    valuationMethod: "",
    marketPrice: "",
    unrealizedGainLoss: "",
    totalReturns: "",
    
    // Tax and Legal
    taxImplications: "",
    customsDuty: "",
    gstPaid: "",
    importDocuments: false,
    
    // Additional Features
    loanAgainst: false,
    loanAmount: "",
    loanProvider: "",
    pledged: false,
    pledgedAmount: "",
    pledgedTo: "",
    
    // Delivery and Logistics
    deliveryMode: "",
    deliveryAddress: "",
    trackingNumber: "",
    deliveryCharges: "",
    
    // Investment Strategy
    investmentPurpose: "",
    holdingPeriod: "",
    targetPrice: "",
    stopLoss: "",
    
    // Alerts and Monitoring
    priceAlerts: true,
    maturityAlerts: false,
    renewalDate: "",
    
    // Additional Information
    description: ""
  });

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Auto-calculate per unit prices
  const calculatePerUnitPrice = (type: 'purchase' | 'current') => {
    const total = parseFloat(type === 'purchase' ? formData.purchasePrice : formData.currentPrice) || 0;
    const quantity = parseFloat(formData.quantity) || 0;
    
    if (total > 0 && quantity > 0) {
      const perUnit = (total / quantity).toFixed(2);
      if (type === 'purchase') {
        handleInputChange("purchasePricePerUnit", perUnit);
      } else {
        handleInputChange("currentPricePerUnit", perUnit);
      }
      
      // Calculate unrealized gain/loss
      const purchaseTotal = parseFloat(formData.purchasePrice) || 0;
      const currentTotal = parseFloat(formData.currentPrice) || 0;
      if (purchaseTotal > 0 && currentTotal > 0) {
        const gainLoss = ((currentTotal - purchaseTotal) / purchaseTotal * 100).toFixed(2);
        handleInputChange("unrealizedGainLoss", gainLoss);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.commodityType || !formData.quantity || !formData.purchasePrice) {
      toast.error("Please fill in all required fields (Commodity Type, Quantity, Purchase Price)");
      return;
    }

    // Validate quantity and price
    if (parseFloat(formData.quantity) <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (parseFloat(formData.purchasePrice) <= 0) {
      toast.error("Purchase price must be greater than 0");
      return;
    }

    // Validate custom commodity name
    if (formData.commodityType === "other" && !formData.customCommodity) {
      toast.error("Please enter commodity name for 'Other' type");
      return;
    }

    // Validate storage details for physical holdings
    if (formData.holdingForm === "physical" && !formData.storageType) {
      toast.error("Please specify storage type for physical holdings");
      return;
    }

    // Validate platform details for ETF/digital holdings
    if ((formData.holdingForm === "etf" || formData.holdingForm === "digital") && !formData.platformName) {
      toast.error("Please specify platform/fund name for ETF/digital holdings");
      return;
    }

    onSubmit(formData);
    
    // Reset form to initial state
    setFormData({
      commodityType: "",
      customCommodity: "",
      commodityCategory: "",
      holdingForm: "physical",
      purchaseDate: "",
      quantity: "",
      unit: "",
      purchasePrice: "",
      purchasePricePerUnit: "",
      currentPrice: "",
      currentPricePerUnit: "",
      purity: "",
      grade: "",
      brand: "",
      manufacturer: "",
      certificateNumber: "",
      hallmarkNumber: "",
      storageLocation: "",
      storageType: "",
      storageCharges: "",
      insuranceValue: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      platformName: "",
      folioNumber: "",
      dpId: "",
      clientId: "",
      isin: "",
      brokerName: "",
      tradingAccount: "",
      exchangeName: "",
      contractDetails: "",
      marginRequired: "",
      lastValuationDate: "",
      valuationMethod: "",
      marketPrice: "",
      unrealizedGainLoss: "",
      totalReturns: "",
      taxImplications: "",
      customsDuty: "",
      gstPaid: "",
      importDocuments: false,
      loanAgainst: false,
      loanAmount: "",
      loanProvider: "",
      pledged: false,
      pledgedAmount: "",
      pledgedTo: "",
      deliveryMode: "",
      deliveryAddress: "",
      trackingNumber: "",
      deliveryCharges: "",
      investmentPurpose: "",
      holdingPeriod: "",
      targetPrice: "",
      stopLoss: "",
      priceAlerts: true,
      maturityAlerts: false,
      renewalDate: "",
      description: ""
    });
  };

  const commodityOptions = [
    // Precious Metals
    { value: "gold", label: "Gold", category: "Precious Metals", units: ["grams", "kg", "ounces", "tola", "troy-ounce"] },
    { value: "silver", label: "Silver", category: "Precious Metals", units: ["grams", "kg", "ounces", "troy-ounce"] },
    { value: "platinum", label: "Platinum", category: "Precious Metals", units: ["grams", "ounces", "troy-ounce"] },
    { value: "palladium", label: "Palladium", category: "Precious Metals", units: ["ounces", "grams", "troy-ounce"] },
    
    // Base Metals
    { value: "copper", label: "Copper", category: "Base Metals", units: ["kg", "tonnes", "pounds"] },
    { value: "aluminum", label: "Aluminum", category: "Base Metals", units: ["kg", "tonnes"] },
    { value: "zinc", label: "Zinc", category: "Base Metals", units: ["kg", "tonnes"] },
    { value: "nickel", label: "Nickel", category: "Base Metals", units: ["kg", "tonnes"] },
    { value: "lead", label: "Lead", category: "Base Metals", units: ["kg", "tonnes"] },
    
    // Energy Commodities
    { value: "crude-oil", label: "Crude Oil", category: "Energy", units: ["barrels", "liters", "gallons"] },
    { value: "natural-gas", label: "Natural Gas", category: "Energy", units: ["units", "cubic-meters", "MMBtu"] },
    { value: "coal", label: "Coal", category: "Energy", units: ["tonnes", "metric-tons"] },
    { value: "heating-oil", label: "Heating Oil", category: "Energy", units: ["gallons", "liters"] },
    
    // Agricultural Commodities
    { value: "wheat", label: "Wheat", category: "Agricultural", units: ["quintals", "tonnes", "bushels"] },
    { value: "rice", label: "Rice", category: "Agricultural", units: ["quintals", "tonnes", "bags"] },
    { value: "corn", label: "Corn/Maize", category: "Agricultural", units: ["quintals", "tonnes", "bushels"] },
    { value: "soybeans", label: "Soybeans", category: "Agricultural", units: ["quintals", "tonnes", "bushels"] },
    { value: "sugar", label: "Sugar", category: "Agricultural", units: ["quintals", "tonnes", "pounds"] },
    { value: "cotton", label: "Cotton", category: "Agricultural", units: ["bales", "kg", "pounds"] },
    { value: "coffee", label: "Coffee", category: "Agricultural", units: ["bags", "kg", "pounds"] },
    { value: "cocoa", label: "Cocoa", category: "Agricultural", units: ["tonnes", "kg"] },
    
    // Livestock
    { value: "live-cattle", label: "Live Cattle", category: "Livestock", units: ["head", "pounds"] },
    { value: "lean-hogs", label: "Lean Hogs", category: "Livestock", units: ["pounds", "head"] },
    
    // Soft Commodities
    { value: "rubber", label: "Rubber", category: "Soft Commodities", units: ["tonnes", "kg"] },
    { value: "timber", label: "Timber/Lumber", category: "Soft Commodities", units: ["board-feet", "cubic-meters"] },
    { value: "orange-juice", label: "Orange Juice", category: "Soft Commodities", units: ["pounds", "gallons"] },
    
    // Other/Custom
    { value: "other", label: "Other", category: "Other", units: ["units", "kg", "tonnes", "pieces"] }
  ];

  const selectedCommodity = commodityOptions.find(c => c.value === formData.commodityType);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Commodity Type */}
      <div>
        <Label>Commodity Type *</Label>
        <Select value={formData.commodityType} onValueChange={(value) => {
          handleInputChange("commodityType", value);
          const commodity = commodityOptions.find(c => c.value === value);
          if (commodity) {
            handleInputChange("commodityCategory", commodity.category);
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select commodity" />
          </SelectTrigger>
          <SelectContent>
            {["Precious Metals", "Base Metals", "Energy", "Agricultural", "Livestock", "Soft Commodities", "Other"].map(category => (
              <div key={category}>
                <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50">{category}</div>
                {commodityOptions.filter(option => option.category === category).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom Commodity Name */}
      {formData.commodityType === "other" && (
        <div>
          <Label>Commodity Name *</Label>
          <Input
            placeholder="Enter commodity name"
            value={formData.customCommodity}
            onChange={(e) => handleInputChange("customCommodity", e.target.value)}
          />
        </div>
      )}

      {/* Holding Form */}
      <div>
        <Label>Holding Form *</Label>
        <RadioGroup
          value={formData.holdingForm}
          onValueChange={(value) => handleInputChange("holdingForm", value)}
          className="flex flex-row flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="physical" id="physical" />
            <Label htmlFor="physical">Physical</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="etf" id="etf" />
            <Label htmlFor="etf">ETF/Fund</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="digital" id="digital" />
            <Label htmlFor="digital">Digital</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="futures" id="futures" />
            <Label htmlFor="futures">Futures</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Purchase and Quantity Details */}
      <div className="space-y-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
          <Banknote className="w-4 h-4" />
          Purchase Details
        </h4>

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
              placeholder="₹ Total amount"
              value={formData.purchasePrice}
              onChange={(e) => {
                handleInputChange("purchasePrice", e.target.value);
                setTimeout(() => calculatePerUnitPrice('purchase'), 100);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <Label>Quantity *</Label>
            <Input
              type="number"
              step="0.001"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={(e) => {
                handleInputChange("quantity", e.target.value);
                setTimeout(() => calculatePerUnitPrice('purchase'), 100);
              }}
            />
          </div>
          <div>
            <Label>Unit</Label>
            <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {selectedCommodity?.units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit.replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Purchase Price Per Unit</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="₹ Price per unit"
            value={formData.purchasePricePerUnit}
            onChange={(e) => handleInputChange("purchasePricePerUnit", e.target.value)}
            className="bg-gray-50"
            readOnly
          />
        </div>
      </div>

      {/* Current Valuation */}
      <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Current Valuation
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Current Market Price</Label>
            <Input
              type="number"
              placeholder="₹ Current total value"
              value={formData.currentPrice}
              onChange={(e) => {
                handleInputChange("currentPrice", e.target.value);
                setTimeout(() => calculatePerUnitPrice('current'), 100);
              }}
            />
          </div>
          <div>
            <Label>Current Price Per Unit</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="₹ Current unit price"
              value={formData.currentPricePerUnit}
              onChange={(e) => handleInputChange("currentPricePerUnit", e.target.value)}
              className="bg-gray-50"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Last Valuation Date</Label>
            <Input
              type="date"
              value={formData.lastValuationDate}
              onChange={(e) => handleInputChange("lastValuationDate", e.target.value)}
            />
          </div>
          <div>
            <Label>Unrealized Gain/Loss (%)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="% Gain/Loss"
              value={formData.unrealizedGainLoss}
              onChange={(e) => handleInputChange("unrealizedGainLoss", e.target.value)}
              className="bg-gray-50"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Quality and Specifications */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Quality & Specifications</h4>
        
        {/* Purity and Grade for Precious Metals */}
        {(formData.commodityType === "gold" || formData.commodityType === "silver" || formData.commodityType === "platinum") && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Purity</Label>
              <Select value={formData.purity} onValueChange={(value) => handleInputChange("purity", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purity" />
                </SelectTrigger>
                <SelectContent>
                  {formData.commodityType === "gold" && (
                    <>
                      <SelectItem value="24k">24K (99.9%)</SelectItem>
                      <SelectItem value="22k">22K (91.6%)</SelectItem>
                      <SelectItem value="18k">18K (75%)</SelectItem>
                      <SelectItem value="916">916 Hallmark</SelectItem>
                    </>
                  )}
                  {formData.commodityType === "silver" && (
                    <>
                      <SelectItem value="999">999 Fine Silver</SelectItem>
                      <SelectItem value="925">925 Sterling Silver</SelectItem>
                      <SelectItem value="900">900 Silver</SelectItem>
                    </>
                  )}
                  {formData.commodityType === "platinum" && (
                    <>
                      <SelectItem value="950">950 Platinum</SelectItem>
                      <SelectItem value="900">900 Platinum</SelectItem>
                      <SelectItem value="850">850 Platinum</SelectItem>
                    </>
                  )}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hallmark/Certificate Number</Label>
              <Input
                placeholder="Certificate number"
                value={formData.hallmarkNumber}
                onChange={(e) => handleInputChange("hallmarkNumber", e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Grade/Quality</Label>
            <Input
              placeholder="Grade or quality specification"
              value={formData.grade}
              onChange={(e) => handleInputChange("grade", e.target.value)}
            />
          </div>
          <div>
            <Label>Brand/Manufacturer</Label>
            <Input
              placeholder="e.g., MMTC-PAMP, Tanishq"
              value={formData.brand}
              onChange={(e) => handleInputChange("brand", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Physical Holdings Specific Fields */}
      {formData.holdingForm === "physical" && (
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Physical Storage Details
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Storage Type</Label>
              <Select value={formData.storageType} onValueChange={(value) => handleInputChange("storageType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select storage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home-safe">Home Safe</SelectItem>
                  <SelectItem value="bank-locker">Bank Locker</SelectItem>
                  <SelectItem value="vault-storage">Professional Vault</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="depository">Commodity Depository</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Storage Charges (Annual)</Label>
              <Input
                type="number"
                placeholder="₹ Annual charges"
                value={formData.storageCharges}
                onChange={(e) => handleInputChange("storageCharges", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Storage Location</Label>
            <Textarea
              placeholder="Detailed storage location/address"
              value={formData.storageLocation}
              onChange={(e) => handleInputChange("storageLocation", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Insurance Value</Label>
              <Input
                type="number"
                placeholder="₹ Insured amount"
                value={formData.insuranceValue}
                onChange={(e) => handleInputChange("insuranceValue", e.target.value)}
              />
            </div>
            <div>
              <Label>Insurance Provider</Label>
              <Input
                placeholder="Insurance company"
                value={formData.insuranceProvider}
                onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Insurance Policy Number</Label>
            <Input
              placeholder="Policy number"
              value={formData.insurancePolicyNumber}
              onChange={(e) => handleInputChange("insurancePolicyNumber", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ETF/Digital Holdings Specific Fields */}
      {(formData.holdingForm === "etf" || formData.holdingForm === "digital") && (
        <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
            <Coins className="w-4 h-4" />
            ETF/Digital Holdings Details
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Platform/Fund Name</Label>
              <Input
                placeholder="e.g., Paytm Gold, HDFC Gold ETF"
                value={formData.platformName}
                onChange={(e) => handleInputChange("platformName", e.target.value)}
              />
            </div>
            <div>
              <Label>Folio/Account Number</Label>
              <Input
                placeholder="Account or folio number"
                value={formData.folioNumber}
                onChange={(e) => handleInputChange("folioNumber", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>DP ID</Label>
              <Input
                placeholder="Depository Participant ID"
                value={formData.dpId}
                onChange={(e) => handleInputChange("dpId", e.target.value)}
              />
            </div>
            <div>
              <Label>Client ID</Label>
              <Input
                placeholder="Client ID"
                value={formData.clientId}
                onChange={(e) => handleInputChange("clientId", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>ISIN</Label>
            <Input
              placeholder="International Securities Identification Number"
              value={formData.isin}
              onChange={(e) => handleInputChange("isin", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Futures/Trading Specific Fields */}
      {formData.holdingForm === "futures" && (
        <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Futures Trading Details
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Exchange Name</Label>
              <Select value={formData.exchangeName} onValueChange={(value) => handleInputChange("exchangeName", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcx">MCX (Multi Commodity Exchange)</SelectItem>
                  <SelectItem value="ncdex">NCDEX (National Commodity)</SelectItem>
                  <SelectItem value="icex">ICEX (Indian Commodity Exchange)</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Broker Name</Label>
              <Input
                placeholder="Broker name"
                value={formData.brokerName}
                onChange={(e) => handleInputChange("brokerName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Trading Account</Label>
              <Input
                placeholder="Trading account number"
                value={formData.tradingAccount}
                onChange={(e) => handleInputChange("tradingAccount", e.target.value)}
              />
            </div>
            <div>
              <Label>Margin Required</Label>
              <Input
                type="number"
                placeholder="₹ Margin amount"
                value={formData.marginRequired}
                onChange={(e) => handleInputChange("marginRequired", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Contract Details</Label>
            <Textarea
              placeholder="Contract specifications, expiry date, lot size, etc."
              value={formData.contractDetails}
              onChange={(e) => handleInputChange("contractDetails", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Loan and Pledging */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Financing Options</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="loanAgainst"
              checked={formData.loanAgainst}
              onCheckedChange={(checked) => handleInputChange("loanAgainst", checked)}
            />
            <Label htmlFor="loanAgainst">Loan Against Commodity</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pledged"
              checked={formData.pledged}
              onCheckedChange={(checked) => handleInputChange("pledged", checked)}
            />
            <Label htmlFor="pledged">Pledged/Mortgaged</Label>
          </div>
        </div>

        {formData.loanAgainst && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Loan Amount</Label>
                <Input
                  type="number"
                  placeholder="₹ Loan amount"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                />
              </div>
              <div>
                <Label>Loan Provider</Label>
                <Input
                  placeholder="Bank/NBFC name"
                  value={formData.loanProvider}
                  onChange={(e) => handleInputChange("loanProvider", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {formData.pledged && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Pledged Amount</Label>
                <Input
                  type="number"
                  placeholder="₹ Pledged value"
                  value={formData.pledgedAmount}
                  onChange={(e) => handleInputChange("pledgedAmount", e.target.value)}
                />
              </div>
              <div>
                <Label>Pledged To</Label>
                <Input
                  placeholder="Institution/person"
                  value={formData.pledgedTo}
                  onChange={(e) => handleInputChange("pledgedTo", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Investment Strategy */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Investment Strategy</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Investment Purpose</Label>
            <Select value={formData.investmentPurpose} onValueChange={(value) => handleInputChange("investmentPurpose", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Investment purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wealth-preservation">Wealth Preservation</SelectItem>
                <SelectItem value="inflation-hedge">Inflation Hedge</SelectItem>
                <SelectItem value="portfolio-diversification">Portfolio Diversification</SelectItem>
                <SelectItem value="speculation">Speculation/Trading</SelectItem>
                <SelectItem value="religious-cultural">Religious/Cultural</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Holding Period</Label>
            <Select value={formData.holdingPeriod} onValueChange={(value) => handleInputChange("holdingPeriod", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Expected holding period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short-term">Short Term (&lt; 1 year)</SelectItem>
                <SelectItem value="medium-term">Medium Term (1-3 years)</SelectItem>
                <SelectItem value="long-term">Long Term (3-5 years)</SelectItem>
                <SelectItem value="very-long-term">Very Long Term (&gt; 5 years)</SelectItem>
                <SelectItem value="permanent">Permanent/Legacy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Target Price</Label>
            <Input
              type="number"
              placeholder="₹ Target selling price"
              value={formData.targetPrice}
              onChange={(e) => handleInputChange("targetPrice", e.target.value)}
            />
          </div>
          <div>
            <Label>Stop Loss</Label>
            <Input
              type="number"
              placeholder="₹ Stop loss price"
              value={formData.stopLoss}
              onChange={(e) => handleInputChange("stopLoss", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Alerts and Monitoring */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Alerts & Monitoring</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="priceAlerts"
              checked={formData.priceAlerts}
              onCheckedChange={(checked) => handleInputChange("priceAlerts", checked)}
            />
            <Label htmlFor="priceAlerts" className="text-sm">Price Alerts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="maturityAlerts"
              checked={formData.maturityAlerts}
              onCheckedChange={(checked) => handleInputChange("maturityAlerts", checked)}
            />
            <Label htmlFor="maturityAlerts" className="text-sm">Maturity Alerts</Label>
          </div>
        </div>

        {formData.maturityAlerts && (
          <div>
            <Label>Renewal/Maturity Date</Label>
            <Input
              type="date"
              value={formData.renewalDate}
              onChange={(e) => handleInputChange("renewalDate", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Tax and Documentation */}
      <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Tax & Documentation
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>GST Paid</Label>
            <Input
              type="number"
              placeholder="₹ GST amount"
              value={formData.gstPaid}
              onChange={(e) => handleInputChange("gstPaid", e.target.value)}
            />
          </div>
          <div>
            <Label>Customs Duty</Label>
            <Input
              type="number"
              placeholder="₹ Customs duty"
              value={formData.customsDuty}
              onChange={(e) => handleInputChange("customsDuty", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Tax Implications</Label>
          <Textarea
            placeholder="Any specific tax considerations or implications"
            value={formData.taxImplications}
            onChange={(e) => handleInputChange("taxImplications", e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="importDocuments"
            checked={formData.importDocuments}
            onCheckedChange={(checked) => handleInputChange("importDocuments", checked)}
          />
          <Label htmlFor="importDocuments">Import/Purchase documents available</Label>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <Label>Additional Notes</Label>
        <Textarea
          placeholder="Any additional information about this commodity investment"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-yellow-600 hover:bg-yellow-700">
          {initialData ? "Update Commodity Investment" : "Add Commodity Investment"}
        </Button>
      </div>
    </form>
  );
}