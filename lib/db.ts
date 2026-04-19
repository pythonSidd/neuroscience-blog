// Simple JSON-based database for testing (no native compilation needed)
import fs from 'fs';
import path from 'path';
import { slug as slugify } from 'slug';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
let db: any = {};
if (fs.existsSync(DB_PATH)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) {
    console.log('Creating new database...');
  }
}

// Save database
function saveDb() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Initialize tables
if (!db.blog_posts) db.blog_posts = [];
if (!db.messaging_ideas) db.messaging_ideas = [];
if (!db.admin_users) db.admin_users = [];
if (!db.research_papers) db.research_papers = [];
if (!db.github_projects) db.github_projects = [];

saveDb();

export interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category: 'research' | 'tutorial' | 'insight';
  status: 'draft' | 'published' | 'archived';
  author?: string;
  created_at?: string;
  published_at?: string;
  updated_at?: string;
  read_time?: number;
  tags?: string;
}

export interface MessagingIdea {
  id?: number;
  platform: 'whatsapp' | 'telegram';
  platform_message_id?: string;
  sender_id: string;
  sender_name?: string;
  original_message: string;
  status: 'pending_ai_generation' | 'pending_review' | 'published' | 'rejected';
  ai_generated_title?: string;
  ai_generated_content?: string;
  admin_notes?: string;
  related_blog_post_id?: number;
  created_at?: string;
  processed_at?: string;
  published_at?: string;
}

// Blog Posts CRUD
export const blogDb = {
  create: (post: BlogPost) => {
    const id = Date.now(); // Simple ID generation
    const newPost = {
      id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      featured_image_url: post.featured_image_url || '',
      category: post.category,
      status: post.status || 'draft',
      author: post.author || 'Admin',
      read_time: post.read_time || 5,
      tags: post.tags || '',
      created_at: new Date().toISOString(),
      published_at: post.status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    db.blog_posts.push(newPost);
    saveDb();
    return id;
  },

  getBySlug: (slug: string): BlogPost | null => {
    return db.blog_posts.find((post: BlogPost) => post.slug === slug) || null;
  },

  getAll: (limit: number = 10, offset: number = 0, category?: string, includeAll: boolean = false) => {
    let posts = includeAll 
      ? db.blog_posts // For admin: return all posts (draft, published, archived)
      : db.blog_posts.filter((post: BlogPost) => post.status === 'published'); // For public: only published

    if (category) {
      posts = posts.filter((post: BlogPost) => post.category === category);
    }

    posts.sort((a: BlogPost, b: BlogPost) =>
      new Date(b.published_at || b.created_at || '').getTime() - new Date(a.published_at || a.created_at || '').getTime()
    );

    return posts.slice(offset, offset + limit);
  },

  update: (id: number, updates: Partial<BlogPost>) => {
    const index = db.blog_posts.findIndex((post: BlogPost) => post.id === id);
    if (index !== -1) {
      db.blog_posts[index] = {
        ...db.blog_posts[index],
        ...updates,
        updated_at: new Date().toISOString(),
        published_at: updates.status === 'published' && !db.blog_posts[index].published_at
          ? new Date().toISOString()
          : db.blog_posts[index].published_at
      };
      saveDb();
      return { changes: 1 };
    }
    return { changes: 0 };
  },

  getById: (id: number): BlogPost | null => {
    return db.blog_posts.find((post: BlogPost) => post.id === id) || null;
  },

  delete: (id: number) => {
    const index = db.blog_posts.findIndex((post: BlogPost) => post.id === id);
    if (index !== -1) {
      db.blog_posts.splice(index, 1);
      saveDb();
      return { changes: 1 };
    }
    return { changes: 0 };
  },

  count: (status: string = 'published'): number => {
    return db.blog_posts.filter((post: BlogPost) => post.status === status).length;
  },
};

// Messaging Ideas CRUD
export const messagingDb = {
  create: (idea: MessagingIdea) => {
    const id = Date.now();
    const newIdea = {
      id,
      platform: idea.platform,
      platform_message_id: idea.platform_message_id || '',
      sender_id: idea.sender_id,
      sender_name: idea.sender_name || '',
      original_message: idea.original_message,
      status: idea.status || 'pending_ai_generation',
      ai_generated_title: idea.ai_generated_title || '',
      ai_generated_content: idea.ai_generated_content || '',
      admin_notes: idea.admin_notes || '',
      related_blog_post_id: idea.related_blog_post_id || null,
      created_at: new Date().toISOString(),
      processed_at: idea.processed_at || null,
      published_at: idea.published_at || null,
    };
    db.messaging_ideas.push(newIdea);
    saveDb();
    return id;
  },

  getById: (id: number): MessagingIdea | null => {
    return db.messaging_ideas.find((idea: MessagingIdea) => idea.id === id) || null;
  },

  getPending: (platform?: string) => {
    let ideas = db.messaging_ideas.filter((idea: MessagingIdea) =>
      ['pending_ai_generation', 'pending_review'].includes(idea.status)
    );

    if (platform) {
      ideas = ideas.filter((idea: MessagingIdea) => idea.platform === platform);
    }

    ideas.sort((a: MessagingIdea, b: MessagingIdea) =>
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    );

    return ideas;
  },

  update: (id: number, updates: Partial<MessagingIdea>) => {
    const index = db.messaging_ideas.findIndex((idea: MessagingIdea) => idea.id === id);
    if (index !== -1) {
      db.messaging_ideas[index] = {
        ...db.messaging_ideas[index],
        ...updates,
        processed_at: updates.status && updates.status !== db.messaging_ideas[index].status
          ? new Date().toISOString()
          : db.messaging_ideas[index].processed_at,
        published_at: updates.status === 'published'
          ? new Date().toISOString()
          : db.messaging_ideas[index].published_at
      };
      saveDb();
      return { changes: 1 };
    }
    return { changes: 0 };
  },

  delete: (id: number) => {
    const index = db.messaging_ideas.findIndex((idea: MessagingIdea) => idea.id === id);
    if (index !== -1) {
      db.messaging_ideas.splice(index, 1);
      saveDb();
      return { changes: 1 };
    }
    return { changes: 0 };
  },
};

// Admin Users
export function getDb() {
  return db;
}

export const adminDb = {
  create: (username: string, passwordHash: string) => {
    const id = Date.now();
    const user = {
      id,
      username,
      password_hash: passwordHash,
      last_login: null,
      created_at: new Date().toISOString(),
    };
    db.admin_users.push(user);
    saveDb();
    return id;
  },

  getByUsername: (username: string) => {
    return db.admin_users.find((user: any) => user.username === username) || null;
  },

  updateLastLogin: (id: number) => {
    const index = db.admin_users.findIndex((user: any) => user.id === id);
    if (index !== -1) {
      db.admin_users[index].last_login = new Date().toISOString();
      saveDb();
    }
  },
};
