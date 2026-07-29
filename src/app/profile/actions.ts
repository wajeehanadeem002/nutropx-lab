"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteCurrentUserAccount,
  getAuthErrorMessage,
  updateCurrentUserAlertSettings,
  updateCurrentUserDisplayName,
  updateCurrentUserPrivacySettings,
} from "@/lib/supabase/auth";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function profileRedirect(key: "error" | "message", value: string): never {
  redirect(`/profile?${key}=${encodeURIComponent(value)}`);
}

function getProfileActionErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? getAuthErrorMessage(error) : fallback;
}

export async function updateProfileAction(formData: FormData) {
  const displayName = getFormValue(formData, "displayName");

  if (!displayName) {
    profileRedirect("error", "Display name is required.");
  }

  try {
    await updateCurrentUserDisplayName(displayName);
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/lab");
    revalidatePath("/my-brain");
  } catch (error) {
    profileRedirect(
      "error",
      getProfileActionErrorMessage(
        error,
        "We could not save your profile. Please try again.",
      ),
    );
  }

  profileRedirect("message", "Changes saved.");
}

export async function updatePrivacyAction(formData: FormData) {
  const leaderboardPublic = getFormValue(formData, "leaderboardPublic") === "true";
  const rawMode = getFormValue(formData, "leaderboardNameMode");
  const leaderboardNameMode = rawMode === "real" ? "real" : "generated";

  try {
    await updateCurrentUserPrivacySettings({
      leaderboardPublic,
      leaderboardNameMode,
    });
    revalidatePath("/profile");
    revalidatePath("/my-brain");
  } catch (error) {
    profileRedirect(
      "error",
      getProfileActionErrorMessage(
        error,
        "We could not save your privacy settings. Please try again.",
      ),
    );
  }

  profileRedirect("message", "Privacy settings saved.");
}

function normalizeDigestFrequency(value: string) {
  if (value === "daily" || value === "weekly" || value === "streak") {
    return value;
  }

  return "weekly";
}

function alertActionResult(error: unknown) {
  return {
    ok: false,
    message: getProfileActionErrorMessage(
      error,
      "We could not save your alert settings. Please try again.",
    ),
  };
}

export async function updatePushNotificationsAction(settings: { pushEnabled: boolean }) {
  try {
    await updateCurrentUserAlertSettings({
      pushEnabled: settings.pushEnabled,
    });
    revalidatePath("/profile");
    return { ok: true, message: "Push notification setting saved." };
  } catch (error) {
    return alertActionResult(error);
  }
}

export async function updateReminderTimeAction(settings: { reminderTime: string }) {
  const reminderTime = settings.reminderTime.trim().slice(0, 12) || "09:00 AM";

  try {
    await updateCurrentUserAlertSettings({
      reminderTime,
    });
    revalidatePath("/profile");
    return { ok: true, message: "Reminder time saved." };
  } catch (error) {
    return alertActionResult(error);
  }
}

export async function updateEmailDigestAction(settings: {
  digestEnabled: boolean;
  digestFrequency: "daily" | "weekly" | "streak";
}) {
  const digestFrequency =
    normalizeDigestFrequency(settings.digestFrequency) as "daily" | "weekly" | "streak";

  try {
    await updateCurrentUserAlertSettings({
      digestEnabled: settings.digestEnabled,
      digestFrequency,
    });
    revalidatePath("/profile");
    return { ok: true, message: "Email preferences saved." };
  } catch (error) {
    return alertActionResult(error);
  }
}

export async function deleteAccountAction() {
  await deleteCurrentUserAccount();
  redirect("/auth/login?message=Account deleted from this app.");
}
