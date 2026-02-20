import { z } from "zod";
import { Dispatch, SetStateAction } from "react";
import { ConsentType } from "./moneyone.enums";

export interface Consent {
  consentID: string;
  consentHandle: string;
  status: string;
  productID: string;
  accountID: string;
  aaId: string;
  vua: string;
  consentCreationData: string;
}

export type ImportHoldingsContextType = {
  showCreateConsentModal: boolean;
  setShowCreateConsentModal: Dispatch<SetStateAction<boolean>>;
  consentType: ConsentType;
};

export const createNewConsentFormSchema = z.object({
  number: z
    .string()
    .min(10)
    .max(10)
    .trim()
    .transform((val) => val.replaceAll(" ", "")),
  pan: z
    .string()
    .min(10)
    .max(10)
    .trim()
    .transform((val) => val.replaceAll(" ", "")),
});

export type CreateNewConsentFormValues = z.infer<
  typeof createNewConsentFormSchema
>;

export type ConsentRequestResponse = {
  status: string;
  ver: string;
  data: {
    status: string;
    consent_handle: string;
  };
};

export type ConsentRequestV3Response = {
  status: string;
  ver: string;
  message: string;
  data: {
    webRedirectionUrl: string;
    status: string;
    consent_handle: string;
  };
};

export type LinkRefNumber = {
  linkRefNumber: string;
  fiStatus: string;
  fipName: string;
  fipId: string;
  maskedAccountNumber: string;
};

export type DataReadyWebHookReqBody = {
  timestamp: string;
  consentHandle: string;
  eventType: string;
  eventStatus: string;
  consentId: string;
  vua: string;
  eventMessage: string;
  productID: string;
  accountID: string;
  fetchType: string;
  consentExpiry: string;
  dataExpiry: string;
  sessionId: string;
  firstTimeFetch: boolean;
  linkRefNumbers: LinkRefNumber[];
};

// Base holding type with common fields
export type BaseHolding = {
  ucc: string;
  isin: string;
  lienUnits: string;
  registrar: string;
  FatcaStatus: string;
  lockinUnits: string;
};

// Equity-specific holding fields
export type EquityHolding = BaseHolding & {
  units: string;
  issuerName: string;
  isinDescription: string;
  lastTradedPrice: string;
};

// Mutual Fund-specific holding fields
export type MutualFundHolding = BaseHolding & {
  amc: string;
  nav: string;
  folioNo: string;
  navDate: string;
  amfiCode: string;
  schemeCode: string;
  schemeTypes: string;
  closingUnits: string;
  schemeOption: string;
  schemeCategory: string;
  isinDescription: string;
};

// ETF-specific holding fields
export type ETFHolding = BaseHolding & {
  nav: string;
  units: string;
  folioNo: string;
  lastNavDate: string;
  isinDescription: string;
};

// Generic Holding type based on ConsentType
export type Holding<T extends ConsentType = ConsentType> =
  T extends ConsentType.EQUITIES ? EquityHolding :
  T extends ConsentType.MUTUAL_FUNDS ? MutualFundHolding :
  T extends ConsentType.ETF ? ETFHolding :
  EquityHolding | MutualFundHolding | ETFHolding; // Fallback for generic usage

// Legacy type for backwards compatibility (union of all holding types)
export type AnyHolding = EquityHolding | MutualFundHolding | ETFHolding;

export type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type FiDataAccountSummary = {
  costValue: string;
  currentValue: string;
  Investment: {
    Holdings: {
      Holding: AnyHolding[];
    };
  };
};

type AccountType = {
  linkReferenceNumber: string;
  maskedAccountNumber: string;
  fiType: string;
  bank: string;
  Summary?: FiDataAccountSummary;
  Profile?: {
    Holders: {
      type: string;
      Holder: Array<{
        dob: string;
        pan: string;
        name: string;
        email: string;
        mobile: string;
        address: string;
        nominee: string;
        landline: string;
        kycCompliance: string;
      }>;
    };
  };
};

export type FiDataResponse = AccountType[];

export type FiRequestResponse = {
  ver: string;
  timestamp: string;
  response: string;
  data: {
    consentId: string;
    sessionId: string;
  };
};
