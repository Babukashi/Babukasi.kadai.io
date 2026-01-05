// server.js
// DenoのHTTPサーバーと、ファイル操作、パス操作のためのモジュールをインポート
import { serve } from 'https://deno.land/std@0.207.0/http/server.ts';
import { extname } from 'https://deno.land/std/path/mod.ts';
import { exists } from 'https://deno.land/std/fs/mod.ts';

// ユーザーデータを管理する簡易的なデータベース（メモリ上の配列）
const MOCK_USERS = [
  { id: 'denouser', passwordHash: 'password1234', name: 'Deno 太郎' },
  { id: 'testuser', passwordHash: 'securepass', name: 'テスト ユーザー' }
];

/**
 * 1. ログイン処理を行う関数
 */
async function handleLogin(request) {
  try {
    const { id, password } = await request.json();

    // IDとパスワードの入力チェック
    if (!id || !password) {
      return new Response(JSON.stringify({ message: 'IDとパスワードを入力してください' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ユーザーの照合
    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user || user.passwordHash !== password) {
      return new Response(JSON.stringify({ message: 'IDまたはパスワードが一致しません' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 認証成功
    return new Response(
      JSON.stringify({
        message: 'ログインに成功しました',
        token: 'dummy_token',
        userName: user.name
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: 'サーバーエラーが発生しました' }), { status: 500 });
  }
}

/**
 * 2. 新規登録処理を行う関数
 */
async function handleSignup(request) {
  try {
    const { id, password } = await request.json();

    // 既に存在するIDかチェック
    if (MOCK_USERS.find((u) => u.id === id)) {
      return new Response(JSON.stringify({ message: 'そのIDは既に使用されています' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 新しいユーザーを追加
    MOCK_USERS.push({ id: id, passwordHash: password, name: `${id} さん` });
    console.log(`新規登録成功: ${id}`);

    return new Response(JSON.stringify({ message: '登録成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'エラーが発生しました' }), { status: 500 });
  }
}

/**
 * ファイルの拡張子からMIMEタイプを判定するヘルパー関数
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

  // --- APIリクエスト (POST) のルーティング ---
  if (pathname === '/api/login' && request.method === 'POST') {
    return handleLogin(request);
  }
  if (pathname === '/api/signup' && request.method === 'POST') {
    return handleSignup(request);
  }

  // --- 静的ファイル (GET) のルーティング ---
  if (request.method === 'GET') {
    // ルートパス ("/") にアクセスされた場合は login.html を表示する
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

  // 該当なし
  return new Response('Not Found', { status: 404 });
}

// サーバー起動設定
const port = 8000;
console.log(`サーバーは http://localhost:${port} で動作中です`);
serve(handler, { port, hostname: '0.0.0.0' });
