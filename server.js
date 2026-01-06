import { serve } from 'https://deno.land/std@0.207.0/http/server.ts';
import { extname } from 'https://deno.land/std/path/mod.ts';
import { exists } from 'https://deno.land/std/fs/mod.ts';

// --- データ保持 (サーバーを再起動するとリセットされます) ---
let MOCK_USERS = [
  {
    id: '1234',
    passwordHash: 'password',
    name: '学生ユーザー',
    occupation: '大学生',
    gender: '女'
  }
];
let BOOKMARKS = [];

// レスポンスを生成する共通関数
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
  });
}

async function handler(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // --- API (POSTメソッド: データ送信・更新) ---
  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}));

    // 1. ログイン
    if (pathname === '/api/login') {
      console.log('--- ログイン試行 ---');
      console.log('届いたID:', body.id);
      console.log('届いたPW:', body.password);

      const user = MOCK_USERS.find((u) => u.id === body.id && u.passwordHash === body.password);
      if (user) {
        console.log('結果: 成功');
        return jsonResponse({ message: 'OK' });
      } else {
        console.log('結果: 失敗 (一致するユーザーがいません)');
        return jsonResponse({ message: 'IDまたはパスワードが違います' }, 401);
      }
    }

    // 2. 新規会員登録
    if (pathname === '/api/signup') {
      if (MOCK_USERS.find((u) => u.id === body.id)) {
        return jsonResponse({ message: 'このIDは既に使われています' }, 400);
      }
      MOCK_USERS.push({
        id: body.id,
        passwordHash: body.password,
        name: '新規ユーザー',
        occupation: '未設定',
        gender: '未設定'
      });
      return jsonResponse({ message: 'OK' });
    }

    // 3. ブックマーク追加
    if (pathname === '/api/add-bookmark') {
      BOOKMARKS.push({ id: Date.now(), ...body });
      return jsonResponse({ message: 'OK' });
    }

    // 4. ブックマーク更新
    if (pathname === '/api/update-bookmark') {
      const index = BOOKMARKS.findIndex((b) => b.id === body.id);
      if (index !== -1) BOOKMARKS[index] = body;
      return jsonResponse({ message: 'OK' });
    }

    // 5. ブックマーク削除
    if (pathname === '/api/delete-bookmark') {
      BOOKMARKS = BOOKMARKS.filter((b) => b.id !== body.id);
      return jsonResponse({ message: 'OK' });
    }

    // 6. プロフィール基本情報更新
    if (pathname === '/api/update-profile') {
      // 簡易的に最初のユーザーを更新
      MOCK_USERS[0] = { ...MOCK_USERS[0], ...body };
      return jsonResponse({ message: 'OK' });
    }

    // 7. ID・パスワードの変更
    if (pathname === '/api/update-auth') {
      MOCK_USERS[0].id = body.id;
      MOCK_USERS[0].passwordHash = body.password;
      console.log('認証情報が変更されました:', MOCK_USERS[0]);
      return jsonResponse({ message: 'OK' });
    }
  }

  // --- GET (ファイル提供 & データ取得) ---
  if (request.method === 'GET') {
    // データ取得系API
    if (pathname === '/api/user-profile') return jsonResponse(MOCK_USERS[0]);
    if (pathname === '/api/bookmarks') return jsonResponse(BOOKMARKS);
    if (pathname === '/api/bookmark') {
      const id = parseInt(url.searchParams.get('id'));
      const item = BOOKMARKS.find((b) => b.id === id);
      return item ? jsonResponse(item) : jsonResponse({}, 404);
    }

    // 静的ファイル提供 (HTML, CSS, JS)
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

console.log('------------------------------------------');
console.log('サーバーを起動しました: http://localhost:8000');
console.log('ログインできないときは、この画面に表示されるパスワードを確認してください');
console.log('------------------------------------------');

serve(handler, { port: 8000, hostname: '0.0.0.0' });
