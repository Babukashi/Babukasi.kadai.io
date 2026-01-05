// 各ボタンの要素を取得
const btnTouroku = document.getElementById('btn-touroku');
const btnKanri = document.getElementById('btn-kanri');
const btnProfile = document.getElementById('btn-profile');
const btnLogout = document.getElementById('btn-logout');

// 登録画面へ
btnTouroku.addEventListener('click', () => {
  window.location.href = '/touroku.html';
});

// 管理画面へ
btnKanri.addEventListener('click', () => {
  window.location.href = '/kanri.html';
});

// プロフィール画面へ
btnProfile.addEventListener('click', () => {
  window.location.href = '/profile.html';
});

// ログアウト画面へ
btnLogout.addEventListener('click', () => {
  window.location.href = '/logout.html';
});
