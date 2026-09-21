import { z } from "zod";

export const HealthResponseSchema = z.object({
  service: z.string(),
  status: z.literal("ok"),
  timestamp: z.string(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export function health(service: string): HealthResponse {
  return {
    service,
    status: "ok",
    timestamp: new Date().toISOString(),
  };
}
