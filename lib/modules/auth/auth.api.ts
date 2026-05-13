import { LoginDTO, SignupDTO } from "./auth.types";

export async function login(data: LoginDTO) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Invalid credentials");
  }

  return result.user;
}

export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  return result;
}

export async function signup(data: SignupDTO) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  return result.user;
}
