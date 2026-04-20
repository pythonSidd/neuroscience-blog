import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, any> = {
    turso_url_set: !!process.env.TURSO_CONNECTION_URL,
    turso_token_set: !!process.env.TURSO_AUTH_TOKEN,
    jwt_secret_set: !!process.env.JWT_SECRET,
    admin_username_set: !!process.env.ADMIN_USERNAME,
  };

  if (checks.turso_url_set && checks.turso_token_set) {
    try {
      const client = createClient({
        url: process.env.TURSO_CONNECTION_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      const result = await client.execute('SELECT COUNT(*) as count FROM admin_users');
      checks.db_connected = true;
      checks.admin_users_count = Number((result.rows[0] as any).count);
    } catch (e: any) {
      checks.db_connected = false;
      checks.db_error = e.message;
    }
  }

  return NextResponse.json(checks);
}
