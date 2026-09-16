/* ============================================================
   DEEP LEARNING EDUCATIONAL PLATFORM — JAVASCRIPT
   ============================================================ */

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  createScrollProgress();
  createNavToggle();
  createHeroParticles();
  drawHeroNetwork();
  drawSingleNeuron();
  drawMultiNeuron();

  // Bind single-neuron sliders
  ['x1','x2','w1','w2','bias1'].forEach(id => {
    document.getElementById(id).addEventListener('input', drawSingleNeuron);
  });

  drawFlowCanvas();
  initWeightDemo();
  initBiasDemo();
  initForwardStepper();
  initLayerBuilder();
  initNeuronCompare();
  initActivation();
  setupSectionObserver();
});

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
function createScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ============================================================
// NAV TOGGLE
// ============================================================
function createNavToggle() {
  const btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.id = 'navToggle';
  btn.innerHTML = '<span></span><span></span><span></span>';
  btn.setAttribute('aria-label', 'Menüyü aç/kapat');
  document.body.prepend(btn);
  const nav = document.getElementById('sideNav');
  btn.addEventListener('click', () => nav.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) nav.classList.remove('open');
  });
}

// ============================================================
// SECTION OBSERVER (nav active link)
// ============================================================
function setupSectionObserver() {
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => a.classList.remove('active'));
        const id = entry.target.id;
        const link = document.querySelector(`.nav-item[data-section="${id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));
}

// ============================================================
// HERO PARTICLES
// ============================================================
function createHeroParticles() {
  const container = document.getElementById('heroParticles');
  const colors = ['#4f9eff','#a855f7','#22d3ee','#ec4899','#10b981'];
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random()*100}%;
      top: ${Math.random()*100}%;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      width: ${2+Math.random()*3}px;
      height: ${2+Math.random()*3}px;
      animation-duration: ${5+Math.random()*15}s;
      animation-delay: ${-Math.random()*15}s;
      opacity: ${0.3+Math.random()*0.5};
    `;
    container.appendChild(p);
  }
}

// ============================================================
// HERO NETWORK CANVAS
// ============================================================
function drawHeroNetwork() {
  const container = document.getElementById('heroNetwork');
  const W = Math.min(400, window.innerWidth * 0.35);
  const H = 480;
  const cvs = document.createElement('canvas');
  cvs.width = W; cvs.height = H;
  container.appendChild(cvs);
  const ctx = cvs.getContext('2d');
  const layers = [3, 5, 5, 3];
  const nodeR = 12;
  const positions = [];

  layers.forEach((count, li) => {
    const x = (li + 0.7) * (W / (layers.length + 0.4));
    const layerPos = [];
    for (let ni = 0; ni < count; ni++) {
      const y = H/2 + (ni - (count-1)/2) * 70;
      layerPos.push({x, y});
    }
    positions.push(layerPos);
  });

  // draw connections
  const colors = ['#4f9eff','#a855f7','#22d3ee','#ec4899'];
  for (let li = 0; li < positions.length - 1; li++) {
    positions[li].forEach(from => {
      positions[li+1].forEach(to => {
        const g = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        g.addColorStop(0, colors[li] + '55');
        g.addColorStop(1, colors[li+1] + '22');
        ctx.strokeStyle = g;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
    });
  }

  // draw nodes
  positions.forEach((layer, li) => {
    layer.forEach(({x, y}) => {
      const grad = ctx.createRadialGradient(x-3, y-3, 1, x, y, nodeR+4);
      grad.addColorStop(0, colors[li] + 'ff');
      grad.addColorStop(1, colors[li] + '22');
      ctx.shadowColor = colors[li];
      ctx.shadowBlur = 20;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, nodeR, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  });

  // Animate pulse
  let t = 0;
  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    // connections
    for (let li = 0; li < positions.length - 1; li++) {
      positions[li].forEach(from => {
        positions[li+1].forEach(to => {
          const g = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
          g.addColorStop(0, colors[li] + '44');
          g.addColorStop(1, colors[li+1] + '22');
          ctx.strokeStyle = g;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        });
      });
    }
    // animated data signal
    const speed = 0.002;
    const prog = (t * speed) % 1;
    for (let li = 0; li < positions.length - 1; li++) {
      const layerProgress = (prog * (positions.length-1)) - li;
      if (layerProgress > 0 && layerProgress < 1) {
        positions[li].forEach(from => {
          positions[li+1].forEach(to => {
            const sx = from.x + (to.x - from.x) * layerProgress;
            const sy = from.y + (to.y - from.y) * layerProgress;
            ctx.fillStyle = '#ffffff99';
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(sx, sy, 3, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
          });
        });
      }
    }
    // nodes
    positions.forEach((layer, li) => {
      layer.forEach(({x, y}) => {
        const pulse = 1 + 0.08 * Math.sin(t * 0.03 + li * 0.5);
        const r = nodeR * pulse;
        const g2 = ctx.createRadialGradient(x-3, y-3, 1, x, y, r+4);
        g2.addColorStop(0, colors[li] + 'ff');
        g2.addColorStop(1, colors[li] + '22');
        ctx.shadowColor = colors[li];
        ctx.shadowBlur = 15;
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    });
    t++;
    requestAnimationFrame(animate);
  };
  animate();
}

// ============================================================
// SECTION 2 — SINGLE NEURON
// ============================================================
function drawSingleNeuron() {
  const vals = {
    x1: parseFloat(document.getElementById('x1').value),
    x2: parseFloat(document.getElementById('x2').value),
    w1: parseFloat(document.getElementById('w1').value),
    w2: parseFloat(document.getElementById('w2').value),
    b:  parseFloat(document.getElementById('bias1').value),
  };

  document.getElementById('x1Val').textContent   = vals.x1.toFixed(1);
  document.getElementById('x2Val').textContent   = vals.x2.toFixed(1);
  document.getElementById('w1Val').textContent   = vals.w1.toFixed(1);
  document.getElementById('w2Val').textContent   = vals.w2.toFixed(1);
  document.getElementById('bias1Val').textContent= vals.b.toFixed(1);

  const z = vals.x1*vals.w1 + vals.x2*vals.w2 + vals.b;
  document.getElementById('zOut').textContent = z.toFixed(3);
  document.getElementById('formulaCalc').textContent =
    `= ${vals.x1.toFixed(1)}×${vals.w1.toFixed(1)} + ${vals.x2.toFixed(1)}×${vals.w2.toFixed(1)} + ${vals.b.toFixed(1)} = ${z.toFixed(2)}`;

  const cvs = document.getElementById('neuronCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const cx = W * 0.62, cy = H * 0.5, r = 40;
  const inputs = [
    { label: 'x₁', val: vals.x1, w: vals.w1, y: H*0.3 },
    { label: 'x₂', val: vals.x2, w: vals.w2, y: H*0.7 },
  ];
  const inputX = 80;

  // Draw connections
  inputs.forEach(inp => {
    const thickness = Math.abs(inp.w) * 3 + 0.5;
    const alpha = Math.min(Math.abs(inp.w) / 2, 1);
    const col = inp.w >= 0 ? `rgba(79,158,255,${alpha})` : `rgba(236,72,153,${alpha})`;
    ctx.strokeStyle = col;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(inputX + 28, inp.y);
    ctx.lineTo(cx - r, cy);
    ctx.stroke();

    // weight label
    const mx = (inputX + 28 + cx - r) / 2;
    const my = (inp.y + cy) / 2 - 8;
    ctx.fillStyle = inp.w >= 0 ? '#4f9eff' : '#ec4899';
    ctx.font = '600 13px Inter';
    ctx.fillText(`w=${inp.w.toFixed(1)}`, mx - 20, my);
  });

  // Draw input nodes
  inputs.forEach(inp => {
    ctx.shadowColor = '#4f9eff';
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(79,158,255,0.15)';
    ctx.strokeStyle = '#4f9eff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(inputX, inp.y, 28, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#e8e8ff';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(inp.label, inputX, inp.y - 4);
    ctx.font = '12px JetBrains Mono';
    ctx.fillStyle = '#22d3ee';
    ctx.fillText(inp.val.toFixed(1), inputX, inp.y + 12);
  });

  // Neuron node
  const absZ = Math.abs(z);
  const intensity = Math.min(absZ / 5, 1);
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 30 * intensity;
  const ng = ctx.createRadialGradient(cx-8, cy-8, 2, cx, cy, r+8);
  ng.addColorStop(0, `rgba(168,85,247,${0.4 + 0.4*intensity})`);
  ng.addColorStop(1, 'rgba(168,85,247,0.05)');
  ctx.fillStyle = ng;
  ctx.strokeStyle = `rgba(168,85,247,${0.5 + 0.4*intensity})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#e8e8ff';
  ctx.font = 'bold 13px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('Σ', cx, cy - 4);
  ctx.font = '600 11px JetBrains Mono';
  ctx.fillStyle = '#22d3ee';
  ctx.fillText(z.toFixed(2), cx, cy + 12);

  // Bias
  ctx.fillStyle = '#f59e0b88';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4,3]);
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx, cy - r - 32);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f59e0b';
  ctx.font = '600 12px Inter';
  ctx.fillText(`b=${vals.b.toFixed(1)}`, cx, cy - r - 38);

  // Output arrow
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + r, cy);
  ctx.lineTo(cx + r + 60, cy);
  ctx.stroke();
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 13px Inter';
  ctx.fillText('z', cx + r + 80, cy + 4);
}

// ============================================================
// SECTION 2 — MULTI NEURON
// ============================================================
function drawMultiNeuron() {
  const cvs = document.getElementById('multiNeuronCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const inputs  = [{ label:'x₁' }, { label:'x₂' }, { label:'x₃' }];
  const neurons = [{ label:'z₁' }, { label:'z₂' }, { label:'z₃' }, { label:'z₄' }];
  const colors  = ['#4f9eff','#a855f7','#22d3ee','#ec4899'];

  const inX = 90, outX = W - 90;
  const inPositions  = inputs.map((_, i) => ({ x: inX,  y: H/(inputs.length+1)*(i+1) }));
  const outPositions = neurons.map((_, i) => ({ x: outX, y: H/(neurons.length+1)*(i+1) }));

  // connections
  inPositions.forEach(inP => {
    outPositions.forEach((outP, oi) => {
      const g = ctx.createLinearGradient(inP.x, inP.y, outP.x, outP.y);
      g.addColorStop(0, '#4f9eff33');
      g.addColorStop(1, colors[oi] + '44');
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(inP.x + 22, inP.y);
      ctx.lineTo(outP.x - 22, outP.y);
      ctx.stroke();
    });
  });

  const nodeR = 22;

  // input nodes
  inPositions.forEach((pos, i) => {
    ctx.shadowColor = '#4f9eff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(79,158,255,0.15)';
    ctx.strokeStyle = '#4f9eff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, nodeR, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#e8e8ff';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(inputs[i].label, pos.x, pos.y + 5);
  });

  // neuron nodes
  outPositions.forEach((pos, i) => {
    ctx.shadowColor = colors[i];
    ctx.shadowBlur = 18;
    const g = ctx.createRadialGradient(pos.x-5, pos.y-5, 2, pos.x, pos.y, nodeR+6);
    g.addColorStop(0, colors[i] + 'aa');
    g.addColorStop(1, colors[i] + '11');
    ctx.fillStyle = g;
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, nodeR, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(neurons[i].label, pos.x, pos.y + 5);
  });

  // labels
  ctx.fillStyle = '#8888aa';
  ctx.font = '600 12px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('Giriş Katmanı', inX, 20);
  ctx.fillText('Gizli Katman', outX, 20);
}

// ============================================================
// SECTION 3 — FLOW ANIMATION
// ============================================================
let flowAnimId = null;
let flowT = 0;

function drawFlowCanvas() {
  const cvs = document.getElementById('flowCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const layers = [2, 4, 4, 2];
  const colors = ['#4f9eff', '#a855f7', '#22d3ee', '#10b981'];
  const positions = layers.map((n, li) => {
    const x = (li + 0.7) * (W / (layers.length + 0.2));
    return Array.from({ length: n }, (_, ni) => ({
      x, y: H/2 + (ni - (n-1)/2) * 65
    }));
  });

  // static connections
  for (let li = 0; li < positions.length - 1; li++) {
    positions[li].forEach(from => {
      positions[li+1].forEach(to => {
        ctx.strokeStyle = colors[li] + '33';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
    });
  }

  // nodes
  positions.forEach((layer, li) => {
    layer.forEach(({ x, y }) => {
      ctx.shadowColor = colors[li];
      ctx.shadowBlur = 12;
      ctx.fillStyle = colors[li] + '33';
      ctx.strokeStyle = colors[li];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  });

  // labels
  const lbls = ['Giriş', 'Gizli 1', 'Gizli 2', 'Çıkış'];
  positions.forEach((layer, li) => {
    ctx.fillStyle = colors[li];
    ctx.font = '600 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(lbls[li], layer[0].x, 24);
  });
}

function startFlow() {
  const cvs = document.getElementById('flowCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;

  const layers = [2, 4, 4, 2];
  const colors = ['#4f9eff', '#a855f7', '#22d3ee', '#10b981'];
  const positions = layers.map((n, li) => {
    const x = (li + 0.7) * (W / (layers.length + 0.2));
    return Array.from({ length: n }, (_, ni) => ({
      x, y: H/2 + (ni - (n-1)/2) * 65
    }));
  });

  if (flowAnimId) cancelAnimationFrame(flowAnimId);

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    // connections
    for (let li = 0; li < positions.length - 1; li++) {
      positions[li].forEach(from => {
        positions[li+1].forEach(to => {
          ctx.strokeStyle = colors[li] + '33';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        });
      });
    }
    // nodes
    positions.forEach((layer, li) => {
      layer.forEach(({ x, y }) => {
        const activated = (flowT / 40) >= li;
        ctx.shadowColor = colors[li];
        ctx.shadowBlur = activated ? 20 : 10;
        ctx.fillStyle = activated ? colors[li] + '66' : colors[li] + '22';
        ctx.strokeStyle = colors[li];
        ctx.lineWidth = activated ? 3 : 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    });
    // animate a ball travelling the connections
    const totalSteps = 120;
    const prog = (flowT % totalSteps) / totalSteps;
    const totalConns = positions.length - 1;
    const connProgress = prog * totalConns;
    const li = Math.min(Math.floor(connProgress), totalConns - 1);
    const lp = connProgress - li;
    positions[li].forEach((from, fi) => {
      const to = positions[li+1][fi % positions[li+1].length];
      if (!to) return;
      const sx = from.x + (to.x - from.x) * lp;
      const sy = from.y + (to.y - from.y) * lp;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // labels
    const lbls = ['Giriş', 'Gizli 1', 'Gizli 2', 'Çıkış'];
    positions.forEach((layer, li2) => {
      ctx.fillStyle = colors[li2];
      ctx.font = '600 12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(lbls[li2], layer[0].x, 24);
    });

    // highlight flow steps
    const steps = document.querySelectorAll('.flow-step');
    steps.forEach((s, si) => {
      s.classList.toggle('active', Math.floor((flowT/30)) % steps.length === si);
    });

    flowT++;
    flowAnimId = requestAnimationFrame(animate);
  };
  animate();

  document.getElementById('flowStart').textContent = '⏸ Dur';
  document.getElementById('flowStart').onclick = () => {
    cancelAnimationFrame(flowAnimId);
    flowAnimId = null;
    document.getElementById('flowStart').textContent = '▶ Animasyonu Başlat';
    document.getElementById('flowStart').onclick = startFlow;
  };
}

function resetFlow() {
  flowT = 0;
  if (flowAnimId) { cancelAnimationFrame(flowAnimId); flowAnimId = null; }
  document.getElementById('flowStart').textContent = '▶ Animasyonu Başlat';
  document.getElementById('flowStart').onclick = startFlow;
  drawFlowCanvas();
  document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));
}

// ============================================================
// SECTION 4 — WEIGHT DEMO
// ============================================================
function initWeightDemo() {
  updateWeightDemo();
}

function updateWeightDemo() {
  const w1 = parseFloat(document.getElementById('wd1').value);
  const w2 = parseFloat(document.getElementById('wd2').value);
  const w3 = parseFloat(document.getElementById('wd3').value);
  document.getElementById('wd1v').textContent = w1.toFixed(2);
  document.getElementById('wd2v').textContent = w2.toFixed(2);
  document.getElementById('wd3v').textContent = w3.toFixed(2);
  drawWeightCanvas(w1, w2, w3);
  updateWeightImportance(w1, w2, w3);
}

function drawWeightCanvas(w1, w2, w3) {
  const cvs = document.getElementById('weightCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const weights = [w1, w2, w3];
  const wColors = ['#4f9eff', '#a855f7', '#ec4899'];
  const inputLabels = ['x₁', 'x₂', 'x₃'];
  const neuronX = W * 0.72, neuronY = H / 2, neuronR = 36;
  const inputX = 80;
  const inputYs = [H*0.25, H*0.5, H*0.75];

  // Draw connections with thickness based on weight
  weights.forEach((w, i) => {
    const thickness = Math.abs(w) * 5 + 0.5;
    const alpha = Math.min(w / 3, 1);
    ctx.strokeStyle = wColors[i] + (Math.round(alpha * 200)).toString(16).padStart(2, '0');
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(inputX + 26, inputYs[i]);
    ctx.lineTo(neuronX - neuronR, neuronY);
    ctx.stroke();

    // Weight label
    const mx = (inputX + 26 + neuronX - neuronR) / 2;
    const my = (inputYs[i] + neuronY) / 2 - 10;
    ctx.fillStyle = wColors[i];
    ctx.font = '600 13px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`w=${w.toFixed(2)}`, mx, my);
  });

  // Input nodes
  inputYs.forEach((iy, i) => {
    ctx.shadowColor = wColors[i];
    ctx.shadowBlur = 10;
    ctx.fillStyle = wColors[i] + '22';
    ctx.strokeStyle = wColors[i];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(inputX, iy, 26, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#e8e8ff';
    ctx.font = 'bold 15px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(inputLabels[i], inputX, iy + 5);
  });

  // Neuron
  const totalInput = weights.reduce((s, w, i) => s + w, 0);
  const intensity = Math.min(totalInput / 6, 1);
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 30 * intensity;
  const ng = ctx.createRadialGradient(neuronX-8, neuronY-8, 2, neuronX, neuronY, neuronR+8);
  ng.addColorStop(0, `rgba(168,85,247,${0.3 + 0.5*intensity})`);
  ng.addColorStop(1, 'rgba(168,85,247,0.04)');
  ctx.fillStyle = ng;
  ctx.strokeStyle = `rgba(168,85,247,${0.5 + 0.4*intensity})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(neuronX, neuronY, neuronR, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('Σ', neuronX, neuronY + 6);

  // Output arrow
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(neuronX + neuronR, neuronY);
  ctx.lineTo(neuronX + neuronR + 55, neuronY);
  ctx.stroke();
  ctx.fillStyle = '#22d3ee';
  ctx.font = '600 12px Inter';
  ctx.textAlign = 'left';
  ctx.fillText('Çıktı', neuronX + neuronR + 60, neuronY + 4);
}

function updateWeightImportance(w1, w2, w3) {
  const container = document.getElementById('weightImportance');
  const ws = [w1, w2, w3];
  const labels = ['Bağlantı 1 (w₁)', 'Bağlantı 2 (w₂)', 'Bağlantı 3 (w₃)'];
  const colors = ['#4f9eff', '#a855f7', '#ec4899'];
  const max = Math.max(...ws);

  container.innerHTML = ws.map((w, i) => `
    <div class="wi-bar-row">
      <span class="wi-label">${labels[i]}</span>
      <div class="wi-bar-bg">
        <div class="wi-bar" style="width:${(w/3*100).toFixed(0)}%; background:${colors[i]}"></div>
      </div>
      <span class="wi-val">${w.toFixed(2)}</span>
      ${w === max ? '<span style="color:#f59e0b;font-size:.75rem;margin-left:4px">⭐ En güçlü</span>' : ''}
    </div>
  `).join('');
}

// ============================================================
// SECTION 5 — BIAS DEMO
// ============================================================
function initBiasDemo() {
  updateBiasDemo();
}

function updateBiasDemo() {
  const w = parseFloat(document.getElementById('biasWSlider').value);
  const b = parseFloat(document.getElementById('biasBSlider').value);
  document.getElementById('biasW').textContent = w.toFixed(1);
  document.getElementById('biasB').textContent = b.toFixed(1);
  drawBiasCanvas(w, b);

  const el = document.getElementById('biasExplanation');
  if (b === 0) {
    el.innerHTML = '<strong>b = 0:</strong> Doğru orijinden geçer. Nöron girişeler sıfır olduğunda da 0 üretir.';
  } else if (b > 0) {
    el.innerHTML = `<strong>b = +${b.toFixed(1)}:</strong> Doğru yukarı kaydı. Nöron daha erken aktive olur (düşük threshold).`;
  } else {
    el.innerHTML = `<strong>b = ${b.toFixed(1)}:</strong> Doğru aşağı kaydı. Nöron daha geç aktive olur (yüksek threshold).`;
  }
}

function drawBiasCanvas(w, b) {
  const cvs = document.getElementById('biasCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const padL = 60, padR = 20, padT = 20, padB = 40;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xMin = -5, xMax = 5, yMin = -8, yMax = 8;
  const toScreen = (x, y) => ({
    sx: padL + (x - xMin) / (xMax - xMin) * plotW,
    sy: padT + (yMax - y) / (yMax - yMin) * plotH,
  });

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let gx = xMin; gx <= xMax; gx++) {
    const { sx } = toScreen(gx, 0);
    ctx.beginPath(); ctx.moveTo(sx, padT); ctx.lineTo(sx, padT + plotH); ctx.stroke();
  }
  for (let gy = yMin; gy <= yMax; gy += 2) {
    const { sy } = toScreen(0, gy);
    ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(padL + plotW, sy); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1.5;
  const ox = toScreen(0, 0);
  ctx.beginPath(); ctx.moveTo(padL, ox.sy); ctx.lineTo(padL + plotW, ox.sy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox.sx, padT); ctx.lineTo(ox.sx, padT + plotH); ctx.stroke();

  // Axis labels
  ctx.fillStyle = '#8888aa';
  ctx.font = '11px Inter';
  ctx.textAlign = 'center';
  for (let gx = xMin; gx <= xMax; gx += 2) {
    const { sx, sy } = toScreen(gx, 0);
    ctx.fillText(gx, sx, sy + 14);
  }
  ctx.textAlign = 'right';
  for (let gy = yMin; gy <= yMax; gy += 2) {
    const { sx, sy } = toScreen(0, gy);
    ctx.fillText(gy, padL - 6, sy + 4);
  }

  // Line b=0 (reference)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  const start0 = toScreen(xMin, w * xMin);
  const end0   = toScreen(xMax, w * xMax);
  ctx.moveTo(start0.sx, start0.sy);
  ctx.lineTo(end0.sx, end0.sy);
  ctx.stroke();
  ctx.setLineDash([]);

  // Main line
  const col = b > 0 ? '#10b981' : b < 0 ? '#ef4444' : '#4f9eff';
  ctx.strokeStyle = col;
  ctx.lineWidth = 3;
  ctx.shadowColor = col;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  const start = toScreen(xMin, w * xMin + b);
  const end   = toScreen(xMax, w * xMax + b);
  ctx.moveTo(start.sx, start.sy);
  ctx.lineTo(end.sx, end.sy);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Y-intercept dot
  ctx.fillStyle = '#f59e0b';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 10;
  const yint = toScreen(0, b);
  ctx.beginPath();
  ctx.arc(yint.sx, yint.sy, 6, 0, Math.PI*2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#f59e0b';
  ctx.font = '600 12px Inter';
  ctx.textAlign = 'left';
  ctx.fillText(`b=${b.toFixed(1)}`, yint.sx + 10, yint.sy - 6);

  // Legend
  ctx.font = '600 12px Inter';
  ctx.fillStyle = col;
  ctx.textAlign = 'left';
  ctx.fillText(`z = ${w.toFixed(1)}·x + ${b.toFixed(1)}`, padL + 8, padT + 18);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText(`z = ${w.toFixed(1)}·x (referans)`, padL + 8, padT + 34);
}

// ============================================================
// SECTION 6 — FORWARD STEPPER
// ============================================================
const FORWARD_STEPS = [
  {
    title: '🎯 Adım 1: Giriş Verisi',
    text: 'Ham veriler (örn. piksel değerleri, sayılar) modele beslenir. Sayısal formata dönüştürülmüş olması gerekir.',
    formula: 'x = [0.5,  0.8,  0.3]',
    highlight: 0,
  },
  {
    title: '⚡ Adım 2: Katman 1 — Ağırlık × Giriş',
    text: 'Her nöron, giriş değerlerini kendi ağırlıklarıyla çarpar. Bu matris çarpımı ile tüm katman tek seferde hesaplanır.',
    formula: 'z₁ = W₁ · x + b₁',
    highlight: 1,
  },
  {
    title: '🌊 Adım 3: Katman 1 Aktivasyonu',
    text: 'z₁ değerleri bir aktivasyon fonksiyonundan geçirilir (örn. ReLU). Bu doğrusal olmayan dönüşümü sağlar.',
    formula: 'a₁ = ReLU(z₁) = max(0, z₁)',
    highlight: 2,
  },
  {
    title: '🔮 Adım 4: Katman 2 Hesabı',
    text: 'Aktivasyon çıktısı a₁, bir sonraki katmana giriş olur. Aynı ağırlık çarpımı + bias + aktivasyon süreci tekrar eder.',
    formula: 'a₂ = f(W₂ · a₁ + b₂)',
    highlight: 3,
  },
  {
    title: '🏁 Adım 5: Çıktı Katmanı',
    text: 'Son katmanda göreve uygun aktivasyon seçilir: Sınıflandırma için Softmax veya ikili için Sigmoid, regresyon için Linear.',
    formula: 'ŷ = softmax(W₃ · a₂ + b₃)',
    highlight: 4,
  },
];

let currentStep = 0;

function initForwardStepper() {
  drawForwardStep(0);
}

function changeStep(dir) {
  currentStep = Math.max(0, Math.min(FORWARD_STEPS.length - 1, currentStep + dir));
  drawForwardStep(currentStep);
  document.getElementById('prevStep').disabled = currentStep === 0;
  document.getElementById('nextStep').disabled = currentStep === FORWARD_STEPS.length - 1;
  document.getElementById('stepIndicator').textContent = `Adım ${currentStep+1} / ${FORWARD_STEPS.length}`;
}

function drawForwardStep(step) {
  const s = FORWARD_STEPS[step];
  document.getElementById('sdTitle').textContent = s.title;
  document.getElementById('sdText').textContent  = s.text;
  document.getElementById('sdFormula').textContent = s.formula;

  const cvs = document.getElementById('forwardCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const layers = [3, 4, 4, 2];
  const colors = ['#4f9eff', '#a855f7', '#22d3ee', '#10b981'];
  const layerLabels = ['Giriş', 'Gizli 1', 'Gizli 2', 'Çıktı'];
  const positions = layers.map((n, li) => {
    const x = (li + 0.7) * (W / (layers.length + 0.2));
    return Array.from({ length: n }, (_, ni) => ({
      x, y: H/2 + 35 + (ni - (n-1)/2) * 62
    }));
  });

  // connections
  for (let li = 0; li < positions.length - 1; li++) {
    const active = li === s.highlight - 1 || li === s.highlight;
    positions[li].forEach(from => {
      positions[li+1].forEach(to => {
        if (active) {
          const g = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
          g.addColorStop(0, colors[li] + 'aa');
          g.addColorStop(1, colors[li+1] + '66');
          ctx.strokeStyle = g;
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,0.06)';
          ctx.lineWidth = 0.8;
        }
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
    });
  }

  // nodes
  positions.forEach((layer, li) => {
    const isHighlight = li === s.highlight;
    layer.forEach(({ x, y }) => {
      ctx.shadowColor = colors[li];
      ctx.shadowBlur = isHighlight ? 25 : 8;
      ctx.fillStyle = isHighlight ? colors[li] + '66' : colors[li] + '1a';
      ctx.strokeStyle = colors[li];
      ctx.lineWidth = isHighlight ? 3 : 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
    // label
    ctx.fillStyle = isHighlight ? colors[li] : '#8888aa';
    ctx.font = (isHighlight ? '700' : '600') + ' 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(layerLabels[li], layer[0].x, 22);
  });
}

// ============================================================
// SECTION 7 — LAYER BUILDER
// ============================================================
function initLayerBuilder() {
  buildNetwork();
}

function buildNetwork() {
  const inputN     = parseInt(document.getElementById('inputN').value);
  const hiddenCount= parseInt(document.getElementById('hiddenCount').value);
  const hiddenN    = parseInt(document.getElementById('hiddenN').value);
  const outputN    = parseInt(document.getElementById('outputN').value);

  const layers = [inputN, ...Array(hiddenCount).fill(hiddenN), outputN];
  const colors = ['#4f9eff', '#a855f7', '#22d3ee', '#ec4899', '#10b981', '#f59e0b'];

  const cvs = document.getElementById('networkCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const maxN = Math.max(...layers);
  const nodeR = Math.min(18, (H * 0.65) / (maxN * 2.5));
  const spacing = Math.min(70, (H * 0.7) / maxN);

  const positions = layers.map((n, li) => {
    const x = (li + 0.7) * (W / (layers.length + 0.2));
    return Array.from({ length: n }, (_, ni) => ({
      x, y: H/2 + 30 + (ni - (n-1)/2) * spacing
    }));
  });

  // connections
  for (let li = 0; li < positions.length - 1; li++) {
    positions[li].forEach(from => {
      positions[li+1].forEach(to => {
        const g = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        g.addColorStop(0, colors[li % colors.length] + '55');
        g.addColorStop(1, colors[(li+1) % colors.length] + '22');
        ctx.strokeStyle = g;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
    });
  }

  // nodes
  positions.forEach((layer, li) => {
    const col = colors[li % colors.length];
    layer.forEach(({ x, y }) => {
      ctx.shadowColor = col;
      ctx.shadowBlur = 14;
      const g = ctx.createRadialGradient(x-3, y-3, 1, x, y, nodeR+4);
      g.addColorStop(0, col + 'cc');
      g.addColorStop(1, col + '11');
      ctx.fillStyle = g;
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, nodeR, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // layer label
    ctx.fillStyle = colors[li % colors.length];
    ctx.font = '600 11px Inter';
    ctx.textAlign = 'center';
    const lbl = li === 0 ? 'Giriş' : li === layers.length-1 ? 'Çıktı' : `Gizli ${li}`;
    ctx.fillText(lbl, layer[0].x, 20);
    ctx.fillStyle = '#8888aa';
    ctx.font = '500 11px Inter';
    ctx.fillText(layers[li] + ' nöron', layer[0].x, 35);
  });

  // Stats
  let params = 0;
  for (let i = 0; i < layers.length - 1; i++) {
    params += layers[i] * layers[i+1] + layers[i+1]; // W + b
  }
  const statsEl = document.getElementById('networkStats');
  const layerNames = layers.map((n, i) => i === 0 ? `Giriş(${n})` : i === layers.length-1 ? `Çıktı(${n})` : `Gizli${i}(${n})`);
  statsEl.innerHTML = `
    <div class="ns-item"><span class="ns-val">${layers.length}</span><span class="ns-label">Katman</span></div>
    <div class="ns-item"><span class="ns-val">${layers.reduce((a,b)=>a+b,0)}</span><span class="ns-label">Toplam Nöron</span></div>
    <div class="ns-item"><span class="ns-val">${params.toLocaleString()}</span><span class="ns-label">Parametre (W+b)</span></div>
    <div class="ns-item"><span class="ns-val" style="font-size:.9rem">${layerNames.join(' → ')}</span><span class="ns-label">Mimari</span></div>
  `;
}

// ============================================================
// SECTION 8 — NEURON COUNT COMPARE
// ============================================================
function initNeuronCompare() {
  updateCompare();
}

function updateCompare() {
  const n = parseInt(document.getElementById('neuronCount').value);
  document.getElementById('neuronCountVal').textContent = n;
  drawCompareCanvas(n);

  const labels = document.getElementById('compareLabels');
  if (n <= 3) {
    labels.innerHTML = '<div class="cl-item underfitting">⚠️ Az Nöron → Underfitting riski</div>';
  } else if (n <= 10) {
    labels.innerHTML = '<div class="cl-item good">✅ Dengeli Nöron Sayısı → İyi genelleme</div>';
  } else {
    labels.innerHTML = '<div class="cl-item overfitting">⚠️ Çok Nöron → Overfitting riski (Dropout gerekli!)</div>';
  }
}

function drawCompareCanvas(nNeurons) {
  const cvs = document.getElementById('compareCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const layers = [3, nNeurons, 2];
  const colors = ['#4f9eff', nNeurons <= 3 ? '#ef4444' : nNeurons <= 10 ? '#10b981' : '#f59e0b', '#10b981'];
  const maxN = Math.max(...layers);
  const spacing = Math.min(55, (H * 0.75) / maxN);
  const nodeR = Math.min(14, spacing * 0.4);

  const positions = layers.map((n, li) => {
    const x = (li + 0.7) * (W / (layers.length + 0.2));
    return Array.from({ length: n }, (_, ni) => ({
      x, y: H/2 + 20 + (ni - (n-1)/2) * spacing
    }));
  });

  for (let li = 0; li < positions.length - 1; li++) {
    positions[li].forEach(from => {
      positions[li+1].forEach(to => {
        ctx.strokeStyle = colors[li] + '44';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
    });
  }

  positions.forEach((layer, li) => {
    layer.forEach(({ x, y }) => {
      ctx.shadowColor = colors[li];
      ctx.shadowBlur = 12;
      ctx.fillStyle = colors[li] + '44';
      ctx.strokeStyle = colors[li];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, nodeR, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
    ctx.fillStyle = colors[li];
    ctx.font = '600 11px Inter';
    ctx.textAlign = 'center';
    const lbl = li === 0 ? 'Giriş' : li === layers.length-1 ? 'Çıktı' : `Gizli (${nNeurons} nöron)`;
    ctx.fillText(lbl, layer[0].x, 22);
  });
}

// ============================================================
// SECTION 9 — ACTIVATION EXPLORER
// ============================================================
const ACTIVATIONS = {
  relu: {
    formula: 'f(x) = max(0, x)',
    fn: x => Math.max(0, x),
    color: '#22d3ee',
    range: '[0, +∞)',
    deriv: '0 veya 1',
    use: 'Gizli katmanlar (ana kullanım)',
    pro: 'Hızlı, gradient kaybı yok (pozitifler için)',
    con: 'Dying ReLU (negatifler için nöron ölümü)',
    desc: 'Negatif değerleri sıfırlar, pozitifleri olduğu gibi geçirir. Günümüzde en yaygın kullanılan aktivasyon fonksiyonu. Derin ağlarda gradient kaybı sorununu büyük ölçüde çözer.',
  },
  sigmoid: {
    formula: 'f(x) = 1 / (1 + e⁻ˣ)',
    fn: x => 1 / (1 + Math.exp(-x)),
    color: '#ec4899',
    range: '(0, 1)',
    deriv: 'f(x)·(1-f(x))',
    use: 'İkili sınıflandırma çıktısı',
    pro: 'Olasılık yorumu kolay',
    con: 'Vanishing gradient, yavaş',
    desc: 'Çıktıyı 0-1 aralığına sıkıştırır. İkili sınıflandırma problemlerinde çıktı katmanında kullanılır. Gizli katlarda gradient kaybı nedeniyle artık tercih edilmez.',
  },
  tanh: {
    formula: 'f(x) = (eˣ - e⁻ˣ) / (eˣ + e⁻ˣ)',
    fn: x => Math.tanh(x),
    color: '#f59e0b',
    range: '(-1, 1)',
    deriv: '1 - f(x)²',
    use: 'RNN, LSTM gizli katmanlar',
    pro: 'Sıfır merkezli (sigmoid\'den iyi)',
    con: 'Vanishing gradient (derin ağlarda)',
    desc: 'Çıktıyı -1 ile 1 arasına sıkıştırır. Sıfır merkezli olması sigmoid\'e göre avantajlıdır. Özellikle RNN ve LSTM mimarilerinde kullanılır.',
  },
  leaky: {
    formula: 'f(x) = x > 0 ? x : 0.01·x',
    fn: x => x >= 0 ? x : 0.01 * x,
    color: '#4f9eff',
    range: '(-∞, +∞)',
    deriv: '1 veya 0.01',
    use: 'Gizli katmanlar (ReLU alternatifi)',
    pro: 'Dying ReLU sorununu çözer',
    con: 'α hiperparametresini ayarlamak gerek',
    desc: 'ReLU\'nun "ölü nöron" sorununu çözer. Negatif değerlere küçük bir eğim (α=0.01) verir. ReLU çalışmadığında denenmesi gereken ilk alternatiftir.',
  },
  gelu: {
    formula: 'f(x) ≈ x·Φ(x)',
    fn: x => 0.5 * x * (1 + Math.tanh(Math.sqrt(2/Math.PI) * (x + 0.044715*x*x*x))),
    color: '#a855f7',
    range: '(-∞, +∞)',
    deriv: 'Σ(x) + x·σ(x)',
    use: 'Transformer, BERT, GPT modelleri',
    pro: 'Stochastic regularization etkisi',
    con: 'Hesaplama maliyeti biraz yüksek',
    desc: 'Gaussian Error Linear Unit. GPT, BERT gibi modern transformer modellerinde tercih edilir. Smooth geçişi ve stochastic doğası ile çok güçlü bir aktivasyon fonksiyonudur.',
  },
  swish: {
    formula: 'f(x) = x · sigmoid(x)',
    fn: x => x * (1 / (1 + Math.exp(-x))),
    color: '#10b981',
    range: '(-∞, +∞)',
    deriv: 'f(x) + σ(x)·(1 - f(x))',
    use: 'Derin sinir ağları (Google önerisi)',
    pro: 'ReLU\'dan genellikle daha iyi performans',
    con: 'Hesaplama maliyeti biraz yüksek',
    desc: 'Google Brain tarafından önerilen, Self-Gated aktivasyon. ReLU\'ya göre daha iyi performans gösterdiği birçok derinlik testinde kanıtlanmıştır. SiLU olarak da bilinir.',
  },
};

let currentActivation = 'relu';

function initActivation() {
  selectActivation('relu');
}

function selectActivation(name) {
  currentActivation = name;
  document.querySelectorAll('.ae-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.fn === name);
  });
  drawActivationCanvas(name);
  updateActivationInfo(name);
}

function drawActivationCanvas(name) {
  const cvs = document.getElementById('activationCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const act = ACTIVATIONS[name];
  const padL = 50, padR = 20, padT = 20, padB = 40;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xMin = -5, xMax = 5;

  // compute y range
  const xs = Array.from({ length: 200 }, (_, i) => xMin + i * (xMax - xMin) / 199);
  const ys = xs.map(x => act.fn(x));
  const yMin = Math.max(-6, Math.min(...ys) - 0.5);
  const yMax = Math.min(6,  Math.max(...ys) + 0.5);

  const toScreen = (x, y) => ({
    sx: padL + (x - xMin) / (xMax - xMin) * plotW,
    sy: padT + (yMax - y) / (yMax - yMin) * plotH,
  });

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let gx = xMin; gx <= xMax; gx++) {
    const { sx } = toScreen(gx, 0);
    ctx.beginPath(); ctx.moveTo(sx, padT); ctx.lineTo(sx, padT + plotH); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1.5;
  const ox = toScreen(0, 0);
  ctx.beginPath(); ctx.moveTo(padL, ox.sy); ctx.lineTo(padL + plotW, ox.sy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox.sx, padT); ctx.lineTo(ox.sx, padT + plotH); ctx.stroke();

  // x labels
  ctx.fillStyle = '#8888aa';
  ctx.font = '11px Inter';
  ctx.textAlign = 'center';
  for (let gx = xMin; gx <= xMax; gx += 2) {
    const { sx, sy } = toScreen(gx, 0);
    ctx.fillText(gx, sx, Math.min(sy + 14, padT + plotH + 14));
  }

  // Plot activation
  ctx.strokeStyle = act.color;
  ctx.lineWidth = 3;
  ctx.shadowColor = act.color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  xs.forEach((x, i) => {
    const y = ys[i];
    const { sx, sy } = toScreen(x, y);
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Legend
  ctx.fillStyle = act.color;
  ctx.font = '600 13px JetBrains Mono';
  ctx.textAlign = 'left';
  ctx.fillText(act.formula, padL + 8, padT + 16);
}

function updateActivationInfo(name) {
  const act = ACTIVATIONS[name];
  document.getElementById('aeiFormula').textContent = act.formula;
  document.getElementById('propRange').textContent = act.range;
  document.getElementById('propDeriv').textContent = act.deriv;
  document.getElementById('propUse').textContent   = act.use;
  document.getElementById('propPro').textContent   = act.pro;
  document.getElementById('propCon').textContent   = act.con;
  document.getElementById('aeiDesc').textContent   = act.desc;
}

// ============================================================
// COPY CODE
// ============================================================
function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre code');
  navigator.clipboard.writeText(pre.textContent).then(() => {
    btn.textContent = '✅ Kopyalandı!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📋 Kopyala';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// ============================================================
// SECTION 10 — BACKPROP STEPPER
// ============================================================
const BP_STEPS = [
  {
    title: '🟢 Adım 1: Forward Pass — Tahmin Yap',
    text:  'Önce ağ girişten çıkışa forward pass yapar ve bir tahmin üretir (ŷ). Bu adımda hiçbir şey güncellenmez.',
    formula: 'ŷ = forward(x; W, b)',
    dir: 'fwd',
  },
  {
    title: '📉 Adım 2: Loss Hesapla',
    text:  'Tahmin (ŷ) ile gerçek etiket (y) arasındaki fark loss fonksiyonu ile ölçülür. Bu hata miktarımızı gösterir.',
    formula: 'L = (ŷ - y)²  →  L = 0.64',
    dir: 'loss',
  },
  {
    title: '↩️ Adım 3: Çıktı Katmanı Gradyanı',
    text:  'Loss\'un çıktı katmanı ağırlıklarına göre türevi hesaplanır. Bu, ağırlıkların hataya ne kadar katkıda bulunduğunu söyler.',
    formula: '∂L/∂W₃ = ∂L/∂ŷ · ∂ŷ/∂z₃ · ∂z₃/∂W₃',
    dir: 'bwd3',
  },
  {
    title: '↩️ Adım 4: Gizli Katman Gradyanı (Chain Rule)',
    text:  'Hata, zincir kuralı ile bir önceki katmana iletilir. Her katmanın gradyanı, sonraki katmanın gradyanına bağlıdır.',
    formula: '∂L/∂W₂ = ∂L/∂a₂ · ∂a₂/∂z₂ · ∂z₂/∂W₂',
    dir: 'bwd2',
  },
  {
    title: '↩️ Adım 5: İlk Katman Gradyanı',
    text:  'Zincir en başa ulaşır. Artık her ağırlığın loss\'a olan katkısı bilinmektedir.',
    formula: '∂L/∂W₁ = ∂L/∂a₁ · ReLU\'(z₁) · ∂z₁/∂W₁',
    dir: 'bwd1',
  },
  {
    title: '✅ Adım 6: Ağırlıkları Güncelle (Gradient Descent)',
    text:  'Tüm gradyanlar hesaplandı. Her ağırlık, gradyanın learning rate ile ölçeklenmiş miktarı kadar güncellenir.',
    formula: 'W ← W − α · ∂L/∂W',
    dir: 'update',
  },
];

let bpStep = 0;

function initBackprop() {
  drawBpStep(0);
}

function changeBpStep(dir) {
  bpStep = Math.max(0, Math.min(BP_STEPS.length - 1, bpStep + dir));
  drawBpStep(bpStep);
  document.getElementById('bpPrev').disabled = bpStep === 0;
  document.getElementById('bpNext').disabled = bpStep === BP_STEPS.length - 1;
  document.getElementById('bpStepInd').textContent = `Adım ${bpStep+1} / ${BP_STEPS.length}`;
}

function drawBpStep(step) {
  const s = BP_STEPS[step];
  document.getElementById('bpTitle').textContent   = s.title;
  document.getElementById('bpText').textContent    = s.text;
  document.getElementById('bpFormula').textContent = s.formula;

  const cvs = document.getElementById('backpropCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const layers  = [3, 4, 4, 2];
  const fwdCols = ['#4f9eff', '#a855f7', '#22d3ee', '#10b981'];
  const bwdCols = ['#ef4444', '#f59e0b', '#ec4899', '#f87171'];
  const layerLbls = ['Giriş (x)', 'Gizli 1', 'Gizli 2', 'Çıktı (ŷ)'];

  const positions = layers.map((n, li) => {
    const x = (li + 0.7) * (W / (layers.length + 0.2));
    return Array.from({ length: n }, (_, ni) => ({
      x, y: H/2 + 25 + (ni - (n-1)/2) * 58
    }));
  });

  // determine which layers are highlighted
  const fwdHighlight = { fwd: [0,1,2,3], loss:[], bwd3:[], bwd2:[], bwd1:[], update:[] }[s.dir] || [];
  const bwdHighlight = { fwd: [], loss:[3], bwd3:[3], bwd2:[2,3], bwd1:[1,2], update:[0,1,2,3] }[s.dir] || [];

  for (let li = 0; li < positions.length - 1; li++) {
    const isFwd = fwdHighlight.includes(li);
    const isBwd = bwdHighlight.includes(li) && bwdHighlight.includes(li+1);
    positions[li].forEach(from => {
      positions[li+1].forEach(to => {
        if (isFwd) {
          ctx.strokeStyle = fwdCols[li] + '88'; ctx.lineWidth = 2;
        } else if (isBwd) {
          ctx.strokeStyle = bwdCols[li] + '88'; ctx.lineWidth = 2.5;
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.8;
        }
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
    });

    // animated backprop arrow
    if (isBwd && s.dir !== 'fwd') {
      positions[li].forEach(from => {
        const to = positions[li+1][0];
        const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
        ctx.fillStyle = '#f59e0b';
        ctx.font = '700 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('←', mx, my - 6);
      });
    }
  }

  // nodes
  positions.forEach((layer, li) => {
    const isFwdH = fwdHighlight.includes(li);
    const isBwdH = bwdHighlight.includes(li);
    const col = isBwdH ? bwdCols[li] : fwdCols[li];
    const active = isFwdH || isBwdH;
    layer.forEach(({ x, y }) => {
      ctx.shadowColor = col;
      ctx.shadowBlur = active ? 22 : 8;
      ctx.fillStyle = active ? col + '66' : col + '1a';
      ctx.strokeStyle = col;
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
    ctx.fillStyle = active ? col : '#8888aa';
    ctx.font = (active ? '700' : '600') + ' 11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(layerLbls[li], layer[0].x, 20);
  });

  // Loss label
  if (s.dir === 'loss' || s.dir.startsWith('bwd') || s.dir === 'update') {
    const lx = W - 60, ly = H / 2;
    ctx.fillStyle = '#ef444488';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4,3]);
    ctx.beginPath();
    ctx.moveTo(positions[3][0].x + 20, positions[3][0].y);
    ctx.lineTo(lx - 24, ly);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = '700 13px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('L', lx, ly + 4);
    ctx.fillStyle = '#ef444466';
    ctx.beginPath();
    ctx.arc(lx, ly, 18, 0, Math.PI*2);
    ctx.fill();
  }
}

// ============================================================
// SECTION 10 — GRADIENT DESCENT DEMO
// ============================================================
let gdAnimId = null;
let gdParticleX = null;
let gdRunning = false;

function getLossLandscape(x) {
  // Quadratic bowl with a bump
  return 0.1 * (x - 2) * (x - 2) + 0.5 * Math.sin(x * 1.8) + 1.2;
}

function getLossGradient(x) {
  const dx = 0.01;
  return (getLossLandscape(x + dx) - getLossLandscape(x - dx)) / (2 * dx);
}

function initGD() {
  drawGDCanvas(null, []);
}

function updateGD() {
  const lr = parseFloat(document.getElementById('lrSlider').value);
  document.getElementById('lrVal').textContent = lr.toFixed(2);
  if (!gdRunning) drawGDCanvas(null, []);
}

function resetGD() {
  gdRunning = false;
  if (gdAnimId) cancelAnimationFrame(gdAnimId);
  gdParticleX = null;
  document.getElementById('gdLog').innerHTML = '<span class="gd-badge">Hazır — Çalıştır butonuna bas</span>';
  document.getElementById('gdRunBtn').textContent = '▶ Gradient Descent Çalıştır';
  document.getElementById('gdRunBtn').onclick = runGD;
  drawGDCanvas(null, []);
}

function runGD() {
  if (gdRunning) { resetGD(); return; }
  gdRunning = true;
  document.getElementById('gdRunBtn').textContent = '⏹ Durdur';
  document.getElementById('gdRunBtn').onclick = resetGD;

  const lr = parseFloat(document.getElementById('lrSlider').value);
  let x = -4.5;
  const history = [x];
  const logEl = document.getElementById('gdLog');
  logEl.innerHTML = '';

  let iter = 0;
  const MAX = 60;

  const step = () => {
    if (iter >= MAX || !gdRunning) {
      gdRunning = false;
      document.getElementById('gdRunBtn').textContent = '▶ Gradient Descent Çalıştır';
      document.getElementById('gdRunBtn').onclick = runGD;
      const badge = document.createElement('span');
      badge.className = 'gd-badge good';
      badge.textContent = `✅ Tamamlandı! ${iter} iterasyon, min ≈ ${getLossLandscape(x).toFixed(3)}`;
      logEl.appendChild(badge);
      return;
    }

    const grad = getLossGradient(x);
    const xNew = x - lr * grad;
    x = xNew;
    history.push(x);
    iter++;

    drawGDCanvas(x, history);

    // log
    if (iter % 5 === 1 || iter <= 3) {
      const badge = document.createElement('span');
      const loss = getLossLandscape(x);
      badge.className = 'gd-badge' + (Math.abs(grad) > 2 ? ' warn' : '');
      badge.textContent = `iter ${iter}: x=${x.toFixed(2)}, L=${loss.toFixed(3)}, ∂L=${grad.toFixed(3)}`;
      logEl.prepend(badge);
    }

    gdAnimId = setTimeout(step, 120);
  };
  step();
}

function drawGDCanvas(currentX, history) {
  const cvs = document.getElementById('gdCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const padL = 50, padR = 20, padT = 20, padB = 40;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xMin = -5, xMax = 5;
  const yMin = 0, yMax = 5;

  const toS = (x, y) => ({
    sx: padL + (x - xMin) / (xMax - xMin) * plotW,
    sy: padT + (yMax - y) / (yMax - yMin) * plotH,
  });

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let gx = xMin; gx <= xMax; gx++) {
    const {sx} = toS(gx, 0);
    ctx.beginPath(); ctx.moveTo(sx, padT); ctx.lineTo(sx, padT + plotH); ctx.stroke();
  }
  for (let gy = 0; gy <= 5; gy++) {
    const {sy} = toS(0, gy);
    ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(padL + plotW, sy); ctx.stroke();
  }

  // axes labels
  ctx.fillStyle = '#8888aa'; ctx.font = '11px Inter'; ctx.textAlign = 'center';
  for (let gx = xMin; gx <= xMax; gx += 2) {
    const {sx, sy} = toS(gx, 0);
    ctx.fillText(gx, sx, Math.min(sy + 14, padT + plotH + 14));
  }

  // Loss curve
  const xs = Array.from({length: 300}, (_, i) => xMin + i * (xMax - xMin) / 299);
  ctx.strokeStyle = '#4f9eff';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#4f9eff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  xs.forEach((x, i) => {
    const y = getLossLandscape(x);
    const {sx, sy} = toS(x, y);
    i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // History path
  if (history.length > 1) {
    ctx.strokeStyle = '#f59e0b88';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    history.forEach((hx, i) => {
      const hy = getLossLandscape(hx);
      const {sx, sy} = toS(hx, hy);
      i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Current position (ball)
  if (currentX !== null) {
    const cy = getLossLandscape(currentX);
    const {sx, sy} = toS(currentX, cy);
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(sx, sy, 9, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // gradient arrow
    const grad = getLossGradient(currentX);
    const arrowLen = Math.min(Math.abs(grad) * 15, 60);
    const dir = grad > 0 ? -1 : 1;
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + dir * arrowLen, sy);
    ctx.stroke();
    ctx.fillStyle = '#ec4899';
    ctx.font = '600 11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`∂L=${grad.toFixed(2)}`, sx, sy - 14);
  }

  // Labels
  ctx.fillStyle = '#4f9eff'; ctx.font = '600 12px Inter'; ctx.textAlign = 'left';
  ctx.fillText('Loss Yüzeyi L(w)', padL + 8, padT + 16);
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('● Mevcut konum', padL + 8, padT + 32);
}

// ============================================================
// SECTION 11 — LOSS EXPLORER
// ============================================================
const LOSS_DEFS = {
  mse: {
    formula: 'L = (1/n) Σ(y − ŷ)²',
    fn: (y, yhat) => (y - yhat) ** 2,
    color: '#4f9eff',
    task: 'Regresyon',
    pro: 'Büyük hataları quadratik cezalandırır',
    con: 'Aykırı değerlere hassas',
    code: 'nn.MSELoss()',
    desc: 'Mean Squared Error: Tahmin ile gerçek farkının karelerinin ortalaması. Büyük hatalar quadratik olarak büyür. Regresyon görevlerinde standart seçimdir.',
    xLabel: 'Tahmin (ŷ)', yLabel: 'L',
    inputMode: 'regression',
  },
  mae: {
    formula: 'L = (1/n) Σ|y − ŷ|',
    fn: (y, yhat) => Math.abs(y - yhat),
    color: '#22d3ee',
    task: 'Regresyon (aykırı değerler var)',
    pro: 'Aykırı değerlere dayanıklı',
    con: 'Sıfırda türev yok',
    code: 'nn.L1Loss()',
    desc: 'Mean Absolute Error: Farkların mutlak değerlerinin ortalaması. Aykırı değerlere MSE\'den daha dayanıklıdır. Médiane regresyon yapar.',
    inputMode: 'regression',
  },
  bce: {
    formula: 'L = −[y·log(ŷ) + (1−y)·log(1−ŷ)]',
    fn: (y, yhat) => -(y * Math.log(yhat + 1e-8) + (1 - y) * Math.log(1 - yhat + 1e-8)),
    color: '#ec4899',
    task: 'İkili Sınıflandırma (0/1)',
    pro: 'Olasılık yorumlama, gradient iyi',
    con: 'Yalnızca 0-1 arası tahminler',
    code: 'nn.BCEWithLogitsLoss()',
    desc: 'Binary Cross-Entropy: Tahmin olasılığının negatif log-likelihood\'ı. İkili sınıflandırmada (0 veya 1 etiket) çıktı katmanında Sigmoid ile kullanılır.',
    inputMode: 'binary',
  },
  cce: {
    formula: 'L = −Σ yᵢ · log(ŷᵢ)',
    fn: (y, yhat) => -(y * Math.log(yhat + 1e-8) + (1 - y) * Math.log(1 - yhat + 1e-8)) * 1.2,
    color: '#a855f7',
    task: 'Çok Sınıflı Sınıflandırma',
    pro: 'Doğru sınıfı olasılığa en çok iter',
    con: 'Logit girdi gerektirir (PyTorch\'ta)',
    code: 'nn.CrossEntropyLoss()',
    desc: 'Categorical Cross-Entropy: Çok sınıflı sınıflandırmada kullanılır. PyTorch\'ta CrossEntropyLoss, Softmax + CE\'yi birleştirmiştir. Tahmin logit olarak girilmeli.',
    inputMode: 'binary',
  },
  huber: {
    formula: 'L = 0.5·x² (|x|≤δ)  else  δ·(|x|−0.5δ)',
    fn: (y, yhat) => { const e = Math.abs(y - yhat); const d = 0.5; return e <= d ? 0.5*e*e : d*(e - 0.5*d); },
    color: '#10b981',
    task: 'Regresyon (aykırı değer toleranslı)',
    pro: 'MSE + MAE karışımı, robust',
    con: 'delta (δ) hiperparametresi',
    code: 'nn.HuberLoss(delta=0.5)',
    desc: 'Huber Loss: Küçük hatalar için MSE, büyük hatalar için MAE gibi davranır. delta parametresi bu geçişi kontrol eder. Aykırı değerlere karşı robust regresyon için idealdir.',
    inputMode: 'regression',
  },
};

let currentLoss = 'mse';

function initLoss() {
  selectLoss('mse');
  updateLossCalc();
}

function selectLoss(name) {
  currentLoss = name;
  document.querySelectorAll('[data-loss]').forEach(t => t.classList.toggle('active', t.dataset.loss === name));
  drawLossCanvas(name);
  const d = LOSS_DEFS[name];
  document.getElementById('lossFormula').textContent   = d.formula;
  document.getElementById('lossPropTask').textContent  = d.task;
  document.getElementById('lossPropPro').textContent   = d.pro;
  document.getElementById('lossPropCon').textContent   = d.con;
  document.getElementById('lossPropCode').textContent  = d.code;
  document.getElementById('lossDesc').textContent      = d.desc;
  updateLossCalc();
}

function drawLossCanvas(name) {
  const cvs = document.getElementById('lossCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const def = LOSS_DEFS[name];
  const padL = 50, padR = 20, padT = 24, padB = 36;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  let xMin, xMax, y = 1.0;
  if (def.inputMode === 'binary') { xMin = 0.001; xMax = 0.999; }
  else { xMin = -2; xMax = 4; y = 2.0; }

  const xs = Array.from({length: 200}, (_, i) => xMin + i * (xMax - xMin) / 199);
  const ys = xs.map(x => def.fn(y, x));
  const yMin = 0, yMax = Math.min(Math.max(...ys) * 1.1, 8);

  const toS = (x, yv) => ({
    sx: padL + (x - xMin) / (xMax - xMin) * plotW,
    sy: padT + (yMax - yv) / (yMax - yMin) * plotH,
  });

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
  for (let gx = 0; gx <= 5; gx++) {
    const fx = xMin + gx * (xMax - xMin) / 5;
    const {sx} = toS(fx, 0);
    ctx.beginPath(); ctx.moveTo(sx, padT); ctx.lineTo(sx, padT + plotH); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

  // Labels
  ctx.fillStyle = '#8888aa'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
  [xMin, (xMin+xMax)/2, xMax].forEach(gx => {
    const {sx, sy} = toS(gx, 0);
    ctx.fillText(gx.toFixed(1), sx, sy + 14);
  });
  ctx.textAlign = 'left';
  ctx.fillStyle = def.color; ctx.font = '600 11px JetBrains Mono';
  ctx.fillText(def.formula.substring(0, 26), padL + 4, padT + 14);

  // Curve
  ctx.strokeStyle = def.color;
  ctx.lineWidth = 3;
  ctx.shadowColor = def.color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  xs.forEach((xv, i) => {
    const yv = ys[i];
    if (yv > yMax || yv < 0) return;
    const {sx, sy} = toS(xv, yv);
    i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Truth marker
  const {sx: tsx, sy: tsy} = toS(def.inputMode === 'binary' ? 1.0 : y, 0);
  ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 1.5; ctx.setLineDash([4,3]);
  ctx.beginPath(); ctx.moveTo(tsx, padT); ctx.lineTo(tsx, padT + plotH); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ffffff88'; ctx.font = '10px Inter';
  ctx.textAlign = 'center'; ctx.fillText('y (gerçek)', tsx, padT + 11);
}

function updateLossCalc() {
  const y    = parseFloat(document.getElementById('lcActualSlider').value);
  const yhat = parseFloat(document.getElementById('lcPredSlider').value);
  document.getElementById('lcActual').textContent = y.toFixed(2);
  document.getElementById('lcPred').textContent   = yhat.toFixed(2);

  const metrics = [
    { name: 'MSE',   val: (y - yhat)**2,                          color: '#4f9eff' },
    { name: 'MAE',   val: Math.abs(y - yhat),                       color: '#22d3ee' },
    { name: 'BCE',   val: -(y * Math.log(yhat+1e-8) + (1-y) * Math.log(1-yhat+1e-8)), color: '#ec4899' },
    { name: 'Huber', val: (() => { const e = Math.abs(y-yhat); const d=0.5; return e<=d ? 0.5*e*e : d*(e-0.5*d); })(), color: '#10b981' },
  ];

  const max = Math.max(...metrics.map(m => m.val));
  document.getElementById('lossMeterDisplay').innerHTML = metrics.map(m => `
    <div class="lm-card">
      <div class="lm-name">${m.name}</div>
      <div class="lm-val" style="color:${m.color}">${m.val.toFixed(4)}</div>
      <div class="lm-bar-bg">
        <div class="lm-bar" style="width:${Math.min(m.val/max*100,100).toFixed(0)}%; background:${m.color}"></div>
      </div>
    </div>
  `).join('');
}

// ============================================================
// SECTION 12 — TRAINING LAB
// ============================================================
let trainingAnimId = null;
let trainingRunning = false;

function resetTraining() {
  trainingRunning = false;
  if (trainingAnimId) clearTimeout(trainingAnimId);
  document.getElementById('trainingLog').innerHTML = '<div class="log-empty">⬆️ Eğitimi başlatmak için "Eğitimi Başlat" butonuna bas</div>';
  document.getElementById('trainingAlert').style.display = 'none';
  document.getElementById('labRunBtn').textContent = '▶ Eğitimi Başlat';
  document.getElementById('labRunBtn').onclick = runTraining;
  document.getElementById('epEpoch').textContent = '—';
  document.getElementById('epTrainLoss').textContent = '—';
  document.getElementById('epValLoss').textContent = '—';
  document.getElementById('epStatus').textContent = 'Bekliyor';
  drawTrainingCanvas([], []);
}

function runTraining() {
  if (trainingRunning) { resetTraining(); return; }
  trainingRunning = true;
  document.getElementById('labRunBtn').textContent = '⏹ Durdur';
  document.getElementById('labRunBtn').onclick = resetTraining;

  const lr        = parseFloat(document.getElementById('labLR').value);
  const maxEpochs = parseInt(document.getElementById('labEpochs').value);
  const capacity  = document.getElementById('labCapacity').value;
  const patience  = parseInt(document.getElementById('labPatience').value);

  const logEl   = document.getElementById('trainingLog');
  const alertEl = document.getElementById('trainingAlert');
  logEl.innerHTML = '';
  alertEl.style.display = 'none';

  // Simulate train/val loss curves based on capacity + lr
  const trainLosses = [], valLosses = [];
  let bestVal = Infinity, patienceCounter = 0;
  let epoch = 0;

  const profile = {
    underfitting: { trainBase: 0.7, trainEnd: 0.55, valBase: 0.72, valEnd: 0.58, noise: 0.02, overfit: false },
    good:         { trainBase: 0.8, trainEnd: 0.12, valBase: 0.82, valEnd: 0.18, noise: 0.03, overfit: false },
    overfitting:  { trainBase: 0.8, trainEnd: 0.04, valBase: 0.82, valEnd: 0.45, noise: 0.04, overfit: true  },
  }[capacity];

  const lrFactor = { 0.001: 0.4, 0.01: 1.0, 0.05: 1.3, 0.5: 0.3 }[lr] || 1.0;

  const step = () => {
    if (!trainingRunning || epoch >= maxEpochs) {
      trainingRunning = false;
      document.getElementById('labRunBtn').textContent = '▶ Eğitimi Başlat';
      document.getElementById('labRunBtn').onclick = runTraining;
      document.getElementById('epStatus').textContent = '✅ Bitti';
      // Final diagnosis
      const lastTrain = trainLosses[trainLosses.length-1];
      const lastVal   = valLosses[valLosses.length-1];
      if (lastTrain > 0.5) {
        showAlert(alertEl, 'underfit', '🧊 Underfitting tespit edildi! Model çok basit — nöron/katman sayısını artır veya daha fazla epoch çalıştır.');
      } else if (lastVal - lastTrain > 0.15) {
        showAlert(alertEl, 'overfit', '⚠️ Overfitting tespit edildi! Validation loss yüksek — Dropout, L2 reg veya Early Stopping kullan.');
      } else {
        showAlert(alertEl, 'good', '✅ İyi bir model! Train ve Val loss dengeli — model iyi genelleme yapıyor.');
      }
      return;
    }

    const t = epoch / maxEpochs;
    const decay = Math.exp(-lrFactor * t * 4);
    const trainLoss = profile.trainBase * decay + profile.trainEnd * (1-decay) + (Math.random()-0.5) * profile.noise;
    const valLoss = profile.overfit
      ? profile.valBase * decay + profile.valEnd * t + (Math.random()-0.5)*profile.noise + (t > 0.4 ? (t-0.4)*0.5 : 0)
      : profile.valBase * decay + profile.valEnd * (1-decay) + (Math.random()-0.5) * profile.noise * 1.5;

    trainLosses.push(Math.max(0.005, trainLoss));
    valLosses.push(Math.max(0.01, valLoss));

    drawTrainingCanvas(trainLosses, valLosses);

    document.getElementById('epEpoch').textContent     = epoch + 1;
    document.getElementById('epTrainLoss').textContent = trainLosses[epoch].toFixed(4);
    document.getElementById('epValLoss').textContent   = valLosses[epoch].toFixed(4);
    document.getElementById('epStatus').textContent    = '🔄 Eğitim';

    // Log line
    const line = document.createElement('div');
    line.className = 'log-line';
    let note = '';
    const delta = valLosses[epoch] - (valLosses[epoch-1] || valLosses[0]);
    if (delta > 0.02) note = `<span class="log-note">⚠️ val artıyor (Δ+${delta.toFixed(3)})</span>`;
    line.innerHTML = `<span class="log-ep">Epoch ${String(epoch+1).padStart(3,' ')}</span><span class="log-train">train: ${trainLosses[epoch].toFixed(4)}</span><span class="log-val">val: ${valLosses[epoch].toFixed(4)}</span>${note}`;
    logEl.prepend(line);

    // Early stopping
    if (patience > 0) {
      if (valLosses[epoch] < bestVal - 0.001) {
        bestVal = valLosses[epoch];
        patienceCounter = 0;
      } else {
        patienceCounter++;
        if (patienceCounter >= patience) {
          const stopLine = document.createElement('div');
          stopLine.className = 'log-line';
          stopLine.innerHTML = `<span class="log-stop">⛔ Early Stopping tetiklendi! Epoch ${epoch+1}, patience=${patience} doldu. En iyi val: ${bestVal.toFixed(4)}</span>`;
          logEl.prepend(stopLine);
          trainingRunning = false;
          document.getElementById('epStatus').textContent = '⛔ Early Stop';
          showAlert(alertEl, 'earlystop', `⛔ Early Stopping tetiklendi! ${patience} epoch boyunca validation loss iyileşmedi. Model ${epoch+1}. epoch'ta durduruldu.`);
          document.getElementById('labRunBtn').textContent = '▶ Eğitimi Başlat';
          document.getElementById('labRunBtn').onclick = runTraining;
          return;
        }
      }
    }

    epoch++;
    const speed = lr <= 0.001 ? 120 : lr >= 0.5 ? 300 : 80;
    trainingAnimId = setTimeout(step, speed);
  };

  step();
}

function showAlert(el, type, msg) {
  el.className = 'training-alert ' + type;
  el.innerHTML = msg;
  el.style.display = 'flex';
}

function drawTrainingCanvas(trainLosses, valLosses) {
  const cvs = document.getElementById('trainingCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  if (trainLosses.length === 0) {
    ctx.fillStyle = '#8888aa';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Eğitimi başlatınca loss grafiği burada görünecek', W/2, H/2);
    return;
  }

  const padL = 55, padR = 20, padT = 24, padB = 40;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = trainLosses.length;
  const allVals = [...trainLosses, ...valLosses];
  const yMin = 0, yMax = Math.max(...allVals) * 1.15;

  const toS = (xi, y) => ({
    sx: padL + (xi / Math.max(n-1, 1)) * plotW,
    sy: padT + (yMax - y) / (yMax - yMin) * plotH,
  });

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const sy = padT + i * plotH / 4;
    ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(padL + plotW, sy); ctx.stroke();
  }

  // Y axis labels
  ctx.fillStyle = '#8888aa'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = yMax - i * yMax / 4;
    const sy = padT + i * plotH / 4;
    ctx.fillText(y.toFixed(2), padL - 5, sy + 4);
  }

  // X axis labels
  ctx.textAlign = 'center';
  ctx.fillText('Epoch', padL + plotW/2, padT + plotH + 30);
  ctx.fillText(1, padL, padT + plotH + 14);
  ctx.fillText(n, padL + plotW, padT + plotH + 14);

  // Train loss curve
  ctx.strokeStyle = '#4f9eff';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#4f9eff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  trainLosses.forEach((v, i) => {
    const {sx, sy} = toS(i, v);
    i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Val loss curve
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#ec4899';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  valLosses.forEach((v, i) => {
    const {sx, sy} = toS(i, v);
    i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Legend
  ctx.font = '600 12px Inter';
  ctx.fillStyle = '#4f9eff'; ctx.textAlign = 'left';
  ctx.fillRect(padL + 8, padT + 4, 20, 3);
  ctx.fillText('Train Loss', padL + 32, padT + 14);
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(padL + 8, padT + 20, 20, 3);
  ctx.fillText('Val Loss', padL + 32, padT + 30);
}

// ============================================================
// INIT — add new inits to DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initBackprop();
  initGD();
  initLoss();
  drawTrainingCanvas([], []);
  initCNN();
});

// ============================================================
// SECTION 13 — CNN
// ============================================================

// ---- Kernel definitions ----
const KERNELS = {
  edge: {
    matrix: [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]],
    name: 'Kenar Tespiti (Laplacian)',
    color: '#4f9eff',
  },
  blur: {
    matrix: [[1,1,1],[1,1,1],[1,1,1]].map(r => r.map(v => v/9)),
    name: 'Bulanıklaştırma (Avg)',
    color: '#22d3ee',
  },
  sharpen: {
    matrix: [[0,-1,0],[-1,5,-1],[0,-1,0]],
    name: 'Keskinleştirme',
    color: '#a855f7',
  },
  emboss: {
    matrix: [[-2,-1,0],[-1,1,1],[0,1,2]],
    name: 'Kabartma (Emboss)',
    color: '#f59e0b',
  },
};

// ---- Simple 7×7 binary pattern (letter-like) ----
const INPUT_IMG = [
  [0,0,1,1,1,0,0],
  [0,1,0,0,0,1,0],
  [1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1],
];

let convAnimId   = null;
let convRunning  = false;
let featureMap   = null;

function initCNN() {
  drawInputImage();
  updateKernel();
  drawKernelCanvas(KERNELS.edge.matrix, KERNELS.edge.color);
  initCNNArch();
  drawCNNFeatureMaps();
  calcCNNParams();
}

function updateKernel() {
  const type = document.getElementById('kernelType').value;
  const k = KERNELS[type];
  document.getElementById('kernelFormula').textContent = k.name;
  drawKernelCanvas(k.matrix, k.color);
  if (!convRunning) {
    featureMap = null;
    drawFeatureMapEmpty();
  }
}

function drawInputImage() {
  const cvs = document.getElementById('inputImgCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const N = 7, cell = Math.floor(cvs.width / N);
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const v = INPUT_IMG[r][c];
      ctx.fillStyle = v ? '#e8e8ff' : '#0a0a1a';
      ctx.fillRect(c * cell, r * cell, cell - 1, cell - 1);
      ctx.fillStyle = v ? '#22d3ee88' : '#4f9eff22';
      ctx.font = `bold ${cell * 0.38}px JetBrains Mono`;
      ctx.textAlign = 'center';
      ctx.fillText(v, c * cell + cell / 2, r * cell + cell * 0.65);
    }
  }
  // Grid overlay
  ctx.strokeStyle = 'rgba(79,158,255,0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= N; i++) {
    ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, cvs.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(cvs.width, i * cell); ctx.stroke();
  }
}

function drawKernelCanvas(matrix, color) {
  const cvs = document.getElementById('kernelCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const N = 3, cell = Math.floor(cvs.width / N);
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  const flat = matrix.flat();
  const maxAbs = Math.max(...flat.map(Math.abs), 1);

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const v = matrix[r][c];
      const alpha = Math.abs(v) / maxAbs;
      ctx.fillStyle = v >= 0 ? `rgba(79,158,255,${0.1 + alpha * 0.5})` : `rgba(236,72,153,${0.1 + alpha * 0.5})`;
      ctx.fillRect(c * cell, r * cell, cell - 1, cell - 1);

      ctx.fillStyle = v >= 0 ? '#4f9eff' : '#ec4899';
      ctx.font = `bold ${cell * 0.36}px JetBrains Mono`;
      ctx.textAlign = 'center';
      const disp = Number.isInteger(v) ? v : v.toFixed(2);
      ctx.fillText(disp, c * cell + cell / 2, r * cell + cell * 0.65);
    }
  }
  // Border glow
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, cvs.width - 2, cvs.height - 2);
}

function drawFeatureMapEmpty() {
  const cvs = document.getElementById('featureMapCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.fillStyle = '#8888aa88';
  ctx.font = '13px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('← Konvolüsyon çalıştır', cvs.width / 2, cvs.height / 2);
}

function computeConvolution(img, kernel) {
  const N = img.length, K = kernel.length;
  const outN = N - K + 1;
  const out = Array.from({ length: outN }, () => Array(outN).fill(0));
  for (let r = 0; r < outN; r++) {
    for (let c = 0; c < outN; c++) {
      let sum = 0;
      for (let kr = 0; kr < K; kr++)
        for (let kc = 0; kc < K; kc++)
          sum += img[r + kr][c + kc] * kernel[kr][kc];
      out[r][c] = sum;
    }
  }
  return out;
}

function drawFeatureMapStep(fmFull, revealR, revealC, color) {
  const cvs = document.getElementById('featureMapCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const N = fmFull.length, cell = Math.floor(cvs.width / N);
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  const flat = fmFull.flat();
  const maxAbs = Math.max(...flat.map(Math.abs), 1);

  for (let r = 0; r <= revealR; r++) {
    const cMax = r < revealR ? N : revealC;
    for (let c = 0; c < cMax; c++) {
      const v    = fmFull[r][c];
      const norm = Math.abs(v) / maxAbs;
      ctx.fillStyle = v >= 0
        ? `rgba(79,158,255,${0.08 + norm * 0.7})`
        : `rgba(236,72,153,${0.08 + norm * 0.6})`;
      ctx.fillRect(c * cell, r * cell, cell - 1, cell - 1);
      ctx.fillStyle = v >= 0 ? '#4f9eff' : '#ec4899';
      ctx.font = `bold ${cell * 0.32}px JetBrains Mono`;
      ctx.textAlign = 'center';
      ctx.fillText(v.toFixed(1), c * cell + cell / 2, r * cell + cell * 0.65);
    }
  }
  // Active cell highlight
  if (revealR < N && revealC < N) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowColor = color; ctx.shadowBlur = 10;
    ctx.strokeRect(revealC * cell, revealR * cell, cell - 1, cell - 1);
    ctx.shadowBlur = 0;
  }
  // Grid
  ctx.strokeStyle = 'rgba(79,158,255,0.12)'; ctx.lineWidth = 1;
  for (let i = 0; i <= N; i++) {
    ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, cvs.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(cvs.width, i * cell); ctx.stroke();
  }
}

function highlightInputRegion(row, col, color) {
  const cvs = document.getElementById('inputImgCanvas');
  if (!cvs) return;
  // Re-draw input
  drawInputImage();
  const ctx = cvs.getContext('2d');
  const N = 7, K = 3, cell = Math.floor(cvs.width / N);
  // Highlight kernel region
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = color; ctx.shadowBlur = 12;
  ctx.strokeRect(col * cell, row * cell, K * cell, K * cell);
  ctx.shadowBlur = 0;
  // Dim fill
  ctx.fillStyle = color + '22';
  ctx.fillRect(col * cell, row * cell, K * cell, K * cell);
}

function runConvolution() {
  if (convRunning) { resetConvolution(); return; }
  convRunning = true;
  document.getElementById('convRunBtn').textContent = '⏹ Durdur';
  document.getElementById('convRunBtn').onclick = resetConvolution;

  const type  = document.getElementById('kernelType').value;
  const speed = parseInt(document.getElementById('convSpeed').value);
  const k     = KERNELS[type];
  featureMap  = computeConvolution(INPUT_IMG, k.matrix);

  const N = featureMap.length; // 5
  const infoEl = document.getElementById('convStepInfo');
  infoEl.innerHTML = '';

  let step = 0;
  const totalSteps = N * N;

  const tick = () => {
    if (!convRunning || step >= totalSteps) {
      convRunning = false;
      document.getElementById('convRunBtn').textContent = '▶ Konvolüsyonu Başlat';
      document.getElementById('convRunBtn').onclick = runConvolution;
      // Show final feature map fully
      drawFeatureMapStep(featureMap, N, N, k.color);
      drawInputImage();
      const badge = document.createElement('span');
      badge.className = 'conv-badge';
      badge.style.background = 'rgba(16,185,129,.1)';
      badge.style.borderColor = 'rgba(16,185,129,.3)';
      badge.style.color = '#10b981';
      badge.textContent = `✅ Feature Map tamamlandı! ${N}×${N} = ${N*N} değer hesaplandı`;
      infoEl.innerHTML = ''; infoEl.appendChild(badge);
      return;
    }

    const r = Math.floor(step / N), c = step % N;
    highlightInputRegion(r, c, k.color);
    drawFeatureMapStep(featureMap, r, c + 1, k.color);

    // Info badge
    const val = featureMap[r][c];
    infoEl.innerHTML = `
      <span class="conv-badge">Pozisyon [${r},${c}] → Çıktı: <strong style="color:${val>=0?'#4f9eff':'#ec4899'}">${val.toFixed(2)}</strong></span>
      <span class="conv-badge" style="background:rgba(168,85,247,.1);border-color:rgba(168,85,247,.3);color:#a855f7">
        Adım ${step+1}/${totalSteps}
      </span>
    `;

    step++;
    convAnimId = setTimeout(tick, speed);
  };
  tick();
}

function resetConvolution() {
  convRunning = false;
  if (convAnimId) clearTimeout(convAnimId);
  document.getElementById('convRunBtn').textContent = '▶ Konvolüsyonu Başlat';
  document.getElementById('convRunBtn').onclick = runConvolution;
  document.getElementById('convStepInfo').innerHTML = '<span class="conv-badge">Hazır — Başlat butonuna bas</span>';
  drawInputImage();
  featureMap = null;
  drawFeatureMapEmpty();
}

// ---- CNN Architecture canvas ----
const CNN_ARCH_STEPS = {
  conv: {
    title: '🔁 Evrişim (Convolution)',
    text: 'Kernel giriş görüntüsü üzerinde kayar. Her pozisyonda eleman-eleman çarpım + toplam (dot product) hesaplanır. Çıktı: Feature Map. Birden fazla filtre → birden fazla feature map (katman derinliği).',
    formula: 'Çıktı boyutu = ⌊(H - K + 2P) / S⌋ + 1',
    highlight: 0,
  },
  relu: {
    title: '⚡ ReLU Aktivasyonu',
    text: 'Feature map\'deki negatif değerler sıfıra çekilir. Bu, ağa doğrusal olmayan öğrenme kapasitesi kazandırır. Eleman bazında uygulanır, boyutu değiştirmez.',
    formula: 'ReLU(x) = max(0, x)',
    highlight: 1,
  },
  pool: {
    title: '📉 MaxPooling',
    text: 'Feature map, küçük bölgelere ayrılır. Her bölgeden maksimum değer alınır (Max Pooling). Bu, boyutu küçültür (hesaplamayı azaltır) ve en baskın özellikleri korur.',
    formula: 'Çıktı boyutu = H/pool_size × W/pool_size',
    highlight: 2,
  },
  fc: {
    title: '🔗 Flatten + Fully Connected',
    text: 'Konvolüsyon bloklarının çıktısı 1D vektöre düzleştirilir (flatten). Sonra standart Dense katmanları uygulanır ve sınıflandırma yapılır.',
    formula: 'Flatten → FC(128) → Dropout → FC(num_classes) → Softmax',
    highlight: 3,
  },
};

function initCNNArch() {
  selectArch('conv');
}

function selectArch(name) {
  document.querySelectorAll('[data-arch]').forEach(t => t.classList.toggle('active', t.dataset.arch === name));
  const s = CNN_ARCH_STEPS[name];
  document.getElementById('caiTitle').textContent   = s.title;
  document.getElementById('caiText').textContent    = s.text;
  document.getElementById('caiFormula').textContent = s.formula;
  drawCNNArchCanvas(s.highlight);
}

function drawCNNArchCanvas(highlight) {
  const cvs = document.getElementById('cnnArchCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const stages = [
    { label: 'Input\n28×28', icon: '📷', col: '#4f9eff', w: 28, h: 28 },
    { label: 'Conv\n26×26×32', icon: '🔁', col: '#a855f7', w: 22, h: 22 },
    { label: 'ReLU\n26×26×32', icon: '⚡', col: '#22d3ee', w: 22, h: 22 },
    { label: 'MaxPool\n13×13×32', icon: '📉', col: '#ec4899', w: 14, h: 14 },
    { label: 'Flatten\n5408', icon: '↔️', col: '#f59e0b', w: 6, h: 30 },
    { label: 'FC\n128', icon: '🔗', col: '#10b981', w: 6, h: 20 },
    { label: 'Output\n10', icon: '🎯', col: '#f87171', w: 6, h: 10 },
  ];

  const margin = 20;
  const totalW = W - margin * 2;
  const sx = totalW / stages.length;
  const cy = H / 2;

  stages.forEach((st, i) => {
    const x = margin + sx * i + sx / 2;
    const isHL = i === (highlight + 1) || (highlight === 3 && i >= 4);
    const alpha = isHL ? 1 : 0.35;

    // Feature volume box
    const bw = Math.max(st.w * 0.7, 8), bh = Math.max(st.h * 1.4, 8);
    ctx.fillStyle = st.col + (isHL ? '44' : '18');
    ctx.strokeStyle = st.col + (isHL ? 'ff' : '55');
    ctx.lineWidth = isHL ? 2.5 : 1.2;
    if (isHL) { ctx.shadowColor = st.col; ctx.shadowBlur = 18; }
    ctx.fillRect(x - bw/2, cy - bh/2, bw, bh);
    ctx.strokeRect(x - bw/2, cy - bh/2, bw, bh);
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = isHL ? st.col : '#8888aa';
    ctx.font = (isHL ? '700' : '500') + ' 9.5px Inter';
    ctx.textAlign = 'center';
    const lines = st.label.split('\n');
    lines.forEach((ln, li) => ctx.fillText(ln, x, cy + bh/2 + 14 + li * 13));

    // Arrow
    if (i < stages.length - 1) {
      const nx = margin + sx * (i+1) + sx/2;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + bw/2 + 2, cy);
      ctx.lineTo(nx - stages[i+1].w * 0.35 - 2, cy);
      ctx.stroke();
    }
  });
}

// ---- Feature map visualizations ----
function drawCNNFeatureMaps() {
  drawFeatCanvas('feat1Canvas', 'edges');
  drawFeatCanvas('feat2Canvas', 'corners');
  drawFeatCanvas('feat3Canvas', 'parts');
  drawFeatCanvas('feat4Canvas', 'object');
}

function drawFeatCanvas(id, type) {
  const cvs = document.getElementById(id);
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  const N = 8;
  const cell = W / N;

  const palettes = {
    edges:   (r, c) => ((r === c || r + c === N - 1 || r === 0 || c === 0 || r === N-1 || c === N-1) ? 1 : 0.05),
    corners: (r, c) => ((r < 2 && c < 2) || (r < 2 && c >= N-2) || (r >= N-2 && c < 2) || (r >= N-2 && c >= N-2) ? 1 : 0.08),
    parts:   (r, c) => (Math.sin(r * 0.9) * Math.cos(c * 0.9) * 0.5 + 0.5),
    object:  (r, c) => {
      const cx = Math.abs(r - N/2) + Math.abs(c - N/2);
      return Math.max(0, 1 - cx / (N/2));
    },
  };
  const colors = { edges:'#4f9eff', corners:'#a855f7', parts:'#22d3ee', object:'#10b981' };

  const fn = palettes[type];
  const col = colors[type];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const v = fn(r, c);
      ctx.fillStyle = `rgba(${hexToRgb(col)},${v.toFixed(2)})`;
      ctx.fillRect(c * cell, r * cell, cell - 0.5, cell - 0.5);
    }
  }
  // Border
  ctx.strokeStyle = col + '88';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ---- CNN Param calculator ----
function calcCNNParams() {
  const H = parseInt(document.getElementById('cpInput').value)  || 28;
  const K = parseInt(document.getElementById('cpKernel').value) || 3;
  const F = parseInt(document.getElementById('cpFilters').value)|| 32;
  const S = parseInt(document.getElementById('cpStride').value) || 1;
  const P = parseInt(document.getElementById('cpPad').value)    || 0;

  const outSize   = Math.floor((H - K + 2 * P) / S) + 1;
  const params    = K * K * 1 * F + F;       // weights + biases (1 input ch)
  const fmTotal   = outSize * outSize * F;
  const receptive = K + (K - 1) * (S - 1);  // simplified

  const result = document.getElementById('cnnParamsResult');
  result.innerHTML = `
    <div class="cpr-card">
      <div class="cpr-label">Çıktı Boyutu</div>
      <div class="cpr-val">${outSize}×${outSize}×${F}</div>
      <div class="cpr-note">Feature map = ${outSize}×${outSize}, ${F} kanal</div>
    </div>
    <div class="cpr-card">
      <div class="cpr-label">Öğrenilebilir Parametre</div>
      <div class="cpr-val">${params.toLocaleString()}</div>
      <div class="cpr-note">${K}×${K}×1×${F} ağırlık + ${F} bias</div>
    </div>
    <div class="cpr-card">
      <div class="cpr-label">Feature Map Eleman Sayısı</div>
      <div class="cpr-val">${fmTotal.toLocaleString()}</div>
      <div class="cpr-note">${outSize}×${outSize}×${F}</div>
    </div>
    <div class="cpr-card">
      <div class="cpr-label">Dense ile Kıyasla</div>
      <div class="cpr-val">${(H*H).toLocaleString()} → ${params.toLocaleString()}</div>
      <div class="cpr-note">Dense: ${(H*H*outSize*outSize*F).toLocaleString()} parametre</div>
    </div>
  `;
}
