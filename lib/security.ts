import type { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (per process). For production, use Redis or another shared store.
type RateLimitConfig = {
  windowMs: number;
  max: number;
};

type HitRecord = {
  count: number;
  firstHit: number;
};

const rateLimitStore = new Map<string, HitRecord>();

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const [first] = xff.split(',');
    return first.trim();
  }
  // Next.js may expose ip on the request in some runtimes
  // @ts-expect-error ip may exist at runtime
  return (req as any).ip ?? 'unknown';
}

export function isRateLimited(
  key: string,
  { windowMs, max }: RateLimitConfig
): boolean {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing) {
    rateLimitStore.set(key, { count: 1, firstHit: now });
    return false;
  }

  if (now - existing.firstHit > windowMs) {
    rateLimitStore.set(key, { count: 1, firstHit: now });
    return false;
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);

  return existing.count > max;
}

export function sanitizeNote(input: unknown, maxLength = 300): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  // Remove control characters except common whitespace
  const cleaned = trimmed.replace(/[^\x20-\x7E\u00A0-\uFFEF]/g, '');
  return cleaned.slice(0, maxLength);
}

