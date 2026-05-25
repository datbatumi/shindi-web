/* ================================================================
   SHINDI — main.js  (v3)
   ================================================================ */
'use strict';

/* ── LOADER ──────────────────────────────────────────────────── */
(function () {
    const loader = document.getElementById('loader');
    const fillEl = document.getElementById('loaderFill');
    const pctEl  = document.getElementById('loaderPct');
    if (!loader) return;

    let progress = 0;
    const tick = () => {
        /* Fast start, slows near 95 */
        const step = progress < 65  ? 9 + Math.random() * 13
                   : progress < 88  ? 1.5 + Math.random() * 3.5
                   : 0;
        progress = Math.min(progress + step, 95);
        if (fillEl) fillEl.style.width = progress + '%';
        if (pctEl)  pctEl.textContent  = Math.floor(progress) + '%';
    };
    const interval = setInterval(tick, 120);

    const MIN_MS = 1600;
    const start  = performance.now();

    const hide = () => {
        clearInterval(interval);
        if (fillEl) fillEl.style.width = '100%';
        if (pctEl)  pctEl.textContent  = '100%';
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('is-loading');
            document.body.classList.add('hero-in');
        }, 260);
    };

    window.addEventListener('load', () => {
        const wait = Math.max(0, MIN_MS - (performance.now() - start));
        setTimeout(hide, wait);
    });
    setTimeout(hide, 5000);
})();


/* ── HEADER: scroll shadow + auto-hide on scroll down ───────── */
(function () {
    const h = document.getElementById('header');
    if (!h) return;
    let lastY = 0;
    const upd = () => {
        const y = window.scrollY;
        h.classList.toggle('scrolled', y > 20);
        if (y > 120) {
            h.classList.toggle('nav-hidden', y > lastY);
        } else {
            h.classList.remove('nav-hidden');
        }
        lastY = y;
    };
    window.addEventListener('scroll', upd, { passive: true });
    upd();
})();


/* ── NAV OVERLAY ─────────────────────────────────────────────── */
(function () {
    const burger  = document.getElementById('mainBurger');
    const overlay = document.getElementById('navOverlay');
    const close   = document.getElementById('overlayClose');
    if (!burger || !overlay) return;
    const open = () => { overlay.classList.add('open'); burger.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const shut = () => { overlay.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = ''; };
    burger.addEventListener('click', () => overlay.classList.contains('open') ? shut() : open());
    if (close) close.addEventListener('click', shut);
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
    document.addEventListener('keydown', e => e.key === 'Escape' && shut());
})();


/* ── HIRE MODAL ──────────────────────────────────────────────── */
(function () {
    const backdrop = document.getElementById('hireModal');
    const openBtns = document.querySelectorAll('[data-hire]');
    const closeBtn = document.getElementById('modalClose');
    if (!backdrop) return;
    const open = () => { backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const shut = () => { backdrop.classList.remove('open'); document.body.style.overflow = ''; };
    openBtns.forEach(b => b.addEventListener('click', open));
    if (closeBtn) closeBtn.addEventListener('click', shut);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) shut(); });
    document.addEventListener('keydown', e => e.key === 'Escape' && shut());
})();


/* ── GIFT MODAL ──────────────────────────────────────────────── */
(function () {
    const backdrop = document.getElementById('giftModal');
    const openBtns = document.querySelectorAll('[data-gift]');
    const closeBtn = document.getElementById('giftClose');
    if (!backdrop) return;
    const open = () => { backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const shut = () => { backdrop.classList.remove('open'); document.body.style.overflow = ''; };
    openBtns.forEach(b => b.addEventListener('click', open));
    if (closeBtn) closeBtn.addEventListener('click', shut);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) shut(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
})();


/* ── SHARED LEAD FORM HELPERS ────────────────────────────────── */
var WP_LEAD = 'https://new.shindi.ge/sadmin/wp-json/shindi/v1/lead';

function markSubmitted() {
    history.pushState({}, '', '/submitted');
}

async function postLead(formData) {
    const res  = await fetch(WP_LEAD, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
    const json = await res.json();
    return json.success === true;
}

function makeLeadFormHandler(formId, successId, formType) {
    const form    = document.getElementById(formId);
    if (!form) return;
    const btnLabel  = form.querySelector('.btn-label');
    const spinner   = form.querySelector('.btn-spinner');
    const submitBtn = form.querySelector('[type="submit"]');
    const successEl = document.getElementById(successId);

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (btnLabel) btnLabel.style.opacity = '.4';
        if (spinner)   spinner.style.display  = 'inline-block';
        if (submitBtn) submitBtn.disabled = true;

        const data = new FormData(form);
        data.append('form_type', formType);

        try {
            const ok = await postLead(data);
            if (!ok) throw new Error();
            if (form)      form.style.display = 'none';
            if (successEl) successEl.style.display = 'flex';
            markSubmitted();
        } catch {
            if (btnLabel)  btnLabel.style.opacity = '1';
            if (spinner)   spinner.style.display  = 'none';
            if (submitBtn) submitBtn.disabled = false;
            alert('გაგზავნა ვერ მოხერხდა. სცადეთ მოგვიანებით ან დაგვიკავშირდით: contact@shindi.ge');
        }
    });
}

/* ── GIFT FORM SUBMIT ────────────────────────────────────────── */
makeLeadFormHandler('giftForm', 'giftFormSuccess', 'gift');

/* ── HIRE FORM SUBMIT ────────────────────────────────────────── */
makeLeadFormHandler('hireForm', 'hireFormSuccess', 'hire');

/* ── CONTACT FORM SUBMIT ─────────────────────────────────────── */
makeLeadFormHandler('contactForm', 'contactSuccess', 'contact');

/* ── CONTACT PAGE CALLBACK FORM ──────────────────────────────── */
makeLeadFormHandler('ctCallbackForm', 'ctCallbackSuccess', 'callback');

/* ── SERVICE PAGE LEAD FORM ──────────────────────────────────── */
makeLeadFormHandler('svcLeadForm', 'leadSuccess', 'service');

/* ── PORTFOLIO DETAIL LEAD FORM ──────────────────────────────── */
makeLeadFormHandler('pdLeadForm', 'pdFormOk', 'portfolio');


/* ── SERVICES STICKY SCROLL ──────────────────────────────────── */
(function () {
    const outer  = document.getElementById('svcStickyOuter');
    const panel  = document.getElementById('svcStickyPanel');
    if (!outer || !panel) return;

    const items   = panel.querySelectorAll('.svc-scroll-item');
    const curEl   = panel.querySelector('.svc-cur');
    const fillEl  = panel.querySelector('.svc-progress-fill');
    const N       = items.length;
    /* Background theme per card: red → dark → white */
    const THEMES  = ['svc-theme-red', 'svc-theme-dark', ''];
    let lastActive = -1;

    function update() {
        const rect        = outer.getBoundingClientRect();
        const totalScroll = outer.offsetHeight - window.innerHeight;
        const scrolled    = -rect.top;
        if (scrolled < 0 || scrolled > totalScroll) return;

        const progress  = scrolled / totalScroll;
        const activeIdx = Math.min(Math.floor(progress * N), N - 1);

        if (activeIdx !== lastActive) {
            lastActive = activeIdx;
            items.forEach((item, i) => {
                item.classList.toggle('active', i === activeIdx);
                item.classList.toggle('past',   i  < activeIdx);
            });
            if (curEl) curEl.textContent = String(activeIdx + 1).padStart(2, '0');
            /* Switch panel background theme */
            panel.classList.remove('svc-theme-dark', 'svc-theme-red');
            if (THEMES[activeIdx]) panel.classList.add(THEMES[activeIdx]);
        }
        if (fillEl) fillEl.style.width = (progress * 100) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
})();


/* ── PORTFOLIO STICKY SCROLL ─────────────────────────────────── */
(function () {
    const outer = document.getElementById('portStickyOuter');
    const panel = document.getElementById('portStickyPanel');
    if (!outer || !panel) return;

    const slides  = panel.querySelectorAll('.port-slide');
    const curEl   = panel.querySelector('.port-cur');
    const N       = slides.length;
    let lastActive = -1;

    function update() {
        const rect        = outer.getBoundingClientRect();
        const totalScroll = outer.offsetHeight - window.innerHeight;
        const scrolled    = -rect.top;
        if (scrolled < 0 || scrolled > totalScroll) return;

        const progress  = scrolled / totalScroll;
        const activeIdx = Math.min(Math.floor(progress * N), N - 1);

        if (activeIdx !== lastActive) {
            lastActive = activeIdx;
            slides.forEach((s, i) => {
                s.classList.toggle('active', i === activeIdx);
                s.classList.toggle('past',   i  < activeIdx);
            });
            if (curEl) curEl.textContent = String(activeIdx + 1).padStart(2, '0');
        }
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
})();


/* ── TESTIMONIALS SLIDER ─────────────────────────────────────── */
(function () {
    const cards  = document.querySelectorAll('.test-card');
    const curEl  = document.getElementById('testCur');
    const prevBtn= document.getElementById('testPrev');
    const nextBtn= document.getElementById('testNext');
    if (!cards.length) return;

    let current = 0;
    const total = cards.length;

    function go(idx) {
        cards[current].classList.remove('active');
        current = (idx + total) % total;
        cards[current].classList.add('active');
        if (curEl) curEl.textContent = String(current + 1).padStart(2, '0');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => go(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(current + 1));

    /* auto-advance every 6 s */
    let timer = setInterval(() => go(current + 1), 6000);
    const reset = () => { clearInterval(timer); timer = setInterval(() => go(current + 1), 6000); };
    if (prevBtn) prevBtn.addEventListener('click', reset);
    if (nextBtn) nextBtn.addEventListener('click', reset);
})();


/* ── FAQ ACCORDION ───────────────────────────────────────────── */
(function () {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            /* close all */
            document.querySelectorAll('.faq-question').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
            });

            /* open clicked if it was closed */
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });
})();


/* ── SCROLL REVEAL ───────────────────────────────────────────── */
(function () {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ── AUTO PAGE SECTION REVEAL (inner pages) ─────────────────── */
(function () {
    if (document.getElementById('hero')) return; // skip homepage — it has its own anims
    var autoObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('visible'); autoObs.unobserve(e.target); }
        });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

    var sel = [
        'main > section:not([class*="hero"])',
        '.port-card', '.svc-desc-card', '.abt-founder-eq-card',
        '.pg-cta', '.bs-article', '.bs-sidebar > *',
        '.ct-map-section', '.ct-callback-section'
    ].join(',');

    document.querySelectorAll(sel).forEach(function (el) {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
            autoObs.observe(el);
        }
    });
})();


/* ── STAT COUNTERS ───────────────────────────────────────────── */
(function () {
    const ease = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    function count(el, from, to, dur, suffix) {
        const start = performance.now();
        const run = now => {
            const p = Math.min((now - start) / dur, 1);
            el.textContent = Math.round(from + (to - from) * ease(p)) + suffix;
            if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
    }
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el     = e.target;
            const to     = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const from   = parseInt(el.dataset.from  || '0', 10);
            count(el, from, to, 1800, suffix);
            obs.unobserve(el);
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
})();


/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        const t = document.querySelector(this.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


/* ── HERO WORD TYPEWRITER ────────────────────────────────────── */
(function () {
    const el = document.getElementById('heroWord');
    if (!el) return;
    let words = ['AI აგენტების', 'ადამიანების', 'ბრენდების'];
    let wordIdx = 0;

    /* homepage-data.js calls this to swap in CMS words before the first cycle ends */
    window._heroTypewriterUpdate = function (newWords) {
        if (Array.isArray(newWords) && newWords.length) words = newWords;
    };

    function type(word, done) {
        el.textContent = '';
        let i = 0;
        const t = setInterval(() => {
            el.textContent += word[i++];
            if (i >= word.length) {
                clearInterval(t);
                setTimeout(done, 2200); /* hold before erasing */
            }
        }, 65);
    }

    function erase(done) {
        const t = setInterval(() => {
            const s = el.textContent;
            if (!s.length) { clearInterval(t); done(); return; }
            el.textContent = s.slice(0, -1);
        }, 42);
    }

    function cycle() {
        erase(() => {
            wordIdx = (wordIdx + 1) % words.length;
            type(words[wordIdx], cycle);
        });
    }

    type(words[0], cycle); /* kick off */
})();


/* ── SERVICES HERO WORD TYPEWRITER ──────────────────────────── */
(function () {
    const el = document.getElementById('svcWord');
    if (!el) return;
    let words = ['ტრანსფორმაცია', 'წარმატება', 'განვითარება', 'ზრდა'];
    let wordIdx = 0;

    window._svcTypewriterUpdate = function (newWords) {
        if (Array.isArray(newWords) && newWords.length) words = newWords;
    };

    function type(word, done) {
        el.textContent = '';
        let i = 0;
        const t = setInterval(() => {
            el.textContent += word[i++];
            if (i >= word.length) { clearInterval(t); setTimeout(done, 2200); }
        }, 65);
    }

    function erase(done) {
        const t = setInterval(() => {
            const s = el.textContent;
            if (!s.length) { clearInterval(t); done(); return; }
            el.textContent = s.slice(0, -1);
        }, 42);
    }

    function cycle() {
        erase(() => { wordIdx = (wordIdx + 1) % words.length; type(words[wordIdx], cycle); });
    }

    type(words[0], cycle);
})();


/* ── PORTFOLIO HERO WORD TYPEWRITER ─────────────────────────── */
(function () {
    const el = document.getElementById('portWord');
    if (!el) return;
    let words = ['ნამუშევრები', 'პორტფოლიო', 'დამკვეთები', 'შედეგები'];
    let wordIdx = 0;

    window._portTypewriterUpdate = function (newWords) {
        if (Array.isArray(newWords) && newWords.length) words = newWords;
    };

    function type(word, done) {
        el.textContent = '';
        let i = 0;
        const t = setInterval(() => {
            el.textContent += word[i++];
            if (i >= word.length) { clearInterval(t); setTimeout(done, 2200); }
        }, 65);
    }

    function erase(done) {
        const t = setInterval(() => {
            const s = el.textContent;
            if (!s.length) { clearInterval(t); done(); return; }
            el.textContent = s.slice(0, -1);
        }, 42);
    }

    function cycle() {
        erase(() => { wordIdx = (wordIdx + 1) % words.length; type(words[wordIdx], cycle); });
    }

    type(words[0], cycle);
})();


/* ── ABOUT HERO WORD TYPEWRITER ─────────────────────────────── */
(function () {
    const el = document.getElementById('abtWord');
    if (!el) return;
    const FALLBACK = ['ბაზარზე', 'მარკეტინგში', 'ბათუმში', 'თქვენს გვერდით'];
    let wordIdx = 0;

    function type(word, done) {
        el.textContent = '';
        let i = 0;
        const t = setInterval(() => {
            el.textContent += word[i++];
            if (i >= word.length) { clearInterval(t); setTimeout(done, 2200); }
        }, 65);
    }

    function erase(done) {
        const t = setInterval(() => {
            const s = el.textContent;
            if (!s.length) { clearInterval(t); done(); return; }
            el.textContent = s.slice(0, -1);
        }, 42);
    }

    function startTypewriter(words) {
        wordIdx = 0;
        function cycle() {
            erase(() => { wordIdx = (wordIdx + 1) % words.length; type(words[wordIdx], cycle); });
        }
        type(words[0], cycle);
    }

    if (window.SHINDI_ABOUT_READY) {
        startTypewriter(window.SHINDI_ABOUT_HERO_WORDS || FALLBACK);
    } else if (typeof window.onAboutReady === 'function') {
        window.onAboutReady(function () {
            startTypewriter(window.SHINDI_ABOUT_HERO_WORDS || FALLBACK);
        });
    } else {
        startTypewriter(FALLBACK);
    }
})();


/* ── BLOG HERO WORD TYPEWRITER ──────────────────────────────── */
(function () {
    const el = document.getElementById('blogWord');
    if (!el) return;
    let words = ['უახლეს სტატიებს', 'ტენდენციებს', 'ექსპერტულ რჩევებს', 'სიახლეებს'];
    let wordIdx = 0;

    window._blogTypewriterUpdate = function (newWords) {
        if (Array.isArray(newWords) && newWords.length) words = newWords;
    };

    function type(word, done) {
        el.textContent = '';
        let i = 0;
        const t = setInterval(() => {
            el.textContent += word[i++];
            if (i >= word.length) { clearInterval(t); setTimeout(done, 2200); }
        }, 65);
    }

    function erase(done) {
        const t = setInterval(() => {
            const s = el.textContent;
            if (!s.length) { clearInterval(t); done(); return; }
            el.textContent = s.slice(0, -1);
        }, 42);
    }

    function cycle() {
        erase(() => { wordIdx = (wordIdx + 1) % words.length; type(words[wordIdx], cycle); });
    }

    type(words[0], cycle);
})();


/* ── CONTACT HERO WORD TYPEWRITER ───────────────────────────── */
(function () {
    const el = document.getElementById('ctWord');
    if (!el) return;
    const words = ['წარმატებაზე?', 'განვითარებაზე?', 'ზრდაზე?', 'წინსვლაზე?'];
    let wordIdx = 0;

    function type(word, done) {
        el.textContent = '';
        let i = 0;
        const t = setInterval(() => {
            el.textContent += word[i++];
            if (i >= word.length) { clearInterval(t); setTimeout(done, 2200); }
        }, 65);
    }

    function erase(done) {
        const t = setInterval(() => {
            const s = el.textContent;
            if (!s.length) { clearInterval(t); done(); return; }
            el.textContent = s.slice(0, -1);
        }, 42);
    }

    function cycle() {
        erase(() => { wordIdx = (wordIdx + 1) % words.length; type(words[wordIdx], cycle); });
    }

    type(words[0], cycle);
})();


/* ── FLOAT GIFT — reveal when footer enters view ─────────────── */
(function () {
    const btn     = document.querySelector('.float-gift');
    const trigger = document.getElementById('footer');
    if (!btn || !trigger) return;
    const obs = new IntersectionObserver(entries => {
        btn.classList.toggle('visible', entries[0].isIntersecting);
    }, { threshold: 0.05 });
    obs.observe(trigger);
})();


/* ── SCROLL TO TOP ───────────────────────────────────────────── */
(function () {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


/* ── FOOTER YEAR ─────────────────────────────────────────────── */
(function () {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
})();


/* ── QUIZ POPUP ───────────────────────────────────────────── */
(function () {
    const modal        = document.getElementById('quizModal');
    const closeBtn     = document.getElementById('quizClose');
    const successEl    = document.getElementById('quizSuccess');
    const successClose = document.getElementById('quizSuccessClose');
    if (!modal) return;

    if (sessionStorage.getItem('quizDismissed')) return;
    if (localStorage.getItem('quizCompleted')) return;

    const stars  = modal.querySelectorAll('.quiz-star');
    const steps  = modal.querySelectorAll('.quiz-step');
    let earned   = 0;
    let current  = 0;
    const history = [];   /* step-index history for back navigation */

    /* ── modal open / close ── */
    const openModal = () => { modal.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        sessionStorage.setItem('quizDismissed', '1');
    };

    /* ── star helpers ── */
    const awardStar = () => {
        if (earned < stars.length) { stars[earned].classList.add('earned'); earned++; }
    };
    const revokeStar = () => {
        if (earned > 0) { earned--; stars[earned].classList.remove('earned'); }
    };

    /* ── navigation ── */
    const showStep = (idx) => {
        steps.forEach(s => s.classList.remove('active'));
        steps[idx].classList.add('active');
        current = idx;
        /* scroll card to top on step change */
        modal.querySelector('.quiz-card').scrollTop = 0;
    };

    const goForward = (toIdx) => {
        history.push(current);
        if (toIdx < steps.length) {
            showStep(toIdx);
        } else {
            showSuccess();
        }
    };

    const goBack = () => {
        if (!history.length) return;
        revokeStar();
        const prev = history.pop();
        showStep(prev);
    };

    /* ── collect answer from a step (selected button or text input) ── */
    const getStepAnswer = (stepEl) => {
        const btn = stepEl.querySelector('.qc-btn.selected');
        if (btn) {
            const other = stepEl.querySelector('.quiz-other-field');
            if (other && other.style.display !== 'none' && other.value.trim()) return other.value.trim();
            return btn.dataset.val || '';
        }
        const inp = stepEl.querySelector('.quiz-input');
        return inp ? inp.value.trim() : '';
    };

    /* ── success screen ── */
    const showSuccess = () => {
        steps.forEach(s => s.classList.remove('active'));
        modal.querySelector('.quiz-stars').style.display    = 'none';
        modal.querySelector('.quiz-headline').style.display = 'none';
        successEl.classList.add('visible');
        successEl.querySelectorAll('.qs-star').forEach((s, i) =>
            setTimeout(() => s.classList.add('pop'), i * 120 + 80));
        localStorage.setItem('quizCompleted', '1');
        sessionStorage.setItem('quizDismissed', '1');

        /* Send quiz answers to WP (fire-and-forget) */
        const qd = new FormData();
        qd.append('form_type',   'quiz');
        qd.append('sector',      getStepAnswer(steps[0]));
        qd.append('service',     getStepAnswer(steps[1]));
        qd.append('company',     getStepAnswer(steps[2]));
        qd.append('phone',       getStepAnswer(steps[3]));
        qd.append('expectation', getStepAnswer(steps[4]));
        fetch(WP_LEAD, { method: 'POST', body: qd, headers: { 'Accept': 'application/json' } }).catch(() => {});

        markSubmitted();
    };

    /* ── STEPS 1, 2 & 5: single choice ── */
    [0, 1, 4].forEach(stepIdx => {
        const step     = steps[stepIdx];
        const btns     = step.querySelectorAll('.qc-btn');
        const otherFld = step.querySelector('.quiz-other-field');
        const nextBtn  = step.querySelector('.quiz-next-btn');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');

                if (btn.classList.contains('qc-other-trigger')) {
                    /* show text field + next button */
                    if (otherFld) { otherFld.style.display = 'block'; otherFld.focus(); }
                    if (nextBtn)  nextBtn.style.display = 'block';
                } else {
                    /* hide other field, auto-advance */
                    if (otherFld) otherFld.style.display = 'none';
                    if (nextBtn)  nextBtn.style.display  = 'none';
                    awardStar();
                    setTimeout(() => goForward(stepIdx + 1), 520);
                }
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                awardStar();
                goForward(stepIdx + 1);
            });
        }
    });

    /* ── STEP 3: company text (required) ── */
    (function () {
        const step  = steps[2];
        const input = step.querySelector('.quiz-input');
        const next  = step.querySelector('.quiz-next-btn');
        const err   = step.querySelector('.quiz-field-err');
        const advance = () => {
            if (!input.value.trim()) {
                err.style.display = 'block';
                input.classList.add('quiz-input--error');
                input.focus();
                return;
            }
            err.style.display = 'none';
            input.classList.remove('quiz-input--error');
            awardStar(); goForward(3);
        };
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                err.style.display = 'none';
                input.classList.remove('quiz-input--error');
            }
        });
        next.addEventListener('click', advance);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') advance(); });
    })();

    /* ── STEP 4: phone (required) ── */
    (function () {
        const step  = steps[3];
        const input = step.querySelector('.quiz-input');
        const next  = step.querySelector('.quiz-next-btn');
        const err   = step.querySelector('.quiz-field-err');
        const advance = () => {
            if (!input.value.trim()) {
                err.style.display = 'block';
                input.classList.add('quiz-input--error');
                input.focus();
                return;
            }
            err.style.display = 'none';
            input.classList.remove('quiz-input--error');
            awardStar(); goForward(4);
        };
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                err.style.display = 'none';
                input.classList.remove('quiz-input--error');
            }
        });
        next.addEventListener('click', advance);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') advance(); });
    })();

    /* ── Back buttons (all steps except step 1) ── */
    modal.querySelectorAll('.quiz-back-btn[data-back]').forEach(btn => {
        btn.addEventListener('click', goBack);
    });

    /* ── Close handlers ── */
    closeBtn.addEventListener('click', closeModal);
    if (successClose) successClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    /* ── Show after 30 seconds, once per session ── */
    setTimeout(openModal, 30000);
})();

/* ── HERO 3D OBJECT — mouse-driven rotation ─────────────────── */
(function () {
    const root  = document.querySelector('.h3d-root');
    const hero  = document.getElementById('hero');
    const wrap  = document.querySelector('.hero-3d-wrap');
    if (!root || !hero || !wrap) return;

    /* Kill the CSS keyframe — JS owns the transform from here */
    root.style.animation = 'none';

    const BASE_X  = 18;          // base tilt (degrees)
    const SPEED   = 360 / 22000; // deg/ms — same as CSS 22s spin
    const DRAG_X  = 30;          // max vertical drag range
    const DRAG_Y  = 70;          // max horizontal drag range

    let autoY     = 0;           // continuously growing Y for auto-spin
    let curX      = BASE_X;
    let curY      = 0;
    let targetX   = BASE_X;
    let targetY   = 0;
    let manual    = false;
    let lastTs    = null;

    /* ── Pointer events on the hero section ── */
    hero.addEventListener('pointermove', e => {
        const wr  = wrap.getBoundingClientRect();
        const dx  = (e.clientX - (wr.left + wr.width  * 0.5)) / (wr.width  * 0.5);
        const dy  = (e.clientY - (wr.top  + wr.height * 0.5)) / (wr.height * 0.5);
        targetX   = BASE_X - dy * DRAG_X;
        targetY   = autoY  + dx * DRAG_Y;
        manual    = true;
    });

    hero.addEventListener('pointerleave', () => {
        /* Sync autoY to curY so the hand-off is seamless */
        autoY  = curY;
        manual = false;
    });

    /* ── RAF loop ── */
    function tick(ts) {
        const dt = lastTs ? (ts - lastTs) : 16;
        lastTs   = ts;

        if (!manual) {
            autoY  += dt * SPEED;
            targetX = BASE_X;
            targetY = autoY;
        }

        /* Smooth lerp toward target */
        curX += (targetX - curX) * 0.07;
        curY += (targetY - curY) * 0.07;

        root.style.transform = `rotateX(${curX}deg) rotateY(${curY}deg)`;
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
})();


/* ── PORTFOLIO REEL — Ken Burns zoom when panel enters view ─── */
(function () {
    var items = document.querySelectorAll('.port-reel-item');
    if (!items.length) return;
    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            e.target.classList.toggle('reel-active', e.isIntersecting);
        });
    }, { threshold: 0.45 });
    items.forEach(function (el) { obs.observe(el); });
})();


/* ── HERO IMAGE SLIDESHOW (0.4s per frame) ───────────────────── */
(function () {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    let current = 0;
    setInterval(function () {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 400);
})();
