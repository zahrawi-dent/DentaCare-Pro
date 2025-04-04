"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.dentalOps = exports.sqlite = exports.db = void 0;
exports.applyDbMigrations = applyDbMigrations;
var better_sqlite3_1 = require("better-sqlite3");
var better_sqlite3_2 = require("drizzle-orm/better-sqlite3");
var path_1 = require("path");
var electron_1 = require("electron");
var operations_js_1 = require("./operations.js");
var migrate_js_1 = require("./migrate.js");
Object.defineProperty(exports, "initializeDatabase", { enumerable: true, get: function () { return migrate_js_1.initializeDatabase; } });
var schema = require("./schema.js");
var migrator_1 = require("drizzle-orm/better-sqlite3/migrator");
// Get user data path for storing the database
var userDataPath = electron_1.app.getPath('userData');
var dbPath = path_1.default.join(userDataPath, 'database.db');
// Initialize the better-sqlite3 database instance
var sqlite = new better_sqlite3_1.default(dbPath);
exports.sqlite = sqlite;
// Initialize Drizzle
var db = (0, better_sqlite3_2.drizzle)(sqlite, { schema: schema, logger: true });
exports.db = db;
// Optional: Enable WAL mode for better concurrency (highly recommended for SQLite)
sqlite.pragma('journal_mode = WAL;');
// Create an instance of dental operations
var dentalOps = new operations_js_1.DentalOperations(db);
exports.dentalOps = dentalOps;
function applyDbMigrations() {
    console.log('Applying database migrations...');
    try {
        // Point to the folder where migrations are stored *within your packaged app*
        // __dirname usually points to the root of your app source in dev,
        // and to the 'app.asar.unpacked' or similar dir in production.
        // Make sure the 'drizzle/migrations' folder is included in your build.
        var migrationsFolder = 'drizzle';
        // This path needs careful handling based on your build process.
        (0, migrator_1.migrate)(db, { migrationsFolder: migrationsFolder });
        console.log('Migrations applied successfully.');
    }
    catch (error) {
        console.error('Failed to apply database migrations:', error);
        // Handle error appropriately - maybe notify user or quit app
        // You might want to backup the DB before migrating in critical apps
    }
}
