import type {
  ScannerResultsParams,
  ScannerResultsResponse,
  ScannerRatio,
  PredefinedGroups,
} from '@/types/definedge-scanner';

const BASE_PROXY_URL = '/definedge/api';

/**
 * Fetch scanner results based on search query
 */
export async function getScannerResults(
  params: ScannerResultsParams
): Promise<ScannerResultsResponse> {
  const searchParams = new URLSearchParams();

  if (params.searchQuery) {
    searchParams.append('searchQuery', encodeURIComponent(params.searchQuery));
  }
  if (params.pageNumber !== undefined) {
    searchParams.append('pageNumber', String(params.pageNumber));
  }
  if (params.pageSize !== undefined) {
    searchParams.append('pageSize', String(params.pageSize));
  }
  if (params.segment !== undefined) {
    searchParams.append('segment', params.segment);
  }
  if (params.groupType !== undefined) {
    searchParams.append('groupType', params.groupType);
  }
  if (params.group) {
    searchParams.append('group', params.group);
  }
  if (params.showOnlyLatestQuarterData !== undefined) {
    searchParams.append('showOnlyLatestQuarterData', params.showOnlyLatestQuarterData);
  }
  if (params.fixedColumns) {
    searchParams.append('fixedColumns', params.fixedColumns);
  }
  if (params.sort) {
    searchParams.append('sort', params.sort);
  }

  const url = `${BASE_PROXY_URL}/v1/data-feed/search?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch scanner results: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch existing scanner results by ID
 */
export async function getExistingScannerResults(
  params: ScannerResultsParams & { id: number }
): Promise<ScannerResultsResponse> {
  const searchParams = new URLSearchParams();

  searchParams.append('id', String(params.id));
  if (params.pageNumber !== undefined) {
    searchParams.append('pageNumber', String(params.pageNumber));
  }
  if (params.pageSize !== undefined) {
    searchParams.append('pageSize', String(params.pageSize));
  }
  if (params.segment !== undefined) {
    searchParams.append('segment', params.segment);
  }
  if (params.groupType !== undefined) {
    searchParams.append('groupType', params.groupType);
  }
  if (params.group) {
    searchParams.append('group', params.group);
  }
  if (params.showOnlyLatestQuarterData !== undefined) {
    searchParams.append('showOnlyLatestQuarterData', params.showOnlyLatestQuarterData);
  }
  if (params.fixedColumns) {
    searchParams.append('fixedColumns', params.fixedColumns);
  }
  if (params.sort) {
    searchParams.append('sort', params.sort);
  }

  const url = `${BASE_PROXY_URL}/v1/data-feed/getExistingScannerResults?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch existing scanner results: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch predefined groups
 */
export async function getPredefinedGroups(): Promise<PredefinedGroups> {
  const url = `${BASE_PROXY_URL}/v1/data-feed/groups/0`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch predefined groups: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch scanner ratios
 */
export async function getScannerRatios(): Promise<ScannerRatio[]> {
  const url = `${BASE_PROXY_URL}/v1/data-feed/scannerRatioList`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch scanner ratios: ${response.statusText}`);
  }

  return response.json();
}
