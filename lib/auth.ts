export const SESSION_COOKIE_NAME = "mywork_session";

/**
 * Derives a deterministic SHA-256 session token using the server-side
 * APP_PASSWORD and AUTH_SECRET environment variables.
 * Uses Web Crypto (crypto.subtle) so it is compatible with both
 * Edge runtime (middleware) and Node.js runtime (API routes).
 */
export async function getExpectedSessionToken(): Promise<string | null> {
  const password = process.env.APP_PASSWORD;
  if (!password) {
    return null;
  }

  const secret = process.env.AUTH_SECRET || "mywork_default_secret_salt";
  const data = new TextEncoder().encode(`${password}:${secret}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Validates whether an incoming session token matches the expected hash.
 */
export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const expected = await getExpectedSessionToken();
  if (!expected) return false;
  return token === expected;
}

/**
 * Validates a user-submitted password against the environment variable.
 */
export function verifyPassword(inputPassword?: string | null): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected || !inputPassword) return false;
  return inputPassword === expected;
}
