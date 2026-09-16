/* ─── Workflow Builder (Drawflow) ─── */
let editor;

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('drawflow');
  if (!container) return;

  // Initialize Drawflow
  editor = new Drawflow(container);
  
  // Customization
  editor.reroute = true;
  editor.reroute_fix_curvature = true;
  editor.force_first_input = false;
  
  // Start the editor
  editor.start();

  // Export Button
  document.getElementById('exportWorkflowBtn').addEventListener('click', () => {
    const exportData = editor.export();
    console.log("🔥 Workflow JSON Export:", JSON.stringify(exportData, null, 2));
    
    // Show toast if available in dashboard.js
    if (typeof showToast === 'function') {
      showToast('Başarılı', 'İşlem hattı JSON olarak konsola yazdırıldı.', 'success');
    } else {
      alert('İşlem hattı JSON olarak konsola yazdırıldı!');
    }
  });
});

/* ─── Drag and Drop Handlers ─── */
let mobile_item_selec = '';
let mobile_last_move = null;

function drag(ev) {
  if (ev.type === "touchstart") {
    mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
  } else {
    ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  if (ev.type === "touchend") {
    let parentdrawflow = document.elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
    if (parentdrawflow != null) {
      addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
    }
    mobile_item_selec = '';
  } else {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("node");
    addNodeToDrawFlow(data, ev.clientX, ev.clientY);
  }
}

/* ─── Add Node Logic ─── */
function addNodeToDrawFlow(name, pos_x, pos_y) {
  if (editor.editor_mode === 'fixed') return;

  // Adjust coordinates based on editor zoom and pan
  pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
  pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

  const nodeId = generateId();

  switch (name) {
    case 'trigger':
      const triggerHtml = `
        <div class="title-box">⚡ Tetikleyici (Trigger)</div>
        <div class="box">
          <label>Tetikleme Şartı</label>
          <select>
            <option>Yeni Randevu Eklendiğinde</option>
            <option>Randevu İptal Edildiğinde</option>
            <option>Manuel Tetikleme</option>
          </select>
        </div>
      `;
      // name, inputs, outputs, posx, posy, class, data, html
      editor.addNode('trigger', 0, 1, pos_x, pos_y, 'trigger', {}, triggerHtml);
      break;

    case 'llm':
      const llmHtml = `
        <div class="title-box">🧠 LLM Modeli</div>
        <div class="box">
          <label>Model Seçimi</label>
          <select>
            <option>Qwen3-4b (Lokal)</option>
            <option>GPT-4o (API)</option>
            <option>Llama-3 (API)</option>
          </select>
          <label>Sistem Promptu</label>
          <textarea rows="3" placeholder="Sen bir sağlık asistanısın..."></textarea>
          <label>Sıcaklık (Temp)</label>
          <input type="range" min="0" max="1" step="0.1" value="0.7" style="width:100%" />
        </div>
      `;
      editor.addNode('llm', 1, 1, pos_x, pos_y, 'llm', {}, llmHtml);
      break;

    case 'agent':
      const agentHtml = `
        <div class="title-box">🕵️‍♂️ Yapay Zeka Ajanı</div>
        <div class="box">
          <label>Görev</label>
          <input type="text" placeholder="Hastanın bilgilerini kontrol et..." />
          <label>Araçlar (Tools)</label>
          <select>
            <option>Takvim Okuma</option>
            <option>Veritabanı Sorgusu</option>
            <option>Email Gönderme</option>
          </select>
        </div>
      `;
      editor.addNode('agent', 1, 2, pos_x, pos_y, 'agent', {}, agentHtml);
      break;

    case 'output':
      const outputHtml = `
        <div class="title-box">📤 Çıktı / Hedef</div>
        <div class="box">
          <label>Sonucu Nereye Gönderelim?</label>
          <select>
            <option>Kullanıcıya Yanıt Olarak</option>
            <option>Veritabanına Kaydet</option>
            <option>Log Dosyasına Yaz</option>
          </select>
        </div>
      `;
      editor.addNode('output', 1, 0, pos_x, pos_y, 'output', {}, outputHtml);
      break;

    default:
      console.warn("Bilinmeyen Düğüm Tipi: ", name);
  }
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
