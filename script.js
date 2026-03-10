const chatFlow = document.getElementById('chat-flow');
const sidebar = document.getElementById('sidebar');
const mainUi = document.getElementById('main-ui');
const typing = document.getElementById('typing');

const translations = {
    en: {
        title: "Just say hello",
        desc: "Don't wait for a reason and don't worry about being a distraction. A simple greeting builds bridges and brightens days",
        cta: "Spread the warmth",
        typing: "Inconnu is typing...",
        me: "You",
        msg1: "Hi, how are you?",
        msg2: "Hey, feeling a bit lonely today, thanks for reaching out"
    },
    ru: {
        title: "Просто скажи «привет»",
        desc: "Не жди повода и не бойся отвлечь. Простое приветствие строит мосты и делает день чуточку лучше",
        cta: "Дари тепло",
        typing: "Inconnu печатает...",
        me: "Ты",
        msg1: "Привет, как дела?",
        msg2: "Привет, одиноко сегодня, спасибо что написал"
    }
};

const randomWords = ["привет","тепло","пжбпжб","пжб","пжб3005","пэжэбэ","фейкпжб","рулет","вкусный","не очень","колбаса"];

let currentLang = localStorage.getItem('pref-lang');
if (!currentLang) {
    currentLang = navigator.language.includes('ru') ? 'ru' : 'en';
}

let warmthClicks = 0;
const BREAK_START = 5;
const BREAK_END   = 11;

const GLITCH_CHARS = '▓▒░█▄▀■□▪▫◆◇●○★☆⚡⚠☠✖✗ωψΩΔΦ∂∑∞≠≈';

function glitchChar() {
    return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function addCrack(btn, level) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('crack-svg');
    const w = btn.offsetWidth, h = btn.offsetHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.style.cssText = `position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;border-radius:50px;`;

    const count = level;
    for (let i = 0; i < count; i++) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const startX = Math.random() * w;
        const startY = Math.random() * h;
        let d = `M ${startX} ${startY}`;
        let cx = startX, cy = startY;
        const segments = 3 + Math.floor(Math.random() * 4);
        for (let s = 0; s < segments; s++) {
            cx += (Math.random() - 0.4) * 60;
            cy += (Math.random() - 0.4) * 40;
            d += ` L ${cx} ${cy}`;
            if (Math.random() > 0.6) {
                d += ` M ${cx} ${cy} L ${cx + (Math.random()-0.5)*30} ${cy + (Math.random()-0.5)*30} M ${cx} ${cy}`;
            }
        }
        path.setAttribute('d', d);
        path.setAttribute('stroke', `rgba(255,255,255,${0.15 + Math.random()*0.35})`);
        path.setAttribute('stroke-width', 0.8 + Math.random() * 1.2);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
    }
    btn.style.position = 'relative';
    btn.appendChild(svg);
}

let glitchInterval = null;
function startGlitchText(btn, originalText) {
    if (glitchInterval) return;
    glitchInterval = setInterval(() => {
        const t = originalText.split('').map((c, i) => {
            if (c === ' ') return ' ';
            return Math.random() > 0.7 ? glitchChar() : c;
        }).join('');
        btn.textContent = t;
    }, 60);
}
function stopGlitchText(btn, originalText) {
    clearInterval(glitchInterval);
    glitchInterval = null;
    btn.textContent = originalText;
}

function applyBreakStage(btn, stage) {
    const t = translations[currentLang];
    btn.querySelectorAll('.crack-svg').forEach(el => el.remove());

    const intensity = stage / (BREAK_END - BREAK_START);

    const tilt = (Math.random() - 0.5) * stage * 3;
    const shakeX = (Math.random() - 0.5) * stage * 2;
    const shakeY = (Math.random() - 0.5) * stage * 1.5;
    btn.style.transform = `rotate(${tilt}deg) translate(${shakeX}px, ${shakeY}px)`;
    btn.style.transition = 'transform 0.05s ease';

    const r = Math.floor(intensity * 200);
    const g = Math.floor(intensity * 30);
    const b = Math.floor(intensity * 30);
    btn.style.borderColor = `rgb(${r + 0},${71 - r * 0.35},${227 - r})`;
    btn.style.color = `rgb(${r * 0.8 + 0},${intensity < 0.5 ? 113 : 80 - r * 0.3},${intensity < 0.5 ? 227 : 200 - r})`;
    btn.style.boxShadow = intensity > 0.4 ? `0 0 ${stage * 4}px rgba(255,50,50,${intensity * 0.6})` : '';
    btn.style.filter = intensity > 0.3 ? `saturate(${1 + intensity}) contrast(${1 + intensity * 0.5})` : '';

    addCrack(btn, stage);

    if (stage >= 3) {
        startGlitchText(btn, t.cta);
    }

    if (stage >= 4) {
        spawnPixelBleed(btn, stage);
    }

    btn.animate([
        { transform: `rotate(${tilt}deg) translate(${shakeX - 4}px, ${shakeY}px)` },
        { transform: `rotate(${tilt + 2}deg) translate(${shakeX + 4}px, ${shakeY - 2}px)` },
        { transform: `rotate(${tilt}deg) translate(${shakeX}px, ${shakeY}px)` },
    ], { duration: 120, easing: 'ease-in-out' });

    document.body.classList.add('breaking-active');
    document.body.classList.remove('screen-shake');
    void document.body.offsetWidth; 
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 200);
}

function spawnPixelBleed(btn, stage) {
    const rect = btn.getBoundingClientRect();
    const count = stage * 3;
    for (let i = 0; i < count; i++) {
        const px = document.createElement('div');
        px.style.cssText = `
            position:fixed;
            width:${2 + Math.random()*4}px;
            height:${2 + Math.random()*4}px;
            background:${['#ff3b30','#ff9f0a','#ff453a','#ffd60a','#ffffff'][Math.floor(Math.random()*5)]};
            left:${rect.left + Math.random()*rect.width}px;
            top:${rect.top + Math.random()*rect.height}px;
            pointer-events:none;
            z-index:9999;
        `;
        document.body.appendChild(px);
        px.animate([
            { opacity: 1, transform: 'translate(0,0)' },
            { opacity: 0, transform: `translate(${(Math.random()-0.5)*80}px, ${(Math.random()-0.5)*80}px)` }
        ], { duration: 400 + Math.random()*300, easing: 'ease-out', fill: 'forwards' })
            .onfinish = () => px.remove();
    }
}

async function launchSansFight() {
    stopGlitchText(document.getElementById('cta-btn'), translations[currentLang].cta);

    const btn = document.getElementById('cta-btn');
    btn.style.transition = 'transform 0.5s cubic-bezier(0.55, 0, 1, 0.45), opacity 0.5s ease';
    btn.style.transform = 'rotate(15deg) translateY(200px) scale(0.6)';
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';

    await sleep(400);

    shatterScreen();

    await sleep(1200);
    showGame();
}

function shatterScreen() {
    const overlay = document.createElement('div');
    overlay.id = 'shatter-overlay';
    overlay.style.cssText = `
        position:fixed; inset:0; z-index:9000;
        background:black;
        pointer-events:none;
    `;
    document.body.appendChild(overlay);

    const cols = 8, rows = 6;
    const W = window.innerWidth, H = window.innerHeight;
    const shardW = W / cols, shardH = H / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const shard = document.createElement('div');
            const dx = (Math.random() - 0.5) * 600;
            const dy = (Math.random() - 0.5) * 600;
            const rot = (Math.random() - 0.5) * 180;
            shard.style.cssText = `
                position:fixed;
                left:${c * shardW}px; top:${r * shardH}px;
                width:${shardW + 1}px; height:${shardH + 1}px;
                background:black;
                border:1px solid rgba(255,255,255,0.05);
                z-index:9001;
                clip-path:polygon(
                    ${Math.random()*20}% 0%,
                    100% ${Math.random()*20}%,
                    ${100-Math.random()*20}% 100%,
                    0% ${100-Math.random()*20}%
                );
            `;
            document.body.appendChild(shard);

            shard.animate([
                { background: 'white', transform: 'scale(1)' },
                { background: 'black', transform: 'scale(1)' },
                { background: 'black', transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.1)`, opacity: 0 },
            ], {
                duration: 800,
                delay: Math.random() * 300,
                easing: 'cubic-bezier(0.55, 0, 1, 0.45)',
                fill: 'forwards'
            }).onfinish = () => shard.remove();
        }
    }

    overlay.animate([
        { background: 'white', opacity: 1 },
        { background: 'white', opacity: 0 },
        { background: 'black', opacity: 1 },
    ], { duration: 200, fill: 'forwards' });

    setTimeout(() => overlay.remove(), 1200);
}

function showGame() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed; inset:0; z-index:9999;
        background:black;
        display:flex; align-items:center; justify-content:center;
        animation: fadeInGame 0.4s ease forwards;
    `;

    const warning = document.createElement('div');
    warning.style.cssText = `
        font-family: 'Courier New', monospace;
        color: #ffffff;
        font-size: clamp(14px, 2.5vw, 22px);
        text-align: center;
        letter-spacing: 2px;
        opacity: 0;
        animation: fadeInGame 0.5s ease 0.3s forwards;
    `;
    warning.textContent = currentLang === 'ru'
        ? '* Ты собираешься иметь плохое время.'
        : '* You are going to have a bad time.';

    overlay.appendChild(warning);
    document.body.appendChild(overlay);

    setTimeout(() => {
        window.location.href = 'https://jcw87.github.io/c2-sans-fight/';
    }, 1800);
}

function resetButton() {
    warmthClicks = 0;
    const btn = document.getElementById('cta-btn');
    btn.querySelectorAll('.crack-svg').forEach(el => el.remove());
    btn.style.cssText = '';
    stopGlitchText(btn, translations[currentLang].cta);
    btn.textContent = translations[currentLang].cta;
    btn.style.pointerEvents = '';
    btn.style.opacity = '';
    btn.style.transform = '';
    document.body.classList.remove('breaking-active');
}

function giveWarmth(e) {
    warmthClicks++;

    if (warmthClicks >= BREAK_END) {
        launchSansFight();
        return;
    }

    if (warmthClicks >= BREAK_START) {
        const stage = warmthClicks - BREAK_START + 1;
        applyBreakStage(document.getElementById('cta-btn'), stage);
        if (stage >= 3) return;
    }

    const w = document.getElementById('wave');
    w.style.animation = 'none';
    w.offsetHeight;
    w.style.animation = 'wave 1s ease-out';
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.innerHTML = ['🧡','✨','☀️','🌸'][Math.floor(Math.random()*4)];
        p.style.left = e.clientX + 'px';
        p.style.top = e.clientY + 'px';
        p.style.setProperty('--x', (Math.random()-0.5)*400+'px');
        p.style.setProperty('--y', (Math.random()-0.5)*400+'px');
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
    }
}

function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function updateUI() {
    const t = translations[currentLang];
    document.getElementById('title').innerText = t.title;
    document.getElementById('desc').innerText = t.desc;
    document.getElementById('cta-btn').innerText = t.cta;
    typing.innerText = t.typing;
}

function addMsg(author, text, type, blur = false) {
    const isDark = document.body.classList.contains('dark-theme');
    const font = '13px Inter, sans-serif';
    const padding = { x: 12, y: 8 };
    const maxWidth = 220;
    const lineHeight = 18;
    const authorFont = 'bold 13px Inter, sans-serif';
    const tmp = document.createElement('canvas');
    const tc = tmp.getContext('2d');
    tc.font = font;
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const w of words) {
        const test = line ? line + ' ' + w : w;
        if (tc.measureText(test).width > maxWidth) {
            if (line) lines.push(line);
            line = w;
        } else { line = test; }
    }
    if (line) lines.push(line);
    tc.font = authorFont;
    const authorWidth = tc.measureText(author).width;
    tc.font = font;
    const maxLineWidth = Math.max(authorWidth, ...lines.map(l => tc.measureText(l).width));
    const canvasW = Math.ceil(maxLineWidth + padding.x * 2);
    const canvasH = Math.ceil(padding.y * 2 + lineHeight + lines.length * lineHeight);
    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = canvasW + 'px';
    canvas.style.height = canvasH + 'px';
    canvas.className = `msg-canvas ${type}${blur ? ' blurred' : ''}`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const bgColor = type === 'me' ? (isDark ? '#0a84ff' : '#0071e3') : (isDark ? '#313338' : '#e3e5e8');
    const r = 8;
    ctx.beginPath();
    ctx.moveTo(r, 0); ctx.lineTo(canvasW - r, 0); ctx.quadraticCurveTo(canvasW, 0, canvasW, r);
    ctx.lineTo(canvasW, canvasH - r); ctx.quadraticCurveTo(canvasW, canvasH, canvasW - r, canvasH);
    ctx.lineTo(r, canvasH); ctx.quadraticCurveTo(0, canvasH, 0, canvasH - r);
    ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.font = authorFont;
    ctx.fillStyle = type === 'me' ? 'rgba(255,255,255,0.7)' : (isDark ? '#a1a1a6' : '#86868b');
    ctx.fillText(author, padding.x, padding.y + lineHeight - 4);
    ctx.font = font;
    ctx.fillStyle = type === 'me' ? '#ffffff' : (isDark ? '#f5f5f7' : '#1d1d1f');
    lines.forEach((l, i) => { ctx.fillText(l, padding.x, padding.y + lineHeight + (i + 1) * lineHeight - 4); });
    chatFlow.appendChild(canvas);
    chatFlow.scrollTop = chatFlow.scrollHeight;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function closeSidebar() {
    sidebar.classList.remove('visible');
    mainUi.classList.remove('shifted');
}

async function startChat() {
    const t = translations[currentLang];
    await sleep(1500);
    addMsg(t.me, t.msg1, "me");
    await sleep(1000);
    sidebar.classList.add('visible');
    mainUi.classList.add('shifted');
    await sleep(800);
    typing.style.display = 'block';
    await sleep(2000);
    typing.style.display = 'none';
    addMsg("Inconnu", t.msg2, "inconnu");
    await sleep(3500);
    for (let i = 0; i < 60; i++) {
        await sleep(40);
        const isMe = Math.random() > 0.5;
        addMsg(
            isMe ? t.me : "Inconnu",
            Array(Math.floor(Math.random()*5)+2).fill(0).map(() => randomWords[Math.floor(Math.random()*randomWords.length)]).join(" "),
            isMe ? "me" : "inconnu",
            true
        );
    }
    await sleep(800);
    closeSidebar();
}

function toggleTheme() { document.body.classList.toggle('dark-theme'); }

function toggleLang() {
    currentLang = currentLang === 'en' ? 'ru' : 'en';
    localStorage.setItem('pref-lang', currentLang);
    location.reload();
}

updateUI();
window.onload = () => setTimeout(startChat, 1000);
