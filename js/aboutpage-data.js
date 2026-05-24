/**
 * Shindi About Page Data — WordPress API Bridge
 * Fetches the 'aboutpage' singleton CPT from WordPress and exposes it
 * as window.SHINDI_ABOUT for about.html to consume.
 *
 * API: https://new.shindi.ge/sadmin/wp-json/wp/v2/aboutpage
 *
 * ACF fields: hero_tag, hero_title_before, hero_title_word,
 *   stat_1_num/label, stat_2_num/label, stat_3_num/label,
 *   story_label, story_para_1, story_para_2, quote_text, quote_cite,
 *   timeline (textarea: "year|description" per line),
 *   founders_label, founders_title, founders_sub,
 *   team_label, team_title_1, team_title_2,
 *   career_label, career_title_main, career_title_word, career_sub
 */

(function () {
    'use strict';

    var API_BASE = 'https://new.shindi.ge/sadmin/wp-json/wp/v2';

    window.SHINDI_ABOUT           = null;
    window.SHINDI_ABOUT_READY     = false;
    window.SHINDI_ABOUT_CALLBACKS = [];

    window.onAboutReady = function (fn) {
        if (window.SHINDI_ABOUT_READY) { fn(window.SHINDI_ABOUT); }
        else { window.SHINDI_ABOUT_CALLBACKS.push(fn); }
    };

    fetch(API_BASE + '/aboutpage?per_page=1&acf_format=standard')
        .then(function (res) {
            if (!res.ok) throw new Error('API error: ' + res.status);
            return res.json();
        })
        .then(function (posts) {
            var data = (posts && posts[0] && posts[0].acf) ? posts[0].acf : null;

            /* Parse hero_title_word textarea → string array for typewriter */
            var heroWords = [];
            if (data && data.hero_title_word) {
                heroWords = String(data.hero_title_word)
                    .split('\n')
                    .map(function (w) { return w.trim(); })
                    .filter(Boolean);
            }
            window.SHINDI_ABOUT_HERO_WORDS = heroWords.length > 0 ? heroWords : null;

            window.SHINDI_ABOUT       = data;
            window.SHINDI_ABOUT_READY = true;
            window.SHINDI_ABOUT_CALLBACKS.forEach(function (fn) { fn(data); });
            document.dispatchEvent(new CustomEvent('shindiAboutReady', { detail: data }));
        })
        .catch(function (err) {
            console.error('[Shindi CMS] Failed to load about page data:', err);
            window.SHINDI_ABOUT_READY = true;
            document.dispatchEvent(new CustomEvent('shindiAboutReady', { detail: null }));
        });

})();
