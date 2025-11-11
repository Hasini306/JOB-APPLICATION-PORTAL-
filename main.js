// main.js — minimal frontend glue for job portal
const API_BASE = window.API_BASE || (location.origin.replace(/:\d+$/,'') + ':5000') || 'http://localhost:5000';

// helper to get token
function getToken() { return localStorage.getItem('token'); }
function setToken(t){ localStorage.setItem('token', t); }
function apiFetch(path, opts={}) {
  opts.headers = opts.headers || {};
  if (getToken()) opts.headers['Authorization'] = 'Bearer ' + getToken();
  return fetch(API_BASE + path, opts).then(r => r.json());
}

// if jobs-list element exists, fetch jobs and populate
document.addEventListener('DOMContentLoaded', function(){
  const jobsList = document.getElementById('jobs-list');
  if (jobsList) {
    apiFetch('/api/jobs')
      .then(data => {
        if (!Array.isArray(data)) return;
        jobsList.innerHTML = data.map(j => `
          <div class="job">
            <h3>${j.title}</h3>
            <p><strong>${j.company}</strong> — ${j.location} — ${j.salary || ''}</p>
            <p>${(j.skills||[]).join(', ')}</p>
            <p>${j.description || ''}</p>
            <button data-id="${j._id}" class="apply-btn">Apply</button>
          </div>
        `).join('\n');
      })
      .catch(err => console.error(err));
  }

  // login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const form = e.target;
      const email = form.querySelector('[name=email]').value;
      const password = form.querySelector('[name=password]').value;
      fetch(API_BASE + '/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      }).then(r=>r.json()).then(res=>{
        if (res.token) {
          setToken(res.token);
          alert('Logged in as ' + (res.user?.name || res.user?.email));
          location.href = 'jobs.html';
        } else {
          alert(res.message || 'Login failed');
        }
      }).catch(err => { console.error(err); alert('Login error');});
    });
  }

  // simple apply handler (delegated)
  document.body.addEventListener('click', function(e){
    if (e.target.matches('.apply-btn')) {
      const id = e.target.dataset.id;
      const token = getToken();
      if (!token) { alert('Please login first'); location.href='login.html'; return; }
      // open small file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx';
      input.onchange = async function() {
        const file = input.files[0];
        const fd = new FormData();
        fd.append('resume', file);
        const res = await fetch(API_BASE + '/api/apply/' + id, { method: 'POST', body: fd, headers: { 'Authorization': 'Bearer ' + token }});
        const j = await res.json();
        alert(j.message || 'Applied');
      };
      input.click();
    }
  });
});
