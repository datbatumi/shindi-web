/**
 * Shindi Testimonials Data — WordPress API Bridge
 * Replaces the static testimonial cards on index.html with live data from WordPress CMS.
 * API: https://new.shindi.ge/sadmin/wp-json/wp/v2/testimonials
 *
 * Uses the 'testimonial' CPT registered in shindi-cpts-plugin.php with ACF fields:
 *   client_company, quote, author_name, author_role, card_color (pink|blue|green), display_order
 */

(function () {
    'use strict';

    var API_BASE = 'https://new.shindi.ge/sadmin/wp-json/wp/v2';

    function fetchTestimonials() {
        return fetch(API_BASE + '/testimonials?per_page=10&acf_format=standard')
            .then(function (res) {
                if (!res.ok) throw new Error('API error: ' + res.status);
                return res.json();
            });
    }

    function normalize(post) {
        var acf = post.acf || {};
        return {
            id         : post.id,
            company    : acf.client_company || post.title.rendered,
            quote      : acf.quote          || '',
            authorName : acf.author_name    || '',
            authorRole : acf.author_role    || '',
            cardColor  : acf.card_color     || 'blue',
            order      : parseInt(acf.display_order || 1, 10),
        };
    }

    window.SHINDI_TESTIMONIALS           = [];
    window.SHINDI_TESTIMONIALS_READY     = false;
    window.SHINDI_TESTIMONIALS_CALLBACKS = [];

    window.onTestimonialsReady = function (fn) {
        if (window.SHINDI_TESTIMONIALS_READY) { fn(window.SHINDI_TESTIMONIALS); }
        else { window.SHINDI_TESTIMONIALS_CALLBACKS.push(fn); }
    };

    fetchTestimonials()
        .then(function (posts) {
            window.SHINDI_TESTIMONIALS = posts
                .map(normalize)
                .sort(function (a, b) { return a.order - b.order; });
            window.SHINDI_TESTIMONIALS_READY = true;
            window.SHINDI_TESTIMONIALS_CALLBACKS.forEach(function (fn) { fn(window.SHINDI_TESTIMONIALS); });
            document.dispatchEvent(new CustomEvent('shindiTestimonialsReady', { detail: window.SHINDI_TESTIMONIALS }));
        })
        .catch(function (err) {
            console.error('[Shindi CMS] Failed to load testimonials:', err);
            document.dispatchEvent(new CustomEvent('shindiTestimonialsReady', { detail: [] }));
        });

})();
