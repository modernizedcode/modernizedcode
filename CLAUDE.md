# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing website for **Modernized Code** (Bharat Hirani's application-modernization consultancy), built with **Eleventy (11ty)** and deployed to Cloudflare Workers. Authored content lives in `src/`; Eleventy compiles it to `_site/`, which Cloudflare serves.

## Commands

```bash
npm install            # install Eleventy + wrangler (no global node_modules before this)
npm run build          # eleventy: src/ -> _site/
npm run dev            # eleventy --serve (local preview with live reload)
npm run preview        # build, then wrangler dev against _site
npm run deploy         # build, then wrangler deploy
```

`_site/` and `node_modules/` are git-ignored — never edit `_site/` by hand. `wrangler.jsonc` `assets.directory` is `_site`, so **you must build before deploying** (the `deploy`/`preview` scripts do this for you).

## Architecture

- **`src/_includes/base.njk`** is the single HTML shell every page inherits via `layout: base.njk`. It owns the `<head>` SEO (title, description, canonical, OpenGraph/Twitter, favicons, fonts), the site-wide JSON-LD graph (Person, ProfessionalService, WebSite), a per-page WebPage + BreadcrumbList block, the header nav, the page hero, and the footer. Change shared chrome here once — not per page.
- **`src/_data/site.js`** is the global data file (`site.*` in templates): canonical `url`, `name`, `author`, default `description`, `ogImage`, the `nav` array, and `social` links. The nav array drives both header and footer; add a page here to add it to navigation.
- **Pages are `src/*.njk`** (`index`, `why`, `services`, `approach`, `about`, `contact`), each with front matter (`title`, `metaTitle`, `description`, `eyebrow`, `lead`, optional `keywords`, optional `structuredData`). Clean URLs are automatic: `services.njk` → `/services/`. The home page (`/`) is detected via `isHome` and renders its own full hero instead of the standard page hero.
- **Per-page structured data**: set the `structuredData` front-matter key (a YAML literal block of raw JSON) and base.njk emits it as an extra `<script type="application/ld+json">`. Used for FAQPage (why), ItemList of Services (services), HowTo (approach), ContactPage (contact).
- **Blog**: posts are markdown in `src/blog/posts/`. `src/blog/posts/posts.json` is the directory data file applying `layout: post.njk`, `tags: post`, and the `/blog/{slug}/` permalink to every post. `src/_includes/post.njk` chains to base.njk, renders the article in `.prose`, and emits BlogPosting JSON-LD. `src/blog/index.njk` lists `collections.posts` (newest-first, defined in `.eleventy.js`).
- **`src/sitemap.njk`** generates `/sitemap.xml` from `collections.all` — new pages and posts appear automatically; no manual editing. `robots.txt` is passed through from `src/`.
- **`.eleventy.js`** wires it together: passthrough copy for `site.css`/`site.js`/`assets`/`robots.txt` (mapped to the output root), the `posts` collection, and filters `startsWith` (active-nav/breadcrumb), `readableDate`, and `isoDate`.

## Conventions that matter

- **Use root-absolute paths** for all internal links and assets (`/site.css`, `/assets/...`, `/why/`). Pages live in subdirectories, so relative paths break.
- **Theming is CSS-variable-driven** in [src/site.css](src/site.css). Light and dark palettes are the canonical **Solarized** scheme (hex values in the CSS header comment) — preserve those exact values. `src/site.js` sets `data-theme` on `<html>` from the OS preference and toggles it; it does **not** persist the choice.
- **Reveal-on-scroll** is opt-in: add the `reveal` class and the IntersectionObserver in `src/site.js` adds `visible` on entry. New animated sections must carry `reveal`.
- **SEO consistency**: every page needs `title`, `description`, and (ideally) a `metaTitle`. base.njk derives canonical/OG/Twitter from those plus `site.url`, so keep front matter accurate. When adding FAQ/services copy, keep the visible content and the `structuredData` JSON in sync.
- **Adding a nav page**: create `src/<name>.njk` with `layout: base.njk` + front matter, then add `{ text, url }` to `nav` in `src/_data/site.js`. The sitemap and active-nav handling pick it up automatically.
- **Adding a blog post**: drop a `.md` file in `src/blog/posts/` with `title`, `description`, and `date` front matter. Everything else (layout, URL, listing, sitemap, JSON-LD) is automatic.
- **Contact form** posts to Web3Forms (`api.web3forms.com/submit`) via the `access_key` hidden input — there is no backend.

## Deployment

Live at https://www.modernizedcode.com/. The origin is hardcoded in `src/_data/site.js` (`url`) and flows into canonical URLs, OG images, JSON-LD, and the sitemap — change it there if the domain moves.
