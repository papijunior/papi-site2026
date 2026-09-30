const TAB_ORDER = ['inicio', 'publica', 'privada', 'academico', 'cv', 'capoeira', 'sistemas', 'contato'];

/* Endereço público do PC do PapiLAB (Cloudflare Tunnel → Apache/XAMPP). */
const SISTEMAS_HOST = 'https://casa.papijunior.com.br';
const SISTEMAS_TIMEOUT_MS = 5000;
const SISTEMAS_RECHECK_MS = 60000;
const WHEEL_COOLDOWN_MS = 850;
const WHEEL_THRESHOLD = 28;

let wheelLocked = false;

function getCurrentTabId() {
    const active = document.querySelector('.tab-content.active');
    return active?.id?.replace('tab-', '') || 'inicio';
}

function getTransitionDir(fromId, toId) {
    const fromIndex = TAB_ORDER.indexOf(fromId);
    const toIndex = TAB_ORDER.indexOf(toId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return null;
    return toIndex > fromIndex ? 'next' : 'prev';
}

function showTab(tabId, triggerEl, transitionDir) {
    const currentTabId = getCurrentTabId();
    const dir = transitionDir || getTransitionDir(currentTabId, tabId);

    document.querySelectorAll('.tab-content').forEach((content) => {
        content.classList.remove('active', 'tab-from-next', 'tab-from-prev');
    });

    document.querySelectorAll('nav a[data-tab]').forEach((link) => {
        link.classList.remove('active');
    });

    const selectedTab = document.getElementById('tab-' + tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
        if (dir === 'next') selectedTab.classList.add('tab-from-next');
        if (dir === 'prev') selectedTab.classList.add('tab-from-prev');
    }

    const matchingLink = document.querySelector(`nav a[data-tab="${tabId}"]`);
    if (matchingLink) {
        matchingLink.classList.add('active');
    } else if (triggerEl?.matches?.('nav a')) {
        triggerEl.classList.add('active');
    }

    const nav = document.querySelector('nav');
    const toggle = document.getElementById('mobile-menu');
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');

    if (window.matchMedia('(max-width: 980px)').matches) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    requestAnimationFrame(() => fitHomeToViewport());
}

function fitHomeToViewport() {
    // Home no longer uses transform scaling — layout is flex-based.
    document.querySelectorAll('.home-fit').forEach((el) => {
        el.style.transform = '';
        el.style.width = '';
        el.style.marginInline = '';
        el.style.height = '';
    });
}

function navigateTab(step) {
    const currentIndex = TAB_ORDER.indexOf(getCurrentTabId());
    if (currentIndex === -1) return false;

    let nextIndex = currentIndex + step;
    while (TAB_ORDER[nextIndex] && document.querySelector(`nav a[data-tab="${TAB_ORDER[nextIndex]}"]`)?.closest('li')?.hidden) {
        nextIndex += step;
    }
    if (nextIndex < 0 || nextIndex >= TAB_ORDER.length) return false;

    const dir = step > 0 ? 'next' : 'prev';
    showTab(TAB_ORDER[nextIndex], null, dir);
    return true;
}

function canUseWheelNavigation() {
    return window.matchMedia('(min-width: 981px)').matches;
}

function shouldIgnoreWheelNavigation(event) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && !lightbox.hidden) return true;

    const nav = document.querySelector('nav');
    if (nav?.classList.contains('open')) return true;

    const target = event.target;
    if (!(target instanceof Element)) return false;

    if (target.closest('textarea, select, [contenteditable="true"], iframe, .lightbox')) {
        return true;
    }

    if (target.closest('input:not([type="hidden"])')) return true;

    return false;
}

function initWheelNavigation() {
    window.addEventListener('wheel', (event) => {
        if (!canUseWheelNavigation() || wheelLocked || shouldIgnoreWheelNavigation(event)) {
            return;
        }

        if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

        event.preventDefault();

        const moved = navigateTab(event.deltaY > 0 ? 1 : -1);
        if (!moved) return;

        wheelLocked = true;
        window.setTimeout(() => {
            wheelLocked = false;
        }, WHEEL_COOLDOWN_MS);
    }, { passive: false });

    window.addEventListener('keydown', (event) => {
        if (!canUseWheelNavigation() || wheelLocked || shouldIgnoreWheelNavigation(event)) {
            return;
        }

        let step = 0;
        if (event.key === 'ArrowDown' || event.key === 'PageDown') step = 1;
        if (event.key === 'ArrowUp' || event.key === 'PageUp') step = -1;
        if (!step) return;

        const tag = document.activeElement?.tagName;
        if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return;

        event.preventDefault();
        const moved = navigateTab(step);
        if (!moved) return;

        wheelLocked = true;
        window.setTimeout(() => {
            wheelLocked = false;
        }, WHEEL_COOLDOWN_MS);
    });
}

document.querySelectorAll('[data-tab]').forEach((el) => {
    el.addEventListener('click', (event) => {
        event.preventDefault();
        showTab(el.dataset.tab, el);
    });
});

const mobileMenu = document.getElementById('mobile-menu');
mobileMenu?.addEventListener('click', () => {
    const nav = document.querySelector('nav');
    const open = nav.classList.toggle('open');
    mobileMenu.setAttribute('aria-expanded', String(open));
});

initWheelNavigation();

/* Contato: estrelas + validação antes do envio */
(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const stars = [...form.querySelectorAll('.star')];
    const ratingInput = document.getElementById('site-rating');
    const hint = document.getElementById('rating-hint');
    const isEn = document.documentElement.lang?.toLowerCase().startsWith('en');

    const setRating = (value) => {
        ratingInput.value = String(value);
        stars.forEach((star) => {
            const active = Number(star.dataset.value) <= value;
            star.classList.toggle('is-active', active);
            star.setAttribute('aria-checked', active && Number(star.dataset.value) === value ? 'true' : 'false');
        });
        if (hint) {
            hint.classList.remove('is-error');
            hint.textContent = isEn
                ? `${value} of 5 stars`
                : `${value} de 5 estrelas`;
        }
    };

    stars.forEach((star) => {
        star.setAttribute('role', 'radio');
        star.setAttribute('aria-checked', 'false');
        star.addEventListener('click', () => setRating(Number(star.dataset.value)));
        star.addEventListener('mouseenter', () => {
            const hoverValue = Number(star.dataset.value);
            stars.forEach((s) => {
                s.classList.toggle('is-hover', Number(s.dataset.value) <= hoverValue);
            });
        });
        star.addEventListener('mouseleave', () => {
            stars.forEach((s) => s.classList.remove('is-hover'));
        });
    });

    form.addEventListener('submit', (event) => {
        if (!ratingInput.value) {
            event.preventDefault();
            if (hint) {
                hint.classList.add('is-error');
                hint.textContent = isEn
                    ? 'Please select a star rating before sending.'
                    : 'Selecione uma avaliação em estrelas antes de enviar.';
            }
            stars[0]?.focus();
            return;
        }

        ratingInput.value = `${ratingInput.value}/5`;
    });
})();

/* Galeria Capoeira — lightbox */
(function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    if (!lightbox || !lightboxImg) return;

    const open = (src, alt) => {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        closeBtn?.focus();
    };

    const close = () => {
        lightbox.hidden = true;
        lightboxImg.removeAttribute('src');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.gallery-item').forEach((btn) => {
        btn.addEventListener('click', () => {
            const full = btn.dataset.full;
            const img = btn.querySelector('img');
            if (full) open(full, img?.alt);
        });
    });

    closeBtn?.addEventListener('click', close);
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !lightbox.hidden) close();
    });
})();

/* Sistemas: índice lido ao vivo do PC do PapiLAB; aba só aparece se o PC estiver online */
(function initSistemas() {
    const navItem = document.getElementById('nav-sistemas');
    const status = document.getElementById('sistemas-status');
    const lista = document.getElementById('sistemas-lista');
    if (!navItem || !status || !lista) return;

    const isEn = document.documentElement.lang?.toLowerCase().startsWith('en');
    const isLocal = /^(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)$/.test(location.hostname);
    const apiUrl = (isLocal ? '' : SISTEMAS_HOST) + '/sistemas/api.php';

    const text = {
        offline: isEn
            ? 'Systems are offline right now. Please try again later or get in touch.'
            : 'Os sistemas estão offline no momento. Tente novamente mais tarde ou entre em contato.',
        empty: isEn ? 'No systems available at the moment.' : 'Nenhum sistema disponível no momento.',
        online: (n) => isEn
            ? `${n} system${n === 1 ? '' : 's'} online`
            : `${n} sistema${n === 1 ? '' : 's'} online`,
        open: isEn ? 'Open system' : 'Abrir sistema',
    };

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));

    const setOffline = () => {
        navItem.hidden = true;
        lista.innerHTML = '';
        status.textContent = text.offline;
        status.dataset.state = 'offline';
    };

    const render = (sistemas) => {
        navItem.hidden = false;
        status.dataset.state = 'online';
        status.textContent = sistemas.length ? text.online(sistemas.length) : text.empty;
        lista.innerHTML = sistemas.map((s) => {
            if (!/^https?:\/\//.test(s.url || '')) return '';
            const desc = isEn ? (s.descricao_en || s.descricao) : s.descricao;
            return `
                <a class="card sistema-card" href="${escapeHtml(s.url)}" target="_blank" rel="noopener">
                    <span class="sistema-cat">${escapeHtml(s.categoria)}</span>
                    <h3>${escapeHtml(s.nome)}</h3>
                    <p>${escapeHtml(desc)}</p>
                    <span class="sistema-open">${text.open} &rarr;</span>
                </a>`;
        }).join('');
    };

    const check = async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), SISTEMAS_TIMEOUT_MS);
        try {
            const res = await fetch(apiUrl, { cache: 'no-store', signal: controller.signal });
            const data = res.ok ? await res.json() : null;
            if (data?.online && Array.isArray(data.sistemas)) render(data.sistemas);
            else setOffline();
        } catch {
            setOffline();
        } finally {
            clearTimeout(timer);
        }
    };

    if (location.hash === '#sistemas') showTab('sistemas');

    check();
    setInterval(check, SISTEMAS_RECHECK_MS);
})();

/* Home: scale content to fit viewport at 100% zoom */
(function initHomeFit() {
    let timer = 0;
    const schedule = () => {
        clearTimeout(timer);
        timer = setTimeout(fitHomeToViewport, 40);
    };

    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    document.querySelectorAll('#tab-inicio img').forEach((img) => {
        if (!img.complete) img.addEventListener('load', schedule, { once: true });
    });

    if (document.fonts?.ready) {
        document.fonts.ready.then(schedule).catch(() => {});
    }

    schedule();
})();
