function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = "none";
  });

  const selected = document.getElementById(tabName + "-tab");
  if (selected) {
    selected.style.display = "block"; // Use "flex" if needed for layout
  }
}

const skillData = {
  personal: [
    "Collaboration and Teamwork",
    "Problem-Solving and Critical Thinking",
    "Analytical and Logical Reasoning",
    "Adaptability and Continuous Learning",
    "Attention to Detail",
    "Independent Research",
    "Self-Learning",
    "Time Management and Prioritization",
    "Peer Mentoring and Support"
  ],
  programming: [
    "Python",
    "Java",
    "C",
    "SQL",
    "R",
    "HTML & CSS",
    "JavaScript",
    "LATEX",
    "Markdown"
  ],
  tools: [
    "Jupyter Notebook",
    "Google Colab",
    "PyCharm",
    "IntelliJ",
    "Visual Studio Code",
    "Microsoft Office",
    "Amazon Web Services (AWS)",
    "Tableau",
    "KNIME",
    "Weka"
  ],
  competencies: [
    "Machine Learning",
    "Deep Learning",
    "Data Analytics",
    "Data Visualization",
    "Model Deployment",
    "Computer Vision",
    "Natural Language Processing",
    "Time Series Forecasting",
    "Model Evaluation & Tuning",
    "Computer Vision",
    "Supervised and Unsupervised Learning",
    "Data Collection and Preprocessing",
    " Research Paper Writing"
  ],
  libraries: [
    "NumPy",
    "Pandas",
    "Seaborn",
    "Matplotlib",
    "Scikit-learn",
    "TensorFlow",
    "Keras",
    "PyTorch",
    "XGBoost",
    "LightGBM",
    "GGPlot (R)",
    "OpenCV",
    "Tkinter",
    "SHAP",
    "UMAP",
    "PCA"
  ]
};

let selectedSkills = [];

function toggleSkill(button, category) {
  const isActive = selectedSkills.includes(category);

  if (isActive) {
    selectedSkills = selectedSkills.filter(c => c !== category);
    button.classList.remove("active");
  } else {
    if (selectedSkills.length === 2) {
      const removed = selectedSkills.shift(); // remove oldest
      const oldButton = document.querySelector(`.skill-tab[onclick*="${removed}"]`);
      if (oldButton) oldButton.classList.remove("active");
    }
    selectedSkills.push(category);
    button.classList.add("active");
  }

  updateSkillColumns();
}

function updateSkillColumns() {
  const leftBox = document.getElementById("skills-left");
  const rightBox = document.getElementById("skills-right");

  leftBox.innerHTML = selectedSkills[0]
    ? `<ul>${skillData[selectedSkills[0]]?.map(skill => `<li>${skill}</li>`).join("")}</ul>`
    : "";

  rightBox.innerHTML = selectedSkills[1]
    ? `<ul>${skillData[selectedSkills[1]]?.map(skill => `<li>${skill}</li>`).join("")}</ul>`
    : "";
}

window.onload = function () {
  const defaultSkills = ["programming", "libraries"];
  defaultSkills.forEach(skill => {
    const btn = document.querySelector(`.skill-tab[onclick*="'${skill}'"]`);
    if (btn) toggleSkill(btn, skill);
  });
};

/* ===== Butterfly Pilot ===== */
(function () {
  const wrap = document.getElementById('butterfly-wrap');
  const player = document.getElementById('butterfly');
  if (!wrap || !player) return;

  // --- helpers ---
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function pageXY(el, offset = {x:0, y:0}) {
    const r = el.getBoundingClientRect();
    // aim near the top edge for nav items, center for big blocks
    const x = r.left + window.scrollX + (r.width  * 0.5) + offset.x;
    const y = r.top  + window.scrollY + (r.height * 0.2) + offset.y;
    return { x, y };
  }

  function currentXY() {
    const t = wrap.style.transform || '';
    const m = /translate3d\(([-0-9.]+)px,\s*([-0-9.]+)px/.exec(t);
    if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
    // starting position (bottom-right corner)
    const x = window.scrollX + window.innerWidth  - 12 - wrap.offsetWidth/2;
    const y = window.scrollY + window.innerHeight - 12 - wrap.offsetHeight/2;
    return { x, y };
  }

  // bezier-like curved flight using Web Animations
  async function flyToPoint(target, {duration=1200, perch=false} = {}) {
    const from = currentXY();
    const to = target;
    // mid control point to create a curve
    const mid = {
      x: (from.x + to.x) / 2 + (Math.random() > 0.5 ? 80 : -80),
      y: Math.min(from.y, to.y) - 120 - Math.random()*60
    };

    const keyframes = [
      { transform: `translate3d(${from.x}px, ${from.y}px, 0)` },
      { transform: `translate3d(${mid.x}px, ${mid.y}px, 0)`  },
      { transform: `translate3d(${to.x}px, ${to.y}px, 0)`    }
    ];
    const anim = wrap.animate(keyframes, { duration, easing: 'ease-in-out', fill: 'forwards' });
    await anim.finished;

    if (perch) {
      wrap.classList.add('butterfly-bob');
    } else {
      wrap.classList.remove('butterfly-bob');
    }
  }

  async function flyToEl(selector, opts = {}, adjust = {x:0, y:0}) {
    const el = document.querySelector(selector);
    if (!el) return;
    const {x,y} = pageXY(el, adjust);
    await flyToPoint({x, y}, opts);
  }

  // --- section hover behaviors ---
  let hoverTimer = null;

  function startOrbit(el, radius = 40, speed = 0.0022) {
    stopHover();
    let t0 = performance.now();
    hoverTimer = requestAnimationFrame(function loop(ts) {
      const dt = ts - t0;
      const angle = ts * speed;
      const c = pageXY(el);
      const x = c.x + radius * Math.cos(angle);
      const y = c.y + radius * Math.sin(angle) - 10;
      wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      hoverTimer = requestAnimationFrame(loop);
    });
  }

  function startPerchCycle(els, stayMs = 1600) {
    stopHover();
    let i = 0, cancelled = false;
    (async function cycle() {
      while (!cancelled && els.length) {
        const el = els[i % els.length];
        i++;
        await flyToElEl(el, {duration: 900, perch: true});
        await sleep(stayMs);
      }
    })();
    function cancel(){ cancelled = true; }
    hoverTimer = { cancel };
  }

  function stopHover() {
    if (!hoverTimer) return;
    if (typeof hoverTimer === 'number') cancelAnimationFrame(hoverTimer);
    if (typeof hoverTimer.cancel === 'function') hoverTimer.cancel();
    hoverTimer = null;
  }

  async function flyToElEl(el, opts = {}, adjust={x:0,y:0}) {
    const {x,y} = pageXY(el, adjust);
    await flyToPoint({x,y}, opts);
  }

  // --- initial grand tour on load (hero) ---
  async function grandTour() {
    try {
      // 1) start bottom-right (already positioned), fly to your photo
      const pic = document.querySelector('#profile .section__pic-container img');
      if (pic) await flyToElEl(pic, { duration: 1400, perch: true }, {x:0,y:-40});
      await sleep(900);

      // 2) hop across the nav links About → Projects → Experience → Skills → Publications → Contact
      const navOrder = [
        '#desktop-nav a[href="#about"]',
        '#desktop-nav a[href="#projects"]',
        '#desktop-nav a[href="#experience"]',
        '#desktop-nav a[href="#skills"]',
        '#desktop-nav a[href="#publications"]',
        '#desktop-nav a[href="#contact"]'
      ];
      for (const sel of navOrder) {
        await flyToEl(sel, { duration: 850, perch: true }, {x:0,y:-24});
        await sleep(500);
      }

      // 3) land on the Resume button
      const resumeBtn = document.querySelector('#profile .btn-container .btn.btn-color-2');
      if (resumeBtn) {
        await flyToElEl(resumeBtn, { duration: 900, perch: true }, {x:0,y:-30});
        await sleep(1200);
      }
    } catch(e) {
      // fail silently – keep page smooth
    }
  }

  // --- per-section behaviors with IntersectionObserver ---
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const id = e.target.id;

      // stop any current pattern before starting a new one
      stopHover();

      if (id === 'about') {
        const title = e.target.querySelector('.title, h1.title') || e.target.querySelector('h1');
        if (title) startOrbit(title, 50);
      }
      else if (id === 'projects') {
        const cards = Array.from(e.target.querySelectorAll('.project-card'));
        if (cards.length) {
          // perch-cycle across project cards
          startPerchCycle(cards, 1500);
        } else {
          const title = e.target.querySelector('h1.title');
          if (title) startOrbit(title, 60);
        }
      }
      else if (id === 'experience' || id === 'skills' || id === 'publications') {
        const title = e.target.querySelector('h1.title');
        if (title) startOrbit(title, 60);
      }
      else if (id === 'contact') {
        const title = e.target.querySelector('h1.title');
        (async () => {
          if (title) await flyToElEl(title, { duration: 900, perch: true }, {x:0,y:-30});
          // then glide to the email pill if present
          const emailPill = e.target.querySelector('.contact-info-container a[href^="mailto"]');
          if (emailPill) await flyToElEl(emailPill, { duration: 950, perch: true }, {x:0,y:-26});
        })();
      }
    }
  }, { rootMargin: '-20% 0px -20% 0px', threshold: 0.1 });

  // Observe your sections
  ['about','projects','experience','skills','publications','contact']
    .forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });

  // Kickoff after first paint
  window.addEventListener('load', () => {
    // lock wrap to a real starting pixel position
    const startX = window.scrollX + window.innerWidth  - 12 - wrap.offsetWidth/2;
    const startY = window.scrollY + window.innerHeight - 12 - wrap.offsetHeight/2;
    wrap.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;

    grandTour();
  });

  // keep flight accurate on resize/zoom
  window.addEventListener('resize', () => {
    // optional: nudge back to viewport if resized
    const pos = currentXY();
    const x = clamp(pos.x, window.scrollX, window.scrollX + document.documentElement.scrollWidth  - 60);
    const y = clamp(pos.y, window.scrollY, window.scrollY + document.documentElement.scrollHeight - 60);
    wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
})();




