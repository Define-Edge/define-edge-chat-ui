import * as z from "zod";

export const webRedirectionDecryptionApiReqParamsSchema = z.object({
  ecres: z.string(),
  resdate: z.string(),
  fi: z.string(),
});
