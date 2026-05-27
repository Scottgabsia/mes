import fs from "fs";
import path from "path";
import { cleanEnvVar } from "./email";

function getFirebaseApiKey(): string {
  const fromEnv =
    cleanEnvVar(process.env.FIREBASE_API_KEY) ||
    cleanEnvVar(process.env.VITE_FIREBASE_API_KEY);
  if (fromEnv) return fromEnv;
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    const raw = JSON.parse(fs.readFileSync(configPath, "utf8")) as {
      apiKey?: string;
    };
    return raw.apiKey || "";
  } catch {
    return "";
  }
}

const ADMIN_EMAILS = [
  "info@cryptorecoveryasset.com",
  "contact@vr-astrovision.com",
  "admin@forensic.io",
];

function isAdminEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (ADMIN_EMAILS.includes(e)) return true;
  if (e.endsWith("@cryptorecoveryasset.com")) return true;
  if (e.endsWith("@forensic.io")) return true;
  return e.includes("admin");
}

/** Verify Firebase ID token via Identity Toolkit REST API */
export async function verifyFirebaseIdToken(
  idToken: string
): Promise<{ email: string; uid: string } | null> {
  const apiKey = getFirebaseApiKey();

  if (!apiKey) {
    console.warn("[Admin] FIREBASE_API_KEY not set — cannot verify admin token");
    return null;
  }

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    const data = (await res.json()) as {
      users?: { email?: string; localId?: string }[];
      error?: { message?: string };
    };
    if (!res.ok || !data.users?.[0]?.email) {
      console.warn("[Admin] Token verify failed:", data.error?.message);
      return null;
    }
    const user = data.users[0];
    const email = user.email!;
    if (!isAdminEmail(email)) {
      console.warn("[Admin] Non-admin email attempted access:", email);
      return null;
    }
    return { email, uid: user.localId || "" };
  } catch (err) {
    console.error("[Admin] Token verify error:", err);
    return null;
  }
}

export async function requireAdminFromRequest(
  authHeader: string | undefined
): Promise<{ email: string; uid: string } | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;
  return verifyFirebaseIdToken(token);
}
