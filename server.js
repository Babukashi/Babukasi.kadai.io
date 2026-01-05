// server.js
// Denoの標準ライブラリから必要なモジュールをインポート
import { serve } from 'https://deno.land/std@0.207.0/http/server.ts';
import { extname } from 'https://deno.land/std/path/mod.ts';
import { exists } from 'https://deno.land/std/fs/mod.ts';

// ユーザーデータを管理する簡易データベース（メモリ上の配列）
const MOCK_USERS = [
  { id: 'denouser', passwordHash: 'password1234', name: 'Deno 太郎' },
  { id: 'testuser', passwordHash: 'securepass', name: 'テスト ユーザー' }
];

/**
 * 1. ログイン処理 (POST /api/login)
 */
async function handleLogin(request) {
  try {
    const { id, password } = await request.json();

    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user || user.passwordHash !== password) {
      return new Response(JSON.stringify({ message: 'IDまたはパスワードが一致しません' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(
      JSON.stringify({
        message: 'ログイン成功',
        userName: user.name
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: 'サーバーエラー' }), { status: 500 });
  }
}

/**
 * 2. 新規登録処理 (POST /api/signup)
 */
async function handleSignup(request) {
  try {
    const { id, password } = await request.json();

    if (MOCK_USERS.find((u) => u.id === id)) {
      return new Response(JSON.stringify({ message: 'そのIDは既に使用されています' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    MOCK_USERS.push({ id, passwordHash: password, name: `${id} さん` });
    return new Response(JSON.stringify({ message: '登録成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'エラーが発生しました' }), { status: 500 });
  }
}

/**
 * ファイル拡張子からMIMEタイプを判定するヘルパー関数
 */
function getMimeType(filePath) {
  const extension = extname(filePath);
  switch (extension) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.png':
      return 'image/png';
    default:
      return 'application/octet-stream';
  }
}

/**
 * メインのルーティング処理
 */
async function handler(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // --- API ルーティング (POST) ---
  if (request.method === 'POST') {
    if (pathname === '/api/login') return handleLogin(request);
    if (pathname === '/api/signup') return handleSignup(request);
  }

  // --- 静的ファイル提供 (GET) ---
  if (request.method === 'GET') {
    // 【重要】ルートパス ("/") アクセス時は login.html を返す
    let filePath = pathname === '/' ? './login.html' : `./${pathname}`;

    if (await exists(filePath)) {
      try {
        const fileContent = await Deno.readFile(filePath);
        const mimeType = getMimeType(filePath);
        return new Response(fileContent, {
          status: 200,
          headers: { 'Content-Type': mimeType }
        });
      } catch (e) {
        return new Response('Internal Server Error', { status: 500 });
      }
    }
  }

  return new Response('Not Found', { status: 404 });
}

// サーバー起動
const port = 8000;
console.log(`サーバーは http://localhost:${port} で動作中です`);
serve(handler, { port, hostname: '0.0.0.0' });
