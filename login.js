document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const userId = document.getElementById('user-id').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, password: password })
    });

    // レスポンスがJSONかどうかを確認してから解析する
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok) {
        window.location.href = '/index.html';
      } else {
        errorMessage.textContent = data.message;
      }
    } else {
      errorMessage.textContent = 'サーバーから予期しない応答がありました。';
    }
  } catch (e) {
    errorMessage.textContent = '通信エラーが発生しました。';
  }
});

document.getElementById('signup-button').addEventListener('click', () => {
  window.location.href = '/signup.html';
});
