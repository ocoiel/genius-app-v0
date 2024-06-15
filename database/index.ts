import * as schema from "@/database/schema";
import { createClient } from "@libsql/client";
import { env } from "@/lib/env";
import { drizzle } from "drizzle-orm/libsql";

const dbClient = () =>
  createClient({
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

export const db = drizzle(dbClient(), { schema });
