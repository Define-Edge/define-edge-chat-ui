// DefineEdge Scanner API Types

export type Segment = "0" | "2" | "-1"; // 0 for NSE, 2 for BSE, -1 for both
export type GroupType = "predefined" | "userdefined";
export type ShowOnlyLatestQuarterData = "0" | "1";

export type ScannerRatio = {
  dbId: number;
  ratio: string;
  currentAlias: string;
  aliases: string;
  groupNames: string;
  ratioTypeInGroup: string;
  sq: number;
  unit: string;
  tooltip: string;
  mainRatio: string;
  dtype: number;
};

export type PredefinedGroups = {
  [groupName: string]: string[];
};

export type ScannerResultsParams = {
  searchQuery?: string;
  id?: number;
  pageNumber?: number;
  pageSize?: number;
  segment?: Segment;
  groupType?: GroupType;
  group?: string;
  showOnlyLatestQuarterData?: ShowOnlyLatestQuarterData;
  fixedColumns?: string;
  sort?: string;
};

export type PaginationResult = {
  content: Record<string, any>[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
};

export type ScannerResultsResponse = {
  columns?: string;
  searchQuery?: string;
  userActualQuery?: string;
  paginationResult?: PaginationResult;
};

export type ExistingScannerResultsResponse = ScannerResultsResponse;
