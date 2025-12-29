import { Landmark, Home, Coins, Shield, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AddedInvestmentsProps {
  fixedDeposits: any[];
  realEstateHoldings: any[];
  commoditiesHoldings: any[];
  insurancePolicies: any[];
  otherInvestments: any[];
  onEdit: (type: string, index: number, data: any) => void;
  onDelete: (type: string, index: number) => void;
  onAddNew: (type: string) => void;
}

export function AddedInvestments({
  fixedDeposits,
  realEstateHoldings,
  commoditiesHoldings,
  insurancePolicies,
  otherInvestments,
  onEdit,
  onDelete,
  onAddNew
}: AddedInvestmentsProps) {
  const hasAnyInvestments =
    fixedDeposits.length > 0 ||
    realEstateHoldings.length > 0 ||
    commoditiesHoldings.length > 0 ||
    insurancePolicies.length > 0 ||
    otherInvestments.length > 0;

  if (!hasAnyInvestments) return null;

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4">Your Added Investments</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fixed Deposits */}
        {fixedDeposits.length > 0 && (
          <InvestmentCategory
            icon={Landmark}
            title="Fixed Deposits"
            iconColor="text-green-500"
            items={fixedDeposits}
            itemType="fixedDeposit"
            onEdit={onEdit}
            onDelete={onDelete}
            onAddNew={() => onAddNew("fixedDeposit")}
            renderItem={(fd) => (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{fd.bankName}</span>
                  <Badge className="text-xs">{fd.fdType}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Principal: ₹{parseFloat(fd.principalAmount || 0).toLocaleString()} |
                  Rate: {fd.interestRate}% |
                  Tenure: {fd.fdTenure} {fd.tenureUnit}
                </div>
              </>
            )}
          />
        )}

        {/* Real Estate */}
        {realEstateHoldings.length > 0 && (
          <InvestmentCategory
            icon={Home}
            title="Real Estate"
            iconColor="text-blue-500"
            items={realEstateHoldings}
            itemType="realEstate"
            onEdit={onEdit}
            onDelete={onDelete}
            onAddNew={() => onAddNew("realEstate")}
            renderItem={(property) => (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{property.propertyType}</span>
                  <Badge className="text-xs">{property.possession}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {property.city}, {property.state} |
                  Purchase: ₹{parseFloat(property.purchasePrice || 0).toLocaleString()}
                  {property.currentValue && ` | Current: ₹${parseFloat(property.currentValue).toLocaleString()}`}
                </div>
              </>
            )}
          />
        )}

        {/* Commodities */}
        {commoditiesHoldings.length > 0 && (
          <InvestmentCategory
            icon={Coins}
            title="Commodities"
            iconColor="text-yellow-500"
            items={commoditiesHoldings}
            itemType="commodities"
            onEdit={onEdit}
            onDelete={onDelete}
            onAddNew={() => onAddNew("commodities")}
            renderItem={(commodity) => (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{commodity.commodityType}</span>
                  <Badge className="text-xs">{commodity.formType}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Quantity: {commodity.quantity} {commodity.unit} |
                  Purchase: ₹{parseFloat(commodity.purchasePrice || 0).toLocaleString()}
                  {commodity.currentPrice && ` | Current: ₹${parseFloat(commodity.currentPrice).toLocaleString()}`}
                </div>
              </>
            )}
          />
        )}

        {/* Insurance */}
        {insurancePolicies.length > 0 && (
          <InvestmentCategory
            icon={Shield}
            title="Insurance"
            iconColor="text-purple-500"
            items={insurancePolicies}
            itemType="insurance"
            onEdit={onEdit}
            onDelete={onDelete}
            onAddNew={() => onAddNew("insurance")}
            renderItem={(policy) => (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{policy.insuranceCompany}</span>
                  <Badge className="text-xs">{policy.insuranceType}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Policy: {policy.policyNumber} |
                  Cover: ₹{parseFloat(policy.sumAssured || 0).toLocaleString()} |
                  Premium: ₹{parseFloat(policy.premiumAmount || 0).toLocaleString()}/{policy.premiumFrequency}
                </div>
              </>
            )}
          />
        )}

        {/* Other Investments */}
        {otherInvestments.length > 0 && (
          <InvestmentCategory
            icon={Globe}
            title="Other Investments"
            iconColor="text-indigo-500"
            items={otherInvestments}
            itemType="other"
            onEdit={onEdit}
            onDelete={onDelete}
            onAddNew={() => onAddNew("other")}
            renderItem={(investment) => (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{investment.investmentType}</span>
                  <Badge className="text-xs">{investment.assetClass}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {investment.assetName} |
                  Amount: ₹{parseFloat(investment.investmentAmount || 0).toLocaleString()}
                  {investment.currentValue && ` | Current: ₹${parseFloat(investment.currentValue).toLocaleString()}`}
                </div>
              </>
            )}
          />
        )}
      </div>
    </div>
  );
}

// Helper component for rendering investment categories
function InvestmentCategory({
  icon: Icon,
  title,
  iconColor,
  items,
  itemType,
  onEdit,
  onDelete,
  onAddNew,
  renderItem
}: {
  icon: any;
  title: string;
  iconColor: string;
  items: any[];
  itemType: string;
  onEdit: (type: string, index: number, data: any) => void;
  onDelete: (type: string, index: number) => void;
  onAddNew: () => void;
  renderItem: (item: any) => React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          {title} ({items.length})
        </h4>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddNew}
          className="text-xs"
        >
          Add New
        </Button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        {items.map((item, index) => (
          <Card key={item.id} className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {renderItem(item)}
              </div>
              <div className="flex gap-1 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(itemType, index, item)}
                  className="text-xs h-8"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(itemType, index)}
                  className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
