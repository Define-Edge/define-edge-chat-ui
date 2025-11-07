export interface BboxCoordinates {
  r: number; // right
  t: number; // top
  l: number; // left
  b: number; // bottom
  coord_origin: "BOTTOMLEFT" | "TOPLEFT";
}

export interface CitationData {
  citationId: string;
  ticker: string;
  page: number;
  filename: string;
  fincode: string;
  category: string;
  documentDate: string;
  bbox: BboxCoordinates;
  headings: string[];
}

export interface CitationButtonProps {
  "data-citation-id": string;
  "data-ticker": string;
  "data-page": string;
  "data-filename": string;
  "data-fincode": string;
  "data-category": string;
  "data-document-date": string;
  "data-bbox": string; // JSON string
  "data-headings": string; // JSON string
  children: React.ReactNode;
}
