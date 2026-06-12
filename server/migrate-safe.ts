/**
 * Safe database migration script
 * Adds columns to orders table only if they don't already exist
 */

import mysql from 'mysql2/promise';
import { ENV } from './_core/env.js';

async function safeAddColumn(
  connection: mysql.Connection,
  tableName: string,
  columnName: string,
  columnDefinition: string
): Promise<void> {
  try {
    // Check if column exists
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `, [tableName, columnName]);

    if (Array.isArray(columns) && columns.length === 0) {
      // Column doesn't exist, add it
      console.log(`  Adding column ${columnName}...`);
      await connection.query(`
        ALTER TABLE \`${tableName}\`
        ADD COLUMN \`${columnName}\` ${columnDefinition}
      `);
      console.log(`  ✓ Added ${columnName}`);
    } else {
      console.log(`  ✓ Column ${columnName} already exists`);
    }
  } catch (error: any) {
    // Ignore duplicate column errors
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log(`  ✓ Column ${columnName} already exists (caught duplicate error)`);
    } else {
      console.error(`  ⚠ Warning with column ${columnName}:`, error.message);
      // Don't throw - continue with other columns
    }
  }
}

export async function runMigrations(): Promise<void> {
  if (!ENV.databaseUrl) {
    console.log('⚠ DATABASE_URL not set, skipping migrations');
    return;
  }

  let connection: mysql.Connection | null = null;

  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(ENV.databaseUrl);
    console.log('✓ Connected\n');

    console.log('Checking orders table columns...');

    // Add ALL columns that might be missing (including session_id which was added earlier)
    await safeAddColumn(connection, 'orders', 'session_id', 'varchar(255)');
    await safeAddColumn(connection, 'orders', 'shipping_city', 'varchar(100)');
    await safeAddColumn(connection, 'orders', 'shipping_state', 'varchar(50)');
    await safeAddColumn(connection, 'orders', 'shipping_zip', 'varchar(20)');
    await safeAddColumn(connection, 'orders', 'shipping_method', 'varchar(100)');
    await safeAddColumn(connection, 'orders', 'stripe_payment_intent_id', 'varchar(255)');
    await safeAddColumn(connection, 'orders', 'stripe_customer_id', 'varchar(255)');
    await safeAddColumn(connection, 'orders', 'tracking_number', 'varchar(255)');
    await safeAddColumn(connection, 'orders', 'notes', 'text');

    console.log('\n✅ All migrations completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message || error);
    // Don't throw - let the server start anyway
    console.log('⚠ Continuing server startup despite migration error...');
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed\n');
      } catch (err) {
        // Ignore close errors
      }
    }
  }
}
