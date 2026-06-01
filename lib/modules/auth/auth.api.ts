import { apiFetch } from "@/lib/api/apiFetch";

import { EmailVerification } from "../emailVerification/emailVerification.types";
import { PublicUser } from "../users/users.types";
import { LoginDTO, SignupDTO } from "./auth.types";

export async function login(data: LoginDTO) {
  const result = await apiFetch<PublicUser>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return result.data;
}

export async function logout() {
  const result = await apiFetch<null>("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return result.data;
}

export async function signup(data: SignupDTO) {
  const result = await apiFetch<PublicUser>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return result.data;
}

export async function emailVerification(token: string) {
  const result = await apiFetch<EmailVerification | null>(
    `/api/auth/verify-email?token=${token}`,
    {
      method: "POST",
    },
  );

  return result.data;
}
