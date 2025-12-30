"use server";
import { ReasonPhrases } from "http-status-codes";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { ConsentType } from "./moneyone.enums";
import { moneyOneAuthHeaders } from "./moneyone.headers";
import { webRedirectionDecryptionApiReqParamsSchema } from "./moneyone.schema";
import {
  Consent,
  ConsentRequestResponse,
  ConsentRequestV3Response,
  FiDataResponse,
  FiRequestResponse,
} from "./moneyone.types";
import { getErrMsgKey } from "./moneyone.utils";

const consentFormMap = {
  [ConsentType.EQUITIES]: process.env.MONEY_ONE_EQUITIES_CONSENT_FORM,
  [ConsentType.MUTUAL_FUNDS]: process.env.MONEY_ONE_MUTUAL_FUNDS_CONSENT_FORM,
} as const;

const consentFipIdsMap = {
  [ConsentType.EQUITIES]: (process.env.MONEY_ONE_EQUITIES_FIPS as string).split(
    ",",
  ),
  [ConsentType.MUTUAL_FUNDS]: (
    process.env.MONEY_ONE_MUTUAL_FUNDS_FIPS as string
  ).split(","),
} as const;

export const createConsentRequest = async (
  mobileNo: string,
  consentType: ConsentType,
  accountID: string, // Browser-unique user ID from localStorage
): Promise<{ error: string } | ConsentRequestResponse> => {
  const body = JSON.stringify({
    partyIdentifierType: "MOBILE",
    partyIdentifierValue: mobileNo,
    productID: consentFormMap[consentType],
    accountID: accountID,
    vua: `${mobileNo}@onemoney`,
  });

  const url = `${process.env.MONEY_ONE_BASE_URL}/v2/requestconsent`;

  try {
    if (process.env.NODE_ENV === "development")
      console.log("---Making consent request ~ body:", body);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...moneyOneAuthHeaders,
      },
      body,
    });

    if (!response.ok) {
      if (response.status === 503)
        throw new Error("503 Service Temporarily Unavailable");
      throw await response.json();
    }

    const res: ConsentRequestResponse = await response.json();
    if (process.env.NODE_ENV === "development")
      console.log("---Consent created ~ /v2/requestconsent", res);

    return res;
  } catch (error) {
    console.error("---Error occurred while creating consent", error);

    // Extract error message from MoneyOne API response or Error object
    const message =
      error instanceof Error
        ? error.message
        : getErrMsgKey(error, "errorMsg") || ReasonPhrases.INTERNAL_SERVER_ERROR;

    return { error: message };
  }
};

export const createConsentRequestV3 = async (
  mobileNo: string,
  consentType: ConsentType,
  accountID: string,
  pan: string,
  redirectUrl: string,
): Promise<{ error: string } | ConsentRequestV3Response> => {
  const body = JSON.stringify({
    partyIdentifierType: "MOBILE",
    partyIdentifierValue: mobileNo,
    productID: consentFormMap[consentType],
    vua: `${mobileNo}@onemoney`,
    accountID: accountID,
    fipID: consentFipIdsMap[consentType],
    pan: pan,
    redirectUrl: redirectUrl,
  });

  const url = `${process.env.MONEY_ONE_BASE_URL}/v3/requestconsent`;

  try {
    if (process.env.NODE_ENV === "development")
      console.log("---Making v3 consent request ~ body:", body);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...moneyOneAuthHeaders,
      },
      body,
    });

    if (!response.ok) {
      if (response.status === 503)
        throw new Error("503 Service Temporarily Unavailable");
      throw await response.json();
    }

    const res: ConsentRequestV3Response = await response.json();
    if (process.env.NODE_ENV === "development")
      console.log("---Consent created v3 ~ /v3/requestconsent", res);

    return res;
  } catch (error) {
    console.error("---Error occurred while creating v3 consent", error);

    // Extract error message from MoneyOne API response or Error object
    const message =
      error instanceof Error
        ? error.message
        : getErrMsgKey(error, "errorMsg") || ReasonPhrases.INTERNAL_SERVER_ERROR;

    return { error: message };
  }
};

export const getEncryptedUrl = async (
  consentHandle: string,
  redirectUrl: string,
  pan: string,
  consentType: ConsentType,
) => {
  try {
    const body = JSON.stringify({
      consentHandle,
      redirectUrl,
      fipID: consentFipIdsMap[consentType],
      pan,
    });

    const url = `${process.env.MONEY_ONE_BASE_URL}/webRedirection/getEncryptedUrl`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...moneyOneAuthHeaders,
      },
      body,
    }).then((res) => res.json());

    if (response?.status !== "success") throw response;
    if (process.env.NODE_ENV === "development")
      console.log("🚀 ~ /webRedirection/getEncryptedUrl ~ response:", response);

    redirect(response.data.webRedirectionUrl);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: ReasonPhrases.INTERNAL_SERVER_ERROR };
  }
};

export const getConsentList = async (
  consentHandle: string,
  mobileNo: string,
  consentType: ConsentType,
  accountID: string, // Browser-unique user ID from localStorage
): Promise<Consent | null> => {
  const body = JSON.stringify({
    partyIdentifierType: "MOBILE",
    partyIdentifierValue: mobileNo,
    productID: consentFormMap[consentType],
    accountID: accountID,
  });

  const url = `${process.env.MONEY_ONE_BASE_URL}/v2/getconsentslist`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...moneyOneAuthHeaders,
    },
    method: "POST",
    body,
  }).then((res) => res.json());

  if (response.status === "success" && Array.isArray(response.data)) {
    const consentsList = response.data;
    const consent: Consent = consentsList.find(
      (c: Consent) => c.consentHandle === consentHandle,
    );
    if (!consent) throw new Error("Consent not found");
    if (process.env.NODE_ENV === "development")
      console.log("Consent found in list: ", consent);

    return consent;
  }
  return null;
};

export const decryptUrl = async (values?: Record<string, string>) => {
  try {
    const validatedParams =
      webRedirectionDecryptionApiReqParamsSchema.safeParse(values);
    if (validatedParams.success) {
      const url = `${process.env.MONEY_ONE_BASE_URL}/webRedirection/decryptUrl`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...moneyOneAuthHeaders,
        },
        body: JSON.stringify({
          webRedirectionURL: validatedParams.data,
        }),
      }).then((res) => res.json());

      if (response?.status !== "success") throw response;

      if (response?.data?.status === "S") {
        if (process.env.NODE_ENV === "development")
          console.log("---Decrypted data found from url", response?.data);
        return response?.data;
      }
    }
  } catch (err) {
    console.error("---Error occurred while decrypting url data", err);
    return null;
  }
};

export const getAllFiData = async (consentID: string, waitTime?: number) => {
  const url = `${process.env.MONEY_ONE_BASE_URL}/getallfidata`;

  try {
    if (process.env.NODE_ENV === "development")
      console.log("---Fetching fiData for consent id", consentID);

    const body = JSON.stringify({
      consentID,
    });

    if (waitTime && waitTime > 0) {
      if (process.env.NODE_ENV === "development")
        console.log(`---Waiting for ${waitTime}ms before fetching fiData`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...moneyOneAuthHeaders,
      },
      method: "POST",
      body,
    }).then((res) => res.json());

    if (response?.errorCode === "NoDataFound") throw response;

    if (response?.status === "success") {
      if (!response.data.some((item: any) => item.Summary))
        throw new Error("NoDataFound");
      if (process.env.NODE_ENV === "development")
        console.log("---Fetched fi data", response);
      return response.data as FiDataResponse;
    }

    throw response;
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : getErrMsgKey(e, "errorMsg") || ReasonPhrases.INTERNAL_SERVER_ERROR;
    return { error: message };
  }
};

export const requestFiData = async (
  consentId: string,
): Promise<FiRequestResponse | { error: string }> => {
  const url = `${process.env.MONEY_ONE_BASE_URL}/fi/request`;

  try {
    if (process.env.NODE_ENV === "development")
      console.log("---Requesting FI data for consent id", consentId);

    const body = JSON.stringify({
      consentId,
    });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...moneyOneAuthHeaders,
      },
      method: "POST",
      body,
    });

    if (!response.ok) {
      if (response.status === 503)
        throw new Error("503 Service Temporarily Unavailable");
      throw await response.json();
    }

    const res: FiRequestResponse = await response.json();

    if (res.response !== "ok") {
      throw new Error("FI request failed");
    }

    if (process.env.NODE_ENV === "development")
      console.log("---FI request successful", res);

    return res;
  } catch (e) {
    console.error("---Error occurred while requesting FI data", e);
    const message =
      e instanceof Error
        ? e.message
        : getErrMsgKey(e, "errorMsg") || ReasonPhrases.INTERNAL_SERVER_ERROR;
    return { error: message };
  }
};
