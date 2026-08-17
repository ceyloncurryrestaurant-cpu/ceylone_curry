import { cookies } from "next/headers";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "ceylon_curry_super_secret_jwt_key_2026_premium_key";
const COOKIE_NAME = "ceylon_admin_token";

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export async function comparePassword(password: string, storedHash: string): Promise<boolean> {
  try {
    if (!storedHash) return false;
    const [salt, originalHash] = storedHash.split(":");
    if (!salt || !originalHash) return false;

    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    const buf1 = Buffer.from(hash, "hex");
    const buf2 = Buffer.from(originalHash, "hex");

    if (buf1.length !== buf2.length) return false;
    return crypto.timingSafeEqual(buf1, buf2);
  } catch (err) {
    return false;
  }
}

export async function createAdminToken(payload: { id: string; email: string; name: string }): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours
  const payloadEncoded = base64UrlEncode(JSON.stringify({ ...payload, exp }));

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payloadEncoded}`)
    .digest("base64url");

  return `${header}.${payloadEncoded}.${signature}`;
}

export async function verifyAdminToken(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payloadEncoded, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payloadEncoded}`)
      .digest("base64url");

    const buf1 = Buffer.from(signature);
    const buf2 = Buffer.from(expectedSignature);

    if (buf1.length !== buf2.length) return null;
    if (!crypto.timingSafeEqual(buf1, buf2)) return null;

    const payload = JSON.parse(base64UrlDecode(payloadEncoded));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Token expired
    }

    return payload as { id: string; email: string; name: string };
  } catch (error) {
    return null;
  }
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = typeof cookieStore.get === "function" ? cookieStore.get(COOKIE_NAME)?.value : null;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch (error) {
    return null;
  }
}
