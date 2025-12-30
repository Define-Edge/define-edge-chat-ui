"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { Holding } from "@/lib/moneyone/moneyone.types";
import { ConsentData } from "@/lib/moneyone/moneyone.storage";
import useModalState from "@/hooks/useModalState";
import {
  MutualFundSearchResponse,
  StockSearchResponse
} from "@/types/search-api.types";
import { Loader2, Plus, Search, Trash2, TrendingUp, X } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useCallback, useState, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useImportHoldingsMutation } from "../../hooks/useImportHoldingsMutation";
import { useFiData } from "../../hooks/useFiData";

type HoldingFormData = {
  holdings: Array<Holding & { quantity: number }>;
};

type HoldingsPreviewModalProps = {
  consent?: ConsentData | null;
};

export function HoldingsPreviewModal({
  consent,
}: HoldingsPreviewModalProps) {
  const { open, handleClose, handleOpenChange } = useModalState();

  const consentID = consent?.consentID;
  const consentType = consent?.type;
  const isDataReady = consent?.isDataReady;
  const [, setImportViewOpen] = useQueryState(
    "importViewOpen",
    parseAsBoolean.withDefault(false),
  );

  const importHoldingsMut = useImportHoldingsMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    | StockSearchResponse["results"]
    | MutualFundSearchResponse["results"]
    | null
  >(null);
  const [isSearching, setIsSearching] = useState(false);

  const { data: fiData, isLoading } = useFiData(consentID, open);

  // Extract holdings and convert to form data
  const allHoldings: Holding[] = [];
  if (fiData) {
    fiData.forEach((account) => {
      if (account.Summary?.Investment?.Holdings?.Holding) {
        allHoldings.push(...account.Summary.Investment.Holdings.Holding);
      }
    });
  }

  const { control, handleSubmit, reset } = useForm<HoldingFormData>({
    defaultValues: {
      holdings: allHoldings.map((h) => ({
        ...h,
        quantity:
          consentType === ConsentType.EQUITIES
            ? parseFloat(h.units || "0")
            : parseFloat(h.closingUnits || "0"),
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "holdings",
  });

  // Reset form when data loads
  if (fiData && fields.length === 0 && allHoldings.length > 0) {
    reset({
      holdings: allHoldings.map((h) => ({
        ...h,
        quantity:
          consentType === ConsentType.EQUITIES
            ? parseFloat(h.units || "0")
            : parseFloat(h.closingUnits || "0"),
      })),
    });
  }

  const assetType =
    consentType === ConsentType.EQUITIES ? "Equity" : "Mutual Fund";

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      const endpoint =
        consentType === ConsentType.EQUITIES
          ? `${apiUrl}/utilities/search/stocks`
          : `${apiUrl}/utilities/search/mutual-funds`;

      const requestBody = { query, limit: 6 };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      const data:
        | StockSearchResponse
        | MutualFundSearchResponse = await response.json();
      setSearchResults(data.results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [consentType]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const handleAddSearchResult = (
    result: StockSearchResponse["results"][0] | MutualFundSearchResponse["results"][0],
  ) => {
    if (consentType === ConsentType.EQUITIES && "symbol" in result) {
      // Add equity
      append({
        issuerName: result.name,
        isin: result.symbol,
        isinDescription: result.name,
        units: "0",
        lastTradedPrice: "0",
        quantity: 0,
      } as Holding & { quantity: number });
    } else if ("schemeCode" in result) {
      // Add mutual fund
      append({
        schemeTypes: result.sName,
        amc: result.legalNames,
        folioNo: "",
        closingUnits: "0",
        nav: "0",
        navDate: "",
        quantity: 0,
      } as Holding & { quantity: number });
    }
    setSearchQuery("");
    setSearchResults(null);
  };

  const onSubmit = (data: HoldingFormData) => {
    if (!fiData) return;

    // Filter out holdings with quantity = 0 (removed)
    const validHoldings = data.holdings.filter((h) => h.quantity > 0);

    // Convert form holdings back to Holding type
    const convertedHoldings: Holding[] = validHoldings.map((h) => {
      const { quantity: _quantity, ...holdingWithoutQuantity } = h;

      if (consentType === ConsentType.EQUITIES) {
        return {
          ...holdingWithoutQuantity,
          units: _quantity.toString(),
        };
      } else {
        return {
          ...holdingWithoutQuantity,
          closingUnits: _quantity.toString(),
        };
      }
    });

    // Create consolidated account with all edited holdings
    // Find the first account with investment data to use as template
    const firstAccountWithInvestment = fiData.find(
      (account) => account.Summary?.Investment
    );

    if (!firstAccountWithInvestment?.Summary?.Investment) {
      return;
    }

    // Create a single consolidated account with all holdings
    const modifiedFiData = [
      {
        ...firstAccountWithInvestment,
        Summary: {
          ...firstAccountWithInvestment.Summary,
          Investment: {
            ...firstAccountWithInvestment.Summary.Investment,
            Holdings: {
              ...firstAccountWithInvestment.Summary.Investment.Holdings,
              Holding: convertedHoldings,
            },
          },
        },
      },
    ];

    // Navigate to chat view immediately
    setImportViewOpen(false);
    handleClose();

    // Call mutation to import holdings to chat
    if (consentType) {
      importHoldingsMut.mutate({ data: modifiedFiData, consentType });
    }
  };

  console.log(consent);
  

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={"text-xs"}
          disabled={!isDataReady}
        >
          <BarChart3 className="w-3 h-3 mr-1" />
          Analyse
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[min(96vw,80rem)] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {assetType} Holdings Preview
          </DialogTitle>
          <DialogDescription>
            Review, edit quantities, or add new holdings before analysis
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 px-1">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading holdings...</span>
              </div>
            )}

            {!isLoading && (
              <>
                {/* Search Bar */}
                <div className="sticky top-0 bg-white pt-2 pb-4 z-10 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder={`Search for ${assetType.toLowerCase()}s to add...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults(null);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {isSearching && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {searchResults && searchResults.length > 0 && (
                    <div className="border rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddSearchResult(result)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0"
                        >
                          <div className="flex-1">
                            {"symbol" in result ? (
                              <>
                                <div className="font-medium text-gray-900">
                                  {result.symbol}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {result.name}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="font-medium text-gray-900">
                                  {result.sName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {result.legalNames}
                                </div>
                              </>
                            )}
                          </div>
                          <Plus className="w-4 h-4 text-blue-600" />
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults && searchResults.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm border rounded-lg">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>

                {/* Summary Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">
                        Total Holdings
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {fields.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">
                        Asset Type
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {assetType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Holdings Table */}
                {fields.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No holdings found. Use the search bar above to add holdings.
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-[350px]">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            {consentType === ConsentType.EQUITIES ? (
                              <>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">
                                  Issuer
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">
                                  ISIN
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">
                                  Description
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-900">
                                  Quantity
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-900">
                                  Last Price
                                </th>
                                <th className="px-4 py-3 text-center font-medium text-gray-900 w-20">
                                  Action
                                </th>
                              </>
                            ) : (
                              <>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">
                                  Scheme
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">
                                  AMC
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">
                                  Folio No
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-900">
                                  Quantity
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-900">
                                  NAV
                                </th>
                                <th className="px-4 py-3 text-center font-medium text-gray-900 w-20">
                                  Action
                                </th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {fields.map((field, index) => (
                            <tr key={field.id} className="hover:bg-gray-50">
                              {consentType === ConsentType.EQUITIES ? (
                                <>
                                  <td className="px-4 py-3 text-gray-900">
                                    {field.issuerName || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                                    {field.isin || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-gray-900">
                                    {field.isinDescription || "-"}
                                  </td>
                                  <td className="px-4 py-3">
                                    <Controller
                                      control={control}
                                      name={`holdings.${index}.quantity`}
                                      rules={{
                                        required: true,
                                        min: 0,
                                      }}
                                      render={({ field: inputField }) => (
                                        <Input
                                          {...inputField}
                                          type="number"
                                          min="0"
                                          step="any"
                                          className="w-28 text-right ml-auto"
                                          onChange={(e) => {
                                            const value = parseFloat(
                                              e.target.value,
                                            );
                                            inputField.onChange(
                                              isNaN(value) ? 0 : value,
                                            );
                                          }}
                                        />
                                      )}
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-900">
                                    {field.lastTradedPrice || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => remove(index)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="px-4 py-3 text-gray-900">
                                    {field.schemeTypes || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-gray-900 max-w-xs truncate">
                                    {field.amc || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                                    {field.folioNo || "-"}
                                  </td>
                                  <td className="px-4 py-3">
                                    <Controller
                                      control={control}
                                      name={`holdings.${index}.quantity`}
                                      rules={{
                                        required: true,
                                        min: 0,
                                      }}
                                      render={({ field: inputField }) => (
                                        <Input
                                          {...inputField}
                                          type="number"
                                          min="0"
                                          step="any"
                                          className="w-28 text-right ml-auto"
                                          onChange={(e) => {
                                            const value = parseFloat(
                                              e.target.value,
                                            );
                                            inputField.onChange(
                                              isNaN(value) ? 0 : value,
                                            );
                                          }}
                                        />
                                      )}
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-900">
                                    {field.nav || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => remove(index)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="flex justify-between items-center mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={importHoldingsMut.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || fields.length === 0 || importHoldingsMut.isPending
              }
            >
              {importHoldingsMut.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding to Chat...
                </>
              ) : (
                "Add to Chat & Analyze"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
