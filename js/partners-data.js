/**
 * Shindi Partners Data — WordPress API Bridge
 * Fetches partner logos from the 'partner' CPT and exposes them sorted by order.
 * API: https://new.shindi.ge/sadmin/wp-json/wp/v2/partners
 *
 * ACF fields used:
 *   logo (image, returns URL), link (url), order (number)
 */

(function () {
    'use strict';

    var API_BASE = 'https://new.shindi.ge/sadmin/wp-json/wp/v2';

    function fetchAllPartners() {
        return fetch(API_BASE + '/partners?per_page=100&acf_format=standard')
            .then(function (res) {
                if (!res.ok) throw new Error('API error: ' + res.status);
                return res.json();
            });
    }

    function normalize(post) {
        var acf = post.acf || {};
        return {
            id    : post.id,
            title : post.title.rendered,
            logo  : acf.logo  || '',
            link  : acf.link  || '',
            order : parseInt(acf.order || 10, 10),
        };
    }

    window.SHINDI_PARTNERS           = [];
    window.SHINDI_PARTNERS_READY     = false;
    window.SHINDI_PARTNERS_CALLBACKS = [];

    window.onPartnersReady = function (fn) {
        if (window.SHINDI_PARTNERS_READY) { fn(window.SHINDI_PARTNERS); }
        else { window.SHINDI_PARTNERS_CALLBACKS.push(fn); }
    };

    fetchAllPartners()
        .then(function (posts) {
            window.SHINDI_PARTNERS = posts
                .map(normalize)
                .filter(function (p) { return p.logo.length > 0; })
                .sort(function (a, b) { return a.order - b.order; });
            window.SHINDI_PARTNERS_READY = true;
            window.SHINDI_PARTNERS_CALLBACKS.forEach(function (fn) { fn(window.SHINDI_PARTNERS); });
            document.dispatchEvent(new CustomEvent('shindiPartnersReady', { detail: window.SHINDI_PARTNERS }));
        })
        .catch(function (err) {
            console.error('[Shindi CMS] Failed to load partners:', err);
            document.dispatchEvent(new CustomEvent('shindiPartnersReady', { detail: [] }));
        });

})();
