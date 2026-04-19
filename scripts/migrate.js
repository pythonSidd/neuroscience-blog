#!/usr/bin/env node
const fs = require('fs');
const path = require('path');


const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
let db = {};
if (fs.existsSync(DB_PATH)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    console.log('Database already exists, skipping migration...');
    process.exit(0);
  } catch (e) {
    console.log('Creating new database...');
  }
}

// Initialize tables
db.blog_posts = [];
db.messaging_ideas = [];
db.admin_users = [];
db.research_papers = [];
db.github_projects = [];

// Simple hash function for now
function hashPassword(password) {
  return Buffer.from(password + 'salt').toString('base64');
}

// Create default admin user
const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
const hashedPassword = hashPassword(adminPassword);

db.admin_users.push({
  id: Date.now(),
  username: process.env.ADMIN_USERNAME || 'admin',
  password_hash: hashedPassword,
  last_login: null,
  created_at: new Date().toISOString(),
});

// Save database
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

console.log('✅ Database initialized successfully!');
console.log(`📁 Database file: ${DB_PATH}`);
console.log(`👤 Admin user created: ${process.env.ADMIN_USERNAME || 'admin'}`);
console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'password123'}`);
console.log('\n🚀 You can now run: npm run dev');
