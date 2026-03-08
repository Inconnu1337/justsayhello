const chatFlow = document.getElementById('chat-flow');
const sidebar = document.getElementById('sidebar');
const mainUi = document.getElementById('main-ui');
const typing = document.getElementById('typing');

const translations = {
    en: {
        title: "Just say hello",
        desc: "Don't wait for a reason. Don't worry about being a distraction. A simple greeting builds bridges and brightens days",
        cta: "Spread the warmth",
        typing: "Inconnu is typing...",
        me: "You",
        msg1: "Hi, how are you?",
        msg2: "Hey, feeling a bit lonely today, thanks for reaching out"
    },
    ru: {
        title: "Просто скажи «привет»",
        desc: "Не жди повода. Не бойся отвлечь. Простое приветствие строит мосты и делает день чуточку лучше",
        cta: "Дари тепло",
        typing: "Inconnu печатает...",
        me: "Ты",
        msg1: "Привет, как дела?",
        msg2: "Привет, одиноко сегодня, спасибо что написал"
    }
};

const randomWords = ["привет","тепло","bridge","story","vibe","sky","connection","smile","moment","kindness","light"];

let currentLang = localStorage.getItem('pref-lang');
if (!currentLang) {
    currentLang = navigator.language.includes('ru') ? 'ru' : 'en';
}

function updateUI() {
    const t = translations[currentLang];
    document.getElementById('title').innerText = t.title;
    document.getElementById('desc').innerText = t.desc;
    document.getElementById('cta-btn').innerText = t.cta;
    typing.innerText = t.typing;
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
}

function addMsg(author, text, type, blur = false) {
    const d = document.createElement('div');
    d.className = `msg ${type} ${blur ? 'blurred' : ''}`;
    d.innerHTML = `<strong>${author}</strong><br>${text}`;
    chatFlow.appendChild(d);
    chatFlow.scrollTop = chatFlow.scrollHeight;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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