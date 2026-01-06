document.getElementById('btn-back').addEventListener('click', () => {
  window.location.href = '/profile.html';
});

async function loadData() {
  const response = await fetch('/api/user-profile');
  const user = await response.json();
  document.getElementById('edit-name').value = user.name;
  document.getElementById('edit-job').value = user.occupation || '大学生';
  document.getElementById('edit-gender').value = user.gender || '回答しない';
}

document.getElementById('btn-go-idpass').addEventListener('click', () => {
  window.location.href = '/idpass.html';
});

document.getElementById('btn-save').addEventListener('click', async () => {
  await fetch('/api/update-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('edit-name').value,
      occupation: document.getElementById('edit-job').value,
      gender: document.getElementById('edit-gender').value
    })
  });
  window.location.href = '/profile.html';
});

loadData();
