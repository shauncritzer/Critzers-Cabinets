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
  } catch (error) {
    console.error(`  ✗ Error with column ${columnName}:`, error);
    throw error;
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

    // Add new columns to orders table
    await safeAddColumn(connection, 'orders', 'shipping_city', 'varchar(100)');
    await safeAddColumn(connection, 'orders', 'shipping_state', 'varchar(50)');
    await safeAddColumn(connection, 'orders', 'shipping_zip', 'varchar(20)');
    await safeAddColumn(connection, 'orders', 'shipping_method', 'varchar(100)');
    await safeAddColumn(connection, 'orders', 'stripe_payment_intent_id', 'varchar(255)');
    await safeAddColumn(connection, 'orders', 'stripe_customer_id', 'varchar(255)');
    await safeAddColumn(connection, 'orders', 'tracking_number', 'varchar(255)');
    await safeAddColumn(connection, 'orders', 'notes', 'text');

    console.log('\n✅ All migrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run migrations if this script is executed directly
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  runMigrations()
    .then(() => {
      console.log('\nMigrations complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nMigration error:', error);
      process.exit(1);
    });
}
