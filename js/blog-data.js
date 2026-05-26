/**
 * Shindi Blog Data — WordPress API Bridge
 * Replaces the static blog-data.js with live data from WordPress CMS.
 * API: https://new.shindi.ge/sadmin/wp-json/wp/v2/posts
 *
 * Uses the native WordPress "post" type with ACF custom fields:
 *   cat_label, read_time, author_name, author_role, intro,
 *   body_paragraphs (repeater), tags (comma-separated text).
 *
 * Drop this file into /js/ to replace the old blog-data.js.
 * blog.html and blog-single.html listen for 'shindiBlogReady' before rendering.
 */

(function () {
    'use strict';

    var API_BASE = 'https://new.shindi.ge/sadmin/wp-json/wp/v2';

    var GEO_MONTHS = [
        'იანვარი', 'თებერვალი', 'მარტი',     'აპრილი',   'მაისი',    'ივნისი',
        'ივლისი',  'აგვისტო',   'სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი'
    ];

    /* ── Helpers ── */
    function fmtDate(isoDate) {
        var d = new Date(isoDate);
        return d.getDate() + ' ' + GEO_MONTHS[d.getMonth()] + ', ' + d.getFullYear();
    }

    function getFeatured(post) {
        try { return post._embedded['wp:featuredmedia'][0].source_url || ''; } catch (e) { return ''; }
    }

    function getCat(post) {
        try {
            var terms = post._embedded['wp:term'];
            if (terms && terms[0] && terms[0][0]) {
                return { slug: terms[0][0].slug, name: terms[0][0].name };
            }
        } catch (e) {}
        return { slug: 'strategia', name: 'სტრატეგია' };
    }

    /* ── Convert a WP post → SHINDI_BLOG item shape ── */
    function normalize(post) {
        var acf = post.acf || {};
        var cat = getCat(post);

        /* Body paragraphs: repeater → flat string array */
        var body = [];
        if (Array.isArray(acf.body_paragraphs)) {
            acf.body_paragraphs.forEach(function (row) {
                if (row.paragraph) body.push(row.paragraph);
            });
        }

        /* Tags: comma-separated text → string array */
        var tags = [];
        if (acf.tags) {
            tags = String(acf.tags).split(',').map(function (t) { return t.trim(); }).filter(Boolean);
        }

        var dateISO = post.date.substring(0, 10);

        /* card_description ACF field takes priority; fall back to native WP excerpt */
        var excerpt = (acf.card_description || '')
            .trim()
            || (post.excerpt.rendered || '').replace(/<[^>]+>/g, '').trim();

        return {
            id         : post.id,
            slug       : post.slug,
            title      : post.title.rendered,
            content    : post.content ? post.content.rendered : '',
            category   : cat.slug,
            catLabel   : acf.cat_label  || cat.name,
            excerpt    : excerpt,
            date       : dateISO,
            dateLabel  : fmtDate(dateISO),
            readTime   : acf.read_time  || '5 წთ',
            featured   : getFeatured(post),
            author     : acf.author_name || '',
            authorRole : acf.author_role || '',
            intro      : acf.intro       || '',
            body       : body,
            tags       : tags,
        };
    }

    /* ── Bootstrap ── */
    window.SHINDI_BLOG           = [];
    window.SHINDI_BLOG_READY     = false;
    window.SHINDI_BLOG_CALLBACKS = [];

    /* Allow other scripts to register a callback for when data is ready */
    window.onBlogReady = function (fn) {
        if (window.SHINDI_BLOG_READY) { fn(window.SHINDI_BLOG); }
        else                          { window.SHINDI_BLOG_CALLBACKS.push(fn); }
    };

    fetch(API_BASE + '/posts?per_page=20&acf_format=standard&_embed=1&orderby=date&order=desc')
        .then(function (res) {
            if (!res.ok) throw new Error('API error: ' + res.status);
            return res.json();
        })
        .then(function (posts) {
            window.SHINDI_BLOG = posts.map(normalize);
            window.SHINDI_BLOG_READY = true;
            window.SHINDI_BLOG_CALLBACKS.forEach(function (fn) { fn(window.SHINDI_BLOG); });
            document.dispatchEvent(new CustomEvent('shindiBlogReady', { detail: window.SHINDI_BLOG }));
        })
        .catch(function (err) {
            console.error('[Shindi CMS] Failed to load blog posts:', err);
            document.dispatchEvent(new CustomEvent('shindiBlogReady', { detail: [] }));
        });

})();
