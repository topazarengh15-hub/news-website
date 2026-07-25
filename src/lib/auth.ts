import { NextRequest } from "next/server";

export interface AuthUser {
  id: number;
  role: "ADMIN" | "EDITOR" | "AUTHOR";
}

export function getCurrentUser(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("admin-token")?.value;
  if (!token) return null;

  try {
    const parsed = JSON.parse(token);
    if (parsed.userId && parsed.role) {
      return { id: parsed.userId, role: parsed.role };
    }
    return null;
  } catch {
    return null;
  }
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
