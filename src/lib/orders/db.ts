import "server-only";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;

let client: Sql | null = null;
let schemaReady: Promise<void> | null = null;

function databaseUrl(): string {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    ""
  );
}

function getSql(): Sql {
  const url = databaseUrl();
  if (!url) {
    throw new Error("order_store_unconfigured");
  }
  if (!client) {
    client = neon(url);
  }
  return client;
}

async function createSchema(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      document JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`DROP INDEX IF EXISTS orders_session_id_uidx`;
  await sql`DROP INDEX IF EXISTS orders_payment_intent_uidx`;
  await sql`ALTER TABLE orders DROP COLUMN IF EXISTS stripe_checkout_session_id`;
  await sql`ALTER TABLE orders DROP COLUMN IF EXISTS stripe_payment_intent_id`;
  await sql`DROP TABLE IF EXISTS stripe_webhook_events`;
}

export async function withOrderDb(): Promise<Sql> {
  const sql = getSql();
  if (!schemaReady) {
    schemaReady = createSchema(sql).catch((error) => {
      schemaReady = null;
      console.error("order_store_schema_failed", {
        type: error instanceof Error ? error.name : "unknown",
      });
      throw error;
    });
  }
  await schemaReady;
  return sql;
}
