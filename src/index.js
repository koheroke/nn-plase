import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie'
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import os from 'node:os';

const app = new Hono();
const port = process.env.PORT || 3000;
const canvasSize = 1000;
const intervalTime = 60000;
const interval = {};
const clientSecret = process.env.clientSecret;
const clientId = process.env.clientID;
const redirectUri = process.env.redirectUri;
const frontEndUri = process.env.frontEndUri;
const prisma = new PrismaClient({ log: ['query'] });
let pixelCanvasData;


app.use('/assets/*', serveStatic({ root: './client/dist' }));
app.get('/', serveStatic({ path: './client/dist/index.html' }));

async function getCanvasData() {
  const canvas = await prisma.pixelCanvas.findUnique({ where: { id: 1 } });
  if (!canvas) {
    return Array.from({ length: canvasSize }, () => Array(canvasSize).fill(null));
  }
  return JSON.parse(canvas.data);
}

async function initCanvas() {
  pixelCanvasData = await getCanvasData();
  console.log('Canvas data initialized');
}
await initCanvas();
async function resCanvasData(newData) {
  await prisma.pixelCanvas.upsert({
    where: { id: 1 },
    update: { data: newData },
    create: { id: 1, data: newData },
  });
}
setInterval(() => {
  for (const [name, data] of Object.entries(interval)) {
    if (data.theSavedTime < Date.now()) {
      delete interval[name];
    }
  }
}, intervalTime * 10);


app.get('/api/auth', (c) => {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId ?? 'NONE');
  url.searchParams.set('redirect_uri', redirectUri ?? 'NONE');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  return c.redirect(url.toString());
});

app.get('/api/auth/callback/google', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.text('No code provided', 400);

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      code,
      client_id: clientId || '',
      client_secret: clientSecret || '',
      redirect_uri: redirectUri || '',
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) return c.text('Token exchange failed', 500);
  const tokenData = await tokenRes.json();
  const idToken = tokenData.id_token;
  if (!idToken) return c.text('ID token not found', 500);

  const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());

  setCookie(c, 'userSub', payload.sub, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return c.redirect(frontEndUri);
});

app.get('/api/me', (c) => {
  const userSub = getCookie(c, 'userSub');
  if (!userSub) return c.json({ error: 'Not logged in' }, 401);
  return c.json({ sub: userSub });
});

app.get('/api/logout', (c) => {
  setCookie(c, 'userSub', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
  });
  return c.json({ message: 'Logged out' });
});
const server = serve({ fetch: app.fetch, port });
const io = new Server(server);

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('paintEventOn', async ({ posData, name }) => {
    if (interval[name]?.theSavedTime && interval[name].theSavedTime > Date.now()) {
      io.to(socket.id).emit('still');
      return;
    }
    interval[name] = { theSavedTime: Date.now() + intervalTime };
    pixelCanvasData[posData.y][posData.x] = posData.color;
    io.emit('paintEventApplicable', { posData });
    await resCanvasData(JSON.stringify(pixelCanvasData));
  });

  io.to(socket.id).emit('canvasData', JSON.stringify(pixelCanvasData));
});
