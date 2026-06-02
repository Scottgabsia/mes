/** Emails allowed to access the admin case manager (must match firestore.rules). */
export const ADMIN_EMAILS: string[] = [
  "info@cryptorecoveryasset.com",
  "contact@vr-astrovision.com",
  "admin@forensic.com",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(normalized)) {
    return true;
  }
  if (normalized.endsWith("@cryptorecoveryasset.com")) {
    return true;
  }
  if (normalized.endsWith("@forensic.com")) {
    return true;
  }
  return false;
}
