import { DataReadyWebHookReqBody } from "@/lib/moneyone/moneyone.types";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const productIdToConsentTypeMap: { [productId: string]: ConsentType } = {};

if (process.env.MONEY_ONE_EQUITIES_CONSENT_FORM) {
  productIdToConsentTypeMap[process.env.MONEY_ONE_EQUITIES_CONSENT_FORM] =
    ConsentType.EQUITIES;
}
if (process.env.MONEY_ONE_MUTUAL_FUNDS_CONSENT_FORM) {
  productIdToConsentTypeMap[process.env.MONEY_ONE_MUTUAL_FUNDS_CONSENT_FORM] =
    ConsentType.MUTUAL_FUNDS;
}
if (process.env.MONEY_ONE_SIP_CONSENT_FORM) {
  productIdToConsentTypeMap[process.env.MONEY_ONE_SIP_CONSENT_FORM] =
    ConsentType.SIP;
}

export async function POST(request: Request) {
  try {
    const body: DataReadyWebHookReqBody = await request.json();
    if (process.env.NODE_ENV === "development")
      console.log("🚀 ~ POST ~ body: DataReadyWebHookReqBody:", body);

    if (!body.consentId || !body.accountID)
      throw new Error("consentId or accountID not present in body");

    if (body?.eventStatus === "DATA_READY") {
      const mobileNo = body.vua.split("@")[0];
      const consentType = productIdToConsentTypeMap[body.productID];

      if (!consentType) {
        console.warn("Unknown productID:", body.productID);
      }

      console.log("Data ready webhook received:", {
        consentID: body.consentId,
        consentType,
        mobileNo,
        accountID: body.accountID,
      });

      // Note: Cannot update localStorage from server-side
      // Client will mark data as ready when fetching
      // This webhook is mainly for logging/monitoring purposes now
    }

    return Response.json({ status: "success" }, { status: StatusCodes.OK });
  } catch (err: unknown) {
    console.error("MoneyOne data-ready webhook error:", err);
    const message =
      err instanceof Error ? err.message : ReasonPhrases.INTERNAL_SERVER_ERROR;
    return Response.json(
      { error: message },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}

// /api/webhooks/moneyone/data-ready