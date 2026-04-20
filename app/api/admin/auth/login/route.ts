import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    const user = await adminDb.getByUsername(username);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const userId = Number(user.id);
    await adminDb.updateLastLogin(userId);

    const token = generateToken({
      id: userId,
      username: user.username,
      role: user.role || 'admin',
    });

    return NextResponse.json({
      token,
      user: {
        id: userId,
        username: user.username,
        role: user.role || 'admin',
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', detail: error?.message },
      { status: 500 }
    );
  }
}
