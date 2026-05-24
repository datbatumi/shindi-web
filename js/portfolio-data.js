/**
 * Shindi Portfolio Data — WordPress API Bridge
 * Replaces the static portfolio-data.js with live data from WordPress CMS.
 * API: https://new.shindi.ge/sadmin/wp-json/wp/v2/portfolio
 *
 * Drop this file into your /js/ folder to replace the old portfolio-data.js.
 * No changes needed to portfolio.html or portfolio-detail.html.
 */

(function () {
    'use strict';

    var API_BASE = 'https://new.shindi.ge/sadmin/wp-json/wp/v2';

    /* ── Category label map (WP slug → Georgian label) ── */
    var CAT_LABELS = {
        'branding'    : 'ბრენდინგი',
        'smm'         : 'სოც. მედია',
        'seo'         : 'SEO / SEM',
        'web'         : 'ვებგვერდი',
        'strategy'    : 'სტრატეგია',
        'packaging'   : 'შეფუთვა',
        'app'         : 'აპლიკაცია',
        'digitalizacia': 'გაციფრულება'
    };

    /* ── Industry label map (same as service for now, extend if needed) ── */
    var INDUSTRY_LABELS = CAT_LABELS;

    /**
     * Fetch all portfolio posts from WordPress (handles pagination).
     * Returns a Promise that resolves to an array of WP post objects.
     */
    function fetchAllPosts() {
        var perPage = 100;
        var url = API_BASE + '/portfolio?per_page=' + perPage + '&acf_format=standard&_embed=1';
        return fetch(url)
            .then(function (res) {
                if (!res.ok) throw new Error('API error: ' + res.status);
                return res.json();
            });
    }

    /**
     * Get featured image URL from embedded WP data.
     */
    function getFeaturedImage(post) {
        try {
            return post._embedded['wp:featuredmedia'][0].source_url || '';
        } catch (e) {
            return post.acf.cover_image || '';
        }
    }

    /**
     * Convert a WP portfolio post → the SHINDI_PORTFOLIO item shape
     * that your existing portfolio.html and portfolio-detail.html expect.
     */
    function normalize(post) {
        var acf      = post.acf || {};
        var catSlug  = acf.service_category || 'branding';
        var catLabel = CAT_LABELS[catSlug] || catSlug;

        /* Gallery images — collect image_1 … image_4, skip falsy values */
        var images = [];
        ['image_1', 'image_2', 'image_3', 'image_4'].forEach(function (key) {
            var val = acf[key];
            if (val && typeof val === 'string' && val.length > 0) images.push(val);
            else if (val && val.url) images.push(val.url); /* if returned as object */
        });

        var featured = getFeaturedImage(post) || acf.cover_image || (images[0] || '');

        /* Decode Georgian slug back to readable text for URL param */
        var slug = '';
        try { slug = decodeURIComponent(post.slug); } catch (e) { slug = post.slug; }

        return {
            /* Core identity */
            id           : post.id,
            slug         : String(post.id),          /* use numeric ID for reliable ?p= lookup */
            company      : post.title.rendered,
            clientName   : acf.client_name || post.title.rendered,

            /* Category / industry */
            industry     : catSlug,
            industryLabel: catLabel,

            /* Services — single for now, extend in WP if needed */
            services     : [catSlug],
            serviceLabels: [catLabel],

            /* Images */
            featured     : featured,
            images       : images,

            /* Text */
            shortDesc    : acf.description || '',

            /* Optional fields (add to ACF later if needed) */
            clientLogo   : acf.client_logo  || '',
            website      : acf.website      || '',
            results      : acf.results      ? acf.results.split('\n').filter(Boolean) : []
        };
    }

    /* ── Bootstrap ── */
    window.SHINDI_PORTFOLIO      = [];    /* start empty — scripts that run after DOMContentLoaded will wait */
    window.SHINDI_PORTFOLIO_READY = false;
    window.SHINDI_PORTFOLIO_CALLBACKS = [];

    /* Allow other scripts to register a callback for when data is ready */
    window.onPortfolioReady = function (fn) {
        if (window.SHINDI_PORTFOLIO_READY) { fn(window.SHINDI_PORTFOLIO); }
        else { window.SHINDI_PORTFOLIO_CALLBACKS.push(fn); }
    };

    fetchAllPosts()
        .then(function (posts) {
            window.SHINDI_PORTFOLIO = posts.map(normalize);
            window.SHINDI_PORTFOLIO_READY = true;
            window.SHINDI_PORTFOLIO_CALLBACKS.forEach(function (fn) { fn(window.SHINDI_PORTFOLIO); });
            /* Fire a custom event so inline scripts can also listen */
            document.dispatchEvent(new CustomEvent('shindiPortfolioReady', { detail: window.SHINDI_PORTFOLIO }));
        })
        .catch(function (err) {
            console.error('[Shindi CMS] Failed to load portfolio:', err);
            /* Dispatch empty event so pages don't hang */
            document.dispatchEvent(new CustomEvent('shindiPortfolioReady', { detail: [] }));
        });

})();
