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
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);

    tc.font = authorFont;
    const authorWidth = tc.measureText(author).width;
    tc.font = font;
    const maxLineWidth = Math.max(authorWidth, ...lines.map(l => tc.measureText(l).width));

    const canvasW = Math.ceil(maxLineWidth + padding.x * 2);
    const canvasH = Math.ceil(padding.y * 2 + lineHeight + lines.length * lineHeight);

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = canvasW + 'px';
    canvas.style.height = canvasH + 'px';
    canvas.className = `msg-canvas ${type}${blur ? ' blurred' : ''}`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const bgColor = type === 'me'
        ? (isDark ? '#0a84ff' : '#0071e3')
        : (isDark ? '#313338' : '#e3e5e8');

    const r = 8;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(canvasW - r, 0);
    ctx.quadraticCurveTo(canvasW, 0, canvasW, r);
    ctx.lineTo(canvasW, canvasH - r);
    ctx.quadraticCurveTo(canvasW, canvasH, canvasW - r, canvasH);
    ctx.lineTo(r, canvasH);
    ctx.quadraticCurveTo(0, canvasH, 0, canvasH - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();

    ctx.font = authorFont;
    ctx.fillStyle = type === 'me' ? 'rgba(255,255,255,0.7)' : (isDark ? '#a1a1a6' : '#86868b');
    ctx.fillText(author, padding.x, padding.y + lineHeight - 4);

    ctx.font = font;
    ctx.fillStyle = type === 'me' ? '#ffffff' : (isDark ? '#f5f5f7' : '#1d1d1f');
    lines.forEach((l, i) => {
        ctx.fillText(l, padding.x, padding.y + lineHeight + (i + 1) * lineHeight - 4);
    });

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

function giveWarmth(e) {
    const w = document.getElementById('wave');
    w.style.animation = 'none';
    w.offsetHeight;
    w.style.animation = 'wave 1s ease-out';
    for(let i=0; i<12; i++){
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

function toggleTheme() { document.body.classList.toggle('dark-theme'); }

function toggleLang() {
    currentLang = currentLang === 'en' ? 'ru' : 'en';
    localStorage.setItem('pref-lang', currentLang);
    location.reload();
}

updateUI();
window.onload = () => setTimeout(startChat, 1000);
