// AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  User,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

// firestoreHelpers (!db)

interface UserProfileInterface {
  email: string;
  createdAt: Timestamp;
  first_name: string;
  last_name: string;
}

export async function createUserProfile(
  userId: string,
  data: UserProfileInterface
) {
  const dbData = {
    createdAt: Timestamp.now(),
    ...data,
  };
  const userDocRef = doc(db, "users", userId);
  return await setDoc(userDocRef, dbData);
}

interface AuthContextType {
  signIn: (method: string, credentials: any) => void;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  currentUser?: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  forgotPassword: async () => {},
  resendVerificationEmail: async () => {},
  currentUser: null,
  isLoading: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (
    method: string,
    credentials: { email?: string; password?: string; idToken?: string }
  ) => {
    try {
      if (method === "email") {
        const { email, password } = credentials;
        await signInWithEmailAndPassword(auth, email!, password!);
      } else if (method === "google") {
        const { idToken } = credentials;
        const googleCredential = GoogleAuthProvider.credential(idToken!);
        await signInWithCredential(auth, googleCredential);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        await sendEmailVerification(user);
        console.log("Verification email sent. Please check your inbox.");

        // Create user profile in Firestore
        await createUserProfile(user.uid, {
          email: user.email,
          createdAt: Timestamp.now(),
          first_name: "",
          last_name: "",
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        console.log("Verification email resent.");
      } else {
        console.log("No user is signed in.");
      }
    } catch (error: any) {
      console.error("Error resending verification email:", error.message);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        signUp,
        forgotPassword,
        resendVerificationEmail,
        currentUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
