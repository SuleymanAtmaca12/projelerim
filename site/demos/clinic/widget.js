/**
 * Smart Clinic Widget — Embed Script
 * Kullanımı: <script src="widget.js"></script>
 * Herhangi bir web sitesine tek satırla eklenebilir.
 */
(function () {
  'use strict';

  const config = window.SmartClinicConfig || {
    apiUrl: 'http://localhost:8000/api',
    clinicName: 'Smart Clinic',
    primaryColor: '#6c63ff',
    welcomeMessage: 'Merhaba! 👋 Ben Smart Clinic AI asistanıyım. Size nasıl yardımcı olabilirim?'
  };

  // Stiller
  const STYLES = `
    .sc-widget-btn {
      position: fixed;
      bottom: 28px; right: 28px;
      width: 62px; height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${config.primaryColor}, #a78bfa);
      border: none;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(108,99,255,0.45);
      display: flex; align-items: center; justify-content: center;
      font-size: 26px;
      z-index: 9998;
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
      animation: scPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    }
    .sc-widget-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 40px rgba(108,99,255,0.6);
    }
    .sc-widget-btn .sc-notif {
      position: absolute;
      top: -2px; right: -2px;
      width: 18px; height: 18px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
      font-size: 10px;
      font-weight: 700;
      color: white;
      display: flex; align-items: center; justify-content: center;
      display: none;
    }
    .sc-chat-window {
      position: fixed;
      bottom: 104px; right: 28px;
      width: 380px;
      height: 560px;
      background: #0f0f1e;
      border: 1px solid rgba(108,99,255,0.2);
      border-radius: 20px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
      z-index: 9999;
      overflow: hidden;
      transform: scale(0.8) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      font-family: 'Inter', -apple-system, sans-serif;
    }
    .sc-chat-window.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    .sc-chat-header {
      padding: 18px 20px;
      background: linear-gradient(135deg, ${config.primaryColor}, #a78bfa);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .sc-avatar {
      width: 42px; height: 42px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
    }
    .sc-header-info .sc-header-name {
      font-size: 15px;
      font-weight: 700;
      color: white;
    }
    .sc-header-info .sc-header-status {
      font-size: 11px;
      color: rgba(255,255,255,0.75);
      display: flex; align-items: center; gap: 4px;
    }
    .sc-status-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #4ade80;
      animation: scPulse 2s infinite;
    }
    .sc-close-btn {
      margin-left: auto;
      background: rgba(255,255,255,0.15);
      border: none;
      color: white;
      width: 32px; height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .sc-close-btn:hover { background: rgba(255,255,255,0.25); }
    .sc-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scrollbar-width: thin;
      scrollbar-color: rgba(108,99,255,0.3) transparent;
    }
    .sc-messages::-webkit-scrollbar { width: 4px; }
    .sc-messages::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.3); border-radius: 4px; }
    .sc-msg {
      display: flex;
      gap: 8px;
      animation: scSlideIn 0.25s ease;
    }
    .sc-msg.user { flex-direction: row-reverse; }
    .sc-msg-avatar {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${config.primaryColor}, #a78bfa);
      font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .sc-msg.user .sc-msg-avatar { background: rgba(108,99,255,0.2); }
    .sc-msg-bubble {
      max-width: 78%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.55;
    }
    .sc-msg.bot .sc-msg-bubble {
      background: rgba(108,99,255,0.1);
      border: 1px solid rgba(108,99,255,0.15);
      color: #e2e0ff;
      border-bottom-left-radius: 4px;
    }
    .sc-msg.user .sc-msg-bubble {
      background: linear-gradient(135deg, ${config.primaryColor}, #a78bfa);
      color: white;
      border-bottom-right-radius: 4px;
    }
    .sc-msg-time {
      font-size: 10px;
      color: rgba(255,255,255,0.35);
      margin-top: 4px;
      text-align: right;
    }
    .sc-msg.bot .sc-msg-time { text-align: left; }
    .sc-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      background: rgba(108,99,255,0.08);
      border-radius: 12px;
      width: fit-content;
    }
    .sc-typing span {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #a78bfa;
      animation: scBounce 1.2s infinite;
    }
    .sc-typing span:nth-child(2) { animation-delay: 0.2s; }
    .sc-typing span:nth-child(3) { animation-delay: 0.4s; }
    .sc-input-area {
      padding: 14px 16px;
      border-top: 1px solid rgba(108,99,255,0.1);
      display: flex;
      gap: 10px;
      align-items: flex-end;
      background: rgba(15,15,30,0.95);
    }
    .sc-input {
      flex: 1;
      background: rgba(108,99,255,0.08);
      border: 1px solid rgba(108,99,255,0.15);
      border-radius: 12px;
      padding: 10px 14px;
      color: #e2e0ff;
      font-size: 13px;
      font-family: inherit;
      resize: none;
      min-height: 42px;
      max-height: 100px;
      transition: border-color 0.2s;
      outline: none;
    }
    .sc-input:focus { border-color: ${config.primaryColor}; }
    .sc-input::placeholder { color: rgba(180,176,210,0.5); }
    .sc-send-btn {
      width: 42px; height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, ${config.primaryColor}, #a78bfa);
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .sc-send-btn:hover { transform: scale(1.05); box-shadow: 0 4px 16px rgba(108,99,255,0.4); }
    .sc-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .sc-success-banner {
      margin: 0 16px 12px;
      padding: 14px 16px;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.3);
      border-radius: 12px;
      font-size: 12px;
      color: #34d399;
      line-height: 1.6;
      display: none;
    }
    @keyframes scPop { from { transform: scale(0); } to { transform: scale(1); } }
    @keyframes scPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    @keyframes scBounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
    @keyframes scSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 480px) {
      .sc-chat-window { right: 8px; left: 8px; width: auto; bottom: 88px; }
      .sc-widget-btn { bottom: 16px; right: 16px; }
    }
  `;

  // State
  let isOpen = false;
  let isTyping = false;
  let messages = []; // {role, content}
  let sessionId = 'sess-' + Date.now();

  // DOM Oluştur
  function init() {
    injectStyles();
    createButton();
    createChatWindow();
    bindEvents();
    setTimeout(() => addBotMessage(config.welcomeMessage), 500);
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  function createButton() {
    const btn = document.createElement('button');
    btn.className = 'sc-widget-btn';
    btn.id = 'sc-widget-btn';
    btn.setAttribute('aria-label', 'AI Asistan ile Randevu Al');
    btn.innerHTML = `<span id="sc-btn-icon">💬</span><span class="sc-notif" id="sc-notif">1</span>`;
    document.body.appendChild(btn);
  }

  function createChatWindow() {
    const win = document.createElement('div');
    win.className = 'sc-chat-window';
    win.id = 'sc-chat-window';
    win.innerHTML = `
      <div class="sc-chat-header">
        <div class="sc-avatar">🏥</div>
        <div class="sc-header-info">
          <div class="sc-header-name">${config.clinicName} Asistan</div>
          <div class="sc-header-status"><span class="sc-status-dot"></span> Aktif — 7/24</div>
        </div>
        <button class="sc-close-btn" id="sc-close-btn">✕</button>
      </div>
      <div class="sc-messages" id="sc-messages"></div>
      <div class="sc-success-banner" id="sc-success-banner"></div>
      <div class="sc-input-area">
        <textarea class="sc-input" id="sc-input" placeholder="Şikayetinizi yazın..." rows="1"></textarea>
        <button class="sc-send-btn" id="sc-send-btn">➤</button>
      </div>
    `;
    document.body.appendChild(win);
  }

  function bindEvents() {
    document.getElementById('sc-widget-btn').addEventListener('click', toggleChat);
    document.getElementById('sc-close-btn').addEventListener('click', closeChat);

    const input = document.getElementById('sc-input');
    const sendBtn = document.getElementById('sc-send-btn');

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });

    // Landing sayfasındaki randevu butonları
    ['openChatHero', 'openChatContact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', openChat);
    });
  }

  function toggleChat() { isOpen ? closeChat() : openChat(); }

  function openChat() {
    isOpen = true;
    document.getElementById('sc-chat-window').classList.add('open');
    document.getElementById('sc-btn-icon').textContent = '✕';
    document.getElementById('sc-notif').style.display = 'none';
    setTimeout(() => document.getElementById('sc-input').focus(), 300);
  }

  function closeChat() {
    isOpen = false;
    document.getElementById('sc-chat-window').classList.remove('open');
    document.getElementById('sc-btn-icon').textContent = '💬';
  }

  function addBotMessage(text) {
    messages.push({ role: 'assistant', content: text });
    renderMessages();
  }

  function renderMessages() {
    const container = document.getElementById('sc-messages');
    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    container.innerHTML = messages.map(m => `
      <div class="sc-msg ${m.role === 'assistant' ? 'bot' : 'user'}">
        <div class="sc-msg-avatar">${m.role === 'assistant' ? '🏥' : '👤'}</div>
        <div>
          <div class="sc-msg-bubble">${m.content.replace(/\n/g, '<br/>')}</div>
          <div class="sc-msg-time">${now}</div>
        </div>
      </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    const container = document.getElementById('sc-messages');
    const typingEl = document.createElement('div');
    typingEl.id = 'sc-typing-indicator';
    typingEl.className = 'sc-msg bot';
    typingEl.innerHTML = `
      <div class="sc-msg-avatar">🏥</div>
      <div class="sc-typing"><span></span><span></span><span></span></div>
    `;
    container.appendChild(typingEl);
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('sc-typing-indicator');
    if (el) el.remove();
  }

  async function sendMessage() {
    const input = document.getElementById('sc-input');
    const text = input.value.trim();
    if (!text || isTyping) return;

    input.value = '';
    input.style.height = 'auto';
    messages.push({ role: 'user', content: text });
    renderMessages();
    isTyping = true;
    document.getElementById('sc-send-btn').disabled = true;
    showTyping();

    try {
      const response = await fetch(`${config.apiUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, session_id: sessionId })
      });

      const data = await response.json();
      hideTyping();

      const reply = data.reply || 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.';
      addBotMessage(reply);

      // SUCCESS_DATA varsa randevu oluştur
      if (data.success_data) {
        await createAppointment(data.success_data);
      }

    } catch (e) {
      hideTyping();
      addBotMessage('🔌 Sunucuya bağlanılamadı. Lütfen backend\'in çalıştığından emin olun (localhost:8000).');
    }

    isTyping = false;
    document.getElementById('sc-send-btn').disabled = false;
  }

  async function createAppointment(successData) {
    try {
      const res = await fetch(`${config.apiUrl}/appointments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(successData)
      });
      if (res.ok) {
        const banner = document.getElementById('sc-success-banner');
        banner.style.display = 'block';
        banner.innerHTML = `
          ✅ <strong>Randevunuz oluşturuldu!</strong><br/>
          ${successData.doctor} — ${successData.time}<br/>
          Onay maili <strong>${successData.email}</strong> adresine gönderildi.
        `;
        setTimeout(() => { banner.style.display = 'none'; }, 8000);
      }
    } catch (e) {
      console.error('Randevu oluşturulamadı:', e);
    }
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
