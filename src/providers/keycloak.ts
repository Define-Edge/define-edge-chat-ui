
// keycloak.ts
import Keycloak from "keycloak-js";

// ✅ Always initialize Keycloak (never null)
const keycloak = new Keycloak({
  url: "https://signin.definedgebroking.com/auth",
  realm: "debroking",
  clientId: "TRAI", // public client
});

// ✅ Patch fetch for token requests to avoid CORS errors
if (typeof window !== "undefined") {
  const originalFetch = window.fetch.bind(window);

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.includes("/protocol/openid-connect/")) {
      return originalFetch(input, { ...init, credentials: "omit" });
    }
    return originalFetch(input, init);
  };
}

export default keycloak;
