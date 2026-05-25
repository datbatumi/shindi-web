/**
 * Shindi Homepage Data — WordPress API Bridge
 * Fetches the singleton 'homepage' CPT post and exposes hero + stats content.
 * API: https://new.shindi.ge/sadmin/wp-json/wp/v2/homepage
 *
 * ACF fields used:
 *   hero_line_1, hero_line_2, hero_line_3_words (textarea, newline-separated),
 *   hero_line_4, hero_images (repeater → image URL),
 *   stat_description, stat_year, stat_year_label,
 *   stat_count_1, stat_count_1_label, stat_count_2, stat_count_2_label
 */

(function () {
    'use strict';

    var API_BASE = 'https://new.shindi.ge/sadmin/wp-json/wp/v2';

    function fetchHomepage() {
        return fetch(API_BASE + '/homepage?per_page=1&acf_format=standard')
            .then(function (res) {
                if (!res.ok) throw new Error('API error: ' + res.status);
                return res.json();
            });
    }

    function normalize(post) {
        var acf = post.acf || {};

        /* hero_line_3_words is a textarea — split on newlines, filter empty lines */
        var words = [];
        if (acf.hero_line_3_words) {
            words = String(acf.hero_line_3_words)
                .split('\n')
                .map(function (w) { return w.trim(); })
                .filter(function (w) { return w.length > 0; });
        }

        /* hero_images is a textarea — one URL per line */
        var heroImages = [];
        if (acf.hero_images) {
            heroImages = String(acf.hero_images)
                .split('\n')
                .map(function (u) { return u.trim(); })
                .filter(function (u) { return u.length > 0; });
        }

        /* services_hero_words is a textarea — split on newlines */
        var svcWords = [];
        if (acf.services_hero_words) {
            svcWords = String(acf.services_hero_words)
                .split('\n')
                .map(function (w) { return w.trim(); })
                .filter(function (w) { return w.length > 0; });
        }

        /* blog_hero_words is a textarea — split on newlines */
        var blogWords = [];
        if (acf.blog_hero_words) {
            blogWords = String(acf.blog_hero_words)
                .split('\n')
                .map(function (w) { return w.trim(); })
                .filter(function (w) { return w.length > 0; });
        }

        return {
            heroLine1        : acf.hero_line_1        || '',
            heroLine2        : acf.hero_line_2        || '',
            heroLine3Words   : words,
            heroLine4        : acf.hero_line_4        || '',
            heroImages       : heroImages,
            statDescription  : acf.stat_description   || '',
            statYear         : acf.stat_year          || '',
            statYearLabel    : acf.stat_year_label    || '',
            statCount1       : acf.stat_count_1       || 0,
            statCount1Label  : acf.stat_count_1_label || '',
            statCount2       : acf.stat_count_2       || 0,
            statCount2Label  : acf.stat_count_2_label || '',
            svcHeroBefore        : acf.services_hero_before    || '',
            svcHeroAfter         : acf.services_hero_after     || '',
            svcHeroWords         : svcWords,
            svcHeroDesc          : acf.services_hero_desc      || '',
            portfolioHeroBefore : acf.portfolio_hero_before || '',
            portfolioHeroWords  : (function () {
                if (!acf.portfolio_hero_highlight) return [];
                return String(acf.portfolio_hero_highlight)
                    .split('\n')
                    .map(function (w) { return w.trim(); })
                    .filter(function (w) { return w.length > 0; });
            }()),
            portfolioHeroDesc   : acf.portfolio_hero_desc || '',
            blogHeroBefore      : acf.blog_hero_before || '',
            blogHeroWords       : blogWords,
        };
    }

    window.SHINDI_HOMEPAGE           = null;
    window.SHINDI_HOMEPAGE_READY     = false;
    window.SHINDI_HOMEPAGE_CALLBACKS = [];

    window.onHomepageReady = function (fn) {
        if (window.SHINDI_HOMEPAGE_READY) { fn(window.SHINDI_HOMEPAGE); }
        else { window.SHINDI_HOMEPAGE_CALLBACKS.push(fn); }
    };

    fetchHomepage()
        .then(function (posts) {
            var data = (posts && posts.length) ? normalize(posts[0]) : null;
            window.SHINDI_HOMEPAGE       = data;
            window.SHINDI_HOMEPAGE_READY = true;
            window.SHINDI_HOMEPAGE_CALLBACKS.forEach(function (fn) { fn(data); });
            document.dispatchEvent(new CustomEvent('shindiHomepageReady', { detail: data }));
        })
        .catch(function (err) {
            console.error('[Shindi CMS] Failed to load homepage settings:', err);
            window.SHINDI_HOMEPAGE_READY = true;
            document.dispatchEvent(new CustomEvent('shindiHomepageReady', { detail: null }));
        });

})();
