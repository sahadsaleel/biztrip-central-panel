/**
 * Validate that commission percentages (Platform + Company + Driver) sum to exactly 100%
 */
export function validateCommissionSplit(
  platform: number,
  company: number,
  driver: number,
): { valid: boolean; sum: number; error?: string } {
  const p = Number(platform) || 0;
  const c = Number(company) || 0;
  const d = Number(driver) || 0;

  if (p < 0 || c < 0 || d < 0) {
    return {
      valid: false,
      sum: p + c + d,
      error: "Commission percentages cannot be negative numbers.",
    };
  }

  const sum = Math.round((p + c + d) * 100) / 100;

  if (sum !== 100) {
    const diff = Math.round((100 - sum) * 100) / 100;
    return {
      valid: false,
      sum,
      error: `Commission split must total exactly 100%. Current total is ${sum}% (${diff > 0 ? `+${diff}% remaining` : `${Math.abs(diff)}% over`}).`,
    };
  }

  return { valid: true, sum: 100 };
}

/**
 * Validate Indian 10-digit or international formatted phone
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-+()]/g, "");
  return cleaned.length >= 10 && cleaned.length <= 13;
}

/**
 * Validate Indian GSTIN format
 * Format: 2 digits (state) + 5 letters (PAN) + 4 digits + 1 letter + 1 char + Z + 1 char
 */
export function validateGSTIN(gstin: string): boolean {
  if (!gstin) return false;
  const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return re.test(gstin.trim().toUpperCase());
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
