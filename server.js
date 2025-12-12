// DenoのHTTPサーバーをインポート
import { serve } from 'https://deno.land/std@0.207.0/http/server.js';
// ファイルシステム操作のためのモジュールをインポート
import { extname } from 'https://deno.land/std/path/mod.ts';
import { exists } from 'https://deno.land/std/fs/mod.ts';

// ユーザーデータを模倣した簡易データベース（変更なし）
const MOCK_USERS = [
  { id: 'denouser', passwordHash: 'password1234', name: 'Deno 太郎' },
  { id: 'testuser', passwordHash: 'securepass', name: 'テスト ユーザー' }
];

// ... (handleLogin 関数は変更なし) ...
async function handleLogin(request) {
  // ... (前述の handleLogin 関数の中身) ...
}

/**
 * ファイルのMIMEタイプを返すヘルパー関数
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
 * メインのルーティング処理 (静的ファイル提供機能を追加)
 * @param {Request} request HTTPリクエストオブジェクト
 * @returns {Response | Promise<Response>} HTTPレスポンス
 */
async function handler(request) {
  const url = new URL(request.url);
  const pathname = url.pathname; // 1. /api/login パスへの POST リクエストを処理

  if (pathname === '/api/login' && request.method === 'POST') {
    return handleLogin(request);
  } // 2. 静的ファイル (HTML, CSS, JS) の GET リクエストを処理

  if (request.method === 'GET') {
    // ルートパス ("/") の場合は index.html を返す
    let filePath = pathname === '/' ? './index.html' : `./${pathname}`;

    // パスがファイルとして存在するかチェック
    if (await exists(filePath)) {
      try {
        // ファイルを読み込む
        const fileContent = await Deno.readFile(filePath);
        const mimeType = getMimeType(filePath);

        // ファイル内容を返す (200 OK)
        return new Response(fileContent, {
          status: 200,
          headers: {
            'Content-Type': mimeType
          }
        });
      } catch (e) {
        console.error('ファイル読み込みエラー:', e);
        return new Response('Internal Server Error', { status: 500 });
      }
    }
  } // 3. どちらにも該当しない場合は Not Found

  return new Response('Not Found', { status: 404 });
}

// サーバー起動
const port = 8000;
console.log(`サーバーは http://localhost:${port} で動作中です`);
serve(handler, { port });
