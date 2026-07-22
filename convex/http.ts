import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';

const http = httpRouter();

http.route({
  path: '/upload',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const blob = await request.blob();

    if (blob.size === 0) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (blob.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File too large (max 5MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const storageId = await ctx.storage.store(blob);
      console.log('Upload complete: storageId:', storageId);

      return new Response(JSON.stringify({ storageId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error('Upload failed:', error);
      return new Response(JSON.stringify({ error: error.message || 'Upload failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),
});

http.route({
  path: '/health',
  method: 'GET',
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
});

export default http;
