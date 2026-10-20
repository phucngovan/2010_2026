(() => {
  "use strict";

  const C = window.CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PALETTE = ["#ff4d84", "#ff7aa8", "#ffc6d9", "#ff93b8", "#f7d38f", "#ff6f91", "#ffd6e5"];

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  document.body.classList.add("locked");

  /* ---------------------------------------------------------
     Sprites (vẽ trước một lần để canvas chạy mượt trên iPhone)
     --------------------------------------------------------- */
  function heartPath(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.32);
    ctx.bezierCurveTo(-s * 0.62, -s * 0.06, -s * 0.34, -s * 0.56, 0, -s * 0.22);
    ctx.bezierCurveTo(s * 0.34, -s * 0.56, s * 0.62, -s * 0.06, 0, s * 0.32);
    ctx.closePath();
  }
  const spriteCache = {};
  function heartSprite(color) {
    if (spriteCache[color]) return spriteCache[color];
    const size = 96, c = document.createElement("canvas");
    c.width = c.height = size;
    const x = c.getContext("2d");
    x.translate(size / 2, size / 2 + 4);
    x.shadowColor = color;
    x.shadowBlur = 18;
    const g = x.createLinearGradient(0, -30, 0, 30);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.35, color);
    g.addColorStop(1, color);
    x.fillStyle = g;
    heartPath(x, 60);
    x.fill();
    return (spriteCache[color] = c);
  }
  function glowSprite(color) {
    const key = "g" + color;
    if (spriteCache[key]) return spriteCache[key];
    const size = 32, c = document.createElement("canvas");
    c.width = c.height = size;
    const x = c.getContext("2d");
    const g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "#fff");
    g.addColorStop(0.25, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, size, size);
    return (spriteCache[key] = c);
  }

  function fitCanvas(cv) {
    const r = cv.getBoundingClientRect();
    cv.width = Math.round(r.width * DPR);
    cv.height = Math.round(r.height * DPR);
    const ctx = cv.getContext("2d");
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { ctx, w: r.width, h: r.height };
  }

  /* ---------------------------------------------------------
     Nền: sao lấp lánh + tim bay lên
     --------------------------------------------------------- */
  const bg = (() => {
    const cv = $("#bg");
    let ctx, w, h, stars = [], hearts = [];
    function resize() {
      ({ ctx, w, h } = fitCanvas(cv));
      stars = Array.from({ length: Math.round((w * h) / 4500) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: rand(0.4, 1.4), p: Math.random() * Math.PI * 2, s: rand(0.6, 2)
      }));
    }
    function newHeart(initial) {
      return {
        x: Math.random() * w, y: initial ? Math.random() * h : h + 30,
        size: rand(10, 26), vy: rand(14, 34), sway: rand(10, 30),
        p: Math.random() * Math.PI * 2, a: rand(0.15, 0.45), col: pick(PALETTE)
      };
    }
    resize();
    hearts = Array.from({ length: 14 }, () => newHeart(true));
    window.addEventListener("resize", resize);
    let last = performance.now();
    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;
      for (const s of stars) {
        ctx.globalAlpha = 0.25 + 0.75 * Math.abs(Math.sin(t * s.s + s.p));
        ctx.fillStyle = "#ffe9f2";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
      }
      for (const hh of hearts) {
        hh.y -= hh.vy * dt;
        const x = hh.x + Math.sin(t * 0.8 + hh.p) * hh.sway;
        ctx.globalAlpha = hh.a;
        ctx.drawImage(heartSprite(hh.col), x - hh.size / 2, hh.y - hh.size / 2, hh.size, hh.size);
        if (hh.y < -40) Object.assign(hh, newHeart(false));
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------------------------------------------------------
     Cánh hoa rơi
     --------------------------------------------------------- */
  if (!reduceMotion) {
    const box = $("#petals");
    for (let i = 0; i < 16; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      const dur = rand(9, 18);
      p.style.left = rand(-5, 100) + "%";
      p.style.animationDuration = dur + "s";
      p.style.animationDelay = -rand(0, dur) + "s";
      p.style.setProperty("--dx", rand(-80, 80) + "px");
      p.style.setProperty("--s", rand(9, 17) + "px");
      p.innerHTML = "<i></i>";
      p.firstChild.style.animationDuration = rand(1.6, 3.2) + "s";
      box.appendChild(p);
    }
  }

  /* ---------------------------------------------------------
     Hiệu ứng: tim khi chạm + pháo hoa trái tim
     --------------------------------------------------------- */
  const fx = (() => {
    const cv = $("#fx");
    let ctx, w, h, parts = [], running = false, last = 0;
    function resize() { ({ ctx, w, h } = fitCanvas(cv)); }
    resize();
    window.addEventListener("resize", resize);

    function loop(now) {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= dt;
        if (p.life <= 0) {
          if (p.onDie) p.onDie(p);
          parts.splice(i, 1);
          continue;
        }
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.g * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.rot += p.vr * dt;
        const k = p.life / p.max;
        ctx.globalAlpha = Math.min(1, k * 1.6);
        const s = p.size * (p.shrink ? 0.4 + 0.6 * k : 1);
        if (p.type === "heart") {
          ctx.save();
          ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.drawImage(heartSprite(p.col), -s / 2, -s / 2, s, s);
          ctx.restore();
        } else {
          ctx.drawImage(glowSprite(p.col), p.x - s / 2, p.y - s / 2, s, s);
          if (p.trail) {
            p.trailT = (p.trailT || 0) + dt;
            if (p.trailT > 0.016) { p.trailT = 0; add({ x: p.x, y: p.y, vx: rand(-15, 15), vy: rand(10, 40), size: 6, life: 0.4, col: "#ffd6a5" }); }
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      if (parts.length) requestAnimationFrame(loop);
      else { running = false; ctx.clearRect(0, 0, w, h); }
    }
    function add(p) {
      parts.push(Object.assign({ type: "dot", vx: 0, vy: 0, g: 0, drag: 1, rot: 0, vr: 0, size: 10, life: 1, col: "#fff", shrink: true }, p, { max: p.life || 1 }));
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); }
    }
    function tapHearts(x, y, n = 7) {
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2), sp = rand(60, 170);
        add({ type: "heart", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, g: -40, drag: 0.94,
          size: rand(12, 24), life: rand(0.9, 1.5), col: pick(PALETTE), rot: rand(-0.5, 0.5), vr: rand(-2, 2), shrink: false });
      }
    }
    function heartBurst(x, y, scale = 1) {
      const col = pick(PALETTE);
      for (let i = 0; i < 64; i++) {
        const t = (i / 64) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        add({ x, y, vx: hx * 9 * scale, vy: hy * 9 * scale, drag: 0.955, g: 30, size: rand(7, 12), life: rand(1.3, 1.8), col });
      }
      for (let i = 0; i < 14; i++) {
        const a = rand(0, Math.PI * 2), sp = rand(40, 140) * scale;
        add({ type: "heart", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, drag: 0.96, g: 50, size: rand(14, 24), life: rand(1.2, 1.8), col: pick(PALETTE), vr: rand(-3, 3), shrink: false });
      }
    }
    function ringBurst(x, y) {
      const col = pick(PALETTE), n = 46;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2, sp = rand(150, 210);
        add({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, drag: 0.95, g: 60, size: rand(6, 10), life: rand(1, 1.5), col });
      }
    }
    function rocket(delay = 0) {
      setTimeout(() => {
        const x = rand(w * 0.15, w * 0.85), ty = rand(h * 0.15, h * 0.42);
        const vy = -Math.sqrt(2 * 520 * (h - ty)) * 0.98;
        add({ x, y: h + 10, vx: rand(-30, 30), vy, g: 520, drag: 1, size: 10, life: -vy / 520, col: "#ffe2b8", shrink: false, trail: true,
          onDie: (p) => (Math.random() < 0.7 ? heartBurst(p.x, p.y, rand(0.8, 1.15)) : ringBurst(p.x, p.y)) });
      }, delay);
    }
    function heartRain(n = 26) {
      for (let i = 0; i < n; i++) {
        setTimeout(() => add({ type: "heart", x: rand(0, w), y: -20, vx: rand(-20, 20), vy: rand(80, 170), g: 40, drag: 1,
          size: rand(16, 32), life: rand(3, 4.5), col: pick(PALETTE), rot: rand(-0.6, 0.6), vr: rand(-1.5, 1.5), shrink: false }), i * 70);
      }
    }
    return { tapHearts, heartBurst, rocket, heartRain, get w() { return w; }, get h() { return h; } };
  })();

  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest("#loveBtn, #musicBtn, #envelope")) return;
    fx.tapHearts(e.clientX, e.clientY);
  }, { passive: true });

  /* ---------------------------------------------------------
     Trái tim hạt (hero) — đập theo nhịp tim
     --------------------------------------------------------- */
  const heroHeart = (() => {
    const cv = $("#heartCanvas");
    let ctx, w, h, cx, cy, sc, parts = [], visible = true, active = false, t0 = 0;
    const N = 820;
    function heartXY(t) {
      return [16 * Math.pow(Math.sin(t), 3), -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))];
    }
    function resize() {
      ({ ctx, w, h } = fitCanvas(cv));
      cx = w / 2; cy = h * 0.44;
      sc = Math.min(w * 0.88, h * 0.8) / 34;
    }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < N; i++) {
      const edge = Math.random() < 0.62;
      parts.push({
        t: Math.random() * Math.PI * 2,
        k: edge ? rand(0.93, 1.02) : (Math.random() < 0.2 ? rand(1.06, 1.3) : Math.pow(Math.random(), 0.5)),
        x: rand(0, w), y: rand(0, h) + h,
        size: rand(3, 8),
        col: pick(["#ff4d84", "#ff7aa8", "#ff93b8", "#ffc6d9", "#ff2d6f", "#ffd1e0"]),
        j: Math.random() * 100, halo: false
      });
      parts[i].halo = parts[i].k > 1.05;
    }
    // nhịp tim: hai nhịp liền nhau rồi nghỉ
    function beat(t) {
      const p = t % 1.1;
      return Math.exp(-Math.pow((p - 0.12) / 0.06, 2)) + 0.6 * Math.exp(-Math.pow((p - 0.34) / 0.07, 2));
    }
    function frame(now) {
      if (!visible || !active) return;
      const t = (now - t0) / 1000;
      const b = beat(t);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const ease = Math.min(1, 0.02 + t * 0.01);
      for (const p of parts) {
        const [hx, hy] = heartXY(p.t);
        const kk = p.halo ? p.k + b * 0.18 : p.k * (1 + b * 0.07);
        const jx = Math.sin(t * 2 + p.j) * 1.4, jy = Math.cos(t * 1.7 + p.j) * 1.4;
        const tx = cx + hx * sc * kk + jx, ty = cy + hy * sc * kk + jy;
        p.x += (tx - p.x) * ease * 2.4;
        p.y += (ty - p.y) * ease * 2.4;
        ctx.globalAlpha = p.halo ? 0.25 + 0.5 * b : 0.55 + 0.35 * Math.sin(t * 3 + p.j) * 0.5;
        const s = p.size * (1 + b * 0.25);
        ctx.drawImage(glowSprite(p.col), p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(frame);
    }
    new IntersectionObserver(([en]) => {
      const was = visible; visible = en.isIntersecting;
      if (visible && !was && active) requestAnimationFrame(frame);
    }).observe(cv);
    return {
      start() { active = true; t0 = performance.now(); requestAnimationFrame(frame); }
    };
  })();

  /* ---------------------------------------------------------
     Chữ chạy
     --------------------------------------------------------- */
  function startTyped() {
    const el = $("#typed"), lines = C.typed && C.typed.length ? C.typed : ["Chúc mừng ngày 20/10 💐"];
    let li = 0, ci = 0, del = false;
    (function step() {
      const chars = Array.from(lines[li]);
      if (!del) {
        ci++;
        el.textContent = chars.slice(0, ci).join("");
        if (ci >= chars.length) { del = true; return setTimeout(step, 2200); }
        setTimeout(step, rand(45, 85));
      } else {
        ci--;
        el.textContent = chars.slice(0, ci).join("");
        if (ci <= 0) { del = false; li = (li + 1) % lines.length; return setTimeout(step, 400); }
        setTimeout(step, 28);
      }
    })();
  }

  /* ---------------------------------------------------------
     Đếm thời gian bên nhau
     --------------------------------------------------------- */
  (() => {
    const start = new Date((C.startDate || "2020-10-20") + "T00:00:00");
    const d = start.getDate(), m = start.getMonth() + 1, y = start.getFullYear();
    $("#startLabel").textContent = `${C.startLabel || "kể từ"} · ${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
    const els = { d: $("#cDays"), h: $("#cHours"), m: $("#cMins"), s: $("#cSecs") };
    const prev = {};
    function set(k, v) {
      if (prev[k] === v) return;
      prev[k] = v;
      els[k].textContent = v;
      els[k].classList.remove("tick"); void els[k].offsetWidth; els[k].classList.add("tick");
    }
    function update() {
      let diff = Math.abs(Date.now() - start.getTime()) / 1000;
      set("d", Math.floor(diff / 86400).toLocaleString("vi-VN"));
      diff %= 86400;
      set("h", Math.floor(diff / 3600));
      set("m", Math.floor((diff % 3600) / 60));
      set("s", Math.floor(diff % 60));
    }
    update();
    setInterval(update, 1000);

    // Kỷ niệm sắp tới
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let next = new Date(today.getFullYear(), m - 1, d);
    if (next < today) next = new Date(today.getFullYear() + 1, m - 1, d);
    const last = new Date(next.getFullYear() - 1, m - 1, d);
    const years = next.getFullYear() - y;
    const left = Math.round((next - today) / 86400000);
    const since = Math.round((today - last) / 86400000);
    const dm = `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}`;
    $("#anniv").textContent = years <= 0 ? ""
      : left === 0 ? `Hôm nay tròn ${years} năm mình bên nhau 🎉`
      : years > 1 && since <= 30 ? `Mình vừa tròn ${years - 1} năm bên nhau hôm ${dm} 🎉`
      : left === 1 ? `Ngày mai là tròn ${years} năm mình bên nhau rồi đó 💞`
      : `Còn ${left} ngày nữa là tròn ${years} năm mình bên nhau 💞`;
  })();

  /* ---------------------------------------------------------
     Xem ảnh to
     --------------------------------------------------------- */
  const openLightbox = (() => {
    const lb = $("#lightbox");
    lb.addEventListener("click", () => lb.classList.remove("show"));
    return (ph) => {
      $("img", lb).src = ph.src;
      $("figcaption", lb).textContent = ph.caption || "";
      lb.classList.add("show");
    };
  })();

  /* ---------------------------------------------------------
     Hành trình của mình
     --------------------------------------------------------- */
  (() => {
    const box = $("#timeline");
    (C.timeline || []).forEach((ch, i) => {
      const li = document.createElement("li");
      li.className = "tl-item reveal";
      const photos = (ch.photos || []).map((p) => (typeof p === "string" ? { src: p } : p));
      li.innerHTML = `<span class="tl-dot">${ch.icon || "💗"}</span>
        <p class="tl-tag">${ch.tag || ""}</p>
        <h4>${ch.title || ""}</h4>
        <p class="tl-text">${ch.text || ""}</p>
        ${photos.length ? `<div class="tl-photos">${photos.map((p, k) =>
          `<figure class="tl-ph${p.wide ? " wide" : ""}" style="--rz:${(i + k) % 2 ? 1.2 : -1.2}deg"><div class="photo"><img src="${p.src}" alt="${ch.title || ""}" loading="lazy" decoding="async"${p.pos ? ` style="object-position:${p.pos}"` : ""}></div></figure>`
        ).join("")}</div>` : ""}`;
      $$(".tl-ph", li).forEach((fig, k) => fig.addEventListener("click", () => openLightbox({ src: photos[k].src, caption: ch.title })));
      box.appendChild(li);
    });
  })();

  /* ---------------------------------------------------------
     Bộ sưu tập ảnh (coverflow)
     --------------------------------------------------------- */
  (() => {
    const car = $("#carousel"), dotsBox = $("#dots");
    const photos = C.photos && C.photos.length ? C.photos : [{ src: "", caption: "Em và anh" }];
    const grads = [["#ffb3c9", "#ff6f9c"], ["#ffd6a5", "#ff8fab"], ["#e0c3fc", "#ff8fb1"], ["#ffc6d9", "#c06c84"], ["#fbc2eb", "#a18cd1"]];
    const emojis = ["💕", "🌷", "💑", "🌙", "✨", "💖", "🌸"];
    photos.forEach((ph, i) => {
      const slide = document.createElement("div");
      slide.className = "slide";
      const g = grads[i % grads.length];
      const photo = ph.src
        ? `<div class="photo"><img src="${ph.src}" alt="${ph.caption || ""}" loading="lazy" decoding="async"${ph.pos ? ` style="object-position:${ph.pos}"` : ""}></div>`
        : `<div class="photo placeholder" style="--c1:${g[0]};--c2:${g[1]}"><span>${emojis[i % emojis.length]}</span></div>`;
      slide.innerHTML = `<figure class="polaroid" style="--rz:${i % 2 ? 2 : -2}deg">${photo}<figcaption>${ph.caption || ""}</figcaption></figure>`;
      if (ph.src) slide.addEventListener("click", () => openLightbox(ph));
      car.appendChild(slide);
      dotsBox.appendChild(document.createElement("i"));
    });
    const slides = $$(".slide", car), dots = $$("i", dotsBox);
    let raf = 0;
    function update() {
      raf = 0;
      const mid = car.getBoundingClientRect().left + car.clientWidth / 2;
      let best = 0, bestD = 1e9;
      slides.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const d = (r.left + r.width / 2 - mid) / r.width;
        const ad = Math.min(Math.abs(d), 1.5);
        const pol = s.firstElementChild;
        pol.style.setProperty("--ry", `${Math.max(-1, Math.min(1, d)) * -28}deg`);
        pol.style.setProperty("--sc", 1 - ad * 0.14);
        pol.style.setProperty("--op", 1 - ad * 0.35);
        if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
      });
      dots.forEach((d, i) => d.classList.toggle("on", i === best));
    }
    car.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  /* ---------------------------------------------------------
     Lời chúc
     --------------------------------------------------------- */
  (() => {
    const list = $("#wishList");
    (C.wishes || []).forEach((w, i) => {
      const el = document.createElement("div");
      el.className = "wish";
      el.style.transitionDelay = (i % 2) * 0.08 + "s";
      el.innerHTML = `<div class="wish-icon">${w.icon}</div><div><h4>${w.title}</h4><p>${w.text}</p></div>`;
      list.appendChild(el);
    });
  })();

  /* ---------------------------------------------------------
     Lá thư — viết từng chữ
     --------------------------------------------------------- */
  const letter = (() => {
    const box = $("#letterBody"), art = $("#letter");
    const paras = C.letter || [];
    $("#signature").textContent = C.signature || "Chồng của em";
    let started = false, skip = false;
    art.addEventListener("click", () => { skip = true; });
    function start() {
      if (started) return; started = true;
      const pen = document.createElement("span"); pen.className = "pen";
      let pi = 0;
      function nextPara() {
        if (pi >= paras.length) { pen.remove(); art.classList.add("done"); return; }
        const p = document.createElement("p");
        const txt = document.createTextNode("");
        p.append(txt, pen);
        box.appendChild(p);
        const chars = Array.from(paras[pi++]);
        let ci = 0;
        (function type() {
          if (skip) { txt.data = chars.join(""); return setTimeout(nextPara, 0); }
          txt.data += chars[ci++];
          if (ci < chars.length) setTimeout(type, /[,.!?]/.test(chars[ci - 1]) ? 220 : rand(22, 42));
          else setTimeout(nextPara, 450);
        })();
      }
      setTimeout(nextPara, 700);
    }
    return { start };
  })();

  /* ---------------------------------------------------------
     Bó hoa SVG
     --------------------------------------------------------- */
  (() => {
    const B = $("#bouquet");
    const base = [150, 318];
    const flowers = [
      { x: 150, y: 150, r: 32, type: "rose", c: ["#ffd1e0", "#ff4d84", "#b3124f"], d: 1.1 },
      { x: 150, y: 86, r: 28, type: "rose", c: ["#ffe1ea", "#ff7aa8", "#d6336c"], d: 1.3 },
      { x: 90, y: 128, r: 27, type: "rose", c: ["#fff0e0", "#ff9d7a", "#e05a47"], d: 1.25 },
      { x: 210, y: 128, r: 27, type: "rose", c: ["#ffe6f0", "#ff6f9c", "#c2185b"], d: 1.4 },
      { x: 100, y: 66, r: 19, type: "daisy", d: 1.6 },
      { x: 202, y: 62, r: 19, type: "daisy", d: 1.75 },
      { x: 54, y: 182, r: 18, type: "daisy", d: 1.9 },
      { x: 246, y: 182, r: 18, type: "daisy", d: 2 },
      { x: 150, y: 34, r: 10, type: "gyp", d: 2.1 },
      { x: 60, y: 104, r: 10, type: "gyp", d: 2.2 },
      { x: 240, y: 100, r: 10, type: "gyp", d: 2.25 },
      { x: 124, y: 196, r: 9, type: "gyp", d: 2.3 },
      { x: 180, y: 198, r: 9, type: "gyp", d: 2.35 }
    ];
    let defs = `<linearGradient id="leafG" x1="0" x2="1"><stop offset="0" stop-color="#2f7a48"/><stop offset="1" stop-color="#7cc98f"/></linearGradient>
      <linearGradient id="paperA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4f7"/><stop offset="1" stop-color="#f5c6d6"/></linearGradient>
      <linearGradient id="paperB" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3ec"/><stop offset="1" stop-color="#e79ab4"/></linearGradient>
      <linearGradient id="ribbon" x1="0" x2="1"><stop offset="0" stop-color="#ff4d84"/><stop offset="1" stop-color="#c2185b"/></linearGradient>`;
    let stems = "", heads = "", leaves = "", sparks = "";
    flowers.forEach((f, i) => {
      const cxp = base[0] + (f.x - base[0]) * 0.25, cyp = (base[1] + f.y) / 2 + 20;
      const stemD = f.type === "gyp" ? f.d - 0.9 : f.d - 1;
      stems += `<path class="stem" pathLength="1" style="--d:${stemD}s;${f.type === "gyp" ? "stroke-width:1.6" : ""}" d="M${base[0]} ${base[1]} Q${cxp} ${cyp} ${f.x} ${f.y + f.r * 0.6}"/>`;
      if (f.type !== "gyp" && i % 2 === 0) {
        const lx = (base[0] + f.x) / 2 + (f.x - base[0]) * 0.1, ly = (base[1] + f.y) / 2 + 10;
        const ang = f.x < base[0] ? -150 : f.x > base[0] ? -30 : -60;
        leaves += `<g transform="translate(${lx} ${ly}) rotate(${ang})"><path class="leaf" style="--d:${stemD + 0.8}s" d="M0 0 Q16 -12 34 0 Q16 12 0 0Z"/></g>`;
      }
      let inner = "";
      if (f.type === "rose") {
        defs += `<radialGradient id="rg${i}" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="${f.c[2]}"/><stop offset=".55" stop-color="${f.c[1]}"/><stop offset="1" stop-color="${f.c[0]}"/></radialGradient>`;
        const r = f.r;
        let ring1 = "", ring2 = "";
        for (let k = 0; k < 5; k++) ring1 += `<ellipse cx="0" cy="${-r * 0.46}" rx="${r * 0.56}" ry="${r * 0.6}" transform="rotate(${k * 72})" fill="url(#rg${i})"/>`;
        for (let k = 0; k < 5; k++) ring2 += `<ellipse cx="0" cy="${-r * 0.27}" rx="${r * 0.4}" ry="${r * 0.42}" transform="rotate(${36 + k * 72})" fill="${f.c[1]}" stroke="${f.c[2]}" stroke-opacity=".35"/>`;
        inner = `<g>${ring1}</g><g class="ring2">${ring2}</g>
          <g class="core"><circle r="${r * 0.28}" fill="${f.c[2]}"/><path d="M0 0 m-${r * 0.05} 0 a${r * 0.08} ${r * 0.08} 0 1 1 ${r * 0.16} 0 a${r * 0.14} ${r * 0.14} 0 1 1 -${r * 0.3} 0 a${r * 0.2} ${r * 0.2} 0 1 1 ${r * 0.42} 0" fill="none" stroke="${f.c[0]}" stroke-width="1.4" stroke-opacity=".7"/></g>`;
      } else if (f.type === "daisy") {
        const r = f.r;
        let ring1 = "", ring2 = "";
        for (let k = 0; k < 12; k++) ring1 += `<ellipse cx="0" cy="${-r * 0.55}" rx="${r * 0.2}" ry="${r * 0.5}" transform="rotate(${k * 30})" fill="#fffafc" stroke="#ffd1e0" stroke-width=".8"/>`;
        for (let k = 0; k < 12; k++) ring2 += `<ellipse cx="0" cy="${-r * 0.36}" rx="${r * 0.14}" ry="${r * 0.32}" transform="rotate(${15 + k * 30})" fill="#ffd6e5"/>`;
        inner = `<g>${ring1}</g><g class="ring2">${ring2}</g><g class="core"><circle r="${r * 0.28}" fill="#ffc94d"/><circle r="${r * 0.16}" fill="#f5a524"/></g>`;
      } else {
        let dots = "";
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          dots += `<circle cx="${Math.cos(a) * f.r * 0.7}" cy="${Math.sin(a) * f.r * 0.7}" r="${rand(2.6, 3.8)}" fill="#fff"/>`;
        }
        inner = `<g>${dots}</g><g class="ring2"></g><g class="core"><circle r="3" fill="#fff6fa"/></g>`;
      }
      heads += `<g transform="translate(${f.x} ${f.y})"><g class="sway" style="animation-delay:${3 + i * 0.2}s"><g class="bloom" style="--d:${f.d}s">${inner}</g></g></g>`;
    });
    for (let i = 0; i < 14; i++) {
      const x = rand(10, 290), y = rand(0, 230), s = rand(3, 7);
      sparks += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><path class="spark" style="--d:${rand(0, 2).toFixed(2)}s" fill="#fff3c4" d="M0 ${-s} Q0 0 ${s} 0 Q0 0 0 ${s} Q0 0 ${-s} 0 Q0 0 0 ${-s}Z"/></g>`;
    }
    B.innerHTML = `<svg viewBox="0 0 300 380" role="img" aria-label="Bó hoa tặng em">
      <defs>${defs}</defs>
      <path class="wrap" fill="url(#paperB)" d="M40 178 L150 230 L260 178 L196 352 L104 352 Z" opacity=".9"/>
      ${stems}${leaves}${heads}
      <g class="wrap">
        <path fill="url(#paperA)" d="M58 214 Q150 248 242 214 L188 362 Q150 372 112 362 Z"/>
        <path fill="none" stroke="#e79ab4" stroke-width="1.2" stroke-opacity=".7" d="M150 240 L150 366 M96 232 L128 362 M204 232 L172 362"/>
      </g>
      <g transform="translate(150 286)"><g class="bow">
        <path fill="url(#ribbon)" d="M0 0 C-34 -30 -52 -4 -40 10 C-30 22 -10 10 0 0Z"/>
        <path fill="url(#ribbon)" d="M0 0 C34 -30 52 -4 40 10 C30 22 10 10 0 0Z"/>
        <path fill="#c2185b" d="M-4 4 L-22 46 L-12 40 L-6 50 L0 8Z M4 4 L22 46 L12 40 L6 50 L0 8Z"/>
        <circle r="7" fill="#ff4d84" stroke="#fff" stroke-opacity=".4"/>
      </g></g>
      ${sparks}
    </svg>`;
  })();

  /* ---------------------------------------------------------
     Hiện dần khi cuộn
     --------------------------------------------------------- */
  $$(".count-item").forEach((el, i) => el.style.setProperty("--delay", i * 0.12 + "s"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      if (en.target.id === "letter") letter.start();
      io.unobserve(en.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal, .wish, #bouquet").forEach((el) => io.observe(el));

  /* ---------------------------------------------------------
     Nút "Bấm vào đây nè"
     --------------------------------------------------------- */
  (() => {
    const btn = $("#loveBtn"), out = $("#loveCount"), toast = $("#toast");
    const lines = C.loveLines && C.loveLines.length ? C.loveLines : ["Anh yêu em! 💖"];
    let n = 0;
    btn.addEventListener("click", (e) => {
      n++;
      const r = btn.getBoundingClientRect();
      fx.heartBurst(r.left + r.width / 2, r.top + r.height / 2, 0.9);
      for (let i = 0; i < 4; i++) fx.rocket(i * 260);
      if (n === 1 || n % 3 === 0) fx.heartRain();
      toast.textContent = lines[(n - 1) % lines.length];
      toast.classList.remove("show"); void toast.offsetWidth; toast.classList.add("show");
      out.textContent = `Em đã nhận được ${n} lời "anh yêu em" 💕`;
    });
  })();

  /* ---------------------------------------------------------
     Nhạc nền (tuỳ chọn)
     --------------------------------------------------------- */
  let audio = null;
  if (C.music) {
    audio = new Audio(C.music);
    audio.loop = true;
    audio.preload = "auto";
    const mb = $("#musicBtn");
    mb.addEventListener("click", () => {
      if (audio.paused) { audio.play().catch(() => {}); mb.classList.remove("off"); }
      else { audio.pause(); mb.classList.add("off"); }
    });
  }

  /* ---------------------------------------------------------
     Mở thư
     --------------------------------------------------------- */
  $("#wifeName").textContent = C.wifeName || "vợ yêu";
  const env = $("#envelope"), intro = $("#intro");
  env.addEventListener("click", () => {
    if (env.classList.contains("open")) return;
    env.classList.add("open");
    if (audio) {
      audio.play().then(() => { $("#musicBtn").hidden = false; }).catch(() => { const mb = $("#musicBtn"); mb.hidden = false; mb.classList.add("off"); });
    }
    const r = env.getBoundingClientRect();
    setTimeout(() => fx.heartBurst(r.left + r.width / 2, r.top + r.height * 0.2, 1.1), 1100);
    setTimeout(() => {
      intro.classList.add("hide");
      document.body.classList.remove("locked");
      document.body.classList.add("started");
      heroHeart.start();
      setTimeout(startTyped, 1300);
    }, 1700);
    setTimeout(() => { intro.style.display = "none"; }, 3000);
  });
})();
