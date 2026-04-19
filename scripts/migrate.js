#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function hashPassword(password) {
  return Buffer.from(password + 'salt').toString('base64');
}

async function migrate() {
  console.log('Running database migration...');

  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      featured_image_url TEXT DEFAULT '',
      category TEXT NOT NULL CHECK(category IN ('research', 'tutorial', 'insight')),
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      author TEXT DEFAULT 'Admin',
      read_time INTEGER DEFAULT 5,
      tags TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      published_at TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messaging_ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL CHECK(platform IN ('whatsapp', 'telegram')),
      platform_message_id TEXT DEFAULT '',
      sender_id TEXT NOT NULL,
      sender_name TEXT DEFAULT '',
      original_message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending_ai_generation'
        CHECK(status IN ('pending_ai_generation', 'pending_review', 'published', 'rejected')),
      ai_generated_title TEXT DEFAULT '',
      ai_generated_content TEXT DEFAULT '',
      admin_notes TEXT DEFAULT '',
      related_blog_post_id INTEGER REFERENCES blog_posts(id),
      created_at TEXT NOT NULL,
      processed_at TEXT,
      published_at TEXT
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      last_login TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Create default admin if not exists
  const existing = await client.execute({
    sql: 'SELECT id FROM admin_users WHERE username = ?',
    args: [process.env.ADMIN_USERNAME || 'admin'],
  });

  if (existing.rows.length === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'password123';
    await client.execute({
      sql: 'INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?)',
      args: [username, hashPassword(password), new Date().toISOString()],
    });
    console.log(`Admin user created: ${username}`);
  } else {
    console.log('Admin user already exists, skipping.');
  }

  console.log('Migration complete.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
