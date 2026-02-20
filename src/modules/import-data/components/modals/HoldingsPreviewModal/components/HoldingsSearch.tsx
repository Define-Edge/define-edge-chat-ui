"use client";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, X } from "lucide-react";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import {
  StockSearchResponse,
  MutualFundSearchResponse,
} from "@/types/search-api.types";
import { useHoldingsSearch } from "../hooks/useHoldingsSearch";
import { getAssetTypeName } from "../utils/holdings-transformer";

type HoldingsSearchProps = {
  /** Consent type to determine search endpoint and display */
  consentType: ConsentType;
  /** Callback when a search result is selected */
  onSelectResult: (
    result:
      | StockSearchResponse["results"][0]
      | MutualFundSearchResponse["results"][0],
  ) => void;
};

/**
 * Search component for adding new holdings
 * Uses React Query for automatic caching and loading states
 */
export function HoldingsSearch({
  consentType,
  onSelectResult,
}: HoldingsSearchProps) {
  const { searchQuery, setSearchQuery, searchResults, isSearching, error } =
    useHoldingsSearch(consentType);

  const assetType = getAssetTypeName(consentType).toLowerCase();

  const handleSelectResult = (
    result:
      | StockSearchResponse["results"][0]
      | MutualFundSearchResponse["results"][0],
  ) => {
    onSelectResult(result);
    setSearchQuery("");
  };

  return (
    <div className="sticky top-0 bg-white pt-2 pb-4 z-10 space-y-2">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={`Search for ${assetType}s to add...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
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
              onClick={() => handleSelectResult(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0"
            >
              <div className="flex-1">
                {"symbol" in result ? (
                  <>
                    <div className="font-medium text-gray-900">
                      {result.symbol}
                    </div>
                    <div className="text-sm text-gray-600">{result.compname}</div>
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

      {/* Error Message */}
      {error && searchQuery.trim() && (
        <div className="text-center py-4 text-red-500 text-sm border border-red-200 rounded-lg bg-red-50">
          Search failed. Please try again.
        </div>
      )}

      {/* No Results Message */}
      {!error && searchResults && searchResults.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm border rounded-lg">
          No results found for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
