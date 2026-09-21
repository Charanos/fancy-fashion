import cors from "cors";
import "dotenv/config";
import express from "express";
import { z } from "zod";

import { health } from "@repo/common";

const env = z
  .object({
    PRODUCT_SERVICE_PORT: z.coerce.number().default(4000),
  })
  .parse(process.env);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json(health("product-service"));
});

app.get("/products", (_req, res) => {
  res.json({
    data: [],
    message: "Product service is ready for Prisma/PostgreSQL wiring.",
  });
});

app.listen(env.PRODUCT_SERVICE_PORT, () => {
  console.log(`Product service listening on :${env.PRODUCT_SERVICE_PORT}`);
});
