import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
});

export function validateEnv(env: Record<string, string | undefined>) {
  return schema.parse(env);
}
