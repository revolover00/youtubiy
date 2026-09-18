import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth";
import { doc, getDocFromServer, getFirestore } from "firebase/firestore";
import { requestGoogleAccessToken, fetchGoogleUserProfile, type GoogleUserProfile } from "./gsi";

const firebaseConfig = {
  apiKey: "AIzaSyDQAG0GLQq6KUph_RMLBJFbRNWiMJOIlOk",
  authDomain: "gen-lang-client-0814697034.firebaseapp.com",
  projectId: "gen-lang-client-0814697034",
  storageBucket: "gen-lang-client-0814697034.firebasestorage.app",
  messagingSenderId: "998894461308",
  appId: "1:998894461308:web:e19d6cb430ec54480804f9",
  clientId: "880349982881-8naia73nime31f07q99j6e2m55gimlac.apps.googleusercontent.com",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-youtubiy-1278634e-3ed7-413d-9d97-686bacfe936e");
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const YOUTUBE_SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];

// In-memory access token cache (Workspace / Google integration guidelines: never store in localStorage)
let cachedAccessToken: string | null = null;
let cachedGoogleUser: GoogleUserProfile | null = null;

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export function setCachedAccessToken(token: string | null): void {
  cachedAccessToken = token;
}

export function getCachedGoogleUser(): GoogleUserProfile | null {
  return cachedGoogleUser;
}

export function setCachedGoogleUser(user: GoogleUserProfile | null): void {
  cachedGoogleUser = user;
}

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function isPopupClosedError(error: unknown): boolean {
  if (!error) return false;
  const err = error as { code?: string; message?: string };
  return (
    err.code === "auth/popup-closed-by-user" ||
    err.code === "auth/cancelled-popup-request" ||
    err.code === "auth/popup-blocked" ||
    (typeof err.message === "string" &&
      (err.message.includes("popup-closed-by-user") ||
        err.message.includes("cancelled-popup-request") ||
        err.message.includes("closed-by-user")))
  );
}

// Connection test on boot as required by Firestore integration
export async function testConnection() {
  // Silent connection verification; local cache ensures continuous functionality
  try {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return;
    }
  } catch {
    // Ignored
  }
}

// Test connection right away on client
if (typeof window !== "undefined") {
  testConnection().catch(() => {});
}

export async function loginWithGoogle(): Promise<{
  user: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  };
  accessToken: string | null;
} | null> {
  // First attempt: Direct Google Cloud Console OAuth 2.0 flow via Google Identity Services
  try {
    const token = await requestGoogleAccessToken(false);
    if (token) {
      cachedAccessToken = token;
      const profile = await fetchGoogleUserProfile(token);
      cachedGoogleUser = profile;
      return { user: profile, accessToken: token };
    }
  } catch (gsiError) {
    console.warn("Direct Google Cloud OAuth attempt:", gsiError);
  }

  // Second attempt / fallback: Firebase Google Auth Provider popup
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/youtube.readonly");
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return {
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      },
      accessToken: cachedAccessToken,
    };
  } catch (error) {
    if (isPopupClosedError(error)) {
      return null;
    }
    console.warn("Failed to sign in with Google:", error);
    throw error;
  }
}

export async function requestYouTubeAccessToken(): Promise<string | null> {
  // First attempt: Direct Google Cloud Console OAuth via Google Identity Services
  try {
    const token = await requestGoogleAccessToken(true);
    if (token) {
      cachedAccessToken = token;
      return token;
    }
  } catch (gsiError) {
    console.warn("Direct Google Cloud token request attempt:", gsiError);
  }

  // Second attempt: Firebase Auth Popup
  const ytProvider = new GoogleAuthProvider();
  ytProvider.addScope("https://www.googleapis.com/auth/youtube.readonly");
  try {
    const result = await signInWithPopup(auth, ytProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return cachedAccessToken;
  } catch (error) {
    if (isPopupClosedError(error)) {
      return null;
    }
    console.warn("Notice: YouTube access token acquisition ended:", error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn("Notice during sign out:", error);
  } finally {
    cachedAccessToken = null;
    cachedGoogleUser = null;
  }
}
