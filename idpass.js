document.getElementById('btn-back').addEventListener('click', () => {
  window.location.href = '/prohensyu.html';
});

document.getElementById('btn-save-auth').addEventListener('click', async () => {
  const id = document.getElementById('new-id').value;
  const pass = document.getElementById('new-pass').value;

  if (!id || !pass) return alert('入力してください');

  await fetch('/api/update-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, password: pass })
  });
  window.location.href = '/prohensyu.html';
});
