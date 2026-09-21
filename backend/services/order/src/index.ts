import cors from "@fastify/cors";
import "dotenv/config";
import Fastify from "fastify";
import { z } from "zod";

import { health } from "@repo/common";

const env = z
  .object({
    ORDER_SERVICE_PORT: z.coerce.number().default(4001),
  })
  .parse(process.env);

const app = Fastify({
  logger: true,
});

await app.register(cors);

app.get("/health", async () => health("order-service"));

app.get("/orders", async () => ({
  data: [],
  message: "Order service is ready for MongoDB wiring.",
}));

await app.listen({
  port: env.ORDER_SERVICE_PORT,
  host: "0.0.0.0",
});
