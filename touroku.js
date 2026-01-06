// 戻るボタンの処理
document.getElementById('back-home').addEventListener('click', () => {
  window.location.href = '/index.html';
});

// 登録ボタンの処理
document.getElementById('submit-bookmark').addEventListener('click', async () => {
  const url = document.getElementById('bm-url').value;
  const title = document.getElementById('bm-title').value;
  const memo = document.getElementById('bm-memo').value;
  const errorText = document.getElementById('title-error');

  // バリデーション：タイトルの入力がない場合
  if (!title.trim()) {
    errorText.textContent = 'タイトルは必ず入力してください。';
    return;
  } else {
    errorText.textContent = '';
  }

  try {
    const response = await fetch('/api/add-bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title, memo })
    });

    if (response.ok) {
      // 登録成功 -> 登録完了画面へ
      window.location.href = '/tourokufin.html';
    } else {
      alert('登録に失敗しました。');
    }
  } catch (e) {
    console.error('通信エラー:', e);
  }
});
