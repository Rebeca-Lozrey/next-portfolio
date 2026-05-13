"use client";

import { SubmitEvent, useState } from "react";

import { useRouter } from "next/navigation";

import * as Form from "@radix-ui/react-form";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import { Button, Text, TextField } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { signup } from "@/lib/modules/auth/auth.api";
import { SignupDTO } from "@/lib/modules/auth/auth.types";
import { usersKeys } from "@/lib/modules/users/users.keys";

import styles from "./SignupForm.module.css";

export default function SignupForm() {
  const [isDirty, setIsDirty] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  const submitMutation = useMutation({
    mutationFn: (dto: SignupDTO) => signup(dto),

    onError: (_err, _vars) => {
      console.error("Failed signing up");
    },

    onSuccess: (data) => {
      queryClient.setQueryData(usersKeys.current, data);
      router.push("/my-articles");
    },
  });

  const { isPending, isError, error } = submitMutation;

  const handleOnSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDirty(false);

    const formData = new FormData(e.currentTarget);
    submitMutation.mutate({
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    });
  };

  const { root, form, fields, inline, title, subtitle, message } = styles;
  return (
    <div className={root}>
      <Form.Root className={form} onSubmit={handleOnSubmit}>
        <div className={title}>Sign Up</div>
        <div className={subtitle}>Create your account</div>
        <div className={fields}>
          <Form.Field name="username">
            <Form.Label asChild>
              <Text as="label">Username</Text>
            </Form.Label>

            <Form.Control asChild>
              <TextField.Root
                name="username"
                required
                minLength={6}
                pattern="^[a-zA-Z0-9]+$"
                onFocus={() => setIsDirty(true)}
              />
            </Form.Control>

            <Form.Message className={message} match="valueMissing">
              Username is required.
            </Form.Message>
            <Form.Message className={message} match="tooShort">
              Username should be at least 6 characters long.
            </Form.Message>
            <Form.Message className={message} match="patternMismatch">
              {" "}
              Only letters and numbers allowed.
            </Form.Message>
          </Form.Field>
          <Form.Field name="email">
            <Form.Label asChild>
              <Text as="label">Email</Text>
            </Form.Label>

            <Form.Control asChild>
              <TextField.Root
                name="email"
                type="email"
                required
                onFocus={() => setIsDirty(true)}
              />
            </Form.Control>

            <Form.Message className={message} match="valueMissing">
              Email is required
            </Form.Message>
            <Form.Message className={message} match="typeMismatch">
              Please enter a valid email address
            </Form.Message>
          </Form.Field>
          <Form.Field name="password">
            <Form.Label asChild>
              <Text as="label">Password</Text>
            </Form.Label>

            <Form.Control asChild>
              <TextField.Root
                name="password"
                type="password"
                required
                minLength={6}
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$"
                onFocus={() => setIsDirty(true)}
              />
            </Form.Control>

            <Form.Message className={message} match="valueMissing">
              Password is required
            </Form.Message>
            <Form.Message className={message} match="tooShort">
              Password should be at least 6 characters long.
            </Form.Message>
            <Form.Message className={message} match="patternMismatch">
              {" "}
              Must include at least one letter and one number. Must not include
              special characters.
            </Form.Message>
          </Form.Field>
          <div>
            {isError && !isDirty && !isPending && (
              <Callout.Root size="1" color="red" role="alert">
                <Callout.Icon>
                  <CrossCircledIcon />
                </Callout.Icon>
                <Callout.Text>{error.message}</Callout.Text>
              </Callout.Root>
            )}
          </div>
          <div className={inline}>
            <Form.Submit asChild>
              <Button
                disabled={isPending}
                color={isError && !isDirty && !isPending ? "red" : "blue"}
              >
                {isPending ? "Signing Up..." : "Sign Up"}
              </Button>
            </Form.Submit>
          </div>
        </div>
      </Form.Root>
    </div>
  );
}
