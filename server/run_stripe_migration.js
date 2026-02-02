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
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function runMigration() {
    try {
        console.log('🔄 Connecting to database...');
        const client = await pool.connect();
        console.log('✅ Connected');

        console.log('🔄 Reading migration file...');
        const migrationPath = path.join(__dirname, 'migrations', '002_add_stripe_columns.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('🔄 Executing Stripe migration...');
        await client.query(sql);
        console.log('✅ Migration executed successfully');

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
