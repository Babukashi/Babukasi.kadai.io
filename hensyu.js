const params = new URLSearchParams(window.location.search);
const id = params.get('id');

document.getElementById('btn-back').addEventListener('click', () => {
  window.location.href = `/syousai.html?id=${id}`;
});

async function loadData() {
  const response = await fetch(`/api/bookmark?id=${id}`);
  const item = await response.json();
  document.getElementById('edit-url').value = item.url;
  document.getElementById('edit-title').value = item.title;
  document.getElementById('edit-memo').value = item.memo || '';
}

document.getElementById('btn-save').addEventListener('click', async () => {
  const title = document.getElementById('edit-title').value;
  if (!title) return alert('タイトルは必須です');

  await fetch('/api/update-bookmark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: parseInt(id),
      url: document.getElementById('edit-url').value,
      title: title,
      memo: document.getElementById('edit-memo').value
    })
  });
  window.location.href = '/kanri.html';
});

document.getElementById('btn-delete').addEventListener('click', async () => {
  if (!confirm('本当に消去しますか？')) return;
  await fetch('/api/delete-bookmark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) })
  });
  window.location.href = '/kanri.html';
});

loadData();
