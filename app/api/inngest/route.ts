import { serve } from "inngest/next";

import * as functions from "@/lib/inngest";
import { inngest } from "@/lib/inngest/client";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: Object.values(functions),
});
