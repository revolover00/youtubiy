import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  auth,
  getCachedAccessToken,
  isPopupClosedError,
  loginWithGoogle,
  logoutUser,
  requestYouTubeAccessToken,
} from "./firebase";
import { syncUserProfile } from "./store";
import { importYouTubeUserData, type YouTubeImportResult } from "./youtubeApi";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  importingYouTube: boolean;
  lastImportResult: YouTubeImportResult | null;
  signIn: () => Promise<User | null>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [importingYouTube, setImportingYouTube] = useState(false);
  const [lastImportResult, setLastImportResult] = useState<YouTubeImportResult | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        try {
          await syncUserProfile(currentUser);
        } catch (err) {
          console.warn("User profile sync notice:", err);
        }
      }
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

  const signIn = async (): Promise<User | null> => {
    try {
      const res = await loginWithGoogle();
      if (res?.user) {
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
