import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { DentalOperations } from './operations.js'
import * as schema from './schema.js'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

// Get user data path for storing the database
const userDataPath = app.getPath('userData')
const dbPath = path.join(userDataPath, 'database.db')

// Initialize the better-sqlite3 database instance
// NOTE: ignore error
const sqlite = new Database(dbPath)

// Initialize Drizzle
const db = drizzle(sqlite, { schema: schema, logger: true })

// Optional: Enable WAL mode for better concurrency (highly recommended for SQLite)
sqlite.pragma('journal_mode = WAL;')

// Create an instance of dental operations
export const dentalOps = new DentalOperations(db)

export function applyDbMigrations(): void {
  console.log('Initializing database...')
  console.log('Applying database migrations...')
  try {
    // Point to the folder where migrations are stored *within your packaged app*
    // __dirname usually points to the root of your app source in dev,
    // and to the 'app.asar.unpacked' or similar dir in production.
    // Make sure the 'drizzle/migrations' folder is included in your build.
    const migrationsFolder = 'drizzle'
    // This path needs careful handling based on your build process.

    migrate(db, { migrationsFolder: migrationsFolder })
    console.log('Migrations applied successfully.')
  } catch (error) {
    console.error('Failed to apply database migrations:', error)
    // Handle error appropriately - maybe notify user or quit app
    // You might want to backup the DB before migrating in critical apps
  }
  console.log('Database initialization complete.')
}
