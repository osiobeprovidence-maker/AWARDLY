import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';

const http = httpRouter();

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsResponse(body: string | null, init?: ResponseInit): Response {
  return new Response(body, {
    ...init,
    headers: {
      ...(init?.headers as Record<string, string>),
      ...CORS_HEADERS,
    },
  });
}

http.route({
  path: '/upload',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const blob = await request.blob();

    if (blob.size === 0) {
      return corsResponse(JSON.stringify({ error: 'No file provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (blob.size > 5 * 1024 * 1024) {
      return corsResponse(JSON.stringify({ error: 'File too large (max 5MB)' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    try {
      const storageId = await ctx.storage.store(blob);
      return corsResponse(JSON.stringify({ storageId }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
      return corsResponse(JSON.stringify({ error: error.message || 'Upload failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }),
});

http.route({
  path: '/upload',
  method: 'OPTIONS',
  handler: httpAction(async () => {
    return corsResponse(null, { status: 204 });
  }),
});

http.route({
  path: '/health',
  method: 'GET',
  handler: httpAction(async () => {
    return corsResponse(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
});

export default http;
