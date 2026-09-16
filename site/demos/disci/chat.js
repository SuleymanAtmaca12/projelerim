const chatEl = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");
const resetBtn = document.getElementById("resetBtn");

const opening = "Selamlar, Dişçi Kliniğine hoş geldiniz. Fiyat sorabilir, randevu için tarih aralığı verebilirsiniz.";

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function addMsg(role, text) {
  const row = document.createElement("div");
  row.className = `msg ${role}`;
  row.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function replyFor(text) {
  const t = text.toLowerCase();
  if (/(fiyat|ücret|dolgu|kanal|beyazlat)/.test(t)) {
    return "Fiyat listesi:\n• Muayene 750 TL\n• Dolgu 2.500 TL\n• Kanal 4.500 TL\n• Beyazlatma 6.000 TL\nRandevu için 2026-02-04 - 2026-02-06 gibi bir aralık yaz.";
  }
  if (/(2026|tarih|aralık|-)/.test(t)) {
    return "Müsait slotlar:\n1) DrAtakan 2026-02-04 10:00-10:30\n2) DrSüleyman 2026-02-04 11:00-11:30\n3) DrAtakan 2026-02-05 14:00-14:30\nBir numara seç, sonra isim ve telefon yaz.";
  }
  if (/^[123]$/.test(t.trim())) {
    return "Bu saati tuttum. Ad-soyad ve 10 haneli telefonunu yazar mısın?";
  }
  if (/(onay|tamam|oluştur|kaydet)/.test(t)) {
    return "✅ Randevu vitrin demosunda tamamlandı görünür. Asıl kayıt tool + veritabanı ile yerelde çalışır.";
  }
  return "Fiyat, dolgu/kanal veya tarih aralığı yazarak devam edebilirsin.";
}

function resetChat() {
  chatEl.innerHTML = "";
  addMsg("assistant", opening);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  addMsg("user", message);
  input.value = "";
  addMsg("assistant", replyFor(message));
});

resetBtn.addEventListener("click", resetChat);
resetChat();
