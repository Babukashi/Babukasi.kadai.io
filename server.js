import { extname } from 'https://deno.land/std@0.207.0/path/mod.ts';

// --- データ保持 ---
let MOCK_USERS = [
  {
    id: '1234',
    passwordHash: 'password',
    name: 'ユーザー',
    occupation: '未選択',
    gender: '未選択'
  }
];
let BOOKMARKS = [];
let currentUser = null;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
  });
}

const handler = async (request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // --- API (POSTメソッド) ---
  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}));

    if (pathname === '/api/login') {
      const user = MOCK_USERS.find((u) => u.id === body.id && u.passwordHash === body.password);
      if (user) {
        currentUser = user;
        return jsonResponse({ message: 'OK' });
      }
      return jsonResponse({ message: 'IDまたはパスワードが違います' }, 401);
    }

    if (pathname === '/api/signup') {
      if (MOCK_USERS.find((u) => u.id === body.id)) {
        return jsonResponse({ message: 'このIDは既に使われています' }, 400);
      }
      const newUser = {
        id: body.id,
        passwordHash: body.password,
        name: '新規ユーザー',
        occupation: '未設定',
        gender: '未設定'
      };
      MOCK_USERS.push(newUser);
      return jsonResponse({ message: 'OK' });
    }

    if (pathname === '/api/add-bookmark') {
      BOOKMARKS.push({ id: Date.now(), ...body });
      return jsonResponse({ message: 'OK' });
    }

    // ブックマーク削除
    if (pathname === '/api/delete-bookmark') {
      BOOKMARKS = BOOKMARKS.filter((b) => b.id !== body.id);
      return jsonResponse({ message: 'OK' });
    }

    if (pathname === '/api/update-profile') {
      if (currentUser) {
        Object.assign(currentUser, body);
        return jsonResponse({ message: 'OK' });
      }
      return jsonResponse({ message: 'ログインが必要です' }, 401);
    }
  }

  // --- GET (ファイル提供 & データ取得) ---
  if (request.method === 'GET') {
    // ユーザー情報取得
    if (pathname === '/api/user-profile') return jsonResponse(currentUser || {});

    // 全データ取得
    if (pathname === '/api/bookmarks') return jsonResponse(BOOKMARKS);

    if (pathname === '/api/bookmark') {
      const id = parseInt(url.searchParams.get('id')); // URLからIDを取得
      const item = BOOKMARKS.find((b) => b.id === id); // IDが一致するものを探す
      if (item) {
        return jsonResponse(item);
      } else {
        return jsonResponse({ message: 'データが見つかりません' }, 404);
      }
    }

    // 静的ファイル提供
    let filePath = pathname === '/' ? './login.html' : `.${pathname}`;
    try {
      const content = await Deno.readFile(filePath);
      const ext = extname(filePath);
      const mimeTypes = {
        '.html': 'text/html; charset=UTF-8',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png'
      };
      const mime = mimeTypes[ext] || 'text/plain';
      return new Response(content, { headers: { 'Content-Type': mime } });
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  }

  return new Response('Not Found', { status: 404 });
};

Deno.serve(handler);
