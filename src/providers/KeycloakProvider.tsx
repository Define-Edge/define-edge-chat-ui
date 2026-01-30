"use client";

import React, { useEffect, useState, createContext } from "react";
import keycloak from "./keycloak";

// Context to share Keycloak state
export const KeycloakContext = createContext<{
  keycloak: any;
  authenticated: boolean;
}>({
  keycloak: null,
  authenticated: false,
});

export const KeycloakProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!keycloak) return;

    keycloak
      .init({
        onLoad: "login-required",           // redirect to login if not authenticated
        pkceMethod: "S256",                 // PKCE for frontend-only public client
        checkLoginIframe: false,            // disables iframe CORS checks
        redirectUri: typeof window !== "undefined" ? window.location.origin : "",
        enableLogging: true,                // optional: helpful for debugging
      })
      .then((auth) => {
        if (auth) {
          setAuthenticated(true);
          // Optional: you can log token info
          console.log("✅ Logged in:", keycloak.tokenParsed);
          console.log("🪙 JWT Token:", keycloak.token);
        } else {
          // fallback: force login
          keycloak.login();
        }
      })
      .catch((err) => console.error("❌ Keycloak init failed", err));
  }, []);

  if (!authenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Redirecting to Definedge AI login...
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we secure your session.
        </p>
        <div className="mt-4 h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated }}>
      {children}
    </KeycloakContext.Provider>
  );
};
