// 各ボタン要素の取得
const btnTouroku = document.getElementById('btn-touroku');
const btnKanri = document.getElementById('btn-kanri');
const btnProfile = document.getElementById('btn-profile');
const btnLogout = document.getElementById('btn-logout');

/**
 * 登録画面へ遷移
 */
btnTouroku.addEventListener('click', () => {
  window.location.href = '/touroku.html';
});

/**
 * 管理画面へ遷移
 */
btnKanri.addEventListener('click', () => {
  window.location.href = '/kanri.html';
});

/**
 * プロフィール画面へ遷移
 */
btnProfile.addEventListener('click', () => {
  window.location.href = '/profile.html';
});

/**
 * ログアウト処理
 * サーバーにログアウトを通知してからログアウト画面へ遷移する
 */
btnLogout.addEventListener('click', async () => {
  try {
    // 1. サーバーのログアウトAPIを呼び出す
    // method: 'POST' で送信（server.js側の設定と合わせる）
    const response = await fetch('/api/logout', {
      method: 'POST'
    });

    if (response.ok) {
      console.log('サーバー側のログアウト処理が完了しました');
    }
  } catch (error) {
    console.error('ログアウト通信中にエラーが発生しました:', error);
  } finally {
    // 2. 通信の成功・失敗に関わらずログアウト画面へ移動
    window.location.href = '/logout.html';
  }
});
