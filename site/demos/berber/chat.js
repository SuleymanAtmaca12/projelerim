const chatEl = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");
const resetBtn = document.getElementById("resetBtn");

const opening = "Merhaba, Berber Asistan’a hoş geldin. Saç kesimi, sakal veya komple paket için yazabilirsin. Uygun saati birlikte seçelim.";

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function addMsg(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerHTML = `<div class="bubble">${escapeHtml(text).replace(/\n/g, "<br>")}</div>`;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function send(text) {
  const msg = (text || "").trim();
  if (!msg) return;
  addMsg("user", msg);
  addMsg("assistant", replyFor(msg));
}

function replyFor(text) {
  const t = text.toLowerCase();
  if (/(fiyat|ücret|kaç)/.test(t)) {
    return "Güncel fiyatlar:\n• Saç kesimi 250 TL\n• Sakal 150 TL\n• Komple 350 TL\nHangi hizmeti istersin?";
  }
  if (/(saat|randevu|yarın|bugün|uygun)/.test(t)) {
    return "Uygun saatler:\n1) Ahmet — yarın 11:00\n2) Mehmet — yarın 14:30\n3) Ali — yarın 16:00\nNumara yazman yeterli.";
  }
  if (/^[123]$/.test(t.trim())) {
    return "Güzel, bu saati ayırdım. Ad-soyad ve telefonunu yazar mısın?";
  }
  if (/(onay|tamam|oluştur|kaydet)/.test(t)) {
    return "✅ Randevu vitrin demosunda kaydedildi gibi göründü. Gerçek kayıt kendi panelinde, yerel asistanla çalışır.";
  }
  return "Anladım. Saç / sakal / komple yazabilir, fiyat sorabilir veya randevu için gün-saat isteyebilirsin.";
}

function resetChat() {
  chatEl.innerHTML = "";
  addMsg("assistant", opening);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;
  input.value = "";
  send(msg);
});

resetBtn.addEventListener("click", resetChat);

document.querySelectorAll("[data-msg]").forEach((btn) => {
  btn.addEventListener("click", () => send(btn.getAttribute("data-msg")));
});

resetChat();
