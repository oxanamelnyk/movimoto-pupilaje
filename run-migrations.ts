import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: 'd699.dinaserver.com',
    user: 'movimoto_bk2503',
    password: 'RXDpm578Mv!',
    database: 'movimoto_bk2503'
  });

  try {
    // Run migration 0004
    const migration0004 = fs.readFileSync(path.join(process.cwd(), 'drizzle/0004_familiar_venom.sql'), 'utf8');
    const statements0004 = migration0004.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s);
    
    console.log('Applying migration 0004...');
    for (const statement of statements0004) {
      await connection.execute(statement);
    }
    console.log('✓ Migration 0004 applied');

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await connection.end();
  }
}

runMigrations();
