import { serve } from 'https://deno.land/std@0.207.0/http/server.ts';
import { extname } from 'https://deno.land/std/path/mod.ts';
import { exists } from 'https://deno.land/std/fs/mod.ts';

// --- データ保持 (再起動するとリセットされます) ---
let MOCK_USERS = [
  { id: '2316871@mwu.jp', passwordHash: 'password', name: '学生ユーザー', occupation: '大学生', gender: '女' }
];
let BOOKMARKS = [];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
  });
}

async function handler(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // --- API (POST) ---
  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}));

    if (pathname === '/api/login') {
      const user = MOCK_USERS.find((u) => u.id === body.id && u.passwordHash === body.password);
      return user ? jsonResponse({ message: 'OK' }) : jsonResponse({ message: 'IDまたはパスワードが違います' }, 401);
    }

    if (pathname === '/api/signup') {
      if (MOCK_USERS.find((u) => u.id === body.id)) {
        return jsonResponse({ message: 'このIDは既に使われています' }, 400);
      }
      MOCK_USERS.push({ id: body.id, passwordHash: body.password, name: '新規ユーザー' });
      return jsonResponse({ message: 'OK' });
    }

    if (pathname === '/api/add-bookmark') {
      BOOKMARKS.push({ id: Date.now(), ...body });
      return jsonResponse({ message: 'OK' });
    }

    if (pathname === '/api/update-bookmark') {
      const index = BOOKMARKS.findIndex((b) => b.id === body.id);
      if (index !== -1) BOOKMARKS[index] = body;
      return jsonResponse({ message: 'OK' });
    }

    if (pathname === '/api/delete-bookmark') {
      BOOKMARKS = BOOKMARKS.filter((b) => b.id !== body.id);
      return jsonResponse({ message: 'OK' });
    }

    if (pathname === '/api/update-profile') {
      MOCK_USERS[0] = { ...MOCK_USERS[0], ...body };
      return jsonResponse({ message: 'OK' });
    }

    if (pathname === '/api/update-auth') {
      MOCK_USERS[0].id = body.id;
      MOCK_USERS[0].passwordHash = body.password;
      return jsonResponse({ message: 'OK' });
    }
  }

  // --- GET (ファイル提供 & データ取得) ---
  if (request.method === 'GET') {
    if (pathname === '/api/user-profile') return jsonResponse(MOCK_USERS[0]);
    if (pathname === '/api/bookmarks') return jsonResponse(BOOKMARKS);
    if (pathname === '/api/bookmark') {
      const id = parseInt(url.searchParams.get('id'));
      const item = BOOKMARKS.find((b) => b.id === id);
      return item ? jsonResponse(item) : jsonResponse({}, 404);
    }

    // 静的ファイル (index.html, login.htmlなど)
    let filePath = pathname === '/' ? './login.html' : `./${pathname}`;
    if (await exists(filePath)) {
      const content = await Deno.readFile(filePath);
      const ext = extname(filePath);
      const mime = ext === '.css' ? 'text/css' : ext === '.js' ? 'text/javascript' : 'text/html';
      return new Response(content, { headers: { 'Content-Type': mime } });
    }
  }

  return new Response('Not Found', { status: 404 });
}

console.log('サーバーを起動しました: http://localhost:8000');
serve(handler, { port: 8000, hostname: '0.0.0.0' });
