document.getElementById('btn-back').addEventListener('click', () => {
  window.location.href = '/index.html';
});

async function loadProfile() {
  const response = await fetch('/api/user-profile');
  const user = await response.json();
  document.getElementById('view-name').textContent = user.name;
  document.getElementById('view-id').textContent = user.id;
  document.getElementById('view-job').textContent = user.occupation || '未設定';
  document.getElementById('view-gender').textContent = user.gender || '未設定';
}

document.getElementById('btn-edit').addEventListener('click', () => {
  window.location.href = '/prohensyu.html';
});

loadProfile();
