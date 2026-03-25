"use client";

import { useActionState, useState } from "react";

import * as Form from "@radix-ui/react-form";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import { Button, Text, TextField } from "@radix-ui/themes";

import { FormAction } from "@/lib/types/actions";

import styles from "./LoginForm.module.css";

export default function LoginForm({ action }: { action: FormAction }) {
  const [state, formAction, pending] = useActionState(action, {
    message: null,
    error: null,
  });

  const [isDirty, setIsDirty] = useState(false);

  const { root, form, fields, inline, title, subtitle, message } = styles;
  return (
    <div className={root}>
      <Form.Root
        className={form}
        action={formAction}
        onSubmit={() => setIsDirty(false)}
      >
        <div className={title}>Login</div>
        <div className={subtitle}>Log in to your account.</div>
        <div className={fields}>
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
            {state.error && !isDirty && !pending && (
              <Callout.Root size="1" color="red" role="alert">
                <Callout.Icon>
                  <CrossCircledIcon />
                </Callout.Icon>
                <Callout.Text>{state.error}</Callout.Text>
              </Callout.Root>
            )}
          </div>
          <div className={inline}>
            <Form.Submit asChild>
              <Button
                disabled={pending}
                color={state.error && !isDirty && !pending ? "red" : "blue"}
              >
                {pending ? "Logging in..." : "Login"}
              </Button>
            </Form.Submit>
          </div>
        </div>
      </Form.Root>
    </div>
  );
}
