document.getElementById('btn-back').addEventListener('click', () => {
  window.location.href = '/index.html';
});

async function loadBookmarks() {
  const response = await fetch('/api/bookmarks');
  const bookmarks = await response.json();
  const listContainer = document.getElementById('bookmark-list');
  listContainer.innerHTML = '';

  // 最大5行表示（登録がない場合も空行を表示する仕様に対応）
  const displayCount = Math.max(bookmarks.length, 5);

  for (let i = 0; i < displayCount; i++) {
    const item = bookmarks[i];
    const row = document.createElement('div');
    row.className = 'list-item';

    row.innerHTML = `
            <div class="item-index">${i + 1}.</div>
            <div class="item-title">${item ? item.title : ''}</div>
            <button class="detail-button" ${item ? '' : 'disabled'} onclick="goToDetail(${
      item ? item.id : -1
    })">詳細</button>
        `;
    listContainer.appendChild(row);
  }
}

function goToDetail(id) {
  if (id !== -1) window.location.href = `/syousai.html?id=${id}`;
}

loadBookmarks();
