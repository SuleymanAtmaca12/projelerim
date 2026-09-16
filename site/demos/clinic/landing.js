const API = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', async () => {
  await loadLandingDoctors();
});

async function loadLandingDoctors() {
  const grid = document.getElementById('landingDoctors');
  try {
    const res = await fetch(`${API}/doctors/`);
    const doctors = await res.json();

    if (!doctors.length) {
      grid.innerHTML = '<div style="color:#6b68a0;text-align:center">Doktor bilgisi yüklenemedi.</div>';
      return;
    }

    const specialtyEmojis = {
      'Diş': '🦷', 'Dahiliye': '🩺', 'Ortopedi': '🦴',
      'Kardiyoloji': '❤️', 'Nöroloji': '🧠', 'Göz': '👁️', 'KBB': '👂', 'Cilt': '🧴'
    };

    grid.innerHTML = doctors.map(d => {
      const emoji = Object.entries(specialtyEmojis).find(([k]) => d.specialty.includes(k))?.[1] || '👨‍⚕️';
      return `
      <div class="landing-doctor-card">
        <div class="landing-doctor-avatar">${emoji}</div>
        <div class="landing-doctor-name">${d.name}</div>
        <span class="landing-doctor-spec">${d.specialty}</span>
        <div class="landing-doctor-meta">🕐 ${d.work_hours}</div>
        <div class="landing-doctor-meta">📅 ${d.work_days}</div>
      </div>`;
    }).join('');
  } catch {
    const demo = [
      { name: "Dr. Ayşe Kaya", specialty: "Diş Hekimliği", work_hours: "09:00-18:00", work_days: "Pzt-Cum" },
      { name: "Dr. Mehmet Demir", specialty: "Dahiliye", work_hours: "10:00-17:00", work_days: "Pzt-Cmt" },
      { name: "Dr. Elif Yıldız", specialty: "Kardiyoloji", work_hours: "09:00-16:00", work_days: "Pzt-Cum" },
      { name: "Dr. Can Özkan", specialty: "Ortopedi", work_hours: "11:00-19:00", work_days: "Sal-Cmt" }
    ];
    const specialtyEmojis = {
      "Diş": "🦷", Dahiliye: "🩺", Ortopedi: "🦴", Kardiyoloji: "❤️"
    };
    grid.innerHTML = demo.map((d) => {
      const emoji = Object.entries(specialtyEmojis).find(([k]) => d.specialty.includes(k))?.[1] || "👨‍⚕️";
      return `
      <div class="landing-doctor-card">
        <div class="landing-doctor-avatar">${emoji}</div>
        <div class="landing-doctor-name">${d.name}</div>
        <span class="landing-doctor-spec">${d.specialty}</span>
        <div class="landing-doctor-meta">🕐 ${d.work_hours}</div>
        <div class="landing-doctor-meta">📅 ${d.work_days}</div>
      </div>`;
    }).join("");
  }
}

// Navbar scroll efekti
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(6,6,16,0.95)';
  } else {
    navbar.style.background = 'rgba(6,6,16,0.85)';
  }
});
