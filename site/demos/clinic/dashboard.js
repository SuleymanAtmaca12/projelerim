/* eslint-disable */
const API = 'http://localhost:8000/api';
const WS_URL = 'ws://localhost:8000/ws/dashboard';

// Auth Check & Fetch Interceptor
const token = localStorage.getItem('sc_token');
if (!token) {
  window.location.href = 'login.html';
}

const originalFetch = window.fetch;
window.fetch = async function() {
  let [resource, config] = arguments;
  if(typeof resource === 'string' && resource.startsWith(API)) {
    config = config || {};
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await originalFetch(resource, config);
  if (res.status === 401) {
    localStorage.removeItem('sc_token');
    window.location.href = 'login.html';
  }
  return res;
};

// ── State ──
let appointments = [];
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let ws;

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
  setupNav();
  setupDoctorForm();
  setupSettingsForm();
  connectWebSocket();
  checkAiStatus();
  loadStats();
  loadRecentAppointments();
  loadAllAppointments();
  loadDoctors();
  loadSettings();
  renderCalendar();
  document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
  document.getElementById('prevMonth').addEventListener('click', () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); });
  document.getElementById('nextMonth').addEventListener('click', () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); });
  document.getElementById('addDoctorBtn').addEventListener('click', () => openModal());
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('testMailBtn').addEventListener('click', testMail);
  document.getElementById('doctorModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
});

// ── Clock ──
function updateClock() {
  const now = new Date();
  document.getElementById('topbarTime').textContent =
    now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ── Sidebar toggle (mobile) ──
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ── Navigation ──
function setupNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      showTab(item.dataset.tab);
    });
  });
}

function showTab(tab) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(`nav-${tab}`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');

  const titles = { dashboard: 'Dashboard', calendar: 'Takvim', doctors: 'Doktor Yönetimi', settings: 'Ayarlar' };
  document.getElementById('pageTitle').textContent = titles[tab] || tab;

  if (tab === 'calendar') { loadAllAppointments(); renderCalendar(); }
  if (tab === 'doctors')  loadDoctors();
  if (tab === 'settings') loadSettings();
}

// ── WebSocket ──
function connectWebSocket() {
  ws = new WebSocket(WS_URL);
  const dot = document.getElementById('ws-indicator').querySelector('.ws-dot');
  const text = document.getElementById('ws-status');

  ws.onopen = () => {
    dot.className = 'ws-dot connected';
    text.textContent = 'Canlı Bağlantı';
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === 'new_appointment') {
      showToast('Yeni Randevu!', `${msg.data.patient_name} → ${msg.data.doctor_name}`, 'success');
      loadStats();
      loadRecentAppointments();
      loadAllAppointments();
      renderCalendar();
      // Badge
      const badge = document.getElementById('sidebar-badge');
      badge.textContent = parseInt(badge.textContent || 0) + 1;
    }
  };

  ws.onclose = () => {
    dot.className = 'ws-dot disconnected';
    text.textContent = 'Bağlantı Kesildi';
    setTimeout(connectWebSocket, 3000);
  };

  ws.onerror = () => ws.close();
}

// ── AI Status ──
async function checkAiStatus() {
  const badge = document.getElementById('aiStatusBadge');
  const text = document.getElementById('aiStatusText');
  try {
    const res = await fetch(`${API}/ai/status`);
    const data = await res.json();
    if (data.status === 'online') {
      badge.className = 'ai-status-badge online';
      text.textContent = 'AI Aktif';
    } else {
      badge.className = 'ai-status-badge offline';
      text.textContent = 'AI Çevrimdışı';
    }
  } catch {
    badge.className = 'ai-status-badge offline';
    text.textContent = 'AI Bağlantı Yok';
  }
}

// ── Stats ──
async function loadStats() {
  try {
    const res = await fetch(`${API}/appointments/stats`);
    const d = await res.json();
    document.getElementById('statTotal').textContent = d.total_appointments;
    document.getElementById('statToday').textContent = d.today_appointments;
    document.getElementById('statBranch').textContent = d.top_specialty?.specialty || '—';
    document.getElementById('statDoctors').textContent = d.total_doctors;
  } catch (e) {
    console.error('Stats yüklenemedi', e);
  }
}

// ── Recent Appointments ──
async function loadRecentAppointments() {
  try {
    const res = await fetch(`${API}/appointments/`);
    const data = await res.json();
    const tbody = document.getElementById('recentBody');
    const recent = data.slice(0, 8);
    if (!recent.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="loading-row">Henüz randevu yok</td></tr>';
      return;
    }
    tbody.innerHTML = recent.map(a => `
      <tr>
        <td><strong>${a.patient_name}</strong><br/><span style="color:var(--text-muted);font-size:11px">${a.patient_email}</span></td>
        <td>${a.doctor_name}</td>
        <td>${a.issue}</td>
        <td>${formatDateTime(a.appointment_time)}</td>
        <td><span class="status-badge status-${a.status}">● ${a.status === 'active' ? 'Aktif' : 'İptal'}</span></td>
      </tr>`).join('');
  } catch (e) {
    console.error('Recent appointments yüklenemedi', e);
  }
}

// ── All Appointments ──
async function loadAllAppointments() {
  try {
    const res = await fetch(`${API}/appointments/`);
    appointments = await res.json();
    const tbody = document.getElementById('allAppBody');
    if (!appointments.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Henüz randevu yok</td></tr>';
      return;
    }
    tbody.innerHTML = appointments.map((a, i) => `
      <tr>
        <td style="color:var(--text-muted)">${a.id}</td>
        <td><strong>${a.patient_name}</strong><br/><span style="color:var(--text-muted);font-size:11px">${a.patient_email}</span></td>
        <td>${a.doctor_name}<br/><span style="color:var(--text-muted);font-size:11px">${a.specialty || ''}</span></td>
        <td>${a.issue}</td>
        <td>${formatDateTime(a.appointment_time)}</td>
        <td><button class="btn-danger" onclick="cancelAppointment(${a.id})">İptal Et</button></td>
      </tr>`).join('');
    document.getElementById('sidebar-badge').textContent = appointments.length;
  } catch (e) {
    console.error('Appointments yüklenemedi', e);
  }
}

async function cancelAppointment(id) {
  if (!confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) return;
  try {
    await fetch(`${API}/appointments/${id}`, { method: 'DELETE' });
    showToast('Randevu İptal Edildi', '', 'info');
    loadAllAppointments();
    loadRecentAppointments();
    loadStats();
    renderCalendar();
  } catch {
    showToast('Hata', 'İptal işlemi başarısız', 'error');
  }
}

// ── Calendar ──
function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const label = document.getElementById('calMonthLabel');
  const monthNames = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  label.textContent = `${monthNames[calMonth]} ${calYear}`;

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  // Haftanın günleri (TR: Pzt ile başla)
  const dayNames = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  const startOffset = (firstDay === 0) ? 6 : firstDay - 1;

  let html = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('');

  for (let i = 0; i < startOffset; i++) html += `<div class="cal-day empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayAppts = appointments.filter(a => a.appointment_time && a.appointment_time.startsWith(dateStr) && a.status === 'active');

    const events = dayAppts.slice(0, 2).map(a =>
      `<div class="cal-event" title="${a.patient_name} — ${a.doctor_name}">${a.patient_name.split(' ')[0]}</div>`
    ).join('');
    const more = dayAppts.length > 2 ? `<div class="cal-event" style="background:var(--text-muted)">+${dayAppts.length - 2} daha</div>` : '';

    html += `<div class="cal-day ${isToday ? 'today' : ''}">
      <div class="cal-day-num">${d}</div>
      ${events}${more}
    </div>`;
  }

  grid.innerHTML = html;
}

// ── Doctors ──
async function loadDoctors() {
  try {
    const res = await fetch(`${API}/doctors/all`);
    const doctors = await res.json();
    const grid = document.getElementById('doctorGrid');
    if (!doctors.length) {
      grid.innerHTML = '<div class="loading-row">Doktor bulunamadı</div>';
      return;
    }
    const specialtyEmojis = { 'Diş Hekimi': '🦷', 'Dahiliye': '🩺', 'Ortopedi': '🦴', 'Kardiyoloji': '❤️', 'Nöroloji': '🧠', 'Göz': '👁️', 'KBB': '👂', 'Cilt': '🧴' };
    grid.innerHTML = doctors.map(d => {
      const emoji = Object.entries(specialtyEmojis).find(([k]) => d.specialty.includes(k))?.[1] || '👨‍⚕️';
      return `
      <div class="doctor-card">
        <div class="doctor-avatar">${emoji}</div>
        <div class="doctor-name">${d.name}</div>
        <span class="doctor-specialty">${d.specialty}</span>
        <div class="doctor-meta">🕐 ${d.work_hours} &nbsp;|&nbsp; 📅 ${d.work_days}</div>
        ${d.phone ? `<div class="doctor-meta">📞 ${d.phone}</div>` : ''}
        ${d.email ? `<div class="doctor-meta">📧 ${d.email}</div>` : ''}
        <div class="doctor-actions">
          <button class="btn-secondary" style="flex:1;font-size:12px" onclick="editDoctor(${d.id})">✏️ Düzenle</button>
          <button class="btn-danger" onclick="deleteDoctor(${d.id}, '${d.name}')">🗑️</button>
        </div>
        ${!d.active ? '<div style="position:absolute;top:12px;right:12px;font-size:10px;background:rgba(239,68,68,0.1);color:var(--danger);padding:2px 8px;border-radius:8px">Pasif</div>' : ''}
      </div>`;
    }).join('');
  } catch (e) {
    console.error('Doktorlar yüklenemedi', e);
  }
}

function openModal(doctor = null) {
  const modal = document.getElementById('doctorModal');
  const form = document.getElementById('doctorForm');
  form.reset();
  document.getElementById('doctorId').value = '';

  if (doctor) {
    document.getElementById('modalTitle').textContent = 'Doktor Düzenle';
    document.getElementById('doctorId').value = doctor.id;
    document.getElementById('docName').value = doctor.name || '';
    document.getElementById('docSpecialty').value = doctor.specialty || '';
    document.getElementById('docHours').value = doctor.work_hours || '';
    document.getElementById('docDays').value = doctor.work_days || '';
    document.getElementById('docPhone').value = doctor.phone || '';
    document.getElementById('docEmail').value = doctor.email || '';
  } else {
    document.getElementById('modalTitle').textContent = 'Doktor Ekle';
  }
  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('doctorModal').classList.remove('open');
}

async function editDoctor(id) {
  try {
    const res = await fetch(`${API}/doctors/${id}`);
    const d = await res.json();
    openModal(d);
  } catch {}
}

async function deleteDoctor(id, name) {
  if (!confirm(`${name} adlı doktoru pasife almak istediğinizden emin misiniz?`)) return;
  try {
    await fetch(`${API}/doctors/${id}`, { method: 'DELETE' });
    showToast('Doktor Pasife Alındı', name, 'info');
    loadDoctors();
  } catch {
    showToast('Hata', 'İşlem başarısız', 'error');
  }
}

function setupDoctorForm() {
  document.getElementById('doctorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('doctorId').value;
    const body = {
      name: document.getElementById('docName').value,
      specialty: document.getElementById('docSpecialty').value,
      work_hours: document.getElementById('docHours').value,
      work_days: document.getElementById('docDays').value,
      phone: document.getElementById('docPhone').value,
      email: document.getElementById('docEmail').value,
    };

    const url = id ? `${API}/doctors/${id}` : `${API}/doctors/`;
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        showToast(id ? 'Doktor Güncellendi' : 'Doktor Eklendi', body.name, 'success');
        closeModal();
        loadDoctors();
        loadStats();
      }
    } catch {
      showToast('Hata', 'İşlem başarısız', 'error');
    }
  });
}

// ── Settings ──
async function loadSettings() {
  try {
    const res = await fetch(`${API}/notifications/settings`);
    const s = await res.json();
    Object.entries(s).forEach(([k, v]) => {
      const el = document.getElementById(`set-${k}`);
      if (el) el.value = v;
    });
  } catch {}
}

function setupSettingsForm() {
  document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const keys = ['clinic_name', 'notification_email', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'reminder_hours'];
    const feedback = document.getElementById('settingsFeedback');
    try {
      await Promise.all(keys.map(k => {
        const el = document.getElementById(`set-${k}`);
        if (!el || !el.value) return;
        return fetch(`${API}/notifications/settings/${k}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: el.value })
        });
      }));
      feedback.className = 'form-feedback success';
      feedback.textContent = '✅ Ayarlar başarıyla kaydedildi';
      showToast('Ayarlar Kaydedildi', '', 'success');
    } catch {
      feedback.className = 'form-feedback error';
      feedback.textContent = '❌ Kaydetme sırasında hata oluştu';
    }
  });
}

async function testMail() {
  const btn = document.getElementById('testMailBtn');
  btn.textContent = '📧 Gönderiliyor...';
  btn.disabled = true;
  try {
    const res = await fetch(`${API}/notifications/test-mail`, { method: 'POST' });
    const d = await res.json();
    showToast(d.success ? 'Test Maili Gönderildi ✅' : 'Mail Gönderilemedi ❌', d.message, d.success ? 'success' : 'error');
  } catch {
    showToast('Hata', 'Mail test başarısız', 'error');
  }
  btn.textContent = '📧 Test Mail Gönder';
  btn.disabled = false;
}

// ── Toast ──
function showToast(title, msg = '', type = 'info') {
  const icons = { success: '✅', error: '❌', info: '💬' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>`;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ── Helpers ──
function formatDateTime(dt) {
  if (!dt) return '—';
  try {
    const d = new Date(dt);
    return d.toLocaleString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return dt; }
}
