"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  createContext,
} from "react";
import keycloak from "./keycloak";

const TOKEN_REFRESH_INTERVAL = 30_000; // check every 30s
const TOKEN_MIN_VALIDITY = 60; // refresh if less than 60s remaining

// Context to share Keycloak state
// eslint-disable-next-line react-refresh/only-export-components
export const KeycloakContext = createContext<{
  keycloak: typeof keycloak;
  authenticated: boolean;
  token: string | undefined;
}>({
  keycloak: null as unknown as typeof keycloak,
  authenticated: false,
  token: undefined,
});

export const KeycloakProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const refreshToken = useCallback(async () => {
    if (!keycloak?.authenticated) return;
    try {
      const refreshed = await keycloak.updateToken(TOKEN_MIN_VALIDITY);
      if (refreshed) {
        setToken(keycloak.token);
      }
    } catch {
      // Token refresh failed — session expired, force re-login
      keycloak.login();
    }
  }, []);

  useEffect(() => {
    if (!keycloak) return;

    keycloak
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        checkLoginIframe: false,
        redirectUri:
          typeof window !== "undefined" ? window.location.origin : "",
        enableLogging: true,
      })
      .then((auth) => {
        if (auth) {
          setAuthenticated(true);
          setToken(keycloak.token);

          // Set up periodic token refresh
          refreshIntervalRef.current = setInterval(
            refreshToken,
            TOKEN_REFRESH_INTERVAL,
          );
        } else {
          keycloak.login();
        }
      })
      .catch((err) => console.error("Keycloak init failed", err));

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refreshToken]);

  if (!authenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Redirecting to Definedge AI login...
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we secure your session.
        </p>
        <div className="mt-4 h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, token }}>
      {children}
    </KeycloakContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useKeycloak() {
  const context = React.useContext(KeycloakContext);
  if (!context) {
    throw new Error("useKeycloak must be used within a KeycloakProvider");
  }
  return context;
}
