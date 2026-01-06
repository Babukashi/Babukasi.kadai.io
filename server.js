// server.js (完全版)
import { serve } from 'https://deno.land/std@0.207.0/http/server.ts';
import { extname } from 'https://deno.land/std/path/mod.ts';
import { exists } from 'https://deno.land/std/fs/mod.ts';

// データベースの初期状態
const MOCK_USERS = [
  { id: 'denouser', passwordHash: 'password1234', name: 'Deno 太郎' },
  { id: '2316871@mwu.jp', passwordHash: 'password', name: '学生ユーザー' }
];

/** JSONレスポンス送信用のヘルパー */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handler(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // --- API (POST) ---
  if (request.method === 'POST') {
    try {
      if (pathname === '/api/login') {
        const { id, password } = await request.json();
        const user = MOCK_USERS.find((u) => u.id === id && u.passwordHash === password);
        return user ? jsonResponse({ message: 'OK' }) : jsonResponse({ message: 'IDまたはパスワードが違います' }, 401);
      }

      if (pathname === '/api/signup') {
        const { id, password } = await request.json();
        if (MOCK_USERS.find((u) => u.id === id)) {
          return jsonResponse({ message: '既に登録されているIDです' }, 400);
        }
        MOCK_USERS.push({ id, passwordHash: password, name: id });
        return jsonResponse({ message: 'OK' });
      }

      if (pathname === '/api/logout') return jsonResponse({ message: 'OK' });
    } catch (e) {
      return jsonResponse({ message: 'リクエスト処理エラー' }, 400);
    }
  }

  // --- 静的ファイル (GET) ---
  if (request.method === 'GET') {
    let filePath = pathname === '/' ? './login.html' : `./${pathname}`;
    if (await exists(filePath)) {
      const content = await Deno.readFile(filePath);
      const mime =
        extname(filePath) === '.css' ? 'text/css' : extname(filePath) === '.js' ? 'text/javascript' : 'text/html';
      return new Response(content, { headers: { 'Content-Type': mime } });
    }
  }

  return new Response('Not Found', { status: 404 });
}

console.log('サーバーを起動しました: http://localhost:8000');
serve(handler, { port: 8000, hostname: '0.0.0.0' });
