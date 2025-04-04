import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import type { Database } from 'better-sqlite3'

export type DrizzleDb = BetterSQLite3Database<any> & { $client: Database }

