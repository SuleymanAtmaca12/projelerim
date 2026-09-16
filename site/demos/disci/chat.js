const chatEl = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");
const resetBtn = document.getElementById("resetBtn");

const opening = "Merhaba, kliniğe hoş geldiniz. Muayene, dolgu, kanal veya beyazlatma için fiyat sorabilir; randevu için tarih aralığı verebilirsiniz.";

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function addMsg(role, text) {
  const row = document.createElement("div");
  row.className = `msg ${role}`;
  row.innerHTML = `
    <div class="face">${role === "assistant" ? "🦷" : "🙂"}</div>
    <div class="col">
      <div class="bubble">${escapeHtml(text).replace(/\n/g, "<br>")}</div>
      <time class="time">şimdi</time>
    </div>`;
  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function send(text) {
  const message = (text || "").trim();
  if (!message) return;
  addMsg("user", message);
  addMsg("assistant", replyFor(message));
}

function replyFor(text) {
  const t = text.toLowerCase();
  if (/(fiyat|ücret|dolgu|kanal|beyazlat|muayene)/.test(t)) {
    return "Fiyat listesi:\n• Muayene 750 TL\n• Dolgu 2.500 TL\n• Kanal 4.500 TL\n• Beyazlatma 6.000 TL\nRandevu için 2026-02-04 - 2026-02-06 yazabilirsiniz.";
  }
  if (/(2026|tarih|aralık|-)/.test(t)) {
    return "Müsait slotlar:\n1) Dr. Atakan · 4 Şub 10:00–10:30\n2) Dr. Süleyman · 4 Şub 11:00–11:30\n3) Dr. Atakan · 5 Şub 14:00–14:30\nBir numara seçin.";
  }
  if (/^[123]$/.test(t.trim())) {
    return "Bu saati ayırdım. Ad-soyad ve 10 haneli telefonunuzu yazar mısınız?";
  }
  if (/(onay|tamam|oluştur|kaydet)/.test(t)) {
    return "Randevunuz oluşturuldu. Kliniğimizde görüşmek üzere.";
  }
  return "Fiyat sorabilir veya tarih aralığı vererek randevu açabilirsiniz.";
}

function resetChat() {
  chatEl.innerHTML = "";
  addMsg("assistant", opening);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  send(message);
});

resetBtn.addEventListener("click", resetChat);
document.querySelectorAll("[data-msg]").forEach((btn) => {
  btn.addEventListener("click", () => send(btn.getAttribute("data-msg")));
});
resetChat();
