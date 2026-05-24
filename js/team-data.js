/**
 * Shindi Team Data — WordPress API Bridge
 * Replaces the static founders and team grid on about.html with live data from WordPress CMS.
 * API: https://new.shindi.ge/sadmin/wp-json/wp/v2/team
 *
 * Uses the 'team_member' CPT registered in shindi-cpts-plugin.php with ACF fields:
 *   role, photo (URL), is_founder (true/false toggle), order (display order number)
 * The featured image can be used instead of the photo ACF field.
 */

(function () {
    'use strict';

    var API_BASE = 'https://new.shindi.ge/sadmin/wp-json/wp/v2';

    function fetchAllTeam() {
        return fetch(API_BASE + '/team?per_page=50&acf_format=standard&_embed=1')
            .then(function (res) {
                if (!res.ok) throw new Error('API error: ' + res.status);
                return res.json();
            });
    }

    function getFeaturedImage(post) {
        try { return post._embedded['wp:featuredmedia'][0].source_url || ''; } catch (e) { return ''; }
    }

    function normalize(post) {
        var acf = post.acf || {};
        return {
            id        : post.id,
            name      : post.title.rendered,
            role      : acf.role      || '',
            photo     : acf.photo     || getFeaturedImage(post),
            isFounder : !!acf.is_founder,
            order     : parseInt(acf.order || 10, 10),
        };
    }

    window.SHINDI_TEAM           = [];
    window.SHINDI_TEAM_READY     = false;
    window.SHINDI_TEAM_CALLBACKS = [];

    window.onTeamReady = function (fn) {
        if (window.SHINDI_TEAM_READY) { fn(window.SHINDI_TEAM); }
        else { window.SHINDI_TEAM_CALLBACKS.push(fn); }
    };

    fetchAllTeam()
        .then(function (posts) {
            window.SHINDI_TEAM = posts
                .map(normalize)
                .sort(function (a, b) { return a.order - b.order; });
            window.SHINDI_TEAM_READY = true;
            window.SHINDI_TEAM_CALLBACKS.forEach(function (fn) { fn(window.SHINDI_TEAM); });
            document.dispatchEvent(new CustomEvent('shindiTeamReady', { detail: window.SHINDI_TEAM }));
        })
        .catch(function (err) {
            console.error('[Shindi CMS] Failed to load team:', err);
            document.dispatchEvent(new CustomEvent('shindiTeamReady', { detail: [] }));
        });

})();
