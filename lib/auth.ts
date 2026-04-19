// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';

export interface TokenPayload {
  id: number;
  username: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  // Simple token generation for now - replace with proper JWT later
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadStr = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = Buffer.from(jwtSecret).toString('base64url');
  return `${header}.${payloadStr}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  // Simple hash for now - replace with bcrypt later
  return Buffer.from(password + 'salt').toString('base64');
}

export function comparePassword(password: string, hash: string): boolean {
  // Simple comparison for now - replace with bcrypt later
  return Buffer.from(password + 'salt').toString('base64') === hash;
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  return null;
}

export function verifyAdminToken(request: NextRequest): TokenPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return verifyToken(token);
}
