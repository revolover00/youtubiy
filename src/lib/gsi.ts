/**
 * Google Identity Services (GSI) OAuth 2.0 Integration
 * Allows authenticating directly with Google Cloud Console OAuth 2.0 Client ID
 * and obtaining an access token with YouTube Data scopes.
 */

export const GOOGLE_CLIENT_ID =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_CLIENT_ID) ||
  "880349982881-8naia73nime31f07q99j6e2m55gimlac.apps.googleusercontent.com";

export const YOUTUBE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/youtube.readonly",
].join(" ");

export interface GoogleUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

let gsiScriptLoadedPromise: Promise<void> | null = null;

/**
 * Dynamically loads the official Google Identity Services (GSI) client script
 */
export function loadGsiScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not defined"));
  }

  // Already loaded
  if (
    (window as unknown as { google?: { accounts?: { oauth2?: unknown } } }).google?.accounts?.oauth2
  ) {
    return Promise.resolve();
  }

  if (gsiScriptLoadedPromise) {
    return gsiScriptLoadedPromise;
  }

  gsiScriptLoadedPromise = new Promise((resolve, reject) => {
    // Check if script tag already exists
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  return gsiScriptLoadedPromise;
}

/**
 * Requests an OAuth 2.0 Access Token with YouTube scopes using Google Cloud Console Client ID
 */
export async function requestGoogleAccessToken(promptConsent = false): Promise<string> {
  await loadGsiScript();

  const google = (
    window as unknown as {
      google: {
        accounts: {
          oauth2: {
            initTokenClient: (config: {
              client_id: string;
              scope: string;
              callback: (response: { access_token?: string; error?: string }) => void;
              error_callback?: (err: unknown) => void;
              prompt?: string;
            }) => {
              requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
            };
          };
        };
      };
    }
  ).google;

  if (!google?.accounts?.oauth2?.initTokenClient) {
    throw new Error("Google Identity Services not loaded");
  }

  return new Promise((resolve, reject) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: YOUTUBE_SCOPES,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error("No access token returned from Google"));
        }
      },
      error_callback: (err) => {
        reject(err);
      },
      prompt: promptConsent ? "consent" : "",
    });

    client.requestAccessToken(promptConsent ? { prompt: "consent" } : undefined);
  });
}

/**
 * Fetches user profile information from Google People/Userinfo API using the access token
 */
export async function fetchGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user profile: ${res.statusText}`);
  }

  const data = (await res.json()) as {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
  };

  return {
    uid: data.sub,
    email: data.email || null,
    displayName: data.name || null,
    photoURL: data.picture || null,
  };
}
