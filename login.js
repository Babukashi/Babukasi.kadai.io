document.getElementById('login-form').addEventListener('submit', function (event) {
  // フォームのデフォルトの送信をキャンセル
  event.preventDefault();

  const userId = document.getElementById('user-id').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  // エラーメッセージをクリア
  errorMessage.textContent = '';

  // サーバーへ認証情報をPOSTで送信
  fetch('/api/login', {
    // ログインAPIのエンドポイント（サーバー側のルーティングで処理）
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: userId,
      password: password
    })
  })
    .then((response) => {
      // 成功（ステータスコード 200-299）
      if (response.ok) {
        return response.json(); // 成功レスポンスのボディをJSONとして取得
      }
      // 失敗（ステータスコード 400-599）
      else {
        // エラーの内容をサーバーから取得
        return response.json().then((data) => {
          // エラー内容を次のcatchブロックへ渡す
          throw new Error(data.message || 'ログインに失敗しました。');
        });
      }
    })
    .then((data) => {
      // ログイン成功時の処理
      // サーバーから認証トークンなどを受け取った後、ホーム画面に遷移
      console.log('ログイン成功:', data);
      window.location.href = 'index.html'; // ホーム画面のパス
    })
    .catch((error) => {
      // ログイン失敗時の処理（サーバーが返すエラーコードを表示）
      console.error('ログインエラー:', error.message);
      errorMessage.textContent = error.message;
    });
});

// 新規登録ボタンの処理
document.getElementById('signup-button').addEventListener('click', function () {
  window.location.href = '/signup.html'; // 新規登録画面のパス
});
