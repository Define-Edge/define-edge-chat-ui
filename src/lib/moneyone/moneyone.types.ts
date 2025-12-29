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
  handlePfAction: (data: FiDataResponse, consentType: ConsentType) => void;
};

export const createNewConsentFormSchema = z.object({
  number: z
    .string()
    .min(10)
    .max(10)
    .trim()
    .transform((val) => val.replace(" ", "")),
  pan: z
    .string()
    .min(10)
    .max(10)
    .trim()
    .transform((val) => val.replace(" ", "")),
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

export type Holding = {
  amc: string;
  nav: string;
  ucc: string;
  isin: string;
  folioNo: string;
  navDate: string;
  amfiCode: string;
  lienUnits: string;
  registrar: string;
  schemeCode: string;
  FatcaStatus: string;
  lockinUnits: string;
  schemeTypes: string;
  closingUnits: string;
  schemeOption: string;
  schemeCategory: string;
  // Equity stock keys
  units: string;
  issuerName: string;
  isinDescription: string;
  lastTradedPrice: string;
};

export type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type FiDataAccountSummary = {
  costValue: string;
  currentValue: string;
  Investment: {
    Holdings: {
      Holding: Holding[];
    };
  };
};

type AccountType = {
  linkReferenceNumber: string;
  maskedAccountNumber: string;
  fiType: string;
  bank: string;
  Summary?: FiDataAccountSummary;
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
