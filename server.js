import { serve } from 'https://deno.land/std@0.207.0/http/server.ts';
import { extname } from 'https://deno.land/std/path/mod.ts';
import { exists } from 'https://deno.land/std/fs/mod.ts';

// ユーザーデータを管理する簡易データベース
const MOCK_USERS = [
  { id: 'denouser', passwordHash: 'password1234', name: 'Deno 太郎' },
  { id: 'testuser', passwordHash: 'securepass', name: 'テスト ユーザー' }
];

/** 1. ログイン処理 */
async function handleLogin(request) {
  try {
    const { id, password } = await request.json();
    const user = MOCK_USERS.find((u) => u.id === id && u.passwordHash === password);

    if (user) {
      return new Response(JSON.stringify({ message: 'ログイン成功' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ message: 'IDまたはパスワードが一致しません' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ message: 'サーバーエラー' }), { status: 500 });
  }
}

/** 2. 新規登録処理 */
async function handleSignup(request) {
  try {
    const { id, password } = await request.json();
    if (MOCK_USERS.find((u) => u.id === id)) {
      return new Response(JSON.stringify({ message: '既に存在するIDです' }), { status: 400 });
    }
    MOCK_USERS.push({ id, passwordHash: password, name: `${id} さん` });
    return new Response(JSON.stringify({ message: '登録成功' }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ message: 'エラーが発生しました' }), { status: 500 });
  }
}

/** 3. ログアウト処理 */
async function handleLogout() {
  console.log('ログアウトAPIが呼び出されました');
  // サーバー側でセッション破棄などを行う場合はここに記述
  return new Response(JSON.stringify({ message: 'ログアウト完了' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

/** MIMEタイプ判定 */
function getMimeType(filePath) {
  const extension = extname(filePath);
  switch (extension) {
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

/** メインハンドラー */
async function handler(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // --- API ルーティング (POST) ---
  if (request.method === 'POST') {
    if (pathname === '/api/login') return handleLogin(request);
    if (pathname === '/api/signup') return handleSignup(request);
    if (pathname === '/api/logout') return handleLogout();
  }

  // --- 静的ファイル提供 (GET) ---
  if (request.method === 'GET') {
    // ルートアクセス時はログイン画面を表示
    let filePath = pathname === '/' ? './login.html' : `./${pathname}`;

    if (await exists(filePath)) {
      try {
        const fileContent = await Deno.readFile(filePath);
        return new Response(fileContent, {
          status: 200,
          headers: { 'Content-Type': getMimeType(filePath) }
        });
      } catch {
        return new Response('Internal Server Error', { status: 500 });
      }
    }
  }

  return new Response('Not Found', { status: 404 });
}

const port = 8000;
console.log(`サーバー起動中: http://localhost:${port}`);
serve(handler, { port, hostname: '0.0.0.0' });
// サーバーはDenoで実行してください: deno run --allow-net --allow-read server.js
