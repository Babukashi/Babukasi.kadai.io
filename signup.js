document.getElementById('signup-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const userId = document.getElementById('user-id').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, password: password })
    });

    if (response.ok) {
      // 成功したら完了画面へ
      window.location.href = '/finish.html';
    } else {
      const data = await response.json();
      errorMessage.textContent = data.message || '登録に失敗しました。';
    }
  } catch (error) {
    errorMessage.textContent = 'サーバーとの通信に失敗しました。';
  }
});
