import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function runMigration() {
    try {
        console.log('🔄 Connecting to database...');
        const client = await pool.connect();
        console.log('✅ Connected');

        const migrationFiles = [
            '001_create_tables.sql',
            '002_add_items_to_orders.sql',
            '003_create_carts_table.sql',
        ];

        for (const file of migrationFiles) {
            console.log(`🔄 Reading migration: ${file}...`);
            const migrationPath = path.join(__dirname, 'migrations', file);
            const sql = fs.readFileSync(migrationPath, 'utf8');

            console.log(`🔄 Executing migration: ${file}...`);
            await client.query(sql);
            console.log(`✅ ${file} executed successfully`);
        }

        client.release();
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigration();
