const navEl = document.getElementById("nav");
const homeGroups = document.getElementById("homeGroups");
const homeView = document.getElementById("homeView");
const workspace = document.getElementById("workspace");
const showcase = document.getElementById("showcase");
const frame = document.getElementById("frame");
const topActions = document.getElementById("topActions");
const crumbCat = document.getElementById("crumbCat");
const crumbTitle = document.getElementById("crumbTitle");

const projects = window.PROJECTS;
const config = window.SITE_CONFIG;
const order = ["Derin Öğrenme", "Veri Bilimi", "Agent & LLM"];

document.title = config.title;

function grouped() {
  return order
    .map((category) => [category, projects.filter((item) => item.category === category)])
    .filter(([, items]) => items.length);
}

function renderNav(activeId) {
  navEl.innerHTML = "";
  const homeBtn = document.createElement("button");
  homeBtn.className = `nav-item ${activeId === "home" ? "active" : ""}`;
  homeBtn.innerHTML = `<span class="icon">🏠</span><span>Ana Sayfa</span>`;
  homeBtn.onclick = () => openPage("home");
  navEl.appendChild(homeBtn);

  for (const [category, items] of grouped()) {
    const label = document.createElement("div");
    label.className = "cat";
    label.textContent = category;
    navEl.appendChild(label);
    for (const app of items) {
      const btn = document.createElement("button");
      btn.className = `nav-item ${activeId === app.id ? "active" : ""}`;
      btn.innerHTML = `
        <span class="icon">${app.icon}</span>
        <span>${app.title}</span>
        <span class="live-dot ${app.live ? "on" : ""}"></span>
      `;
      btn.onclick = () => openPage(app.id);
      navEl.appendChild(btn);
    }
  }
}

function renderHome() {
  homeGroups.innerHTML = "";
  for (const [category, items] of grouped()) {
    const wrap = document.createElement("section");
    wrap.innerHTML = `<div class="group-title">${category}</div>`;
    const grid = document.createElement("div");
    grid.className = "cards";
    for (const app of items) {
      const card = document.createElement("button");
      card.className = "card";
      card.innerHTML = `
        <div class="emoji">${app.icon}</div>
        <h3>${app.title}</h3>
        <p>${app.description}</p>
        <div class="meta">${app.badge}</div>
      `;
      card.onclick = () => openPage(app.id);
      grid.appendChild(card);
    }
    wrap.appendChild(grid);
    homeGroups.appendChild(wrap);
  }
}

function renderTop(app) {
  topActions.innerHTML = "";
  if (!app) return;

  const pages = app.extraPages || (app.live ? [{ label: "Aç", url: app.live }] : []);
  for (const page of pages) {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = page.label;
    chip.onclick = () => {
      frame.src = page.url;
      document.querySelectorAll(".top-actions .chip").forEach((el) => el.classList.remove("active"));
      chip.classList.add("active");
      showWorkspace();
    };
    if (page === pages[0]) chip.classList.add("active");
    topActions.appendChild(chip);
  }

  if (app.live) {
    const full = document.createElement("a");
    full.className = "ghost";
    full.href = app.live;
    full.target = "_blank";
    full.textContent = "Tam ekran";
    topActions.appendChild(full);
  }
}

function showHome() {
  homeView.classList.remove("hidden");
  workspace.classList.add("hidden");
  showcase.classList.add("hidden");
  frame.src = "about:blank";
  crumbCat.textContent = "Atölye";
  crumbTitle.textContent = "Ana Sayfa";
  renderTop(null);
  renderNav("home");
}

function showWorkspace() {
  homeView.classList.add("hidden");
  showcase.classList.add("hidden");
  workspace.classList.remove("hidden");
}

function openPage(id) {
  document.getElementById("sidebar").classList.remove("open");
  if (!id || id === "home") {
    history.replaceState(null, "", location.pathname);
    showHome();
    return;
  }

  const app = projects.find((item) => item.id === id);
  if (!app) return;
  if (location.hash !== `#${app.id}`) {
    history.replaceState(null, "", `#${app.id}`);
  }
  crumbCat.textContent = app.category;
  crumbTitle.textContent = app.title;
  renderNav(app.id);
  renderTop(app);

  if (app.live) {
    frame.src = app.live;
    showWorkspace();
    return;
  }

  workspace.classList.add("hidden");
  homeView.classList.add("hidden");
  showcase.classList.remove("hidden");
  showcase.innerHTML = `
    <article class="article">
      <p class="eyebrow">${app.icon} ${app.category}</p>
      <h1>${app.title}</h1>
      <div class="pills">${app.stack.map((item) => `<span class="pill">${item}</span>`).join("")}</div>
      <p class="story">${app.story}</p>
      <ul class="points">${app.points.map((item) => `<li>${item}</li>`).join("")}</ul>
      <div class="note">
        Bu proje yerelde TensorFlow / Streamlit / LLM ile çalışır. Kaynak kod herkese açık yüklenmez; burada amaç arayüzü ve fikri göstermektir.
      </div>
    </article>
  `;
}

function boot() {
  renderHome();
  const id = location.hash.replace("#", "");
  if (id && projects.some((item) => item.id === id)) openPage(id);
  else showHome();
}

window.addEventListener("hashchange", () => {
  const id = location.hash.replace("#", "") || "home";
  openPage(id);
});

document.getElementById("menuBtn").onclick = () => {
  document.getElementById("sidebar").classList.toggle("open");
};

boot();
window.openPage = openPage;
