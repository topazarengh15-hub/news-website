import { NextRequest } from "next/server";
import crypto from "crypto";

export interface AuthUser {
  id: number;
  role: "ADMIN" | "EDITOR" | "AUTHOR";
}

function getSecret(): string {
  return process.env.AUTH_SECRET || "fallback-secret-change-me";
}

function sign(payload: string): string {
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(payload);
  return hmac.digest("hex");
}

export function signCookie(data: { userId: number; role: string }): string {
  const payload = JSON.stringify(data);
  const signature = sign(payload);
  return `${signature}.${Buffer.from(payload).toString("base64")}`;
}

export function verifyCookie(token: string): { userId: number; role: string } | null {
  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return null;

  const receivedSig = token.substring(0, dotIndex);
  const payloadB64 = token.substring(dotIndex + 1);

  const payload = Buffer.from(payloadB64, "base64").toString("utf-8");
  const expectedSig = sign(payload);

  if (!crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload);
    if (parsed.userId && parsed.role) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function getCurrentUser(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("admin-token")?.value;
  if (!token) return null;

  const parsed = verifyCookie(token);
  if (parsed) {
    return { id: parsed.userId, role: parsed.role as AuthUser["role"] };
  }
  return null;
}

export function requireAuth(
  request: NextRequest,
  allowedRoles?: ("ADMIN" | "EDITOR" | "AUTHOR")[]
): { user: AuthUser } | { error: Response } {
  const user = getCurrentUser(request);

  if (!user) {
    return {
      error: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      error: new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  return { user };
}
