import { createClient, Client } from '@libsql/client';

let _client: Client | null = null;

function getClient(): Client {
  if (!_client) {
    if (!process.env.TURSO_CONNECTION_URL) {
      throw new Error('TURSO_CONNECTION_URL is not set');
    }
    _client = createClient({
      url: process.env.TURSO_CONNECTION_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return _client;
}

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

export const blogDb = {
  create: async (post: BlogPost): Promise<number> => {
    const now = new Date().toISOString();
    const result = await getClient().execute({
      sql: `INSERT INTO blog_posts
              (title, slug, content, excerpt, featured_image_url, category, status, author, read_time, tags, created_at, published_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        post.title,
        post.slug,
        post.content,
        post.excerpt || '',
        post.featured_image_url || '',
        post.category,
        post.status || 'draft',
        post.author || 'Admin',
        post.read_time || 5,
        post.tags || '',
        now,
        post.status === 'published' ? now : null,
        now,
      ],
    });
    return Number(result.lastInsertRowid);
  },

  getBySlug: async (slug: string): Promise<BlogPost | null> => {
    const result = await getClient().execute({
      sql: 'SELECT * FROM blog_posts WHERE slug = ?',
      args: [slug],
    });
    return (result.rows[0] as unknown as BlogPost) || null;
  },

  getAll: async (limit = 10, offset = 0, category?: string, includeAll = false): Promise<BlogPost[]> => {
    const conditions: string[] = [];
    const args: (string | number)[] = [];

    if (!includeAll) conditions.push("status = 'published'");
    if (category) { conditions.push('category = ?'); args.push(category); }

    let sql = 'SELECT * FROM blog_posts';
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY COALESCE(published_at, created_at) DESC LIMIT ? OFFSET ?';
    args.push(limit, offset);

    const result = await getClient().execute({ sql, args });
    return result.rows as unknown as BlogPost[];
  },

  update: async (id: number, updates: Partial<BlogPost>) => {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const args: (string | number | null)[] = [];

    for (const key of ['title', 'slug', 'content', 'excerpt', 'featured_image_url', 'category', 'status', 'tags', 'read_time', 'published_at'] as const) {
      if (key in updates) {
        fields.push(`${key} = ?`);
        args.push((updates as any)[key] ?? null);
      }
    }
    fields.push('updated_at = ?');
    args.push(now, id);

    await getClient().execute({ sql: `UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`, args });
    return { changes: 1 };
  },

  getById: async (id: number): Promise<BlogPost | null> => {
    const result = await getClient().execute({
      sql: 'SELECT * FROM blog_posts WHERE id = ?',
      args: [id],
    });
    return (result.rows[0] as unknown as BlogPost) || null;
  },

  delete: async (id: number) => {
    await getClient().execute({ sql: 'DELETE FROM blog_posts WHERE id = ?', args: [id] });
    return { changes: 1 };
  },

  count: async (status = 'published'): Promise<number> => {
    const result = await getClient().execute({
      sql: 'SELECT COUNT(*) as count FROM blog_posts WHERE status = ?',
      args: [status],
    });
    return Number((result.rows[0] as any).count);
  },
};

export const messagingDb = {
  create: async (idea: MessagingIdea): Promise<number> => {
    const now = new Date().toISOString();
    const result = await getClient().execute({
      sql: `INSERT INTO messaging_ideas
              (platform, platform_message_id, sender_id, sender_name, original_message, status,
               ai_generated_title, ai_generated_content, admin_notes, related_blog_post_id,
               created_at, processed_at, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        idea.platform,
        idea.platform_message_id || '',
        idea.sender_id,
        idea.sender_name || '',
        idea.original_message,
        idea.status || 'pending_ai_generation',
        idea.ai_generated_title || '',
        idea.ai_generated_content || '',
        idea.admin_notes || '',
        idea.related_blog_post_id || null,
        now,
        idea.processed_at || null,
        idea.published_at || null,
      ],
    });
    return Number(result.lastInsertRowid);
  },

  getById: async (id: number): Promise<MessagingIdea | null> => {
    const result = await getClient().execute({
      sql: 'SELECT * FROM messaging_ideas WHERE id = ?',
      args: [id],
    });
    return (result.rows[0] as unknown as MessagingIdea) || null;
  },

  getPending: async (platform?: string): Promise<MessagingIdea[]> => {
    const args: string[] = [];
    let sql = "SELECT * FROM messaging_ideas WHERE status IN ('pending_ai_generation', 'pending_review')";
    if (platform) { sql += ' AND platform = ?'; args.push(platform); }
    sql += ' ORDER BY created_at DESC';
    const result = await getClient().execute({ sql, args });
    return result.rows as unknown as MessagingIdea[];
  },

  update: async (id: number, updates: Partial<MessagingIdea>) => {
    const fields: string[] = [];
    const args: (string | number | null)[] = [];

    for (const key of ['platform', 'status', 'ai_generated_title', 'ai_generated_content', 'admin_notes', 'related_blog_post_id', 'processed_at', 'published_at'] as const) {
      if (key in updates) {
        fields.push(`${key} = ?`);
        args.push((updates as any)[key] ?? null);
      }
    }

    if (updates.status && !updates.processed_at) {
      fields.push('processed_at = ?');
      args.push(new Date().toISOString());
    }
    if (updates.status === 'published' && !updates.published_at) {
      fields.push('published_at = ?');
      args.push(new Date().toISOString());
    }

    args.push(id);
    await getClient().execute({ sql: `UPDATE messaging_ideas SET ${fields.join(', ')} WHERE id = ?`, args });
    return { changes: 1 };
  },

  delete: async (id: number) => {
    await getClient().execute({ sql: 'DELETE FROM messaging_ideas WHERE id = ?', args: [id] });
    return { changes: 1 };
  },
};

export const adminDb = {
  create: async (username: string, passwordHash: string): Promise<number> => {
    const result = await getClient().execute({
      sql: 'INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?)',
      args: [username, passwordHash, new Date().toISOString()],
    });
    return Number(result.lastInsertRowid);
  },

  getByUsername: async (username: string) => {
    const result = await getClient().execute({
      sql: 'SELECT * FROM admin_users WHERE username = ?',
      args: [username],
    });
    return (result.rows[0] as any) || null;
  },

  updateLastLogin: async (id: number) => {
    await getClient().execute({
      sql: 'UPDATE admin_users SET last_login = ? WHERE id = ?',
      args: [new Date().toISOString(), id],
    });
  },
};
