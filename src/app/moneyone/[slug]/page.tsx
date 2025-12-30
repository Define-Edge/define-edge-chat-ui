import {
  decryptUrl,
  getConsentList,
  // requestFiData
} from "@/lib/moneyone/moneyone.actions";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { webRedirectionDecryptionApiReqParamsSchema } from "@/lib/moneyone/moneyone.schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function page({ params, searchParams }: Props) {
  // Await params and searchParams (Next.js 15 requirement)
  const { slug } = await params;
  const searchParamsData = await searchParams;

  const slugParts = slug.split("~");

  // Slug pattern: {consentType}~{accountID} or {consentType}~{accountID}~{threadId}
  // Using ~ as delimiter since accountID and threadID may contain dashes
  if (!Object.values(ConsentType).includes(slugParts[0] as ConsentType))
    return <div>Invalid slug</div>;

  const consentType = slugParts[0] as ConsentType;
  const accountID = slugParts[1];
  const threadId = slugParts[2];

  if (!accountID) {
    return <div>Missing account ID in URL</div>;
  }

  const validatedData =
    webRedirectionDecryptionApiReqParamsSchema.safeParse(searchParamsData);

  if (!validatedData.success) {
    return <div>Invalid search params</div>;
  }

  const decryptedUrlData = await decryptUrl(validatedData.data);

  if (decryptedUrlData) {
    try {
      const mobileNo: string = decryptedUrlData.userid.split("@")[0];

      // Get pending consent handle from localStorage on client side
      // For now, we'll use the srcref from decrypted data
      const consentHandle = decryptedUrlData.srcref;

      const consent = await getConsentList(
        consentHandle,
        mobileNo,
        consentType,
        accountID,
      );

      if (!consent) return <div>Consent not found</div>;

      const consentID = consent.consentID;
      if (!consentID) return <div>Invalid consent ID</div>;

      // Request FI data from Account Aggregator
      // Hmm this is not required as we've set
      // DATA FETCH AND PERIODICITY to Periodic
      // Data Request Mode : Manual
      // Do First Time Data Request Automatic is set to true
      // const fiRequestResult = await requestFiData(consentID);

      // if ("error" in fiRequestResult) {
      //   console.error("FI request failed:", fiRequestResult.error);
      //   // Continue with redirect even if FI request fails
      //   // The data flow is asynchronous, so we don't wait for the actual FI data
      // } else if (process.env.NODE_ENV === "development") {
      //   console.log("FI request initiated successfully:", fiRequestResult);
      // }

      // Redirect with consent data as search params
      const redirectUrlParams = new URLSearchParams();
      redirectUrlParams.set("consentID", consentID);
      redirectUrlParams.set("consentType", consentType);
      redirectUrlParams.set("mobileNo", mobileNo);
      redirectUrlParams.set("consentCreationData", consent.consentCreationData);
      redirectUrlParams.set("importViewOpen", "true");
      if (threadId) redirectUrlParams.set("threadId", threadId);

      redirect(`/?${redirectUrlParams.toString()}`);
    } catch (error) {
      if (isRedirectError(error)) throw error;
      console.error("Error processing consent redirect:", error);
      return <div>Error processing consent</div>;
    }
  }

  return null;
}
