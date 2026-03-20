"use server";
import { z } from "zod";

import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { createUserSchema } from "@/lib/modules/users/users.schema";
import { createUserService } from "@/lib/modules/users/users.service";

export async function createUserAction(
  prevState: {
    message: string | null;
    error: string | null;
  },
  formData: FormData,
) {
  try {
    const raw = {
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const parsed = createUserSchema.parse(raw);

    const user = await createUserService(mongoUsersRepository, parsed);

    return {
      message: "User created successfully",
      error: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => issue.message).join(", ");
      console.error(issues);
      return {
        message: null,
        error: issues,
      };
    } else if (error instanceof Error) {
      console.error(error.message);
      return {
        message: null,
        error: error.message,
      };
    } else {
      console.error("Unknown error:", error);
    }

    return {
      message: null,
      error: "Something went wrong",
    };
  }
}
