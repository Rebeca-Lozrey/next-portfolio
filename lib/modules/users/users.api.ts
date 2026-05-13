import { UpdateUserInput } from "./users.types";

export async function updateUser(updateUserInput: UpdateUserInput) {
  const response = await fetch("/api/user/me", {
    method: "PATCH",
    body: JSON.stringify(updateUserInput),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Something went wrong");
  }

  return result;
}

export async function fetchCurrentUser() {
  const response = await fetch("/api/user/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return result.user;
}
