// db/migrate.ts
import { db } from './index.js'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

/**
 * Initialize the database with migrations
 */
export async function initializeDatabase(): Promise<void> {
  console.log('Initializing database...')

  // Run migrations
  migrate(db, { migrationsFolder: './migrations' })

  console.log('Database initialization complete.')
}

