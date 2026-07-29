"use server";

import { redirect } from "next/navigation";
import {
  getAuthErrorMessage,
  signInWithPassword,
  signOutCurrentUser,
  signUpWithPassword,
} from "@/lib/supabase/auth";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function authRedirect(path: string, key: "error" | "message", value: string): never {
  redirect(`${path}?${key}=${encodeURIComponent(value)}`);
}

export async function signInAction(formData: FormData) {
  const email = getFormValue(formData, "email");
  const password = getFormValue(formData, "password");

  if (!email || !password) {
    authRedirect("/auth/login", "error", "Email and password are required.");
  }

  try {
    await signInWithPassword(email, password);
  } catch (error) {
    authRedirect("/auth/login", "error", getAuthErrorMessage(error));
  }

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const email = getFormValue(formData, "email");
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");
  let needsEmailConfirmation = false;

  if (!email || !password || !confirmPassword) {
    authRedirect("/auth/signup", "error", "All fields are required.");
  }

  if (password.length < 6) {
    authRedirect("/auth/signup", "error", "Password must be at least 6 characters.");
  }

  if (password !== confirmPassword) {
    authRedirect("/auth/signup", "error", "Passwords do not match.");
  }

  try {
    const session = await signUpWithPassword(email, password);
    if (!session.access_token) {
      needsEmailConfirmation = true;
    }
  } catch (error) {
    authRedirect("/auth/signup", "error", getAuthErrorMessage(error));
  }

  if (needsEmailConfirmation) {
    authRedirect(
      "/auth/login",
      "message",
      "Account created. Please check your email to confirm your address before signing in.",
    );
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  await signOutCurrentUser();
  redirect("/auth/login?message=You have been signed out.");
}
