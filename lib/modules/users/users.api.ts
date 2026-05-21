import { apiFetch } from "@/lib/api/apiFetch";

import { PublicUser, UpdateUserInput } from "./users.types";

export async function updateUser(updateUserInput: UpdateUserInput) {
  const result = await apiFetch<PublicUser | null>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(updateUserInput),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return result.data;
}

export async function fetchCurrentUser() {
  const result = await apiFetch<PublicUser | null>("/api/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return result.data;
}
