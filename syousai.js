const params = new URLSearchParams(window.location.search);
const id = params.get('id');

document.getElementById('btn-back').addEventListener('click', () => {
  window.location.href = '/kanri.html';
});

async function loadDetail() {
  const response = await fetch(`/api/bookmark?id=${id}`);
  const item = await response.json();
  document.getElementById('view-url').textContent = item.url;
  document.getElementById('view-title').textContent = item.title;
  document.getElementById('view-memo').textContent = item.memo || '';
}

document.getElementById('btn-edit').addEventListener('click', () => {
  window.location.href = `/hensyu.html?id=${id}`;
});

loadDetail();
