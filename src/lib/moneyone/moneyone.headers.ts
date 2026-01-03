export const moneyOneAuthHeaders = {
  client_id: process.env.MONEY_ONE_CLIENT_ID || "",
  client_secret: process.env.MONEY_ONE_CLIENT_SECRET || "",
  organisationId: process.env.MONEY_ONE_ORG_ID || "",
  appIdentifier: process.env.MONEY_ONE_APP_IDENTIFIER || "",
};
