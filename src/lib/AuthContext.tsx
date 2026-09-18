import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getCachedAccessToken,
  getCachedGoogleUser,
  isPopupClosedError,
  loginWithGoogle,
  logoutUser,
  requestYouTubeAccessToken,
} from "./firebase";
import { syncUserProfile } from "./store";
import { importYouTubeUserData, type YouTubeImportResult } from "./youtubeApi";
import type { AppUser } from "./types";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  importingYouTube: boolean;
  lastImportResult: YouTubeImportResult | null;
  signIn: () => Promise<AppUser | null>;
  signOut: () => Promise<void>;
  syncYouTubeData: () => Promise<YouTubeImportResult | null>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  importingYouTube: false,
  lastImportResult: null,
  signIn: async () => null,
  signOut: async () => {},
  syncYouTubeData: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [importingYouTube, setImportingYouTube] = useState(false);
  const [lastImportResult, setLastImportResult] = useState<YouTubeImportResult | null>(null);

  useEffect(() => {
    // Check if we already have a cached Google Cloud Console user in session
    const cached = getCachedGoogleUser();
    if (cached) {
      setUser(cached);
      setLoading(false);
    }

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const mappedUser: AppUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
        setUser(mappedUser);
        try {
          await syncUserProfile(mappedUser);
        } catch (err) {
          console.warn("User profile sync notice:", err);
        }
      } else {
        // If not signed into Firebase, keep GSI cached user if available
        const currentGsi = getCachedGoogleUser();
        if (currentGsi) {
          setUser(currentGsi);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const performYouTubeImport = async (token: string): Promise<YouTubeImportResult | null> => {
    try {
      setImportingYouTube(true);
      const result = await importYouTubeUserData(token);
      setLastImportResult(result);
      // Dispatch an event so App and feeds can refresh
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("yt:subscriptions-synced", { detail: result }));
      }
      return result;
    } catch (err) {
      console.warn("YouTube import notice:", err);
      throw err;
    } finally {
      setImportingYouTube(false);
    }
  };

  const signIn = async (): Promise<AppUser | null> => {
    try {
      const res = await loginWithGoogle();
      if (res?.user) {
        setUser(res.user);
        try {
          await syncUserProfile(res.user);
        } catch (err) {
          console.warn("User profile sync notice:", err);
        }
        if (res.accessToken) {
          try {
            await performYouTubeImport(res.accessToken);
          } catch (err) {
            console.warn("Auto-sync YouTube on sign-in failed:", err);
          }
        }
        return res.user;
      }
      return null;
    } catch (err) {
      if (!isPopupClosedError(err)) {
        console.warn("Sign in ended:", err);
      }
      return null;
    }
  };

  const syncYouTubeData = async (): Promise<YouTubeImportResult | null> => {
    try {
      let token = getCachedAccessToken();
      if (!token) {
        token = await requestYouTubeAccessToken();
      }
      if (token) {
        return await performYouTubeImport(token);
      }
      return null;
    } catch (err) {
      if (isPopupClosedError(err)) {
        return null;
      }
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
      setUser(null);
      setLastImportResult(null);
    } catch (err) {
      console.warn("Sign out ended:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        importingYouTube,
        lastImportResult,
        signIn,
        signOut,
        syncYouTubeData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
