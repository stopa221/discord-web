// Animacja wejścia kart (bez zmian)
const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

cards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    card.style.transition = '0.6s';
    observer.observe(card);
});

/* ---------- Kod: ciągłe pisanie + glitch dla code-card (pętla)
   Dodatkowo: stała wysokość (8 linii) i automatyczny scroll do dołu ---------- */

document.addEventListener('DOMContentLoaded', () => {
    const preEl = document.getElementById('code'); // kontener przewijania
    const cursorEl = document.getElementById('code-cursor');
    const codeCard = document.querySelector('.code-card');

    // snippet Pythona (przykład bota Discord)
    const codeLines = [
"import discord",
"from discord.ext import commands",
"",
"bot = commands.Bot(command_prefix='!')",
"",
"@bot.event",
"async def on_ready():",
"    print(f'Logged in as {bot.user}')",
"",
"@bot.command()",
"async def ping(ctx):",
"    await ctx.send('Pong!')",
"",
"bot.run('TOKEN')"
    ];

    const fullText = codeLines.join('\n');

    function applySimpleHighlighting(text) {
        return text
            .replace(/\b(import|from|async|await|def|class|print|return)\b/g, (m) => `<span class="kw">${m}</span>`)
            .replace(/('.*?'|".*?")/g, (m) => `<span class="str">${m}</span>`)
            .replace(/\b(bot|commands|ctx)\b/g, (m) => `<span class="fn">${m}</span>`);
    }

    let i = 0;
    const baseSpeed = 18;

    function getCodeEl() {
        return preEl.querySelector('code');
    }

    // Upewnij się, że istnieje element <code> wewnątrz <pre>
    if (!getCodeEl()) {
        const codeNode = document.createElement('code');
        preEl.appendChild(codeNode);
    }

    function scrollToBottom() {
        // przewiń kontener pre do dołu (pokazuje ostatnie linie)
        preEl.scrollTop = preEl.scrollHeight;
    }

    function typeStep() {
        const target = getCodeEl();
        if (!target) return;

        if (i <= fullText.length) {
            const visible = fullText.slice(0, i);
            target.textContent = visible;
            scrollToBottom();
            i++;
            const jitter = Math.floor(Math.random() * 40) - 20;
            const delay = Math.max(8, baseSpeed + jitter);
            setTimeout(typeStep, delay);
        } else {
            // po napisaniu całości: zastosuj highlight (innerHTML) dla estetyki
            const highlighted = applySimpleHighlighting(fullText).replace(/\n/g, '<br>');
            target.innerHTML = highlighted;
            scrollToBottom();

            // krótka pauza, potem restart pętli — bez zmiany rozmiaru kontenera
            setTimeout(() => {
                // wyczyszczenie i restart
                const t = getCodeEl();
                if (t) t.textContent = '';
                preEl.scrollTop = 0;
                i = 0;
                setTimeout(typeStep, 200); // małe opóźnienie przed rozpoczęciem kolejnego cyklu
            }, 1000 + Math.floor(Math.random() * 900));
        }
    }

    // uruchom pisanie w pętli
    typeStep();

    // Glitch: krótkotrwałe podmiany znaków + klasa .glitch
    function randomChar() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]{}<>/\\|';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }

    function doGlitchOnce() {
        const target = getCodeEl();
        if (!target) return;

        codeCard.classList.add('glitch');

        // Pobierz czysty tekst z pre (bez spanów)
        let text = preEl.textContent || preEl.innerText || '';
        if (!text) {
            codeCard.classList.remove('glitch');
            return;
        }
        const arr = text.split('');
        const changes = Math.max(1, Math.floor(arr.length * 0.03));
        const positions = [];
        for (let k = 0; k < changes; k++) {
            positions.push(Math.floor(Math.random() * arr.length));
        }
        const original = positions.map(p => ({ p, c: arr[p] }));
        positions.forEach(p => arr[p] = randomChar());

        // ustaw tymczasowo w code (textContent zachowa brak spanów) — potem przywrócimy
        const t = getCodeEl();
        if (t) t.textContent = arr.join('');
        scrollToBottom();

        setTimeout(() => {
            original.forEach(o => arr[o.p] = o.c);
            if (t) t.textContent = arr.join('');
            codeCard.classList.remove('glitch');
            scrollToBottom();
        }, 100 + Math.floor(Math.random() * 220));
    }

    function scheduleGlitches() {
        const min = 2000, max = 8000;
        (function loop() {
            const t = min + Math.random() * (max - min);
            setTimeout(() => {
                const series = Math.random() < 0.35 ? 2 + Math.floor(Math.random() * 3) : 1;
                for (let s = 0; s < series; s++) {
                    setTimeout(doGlitchOnce, s * (70 + Math.random() * 90));
                }
                loop();
            }, t);
        })();
    }

    scheduleGlitches();

    // Jeśli chcesz: można dodać pauzę kiedy karta przestaje być widoczna (opcjonalne).
});

// Płynne przewijanie do sekcji "projekty"
document.querySelector('.scroll-to-projects').addEventListener('click', e => {
    e.preventDefault();

    const target = document.getElementById('projekty');
    if (!target) return;

    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});
