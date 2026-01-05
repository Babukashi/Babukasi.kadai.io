import { serve } from 'https://deno.land/std@0.207.0/http/server.ts';
import { extname } from 'https://deno.land/std/path/mod.ts';
import { exists } from 'https://deno.land/std/fs/mod.ts';

const MOCK_USERS = [
  { id: 'denouser', passwordHash: 'password1234', name: 'Deno 太郎' },
  { id: '2316871@mwu.jp', passwordHash: 'password', name: '学生ユーザー' } // テスト用に追加
];

/** JSONレスポンスを生成する共通関数 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleLogin(request) {
  try {
    const { id, password } = await request.json();
    const user = MOCK_USERS.find((u) => u.id === id && u.passwordHash === password);
    if (user) {
      return jsonResponse({ message: 'ログイン成功' });
    }
    return jsonResponse({ message: 'IDまたはパスワードが一致しません' }, 401);
  } catch {
    return jsonResponse({ message: '不正なリクエストです' }, 400);
  }
}

async function handleSignup(request) {
  try {
    const { id, password } = await request.json();
    if (MOCK_USERS.find((u) => u.id === id)) {
      return jsonResponse({ message: 'そのIDは既に使用されています' }, 400);
    }
    MOCK_USERS.push({ id, passwordHash: password, name: id });
    return jsonResponse({ message: '登録完了' });
  } catch {
    return jsonResponse({ message: '登録エラー' }, 500);
  }
}

async function handleLogout() {
  return jsonResponse({ message: 'ログアウト完了' });
}

function getMimeType(filePath) {
  const ext = extname(filePath);
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    default:
      return 'application/octet-stream';
  }
}

async function handler(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // --- API (POST) ---
  if (request.method === 'POST') {
    if (pathname === '/api/login') return handleLogin(request);
    if (pathname === '/api/signup') return handleSignup(request);
    if (pathname === '/api/logout') return handleLogout();
  }

  // --- 静的ファイル (GET) ---
  if (request.method === 'GET') {
    let filePath = pathname === '/' ? './login.html' : `./${pathname}`;
    if (await exists(filePath)) {
      const content = await Deno.readFile(filePath);
      return new Response(content, { headers: { 'Content-Type': getMimeType(filePath) } });
    }
  }

  return new Response('Not Found', { status: 404 });
}

console.log(`サーバー起動: http://localhost:8000`);
serve(handler, { port: 8000, hostname: '0.0.0.0' });
