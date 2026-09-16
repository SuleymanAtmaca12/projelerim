const chatEl = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");
const resetBtn = document.getElementById("resetBtn");

const opening = "Hoş geldin. Saç, sakal veya komple paket için yazman yeterli — fiyatı ve uygun saati hemen söyleyeyim.";

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function addMsg(role, text) {
  const row = document.createElement("div");
  row.className = "msg " + role;
  row.innerHTML = `
    <div class="face">${role === "assistant" ? "💈" : "🙂"}</div>
    <div class="col">
      <div class="bubble">${escapeHtml(text).replace(/\n/g, "<br>")}</div>
      <time class="time">şimdi</time>
    </div>`;
  chatEl.appendChild(row);
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
    return "Güncel fiyatlar:\n• Saç kesimi 250 TL\n• Sakal 150 TL\n• Komple 350 TL\nHangisini istersin?";
  }
  if (/(saat|randevu|yarın|bugün|uygun)/.test(t)) {
    return "Yarın açık saatler:\n1) Ahmet — 11:00\n2) Mehmet — 14:30\n3) Ali — 16:00\nNumara yazman yeterli.";
  }
  if (/^[123]$/.test(t.trim())) {
    return "Bu saati tuttum. Ad-soyad ve telefonunu yazar mısın?";
  }
  if (/(onay|tamam|oluştur|kaydet)/.test(t)) {
    return "Randevu deftere işlendi. Kapıda görüşürüz.";
  }
  return "Saç, sakal veya komple yazabilirsin. Fiyat da sorabilirsin.";
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
