<?php
/**
 * Plugin Name:  Shindi CPTs and ACF Fields
 * Plugin URI:   https://new.shindi.ge
 * Description:  Registers custom post types and ACF field groups for the Shindi headless website.
 *               Requires Advanced Custom Fields (free or Pro).
 * Version:      1.0.0
 * Requires PHP: 7.4
 * Author:       Shindi Agency
 *
 * HOW TO INSTALL:
 *   1. Upload this file to /wp-content/plugins/shindi-cpts/shindi-cpts-plugin.php
 *   2. Activate "Shindi Agency — CPTs & ACF Fields" in WP Admin → Plugins
 *   3. Install & activate the ACF plugin (free version works)
 *   4. The CPTs and field groups appear immediately — no UI setup needed
 */

defined( 'ABSPATH' ) || exit;

/* ═══════════════════════════════════════════════════════════════════════
   1. CUSTOM POST TYPES
   ═══════════════════════════════════════════════════════════════════════ */

add_action( 'init', 'shindi_register_cpts' );
function shindi_register_cpts() {

    /* ── Portfolio (already registered — kept here for reference only) ──
     * The Portfolio CPT was registered manually via WP Admin. If you ever
     * need to re-create it, uncomment the block below.
     *
    register_post_type( 'portfolio', [
        'label'        => 'პორტფოლიო',
        'public'       => true,
        'show_in_rest' => true,
        'rest_base'    => 'portfolio',
        'supports'     => [ 'title', 'thumbnail', 'revisions' ],
        'menu_icon'    => 'dashicons-portfolio',
    ] );
     */

    /* ── Service ── */
    register_post_type( 'service', [
        'label'         => 'სერვისები',
        'labels'        => [
            'name'          => 'სერვისები',
            'singular_name' => 'სერვისი',
            'add_new_item'  => 'სერვისის დამატება',
            'edit_item'     => 'სერვისის რედაქტირება',
            'search_items'  => 'სერვისის ძიება',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'rest_base'     => 'services',
        'has_archive'   => false,
        'rewrite'       => [ 'slug' => 'service' ],
        'menu_icon'     => 'dashicons-star-filled',
        'menu_position' => 5,
        'supports'      => [ 'title', 'thumbnail', 'revisions' ],
    ] );

    /* ── Testimonial ── */
    register_post_type( 'testimonial', [
        'label'         => 'გამოხმაურებები',
        'labels'        => [
            'name'          => 'გამოხმაურებები',
            'singular_name' => 'გამოხმაურება',
            'add_new_item'  => 'გამოხმაურების დამატება',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'rest_base'     => 'testimonials',
        'has_archive'   => false,
        'rewrite'       => [ 'slug' => 'testimonial' ],
        'menu_icon'     => 'dashicons-format-quote',
        'menu_position' => 6,
        'supports'      => [ 'title', 'revisions' ],
    ] );

    /* ── Homepage Settings (singleton — admin creates one post here) ── */
    register_post_type( 'homepage', [
        'label'         => 'მთავარი გვერდი',
        'labels'        => [
            'name'          => 'მთავარი გვერდი',
            'singular_name' => 'მთავარი გვერდი — პარამეტრები',
            'add_new_item'  => 'პარამეტრების დამატება',
            'edit_item'     => 'მთავარი გვერდის რედაქტირება',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_rest'  => true,
        'rest_base'     => 'homepage',
        'has_archive'   => false,
        'menu_icon'     => 'dashicons-admin-home',
        'menu_position' => 2,
        'supports'      => [ 'title', 'revisions' ],
    ] );

    /* ── Partner Logo ── */
    register_post_type( 'partner', [
        'label'         => 'პარტნიორები',
        'labels'        => [
            'name'          => 'პარტნიორები',
            'singular_name' => 'პარტნიორი',
            'add_new_item'  => 'პარტნიორის დამატება',
            'edit_item'     => 'პარტნიორის რედაქტირება',
            'search_items'  => 'პარტნიორის ძიება',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_rest'  => true,
        'rest_base'     => 'partners',
        'has_archive'   => false,
        'menu_icon'     => 'dashicons-businessman',
        'menu_position' => 8,
        'supports'      => [ 'title', 'revisions' ],
    ] );

    /* ── About Page Settings (singleton — admin creates one post here) ── */
    register_post_type( 'aboutpage', [
        'label'         => 'ჩვენ შესახებ',
        'labels'        => [
            'name'          => 'ჩვენ შესახებ',
            'singular_name' => 'ჩვენ შესახებ — პარამეტრები',
            'add_new_item'  => 'პარამეტრების დამატება',
            'edit_item'     => 'ჩვენ შესახებ გვერდის რედაქტირება',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_rest'  => true,
        'rest_base'     => 'aboutpage',
        'has_archive'   => false,
        'menu_icon'     => 'dashicons-admin-users',
        'menu_position' => 3,
        'supports'      => [ 'title', 'revisions' ],
    ] );

    /* ── Team Member ── */
    register_post_type( 'team_member', [
        'label'         => 'გუნდი',
        'labels'        => [
            'name'          => 'გუნდი',
            'singular_name' => 'გუნდის წევრი',
            'add_new_item'  => 'წევრის დამატება',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'rest_base'     => 'team',
        'has_archive'   => false,
        'rewrite'       => [ 'slug' => 'team' ],
        'menu_icon'     => 'dashicons-groups',
        'menu_position' => 7,
        'supports'      => [ 'title', 'thumbnail', 'revisions' ],
    ] );
}

/* ═══════════════════════════════════════════════════════════════════════
   2. ACF FIELD GROUPS
   Defined in PHP so they are version-controlled alongside the site code.
   They appear in WP Admin → Custom Fields (read-only, shown in grey).
   ═══════════════════════════════════════════════════════════════════════ */

add_action( 'acf/init', 'shindi_register_acf_field_groups' );
function shindi_register_acf_field_groups() {

    if ( ! function_exists( 'acf_add_local_field_group' ) ) return;

    /* ──────────────────────────────────────────────────────────────────
       A. PORTFOLIO  — matches the fields already created in WP Admin
          Listed here for reference; ACF won't duplicate them.
    ────────────────────────────────────────────────────────────────── */
    acf_add_local_field_group( [
        'key'          => 'group_shindi_portfolio',
        'title'        => 'პორტფოლიო ველები',
        'show_in_rest' => 1,
        'fields' => [
            [ 'key' => 'field_port_client_name',     'label' => 'კლიენტის სახელი',   'name' => 'client_name',     'type' => 'text' ],
            [ 'key' => 'field_port_service_category','label' => 'სერვისის კატეგორია','name' => 'service_category','type' => 'select',
              'choices' => [
                  'branding'      => 'ბრენდინგი',
                  'smm'           => 'სოც. მედია',
                  'seo'           => 'SEO / SEM',
                  'web'           => 'ვებგვერდი',
                  'strategy'      => 'სტრატეგია',
                  'packaging'     => 'შეფუთვა',
                  'app'           => 'აპლიკაცია',
                  'digitalizacia' => 'გაციფრულება',
              ],
            ],
            [ 'key' => 'field_port_cover_image', 'label' => 'Cover Image (URL)',  'name' => 'cover_image',  'type' => 'text' ],
            [ 'key' => 'field_port_image_1',     'label' => 'Gallery Image 1',    'name' => 'image_1',      'type' => 'image', 'return_format' => 'url' ],
            [ 'key' => 'field_port_image_2',     'label' => 'Gallery Image 2',    'name' => 'image_2',      'type' => 'image', 'return_format' => 'url' ],
            [ 'key' => 'field_port_image_3',     'label' => 'Gallery Image 3',    'name' => 'image_3',      'type' => 'image', 'return_format' => 'url' ],
            [ 'key' => 'field_port_image_4',     'label' => 'Gallery Image 4',    'name' => 'image_4',      'type' => 'image', 'return_format' => 'url' ],
            [ 'key' => 'field_port_description', 'label' => 'აღწერა',             'name' => 'description',  'type' => 'textarea', 'rows' => 4 ],
            [ 'key' => 'field_port_results',     'label' => 'შედეგები (ერთი სტრიქონი = ერთი ელემენტი)', 'name' => 'results', 'type' => 'textarea', 'rows' => 4 ],
            [ 'key' => 'field_port_website',     'label' => 'ვებგვერდი',          'name' => 'website',      'type' => 'url' ],
        ],
        'location' => [
            [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'portfolio' ] ],
        ],
        'active' => true,
    ] );

    /* ──────────────────────────────────────────────────────────────────
       B. SERVICE  (8 services: სტრატეგია, ბრენდინგი, შეფუთვა,
                    სოც. მედია, SEO, ვებგვერდი, აპლიკაცია, გაციფრულება)
    ────────────────────────────────────────────────────────────────── */
    acf_add_local_field_group( [
        'key'          => 'group_shindi_service',
        'title'        => 'სერვისის ველები',
        'show_in_rest' => 1,
        'fields' => [
            [
                'key'          => 'field_svc_num',
                'label'        => 'ნომერი',
                'name'         => 'service_num',
                'type'         => 'text',
                'instructions' => 'მაგ: 01, 02 … 08',
                'wrapper'      => [ 'width' => '20' ],
            ],
            [
                'key'          => 'field_svc_slug',
                'label'        => 'Slug',
                'name'         => 'service_slug',
                'type'         => 'text',
                'instructions' => 'მაგ: strategia · branding · sheputva · social-media · seo · website · app · digitalizacia',
                'wrapper'      => [ 'width' => '40' ],
            ],
            [
                'key'     => 'field_svc_emoji',
                'label'   => 'ემოჯი',
                'name'    => 'emoji',
                'type'    => 'text',
                'wrapper' => [ 'width' => '20' ],
            ],
            [
                'key'   => 'field_svc_short_desc',
                'label' => 'მოკლე აღწერა (hero sub-title)',
                'name'  => 'short_desc',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_svc_meta_desc',
                'label' => 'Meta Description',
                'name'  => 'meta_desc',
                'type'  => 'textarea',
                'rows'  => 2,
            ],
            [
                'key'          => 'field_svc_long_desc',
                'label'        => 'სრული აღწერა',
                'name'         => 'long_desc',
                'type'         => 'textarea',
                'rows'         => 12,
                'instructions' => 'გამოიყენეთ \\n\\n ბლოკების გამოყოფისთვის. პირველი სტრიქონი = h3, დანარჩენი სია. "სახელი: ..." = bullet.',
            ],
            /* Deliverables — one item per line */
            [
                'key'          => 'field_svc_deliverables',
                'label'        => 'დელივერებლები (ერთი სტრიქონი = ერთი ელემენტი)',
                'name'         => 'deliverables',
                'type'         => 'textarea',
                'rows'         => 6,
                'instructions' => "მაგ:\nბრენდის სტრატეგია\nლოგო და ბრენდბუქი\nვიზიტური ბარათები",
            ],
            /* Portfolio items repeater */
            [
                'key'          => 'field_svc_portfolio_items',
                'label'        => 'პორტფოლიო ელემენტები (4)',
                'name'         => 'portfolio_items',
                'type'         => 'repeater',
                'layout'       => 'block',
                'button_label' => '+ ელემენტი',
                'sub_fields'   => [
                    [
                        'key'     => 'field_svc_port_img',
                        'label'   => 'სურათი (URL)',
                        'name'    => 'img',
                        'type'    => 'url',
                        'wrapper' => [ 'width' => '55' ],
                    ],
                    [
                        'key'     => 'field_svc_port_name',
                        'label'   => 'სახელი / სათაური',
                        'name'    => 'name',
                        'type'    => 'text',
                        'wrapper' => [ 'width' => '70' ],
                    ],
                ],
            ],
            /* FAQ — question and answer separated by blank line */
            [
                'key'          => 'field_svc_faq',
                'label'        => 'FAQ (კითხვა-პასუხი)',
                'name'         => 'faq',
                'type'         => 'textarea',
                'rows'         => 12,
                'instructions' => "თითოეული FAQ ბლოკი: პირველი სტრიქონი = კითხვა, მეორე სტრიქონი = პასუხი. ბლოკებს შორის ცარიელი სტრიქონი.\n\nმაგ:\nრა ღირს ბრენდინგი?\nფასი დამოკიდებულია პროექტის სირთულეზე. გაგვიკავშირდით შეფასებისთვის.\n\nრამდენ ხანს გრძელდება პროექტი?\nსაშუალოდ 3-6 კვირა, მოცულობის მიხედვით.",
            ],
        ],
        'location' => [
            [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'service' ] ],
        ],
        'active' => true,
    ] );

    /* ──────────────────────────────────────────────────────────────────
       C. BLOG  — added to the native WordPress "post" post type.
          Featured image → WP featured media.
          Date, excerpt → WP built-in fields.
    ────────────────────────────────────────────────────────────────── */
    acf_add_local_field_group( [
        'key'          => 'group_shindi_blog',
        'title'        => 'ბლოგ სტატიის ველები',
        'show_in_rest' => 1,
        'fields' => [
            [
                'key'          => 'field_blog_cat_label',
                'label'        => 'კატეგორიის ლეიბლი',
                'name'         => 'cat_label',
                'type'         => 'text',
                'instructions' => 'მაგ: სტრატეგია, ბრენდინგი, SEO / SEM',
                'wrapper'      => [ 'width' => '50' ],
            ],
            [
                'key'          => 'field_blog_read_time',
                'label'        => 'კითხვის დრო',
                'name'         => 'read_time',
                'type'         => 'text',
                'instructions' => 'მაგ: 6 წთ',
                'wrapper'      => [ 'width' => '25' ],
            ],
            [
                'key'     => 'field_blog_author_name',
                'label'   => 'ავტორი (სახელი)',
                'name'    => 'author_name',
                'type'    => 'text',
                'wrapper' => [ 'width' => '50' ],
            ],
            [
                'key'          => 'field_blog_author_role',
                'label'        => 'ავტორის პოზიცია',
                'name'         => 'author_role',
                'type'         => 'text',
                'instructions' => 'მაგ: CEO & სტრატეგი',
                'wrapper'      => [ 'width' => '50' ],
            ],
            [
                'key'   => 'field_blog_intro',
                'label' => 'შესავალი (intro)',
                'name'  => 'intro',
                'type'  => 'textarea',
                'rows'  => 3,
            ],
            [
                'key'          => 'field_blog_body_paragraphs',
                'label'        => 'სტატიის ტექსტი — პარაგრაფები',
                'name'         => 'body_paragraphs',
                'type'         => 'repeater',
                'layout'       => 'block',
                'button_label' => '+ პარაგრაფი',
                'sub_fields'   => [
                    [
                        'key'   => 'field_blog_para',
                        'label' => 'პარაგრაფი',
                        'name'  => 'paragraph',
                        'type'  => 'textarea',
                        'rows'  => 5,
                    ],
                ],
            ],
            [
                'key'          => 'field_blog_tags',
                'label'        => 'ტეგები (მძიმეებით)',
                'name'         => 'tags',
                'type'         => 'text',
                'instructions' => 'მაგ: SEO, ბათუმი, სტრატეგია',
            ],
        ],
        'location' => [
            [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'post' ] ],
        ],
        'active' => true,
    ] );

    /* ──────────────────────────────────────────────────────────────────
       D. TESTIMONIAL  (index.html slider — 3 entries)
    ────────────────────────────────────────────────────────────────── */
    acf_add_local_field_group( [
        'key'          => 'group_shindi_testimonial',
        'title'        => 'გამოხმაურების ველები',
        'show_in_rest' => 1,
        'fields' => [
            [
                'key'   => 'field_test_company',
                'label' => 'კომპანია',
                'name'  => 'client_company',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_test_quote',
                'label' => 'ციტატა',
                'name'  => 'quote',
                'type'  => 'textarea',
                'rows'  => 4,
            ],
            [
                'key'     => 'field_test_author_name',
                'label'   => 'ავტორი (სახელი)',
                'name'    => 'author_name',
                'type'    => 'text',
                'wrapper' => [ 'width' => '50' ],
            ],
            [
                'key'     => 'field_test_author_role',
                'label'   => 'ავტორის პოზიცია',
                'name'    => 'author_role',
                'type'    => 'text',
                'wrapper' => [ 'width' => '50' ],
            ],
            [
                'key'           => 'field_test_card_color',
                'label'         => 'ბარათის ფერი',
                'name'          => 'card_color',
                'type'          => 'select',
                'choices'       => [
                    'pink'  => 'ვარდისფერი (pink)',
                    'blue'  => 'ლურჯი (blue)',
                    'green' => 'მწვანე (green)',
                ],
                'default_value' => 'blue',
                'wrapper'       => [ 'width' => '35' ],
            ],
            [
                'key'           => 'field_test_order',
                'label'         => 'რიგი (1 = პირველი)',
                'name'          => 'display_order',
                'type'          => 'number',
                'default_value' => 1,
                'min'           => 1,
                'wrapper'       => [ 'width' => '25' ],
            ],
        ],
        'location' => [
            [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'testimonial' ] ],
        ],
        'active' => true,
    ] );

    /* ──────────────────────────────────────────────────────────────────
       E. TEAM MEMBER  (about.html — founders + team grid)
    ────────────────────────────────────────────────────────────────── */
    acf_add_local_field_group( [
        'key'          => 'group_shindi_team',
        'title'        => 'გუნდის წევრის ველები',
        'show_in_rest' => 1,
        'fields' => [
            [
                'key'          => 'field_team_role',
                'label'        => 'პოზიცია',
                'name'         => 'role',
                'type'         => 'text',
                'instructions' => 'მაგ: Co-founder & CEO, SMM მენეჯერი',
            ],
            [
                'key'   => 'field_team_photo',
                'label' => 'ფოტო (URL)',
                'name'  => 'photo',
                'type'  => 'url',
            ],
            [
                'key'           => 'field_team_is_founder',
                'label'         => 'დამფუძნებელი?',
                'name'          => 'is_founder',
                'type'          => 'true_false',
                'default_value' => 0,
                'ui'            => 1,
                'instructions'  => 'ჩართვისას ბარათი ჩნდება "დამფუძნებლები" სექციაში',
                'wrapper'       => [ 'width' => '30' ],
            ],
            [
                'key'           => 'field_team_order',
                'label'         => 'რიგი (ჩვენების თანმიმდევრობა)',
                'name'          => 'order',
                'type'          => 'number',
                'default_value' => 10,
                'min'           => 1,
                'wrapper'       => [ 'width' => '30' ],
            ],
        ],
        'location' => [
            [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'team_member' ] ],
        ],
        'active' => true,
    ] );

    /* ──────────────────────────────────────────────────────────────────
       F. HOMEPAGE SETTINGS  (singleton — one post manages all sections)
    ────────────────────────────────────────────────────────────────── */
    acf_add_local_field_group( [
        'key'          => 'group_shindi_homepage',
        'title'        => 'მთავარი გვერდის პარამეტრები',
        'show_in_rest' => 1,
        'fields' => [
            /* ── Hero text ── */
            [
                'key'          => 'field_home_hero_line1',
                'label'        => 'Hero — სტრიქონი 1',
                'name'         => 'hero_line_1',
                'type'         => 'text',
                'instructions' => 'მაგ: ჩვენ ვქმნით ბიზნესს',
                'wrapper'      => [ 'width' => '50' ],
            ],
            [
                'key'          => 'field_home_hero_line2',
                'label'        => 'Hero — სტრიქონი 2',
                'name'         => 'hero_line_2',
                'type'         => 'text',
                'instructions' => 'მაგ: მომავლისთვის',
                'wrapper'      => [ 'width' => '50' ],
            ],
            [
                'key'          => 'field_home_hero_line3',
                'label'        => 'Hero — სიტყვები (typewriter, ერთი სტრიქონი = ერთი სიტყვა)',
                'name'         => 'hero_line_3_words',
                'type'         => 'textarea',
                'rows'         => 4,
                'instructions' => "თითოეული სიტყვა ახალ სტრიქონზე. მაგ:\nAI აგენტების\nადამიანების\nბრენდების",
                'wrapper'      => [ 'width' => '50' ],
            ],
            [
                'key'          => 'field_home_hero_line4',
                'label'        => 'Hero — სტრიქონი 4 (sub-description)',
                'name'         => 'hero_line_4',
                'type'         => 'text',
                'instructions' => 'მაგ: — შინდის გუნდი',
                'wrapper'      => [ 'width' => '50' ],
            ],
            /* ── Hero images (one URL per line) ── */
            [
                'key'          => 'field_home_hero_imgs',
                'label'        => 'Hero სლაიდ-სურათები',
                'name'         => 'hero_images',
                'type'         => 'textarea',
                'rows'         => 8,
                'instructions' => 'ყოველ სტრიქონზე ერთი სურათის URL. ატვირთეთ სურათი Media Library-ში, დააკოპირეთ ბმული და ჩასვით აქ. მინ. 3, მაქს. 20.',
            ],
            /* ── Stats section ── */
            [
                'key'          => 'field_home_stat_desc',
                'label'        => 'სტატისტიკა — მოკლე აღწერა',
                'name'         => 'stat_description',
                'type'         => 'text',
                'instructions' => 'მაგ: ვმუშაობთ კომპანიებთან, რომლებსაც სჯერათ ხვალის',
            ],
            [
                'key'          => 'field_home_stat_year',
                'label'        => 'დაარსების წელი',
                'name'         => 'stat_year',
                'type'         => 'text',
                'instructions' => 'მაგ: 2019',
                'wrapper'      => [ 'width' => '25' ],
            ],
            [
                'key'          => 'field_home_stat_year_label',
                'label'        => 'წლის ლეიბლი',
                'name'         => 'stat_year_label',
                'type'         => 'text',
                'instructions' => 'მაგ: დაარსდა',
                'wrapper'      => [ 'width' => '35' ],
            ],
            [
                'key'          => 'field_home_stat_count1',
                'label'        => 'კოუნტერი 1 (რიცხვი)',
                'name'         => 'stat_count_1',
                'type'         => 'number',
                'instructions' => 'მაგ: 120',
                'wrapper'      => [ 'width' => '20' ],
            ],
            [
                'key'          => 'field_home_stat_count1_label',
                'label'        => 'კოუნტერი 1 — ლეიბლი',
                'name'         => 'stat_count_1_label',
                'type'         => 'text',
                'instructions' => 'მაგ: + პროექტი',
                'wrapper'      => [ 'width' => '40' ],
            ],
            [
                'key'          => 'field_home_stat_count2',
                'label'        => 'კოუნტერი 2 (რიცხვი)',
                'name'         => 'stat_count_2',
                'type'         => 'number',
                'instructions' => 'მაგ: 60',
                'wrapper'      => [ 'width' => '20' ],
            ],
            [
                'key'          => 'field_home_stat_count2_label',
                'label'        => 'კოუნტერი 2 — ლეიბლი',
                'name'         => 'stat_count_2_label',
                'type'         => 'text',
                'instructions' => 'მაგ: + კლიენტი',
                'wrapper'      => [ 'width' => '40' ],
            ],
            /* ── Services page hero ── */
            [
                'key'          => 'field_home_svc_before',
                'label'        => 'სერვისები — სათაური (typewriter-მდე)',
                'name'         => 'services_hero_before',
                'type'         => 'text',
                'instructions' => 'მაგ: ციფრული',
                'wrapper'      => [ 'width' => '50' ],
            ],
            [
                'key'          => 'field_home_svc_after',
                'label'        => 'სერვისები — სათაური (typewriter-ის შემდეგ)',
                'name'         => 'services_hero_after',
                'type'         => 'text',
                'instructions' => 'მაგ: თქვენი ბიზნესისთვის',
                'wrapper'      => [ 'width' => '50' ],
            ],
            [
                'key'          => 'field_home_svc_words',
                'label'        => 'სერვისები — typewriter სიტყვები (ერთი სტრიქონი = ერთი სიტყვა)',
                'name'         => 'services_hero_words',
                'type'         => 'textarea',
                'rows'         => 4,
                'instructions' => "მაგ:\nტრანსფორმაცია\nწარმატება\nგანვითარება\nზრდა",
            ],
            [
                'key'          => 'field_home_svc_desc',
                'label'        => 'სერვისები — ქვე-სათაური (description)',
                'name'         => 'services_hero_desc',
                'type'         => 'text',
                'instructions' => 'მაგ: გაზარდეთ თქვენი ბიზნესის შესაძლებლობები',
            ],
            /* ── Portfolio page hero ── */
            [
                'key'          => 'field_home_port_before',
                'label'        => 'ნამუშევრები — სათაური (წითელ სიტყვამდე)',
                'name'         => 'portfolio_hero_before',
                'type'         => 'text',
                'instructions' => 'მაგ: ჩვენი',
                'wrapper'      => [ 'width' => '40' ],
            ],
            [
                'key'          => 'field_home_port_highlight',
                'label'        => 'ნამუშევრები — typewriter სიტყვები (ერთი სტრიქონი = ერთი სიტყვა)',
                'name'         => 'portfolio_hero_highlight',
                'type'         => 'textarea',
                'rows'         => 4,
                'instructions' => "მაგ:\nნამუშევრები\nპროექტები\nშედეგები",
            ],
            [
                'key'          => 'field_home_port_desc',
                'label'        => 'ნამუშევრები — ქვე-სათაური (description)',
                'name'         => 'portfolio_hero_desc',
                'type'         => 'text',
                'instructions' => 'მაგ: 500+ წარმატებული პროექტი - სტრატეგია, ბრენდინგი, SMM, SEO, ვებგვერდი, ტარგეტირება.',
            ],
            /* ── Blog page hero ── */
            [
                'key'          => 'field_home_blog_before',
                'label'        => 'ბლოგი — სათაური (typewriter-მდე)',
                'name'         => 'blog_hero_before',
                'type'         => 'text',
                'instructions' => 'მაგ: გაეცანით',
                'wrapper'      => [ 'width' => '40' ],
            ],
            [
                'key'          => 'field_home_blog_words',
                'label'        => 'ბლოგი — typewriter სიტყვები (ერთი სტრიქონი = ერთი სიტყვა)',
                'name'         => 'blog_hero_words',
                'type'         => 'textarea',
                'rows'         => 4,
                'instructions' => "თითოეული სიტყვა ახალ სტრიქონზე. მაგ:\nსიახლეებს\nტენდენციებს\nრჩევებს\nსტატიებს",
                'wrapper'      => [ 'width' => '60' ],
            ],
        ],
        'location' => [
            [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'homepage' ] ],
        ],
        'active' => true,
    ] );

    /* ──────────────────────────────────────────────────────────────────
       G. ABOUT PAGE SETTINGS  (singleton — one post manages all sections)
    ────────────────────────────────────────────────────────────────── */
    acf_add_local_field_group( [
        'key'          => 'group_shindi_aboutpage',
        'title'        => 'ჩვენ შესახებ — გვერდის პარამეტრები',
        'show_in_rest' => 1,
        'fields' => [
            /* ── Hero ── */
            [
                'key'          => 'field_abt_hero_tag',
                'label'        => 'Hero — ტეგი',
                'name'         => 'hero_tag',
                'type'         => 'text',
                'instructions' => 'მაგ: ჩვენ შესახებ',
                'wrapper'      => [ 'width' => '40' ],
            ],
            [
                'key'          => 'field_abt_hero_before',
                'label'        => 'Hero — სათაური (წითელ სიტყვამდე)',
                'name'         => 'hero_title_before',
                'type'         => 'text',
                'instructions' => 'მაგ: 11 წელი',
                'wrapper'      => [ 'width' => '30' ],
            ],
            [
                'key'          => 'field_abt_hero_word',
                'label'        => 'Hero — წითელი სიტყვები (ერთი სტრიქონი = ერთი სიტყვა/ფრაზა)',
                'name'         => 'hero_title_word',
                'type'         => 'textarea',
                'rows'         => 5,
                'instructions' => "თითოეული სიტყვა ან ფრაზა ახალ სტრიქონზე. მაგ:\nბაზარზე\nმარკეტინგში\nბათუმში\nთქვენს გვერდით",
                'wrapper'      => [ 'width' => '60' ],
            ],
            [
                'key'          => 'field_abt_stat1_num',
                'label'        => 'სტატისტიკა 1 — რიცხვი',
                'name'         => 'stat_1_num',
                'type'         => 'text',
                'instructions' => 'მაგ: 2015',
                'wrapper'      => [ 'width' => '25' ],
            ],
            [
                'key'          => 'field_abt_stat1_label',
                'label'        => 'სტატისტიკა 1 — ლეიბლი',
                'name'         => 'stat_1_label',
                'type'         => 'text',
                'instructions' => 'მაგ: წლიდან ბაზარზე',
                'wrapper'      => [ 'width' => '40' ],
            ],
            [
                'key'          => 'field_abt_stat2_num',
                'label'        => 'სტატისტიკა 2 — რიცხვი',
                'name'         => 'stat_2_num',
                'type'         => 'text',
                'instructions' => 'მაგ: 500+',
                'wrapper'      => [ 'width' => '25' ],
            ],
            [
                'key'          => 'field_abt_stat2_label',
                'label'        => 'სტატისტიკა 2 — ლეიბლი',
                'name'         => 'stat_2_label',
                'type'         => 'text',
                'instructions' => 'მაგ: წარმატებული პროექტი',
                'wrapper'      => [ 'width' => '40' ],
            ],
            [
                'key'          => 'field_abt_stat3_num',
                'label'        => 'სტატისტიკა 3 — რიცხვი',
                'name'         => 'stat_3_num',
                'type'         => 'text',
                'instructions' => 'მაგ: 100+',
                'wrapper'      => [ 'width' => '25' ],
            ],
            [
                'key'          => 'field_abt_stat3_label',
                'label'        => 'სტატისტიკა 3 — ლეიბლი',
                'name'         => 'stat_3_label',
                'type'         => 'text',
                'instructions' => 'მაგ: ბრენდის გვერდით',
                'wrapper'      => [ 'width' => '40' ],
            ],
            /* ── Story ── */
            [
                'key'          => 'field_abt_story_label',
                'label'        => 'ისტორია — სექციის ლეიბლი',
                'name'         => 'story_label',
                'type'         => 'text',
                'instructions' => 'მაგ: შინდის ისტორია',
                'wrapper'      => [ 'width' => '50' ],
            ],
            [
                'key'   => 'field_abt_story_para1',
                'label' => 'ისტორია — პარაგრაფი 1',
                'name'  => 'story_para_1',
                'type'  => 'textarea',
                'rows'  => 4,
            ],
            [
                'key'   => 'field_abt_story_para2',
                'label' => 'ისტორია — პარაგრაფი 2',
                'name'  => 'story_para_2',
                'type'  => 'textarea',
                'rows'  => 4,
            ],
            [
                'key'          => 'field_abt_quote_text',
                'label'        => 'ციტატა',
                'name'         => 'quote_text',
                'type'         => 'text',
                'instructions' => 'მაგ: საუკეთესო რეკლამა კმაყოფილი კლიენტია.',
            ],
            [
                'key'          => 'field_abt_quote_cite',
                'label'        => 'ციტატის წყარო',
                'name'         => 'quote_cite',
                'type'         => 'text',
                'instructions' => 'მაგ: — შინდის ფილოსოფია',
                'wrapper'      => [ 'width' => '50' ],
            ],
            [
                'key'          => 'field_abt_timeline',
                'label'        => 'ქრონოლოგია (ფორმატი: წელი|აღწერა, ერთი სტრიქონი = ერთი ჩანაწერი)',
                'name'         => 'timeline',
                'type'         => 'textarea',
                'rows'         => 8,
                'instructions' => "ბოლო ჩანაწერი ავტომატურად ხდება \"დღეს\" სტილით.\nმაგ:\n2015|დაარსება · პირველი დამკვეთი · ბათუმი\n2017|30+ პროექტი · სახელმწიფო და კერძო სექტორი\n2019|100+ პროექტი · ბრენდინგი, ვებგვერდი\n2022|250+ კლიენტი · ახალი ოფისი · გუნდის გაზრდა\nდღეს|500+ პროექტი · AI მარკეტინგი · ახალი მიზნები",
            ],
            /* ── Founders section labels ── */
            [
                'key'          => 'field_abt_founders_label',
                'label'        => 'დამფუძნებლები — სექციის ლეიბლი',
                'name'         => 'founders_label',
                'type'         => 'text',
                'instructions' => 'მაგ: გუნდი',
                'wrapper'      => [ 'width' => '33' ],
            ],
            [
                'key'          => 'field_abt_founders_title',
                'label'        => 'დამფუძნებლები — სათაური',
                'name'         => 'founders_title',
                'type'         => 'text',
                'instructions' => 'მაგ: დამფუძნებლები',
                'wrapper'      => [ 'width' => '33' ],
            ],
            [
                'key'          => 'field_abt_founders_sub',
                'label'        => 'დამფუძნებლები — ქვე-სათაური',
                'name'         => 'founders_sub',
                'type'         => 'text',
                'instructions' => 'მაგ: ერთი ხედვა, საერთო ღირებულება.',
                'wrapper'      => [ 'width' => '33' ],
            ],
            /* ── Team section labels ── */
            [
                'key'          => 'field_abt_team_label',
                'label'        => 'გუნდი — სექციის ლეიბლი',
                'name'         => 'team_label',
                'type'         => 'text',
                'instructions' => 'მაგ: ჩვენი გუნდი',
                'wrapper'      => [ 'width' => '33' ],
            ],
            [
                'key'          => 'field_abt_team_title1',
                'label'        => 'გუნდი — სათაური, სტრიქონი 1',
                'name'         => 'team_title_1',
                'type'         => 'text',
                'instructions' => 'მაგ: ერთი გუნდი.',
                'wrapper'      => [ 'width' => '33' ],
            ],
            [
                'key'          => 'field_abt_team_title2',
                'label'        => 'გუნდი — სათაური, სტრიქონი 2',
                'name'         => 'team_title_2',
                'type'         => 'text',
                'instructions' => 'მაგ: საერთო მიზანი.',
                'wrapper'      => [ 'width' => '33' ],
            ],
            /* ── Career section labels ── */
            [
                'key'          => 'field_abt_career_label',
                'label'        => 'კარიერა — სექციის ლეიბლი',
                'name'         => 'career_label',
                'type'         => 'text',
                'instructions' => 'მაგ: კარიერა',
                'wrapper'      => [ 'width' => '25' ],
            ],
            [
                'key'          => 'field_abt_career_title_main',
                'label'        => 'კარიერა — სათაური (სტრიქონი 1)',
                'name'         => 'career_title_main',
                'type'         => 'text',
                'instructions' => 'მაგ: შემოგვიერთდი',
                'wrapper'      => [ 'width' => '35' ],
            ],
            [
                'key'          => 'field_abt_career_title_word',
                'label'        => 'კარიერა — წითელი სიტყვა (სტრიქონი 2)',
                'name'         => 'career_title_word',
                'type'         => 'text',
                'instructions' => 'მაგ: შინდში',
                'wrapper'      => [ 'width' => '25' ],
            ],
            [
                'key'          => 'field_abt_career_sub',
                'label'        => 'კარიერა — ქვე-სათაური',
                'name'         => 'career_sub',
                'type'         => 'text',
                'instructions' => 'მაგ: შეავსე ფორმა და დაელოდე ჩვენი გუნდის ზარს',
            ],
        ],
        'location' => [
            [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'aboutpage' ] ],
        ],
        'active' => true,
    ] );

    /* ──────────────────────────────────────────────────────────────────
       H. PARTNER LOGO  (index.html — infinite-scroll logo strip)
    ────────────────────────────────────────────────────────────────── */
    acf_add_local_field_group( [
        'key'          => 'group_shindi_partner',
        'title'        => 'პარტნიორის ველები',
        'show_in_rest' => 1,
        'fields' => [
            [
                'key'           => 'field_part_logo',
                'label'         => 'ლოგო',
                'name'          => 'logo',
                'type'          => 'image',
                'return_format' => 'url',
                'preview_size'  => 'thumbnail',
                'instructions'  => 'PNG/SVG, გამჭვირვალე ფონი სასურველია',
            ],
            [
                'key'          => 'field_part_link',
                'label'        => 'ვებგვერდი (სურვილისამებრ)',
                'name'         => 'link',
                'type'         => 'url',
            ],
            [
                'key'           => 'field_part_order',
                'label'         => 'რიგი (ჩვენების თანმიმდევრობა)',
                'name'          => 'order',
                'type'          => 'number',
                'default_value' => 10,
                'min'           => 1,
                'wrapper'       => [ 'width' => '30' ],
            ],
        ],
        'location' => [
            [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'partner' ] ],
        ],
        'active' => true,
    ] );
}

/* ═══════════════════════════════════════════════════════════════════════
   3. ENSURE ACF DATA IS INCLUDED IN REST API RESPONSES
   Adds ?acf_format=standard support and exposes ACF fields automatically.
   ═══════════════════════════════════════════════════════════════════════ */

add_filter( 'acf/settings/rest_api_format', function () {
    return 'standard';
} );

/* ═══════════════════════════════════════════════════════════════════════
   4. CUSTOM REST ENDPOINT  —  shindi/v1/acf/{id}
   Uses update_field() so ALL ACF field types (repeaters, select, etc.)
   save correctly. Accepts a JSON body of { field_name: value, … }.
   Auth: WordPress Application Passwords (Basic Auth).
   ═══════════════════════════════════════════════════════════════════════ */

add_action( 'rest_api_init', function () {
    register_rest_route( 'shindi/v1', '/acf/(?P<id>\d+)', [
        'methods'             => WP_REST_Server::CREATABLE,
        'callback'            => 'shindi_update_acf_fields',
        'permission_callback' => function () {
            return current_user_can( 'edit_posts' );
        },
        'args' => [
            'id' => [ 'validate_callback' => function ( $v ) { return is_numeric( $v ); } ],
        ],
    ] );
} );

/**
 * Write ACF-format post meta for a repeater field.
 * Writes:  field_name = count
 *          _field_name = field_key
 *          field_name_{i}_{sub} = value
 *          _field_name_{i}_{sub} = sub_key
 *
 * @param int    $post_id
 * @param string $field_name  e.g. "deliverables"
 * @param string $field_key   e.g. "field_svc_deliverables"
 * @param array  $rows        array of associative arrays
 * @param array  $sub_map     [ sub_name => sub_key ]
 */
function shindi_save_repeater( $post_id, $field_name, $field_key, $rows, $sub_map ) {
    if ( ! is_array( $rows ) ) return;
    update_post_meta( $post_id, $field_name,         count( $rows ) );
    update_post_meta( $post_id, '_' . $field_name,   $field_key );
    foreach ( $rows as $i => $row ) {
        foreach ( $sub_map as $sub_name => $sub_key ) {
            $mk = "{$field_name}_{$i}_{$sub_name}";
            update_post_meta( $post_id, $mk,         $row[ $sub_name ] ?? '' );
            update_post_meta( $post_id, '_' . $mk,   $sub_key );
        }
    }
}

function shindi_update_acf_fields( WP_REST_Request $request ) {
    $post_id = (int) $request->get_param( 'id' );
    $data    = $request->get_json_params();

    if ( ! $data || ! is_array( $data ) ) {
        return new WP_Error( 'no_data', 'No ACF data provided.', [ 'status' => 400 ] );
    }

    /* ── Repeater definitions: field_name => [ field_key, sub_map ] ── */
    $repeaters = [
        'body_paragraphs' => [ 'field_blog_body_paragraphs', [ 'paragraph' => 'field_blog_para' ] ],
    ];

    $saved = [];
    foreach ( $data as $field_name => $value ) {
        if ( isset( $repeaters[ $field_name ] ) ) {
            [ $fkey, $sub_map ] = $repeaters[ $field_name ];
            shindi_save_repeater( $post_id, $field_name, $fkey, $value, $sub_map );
            $saved[] = $field_name . '(repeater)';
        } else {
            /* Simple field — use update_field by field key if it looks like one,
               otherwise fall back to update_post_meta by name */
            if ( str_starts_with( $field_name, 'field_' ) ) {
                update_field( $field_name, $value, $post_id );
            } else {
                update_post_meta( $post_id, $field_name, $value );
            }
            $saved[] = $field_name;
        }
    }

    return rest_ensure_response( [
        'success' => true,
        'post_id' => $post_id,
        'updated' => $saved,
    ] );
}

/* ═══════════════════════════════════════════════════════════════════════
   5. LEAD FORM ENDPOINT  —  shindi/v1/lead
   Receives all text-only lead forms (hire, gift, contact, quiz).
   Field "form_type" identifies the source. No file handling.
   ═══════════════════════════════════════════════════════════════════════ */

add_action( 'rest_api_init', function () {
    register_rest_route( 'shindi/v1', '/lead', [
        'methods'             => WP_REST_Server::CREATABLE,
        'callback'            => 'shindi_lead_form_handler',
        'permission_callback' => '__return_true',
    ] );
} );

function shindi_lead_form_handler( WP_REST_Request $request ) {

    /* Honeypot */
    if ( ! empty( $request->get_param( '_hp' ) ) ) {
        return rest_ensure_response( [ 'success' => true ] );
    }

    $type        = sanitize_text_field( $request->get_param( 'form_type' )   ?? 'lead' );
    $name        = sanitize_text_field( $request->get_param( 'name' )        ?? '' );
    $phone       = sanitize_text_field( $request->get_param( 'phone' )       ?? '' );
    $email       = sanitize_email(      $request->get_param( 'email' )       ?? '' );
    $service     = sanitize_text_field( $request->get_param( 'service' )     ?? '' );
    $website     = esc_url_raw(         $request->get_param( 'website' )     ?? '' );
    $revenue     = sanitize_text_field( $request->get_param( 'revenue' )     ?? '' );
    $message     = sanitize_textarea_field( $request->get_param( 'message' ) ?? '' );
    $sector      = sanitize_text_field( $request->get_param( 'sector' )      ?? '' );
    $company     = sanitize_text_field( $request->get_param( 'company' )     ?? '' );
    $expectation = sanitize_text_field( $request->get_param( 'expectation' ) ?? '' );

    $subjects = [
        'hire'      => 'გაგვესაუბრეთ — Shindi.ge',
        'gift'      => 'დაფინანსების მოთხოვნა — Shindi.ge',
        'contact'   => 'შეკითხვა — Shindi.ge',
        'quiz'      => 'კვიზის განაცხადი — Shindi.ge',
        'service'   => 'სერვის ლიდი — Shindi.ge',
        'portfolio' => 'პორტფოლიო ლიდი — Shindi.ge',
        'callback'  => 'ზარის მოთხოვნა — Shindi.ge',
    ];
    $subject = $subjects[ $type ] ?? 'შეკითხვა — Shindi.ge';

    $lines = [];
    if ( $name )        $lines[] = 'სახელი      : ' . $name;
    if ( $phone )       $lines[] = 'ტელეფონი    : ' . $phone;
    if ( $email )       $lines[] = 'ელ-ფოსტა    : ' . $email;
    if ( $service )     $lines[] = 'სერვისი     : ' . $service;
    if ( $website )     $lines[] = 'ვებ/Facebook : ' . $website;
    if ( $revenue )     $lines[] = 'ბრუნვა      : ' . $revenue;
    if ( $sector )      $lines[] = 'სფერო       : ' . $sector;
    if ( $company )     $lines[] = 'კომპანია    : ' . $company;
    if ( $expectation ) $lines[] = 'მოლოდინი    : ' . $expectation;
    if ( $message )     $lines[] = "\nშეტყობინება :\n" . $message;

    if ( empty( $lines ) ) {
        return new WP_Error( 'no_data', 'ველები ცარიელია.', [ 'status' => 422 ] );
    }

    $headers = [ 'Content-Type: text/plain; charset=UTF-8' ];
    if ( $email ) $headers[] = 'Reply-To: ' . $email;

    $sent = wp_mail( 'contact@shindi.ge', $subject, implode( "\n", $lines ), $headers );

    if ( $sent ) {
        return rest_ensure_response( [ 'success' => true ] );
    }
    return new WP_Error( 'mail_failed', 'ელ-ფოსტის გაგზავნა ვერ მოხერხდა.', [ 'status' => 500 ] );
}

/* ═══════════════════════════════════════════════════════════════════════
   6. CAREER FORM ENDPOINT  —  shindi/v1/career
   Receives the "შემოგვიერთდი შინდში" form from about.html.
   Accepts multipart/form-data (text fields + optional CV file).
   Sends email with attachment to contact@shindi.ge via wp_mail().
   No authentication required — public form endpoint.
   ═══════════════════════════════════════════════════════════════════════ */

add_action( 'rest_api_init', function () {
    register_rest_route( 'shindi/v1', '/career', [
        'methods'             => WP_REST_Server::CREATABLE,
        'callback'            => 'shindi_career_form_handler',
        'permission_callback' => '__return_true',
    ] );
} );

function shindi_career_form_handler( WP_REST_Request $request ) {

    /* ── Text fields ── */
    $name   = sanitize_text_field( $request->get_param( 'name' )   ?? '' );
    $phone  = sanitize_text_field( $request->get_param( 'phone' )  ?? '' );
    $email  = sanitize_email(      $request->get_param( 'email' )  ?? '' );
    $social = esc_url_raw(         $request->get_param( 'social' ) ?? '' );

    /* Honeypot — bots fill this, humans don't */
    if ( ! empty( $request->get_param( '_hp' ) ) ) {
        return rest_ensure_response( [ 'success' => true ] ); /* fake success to fool bots */
    }

    if ( ! $name || ! $phone ) {
        return new WP_Error( 'missing_fields', 'სახელი და ტელეფონი სავალდებულოა.', [ 'status' => 422 ] );
    }

    /* ── Build email body ── */
    $lines = [
        'სახელი გვარი : ' . $name,
        'ტელეფონი     : ' . $phone,
    ];
    if ( $email  ) $lines[] = 'ელ-ფოსტა      : ' . $email;
    if ( $social ) $lines[] = 'Facebook/LinkedIn: ' . $social;
    $message = implode( "\n", $lines );

    $headers = [ 'Content-Type: text/plain; charset=UTF-8' ];
    if ( $email ) $headers[] = 'Reply-To: ' . $email;

    /* ── Optional file attachment ── */
    $attachments = [];
    $tmp_copy    = '';
    $files       = $request->get_file_params();

    if ( ! empty( $files['resume'] ) && $files['resume']['error'] === UPLOAD_ERR_OK ) {
        $orig = sanitize_file_name( $files['resume']['name'] );
        $ext  = strtolower( pathinfo( $orig, PATHINFO_EXTENSION ) );

        if ( in_array( $ext, [ 'pdf', 'doc', 'docx' ], true ) && $files['resume']['size'] <= 5 * 1024 * 1024 ) {
            /* Copy tmp file with readable name so wp_mail attaches it correctly */
            $tmp_copy = sys_get_temp_dir() . '/shindi_cv_' . time() . '_' . $orig;
            copy( $files['resume']['tmp_name'], $tmp_copy );
            $attachments[] = $tmp_copy;
        }
    }

    /* ── Send ── */
    $sent = wp_mail( 'contact@shindi.ge', 'კარიერის განაცხადი — Shindi.ge', $message, $headers, $attachments );

    /* Clean up temp copy */
    if ( $tmp_copy && file_exists( $tmp_copy ) ) @unlink( $tmp_copy );

    if ( $sent ) {
        return rest_ensure_response( [ 'success' => true ] );
    }

    return new WP_Error( 'mail_failed', 'ელ-ფოსტის გაგზავნა ვერ მოხერხდა.', [ 'status' => 500 ] );
}
