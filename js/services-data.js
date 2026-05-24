/**
 * Shindi Services Data — WordPress API Bridge
 * Replaces the static services-data.js with live data from WordPress CMS.
 * API: https://new.shindi.ge/sadmin/wp-json/wp/v2/services
 *
 * Drop this file into /js/ to replace the old services-data.js.
 * service.html listens for the 'shindiServicesReady' event before rendering.
 */

(function () {
    'use strict';

    var API_BASE = 'https://new.shindi.ge/sadmin/wp-json/wp/v2';

    /* ── Fetch all service posts ── */
    function fetchAllServices() {
        var url = API_BASE + '/services?per_page=20&acf_format=standard&_embed=1';
        return fetch(url).then(function (res) {
            if (!res.ok) throw new Error('API error: ' + res.status);
            return res.json();
        });
    }

    /* ── Convert a WP service post → SHINDI_SERVICES item shape ── */
    function normalize(post) {
        var acf = post.acf || {};

        /* Deliverables: textarea — one item per line */
        var deliverables = [];
        if (acf.deliverables) {
            deliverables = String(acf.deliverables)
                .split('\n')
                .map(function (l) { return l.trim(); })
                .filter(function (l) { return l.length > 0; });
        }

        /* Portfolio items: still repeater if Pro, otherwise empty */
        var portfolio = [];
        if (Array.isArray(acf.portfolio_items)) {
            acf.portfolio_items.forEach(function (row) {
                portfolio.push({ img: row.img || '', name: row.name || '' });
            });
        }

        /* FAQ: textarea — blank line separates blocks; first line = Q, rest = A */
        var faq = [];
        if (acf.faq) {
            String(acf.faq).split(/\n\s*\n/).forEach(function (block) {
                var lines = block.split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 0; });
                if (lines.length >= 2) {
                    faq.push({ q: lines[0], a: lines.slice(1).join(' ') });
                }
            });
        }

        return {
            id          : post.id,
            slug        : acf.service_slug  || post.slug,
            num         : acf.service_num   || '',
            title       : post.title.rendered,
            emoji       : acf.emoji         || '',
            shortDesc   : acf.short_desc    || '',
            metaDesc    : acf.meta_desc     || acf.short_desc || '',
            longDesc    : acf.long_desc     || '',
            deliverables: deliverables,
            portfolio   : portfolio,
            faq         : faq,
        };
    }

    /* Sort by service_num ascending (01, 02 … 08) */
    function sortByNum(arr) {
        return arr.slice().sort(function (a, b) {
            return parseInt(a.num || 99, 10) - parseInt(b.num || 99, 10);
        });
    }

    /* ── Bootstrap ── */
    window.SHINDI_SERVICES           = [];
    window.SHINDI_SERVICES_READY     = false;
    window.SHINDI_SERVICES_CALLBACKS = [];

    /* Allow other scripts to register a callback for when data is ready */
    window.onServicesReady = function (fn) {
        if (window.SHINDI_SERVICES_READY) { fn(window.SHINDI_SERVICES); }
        else                              { window.SHINDI_SERVICES_CALLBACKS.push(fn); }
    };

    fetchAllServices()
        .then(function (posts) {
            window.SHINDI_SERVICES = sortByNum(posts.map(normalize));
            window.SHINDI_SERVICES_READY = true;
            window.SHINDI_SERVICES_CALLBACKS.forEach(function (fn) { fn(window.SHINDI_SERVICES); });
            document.dispatchEvent(new CustomEvent('shindiServicesReady', { detail: window.SHINDI_SERVICES }));
        })
        .catch(function (err) {
            console.error('[Shindi CMS] Failed to load services:', err);
            document.dispatchEvent(new CustomEvent('shindiServicesReady', { detail: [] }));
        });

})();
