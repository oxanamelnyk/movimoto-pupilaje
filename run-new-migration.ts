import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'd699.dinaserver.com',
    user: process.env.DB_USER || 'movimoto_bk2503',
    password: process.env.DB_PASS || 'RXDpm578Mv!',
    database: process.env.DB_NAME || 'movimoto_bk2503',
    multipleStatements: true
  });

  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync(path.join(process.cwd(), 'drizzle/0005_create_new_tables.sql'), 'utf8');
    
    console.log('Running migration 0005_create_new_tables.sql...');
    
    // Execute all statements at once
    const result = await connection.execute(migrationSQL);
    
    console.log('✓ Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
