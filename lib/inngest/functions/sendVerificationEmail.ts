import { Resend } from "resend";

import { inngest } from "../client";
import { EVENTS } from "../events";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = inngest.createFunction(
  {
    id: "send-verification-email",
    triggers: [{ event: EVENTS.USER_SIGNUP_COMPLETED }],
  },
  async ({ event, step }) => {
    const result = await step.run("send-verification-email", async () => {
      return resend.emails.send({
        from: "onboarding@resend.dev",
        to: event.data.email,
        subject: "Verify your account",
        html: `
                <div
                  style="
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 32px;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #1f2937;
                    line-height: 1.6;
                  "
                >
                  <h1
                    style="
                      margin: 0 0 24px;
                      font-size: 32px;
                      font-weight: bold;
                      color: #111827;
                    "
                  >
                    SOcial
                  </h1>

                  <p style="margin: 0 0 16px;">
                    This email was sent to you after signing up for Social.
                  </p>

                  <p style="margin: 0 0 32px;">
                    Please click the button below to verify your account.
                  </p>

                  <a
                    href="${process.env.APP_URL}/email-verification?token=${event.data.token}"
                    style="
                      display: inline-block;
                      padding: 12px 24px;
                      background-color: #111827;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 6px;
                      font-weight: 600;
                    "
                  >
                    Verify Email
                  </a>

                  <p
                    style="
                      margin-top: 32px;
                      font-size: 14px;
                      color: #6b7280;
                    "
                  >
                    If you did not create an account, you can safely ignore this email.
                  </p>
                </div>
          `,
      });
    });
    console.log("Resend email sent:", result);
    return {
      success: true,
      result,
    };
  },
);
