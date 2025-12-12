// DenoのHTTPサーバーをインポート
// DenoはES ModulesのURLインポートに対応しています
import { serve } from 'https://deno.land/std@0.207.0/http/server.ts';

// ユーザーデータを模倣した簡易データベース
const MOCK_USERS = [
  { id: 'denouser', passwordHash: 'password1234', name: 'Deno 太郎' },
  { id: 'testuser', passwordHash: 'securepass', name: 'テスト ユーザー' }
];

/**
 * ログイン処理を行う関数
 * @param {Request} request HTTPリクエストオブジェクト
 * @returns {Promise<Response>} HTTPレスポンス
 */
async function handleLogin(request) {
  try {
    // 1. リクエストボディのJSONを解析
    const { id, password } = await request.json();

    // IDとパスワードが提供されているかチェック
    if (!id || !password) {
      return new Response(JSON.stringify({ message: 'IDとパスワードを入力してください' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. データベース（モック）でユーザーを検索し、認証
    const user = MOCK_USERS.find((u) => u.id === id);

    // ユーザーが存在しない、またはパスワードが一致しない場合
    if (!user || user.passwordHash !== password) {
      return new Response(JSON.stringify({ message: 'IDまたはパスワードが一致しません' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. 認証成功
    const responseBody = JSON.stringify({
      message: 'ログインに成功しました',
      token: 'dummy_jwt_token_12345', // ダミーのトークン
      userName: user.name
    });

    // 成功（200 OK）レスポンスを返す
    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('ログイン処理エラー:', error);
    // JSONパース失敗など、サーバー側のエラー
    return new Response(JSON.stringify({ message: 'サーバーエラーが発生しました' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * メインのルーティング処理
 * @param {Request} request HTTPリクエストオブジェクト
 * @returns {Response | Promise<Response>} HTTPレスポンス
 */
function handler(request) {
  const url = new URL(request.url);

  // /api/login パスへの POST リクエストを処理 (ルーティング)
  if (url.pathname === '/api/login' && request.method === 'POST') {
    return handleLogin(request);
  }

  // 他のパスやメソッドは「見つからない」として処理
  return new Response('Not Found', { status: 404 });
}

// サーバー起動
const port = 8000;
console.log(`サーバーは http://localhost:${port} で動作中です`);
serve(handler, { port });
