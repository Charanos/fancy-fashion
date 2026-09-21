import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { z } from "zod";

import { health } from "@repo/common";

const env = z
  .object({
    PAYMENT_SERVICE_PORT: z.coerce.number().default(4002),
  })
  .parse(process.env);

const app = new Hono();

app.get("/health", (c) => c.json(health("payment-service")));

app.get("/payments", (c) =>
  c.json({
    data: [],
    message: "Payment service is ready for Stripe wiring.",
  }),
);

serve(
  {
    fetch: app.fetch,
    port: env.PAYMENT_SERVICE_PORT,
  },
  (info) => {
    console.log(`Payment service listening on :${info.port}`);
  },
);
