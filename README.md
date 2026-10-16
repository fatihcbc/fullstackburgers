# Fullstack Burgers

Phase 1: a static Astro website with Dutch and English pages, vanilla CSS and Markdown collections. All copy and artwork are provisional. No React, Tailwind, CMS, database or backend.

## Local development

Use Node.js 22.22+ (Node 22 LTS recommended) and npm.

~~~sh
npm ci
npm run dev
npm run verify
npm run preview
~~~

- `check`: Astro and TypeScript diagnostics (also syncs content schemas).
- `build`: generate static files in `dist/`.
- `verify`: type check, production build, then verify localized output, SEO metadata and local links.
- `preview`: serve the built site locally.

This checkout also has a checksum-verified portable Node runtime under ignored .tools/ for local verification. If Node/npm are not on your Windows PATH, start a PowerShell session in this repository and run:

~~~powershell
$env:Path = "$PWD\.tools\node-v22.23.3-win-x64;$env:Path"
npm run dev
~~~

The portable runtime is local tooling, not part of the tracked project. Other checkouts should install a supported Node version and use npm ci.

Production remains on GitHub Pages from its existing configuration. The root CNAME and public/CNAME remain www.fullstackburgers.nl. Do not merge development into main or change GitHub Pages settings to enable staging.

## Permanent staging on Cloudflare Pages

The shared policy in config/environment.mjs uses DEPLOY_ENV=production (the default) or DEPLOY_ENV=staging. It sets both Astro's site URL and application SEO URLs. Staging uses https://beta.fullstackburgers.nl; production retains https://www.fullstackburgers.nl. Configure DEPLOY_ENV as a process/build environment variable, not in a local .env file. Astro's production build mode does not identify the hosting environment.

Staging adds noindex,nofollow to every HTML page, emits a Cloudflare _headers rule for all responses, omits the sitemap advertisement from robots.txt, and emits an empty sitemap. Crawling remains allowed so search engines can read noindex. The build removes only the output CNAME in staging; both source CNAME files and the production output CNAME are preserved. Production emits no staging _headers file and keeps its existing root/404 indexing policy and ten-page sitemap.

Run npm run verify for the selected environment, or npm run verify:all to check both staging and production plus invalid Cloudflare environment/branch guards. The latter leaves a production build in dist. No new dependencies are needed.

~~~powershell
$env:DEPLOY_ENV = 'staging'
npm run verify
$env:DEPLOY_ENV = 'production'
npm run verify
npm run verify:all
~~~

Manual setup, after deployment authorization:

1. Create a separate Cloudflare **Pages** project using the existing fatihcbc/fullstackburgers GitHub repository. Authorize the Cloudflare GitHub application for this repository only. Project creation can trigger the first deployment.
2. Set this project's production branch to development, enable its automatic deployments, and disable preview-branch deployments. This Cloudflare label does not refer to the live GitHub Pages website. Cloudflare builds fail unless CF_PAGES_BRANCH=development and DEPLOY_ENV=staging.
3. Select Astro, repository root, build command npm run verify, output directory dist, and environment variables DEPLOY_ENV=staging and NODE_VERSION=22.23.3. Cloudflare supplies CF_PAGES and CF_PAGES_BRANCH automatically. No adapter, Wrangler configuration, GitHub Actions workflow, or deployment token is required.
4. Add beta.fullstackburgers.nl under the project's Custom domains. Then add only a beta CNAME at the existing DNS provider, pointing to the assigned project.pages.dev hostname. Keep nameservers and all production DNS records unchanged. Confirm domain activation and HTTPS in Cloudflare.
5. Check the root, ten localized pages, language links, images/styles, direct navigation, real 404 status, beta metadata URLs, and noindex headers on both beta and Pages URLs. Compare production DNS, Pages settings, deployed commit, content/assets, redirects, and SEO against the pre-deployment baseline. Confirm the next development push automatically updates beta.

No Cloudflare project creation or DNS change is performed by these scripts. Indexing directives are not authentication; beta is intended to be publicly accessible but excluded from search results.

## Project structure

~~~text
src/
  assets/          # Place final imported image assets here when supplied
  components/      # Header, footer, media, home sections and collection views
  config/site.ts   # Domain, business configuration and replaceable asset map
  content/         # burgers/, announcements/, events/; each has nl/ and en/
  content.config.ts # Typed collection schemas
  i18n.ts          # Localized routes, interface copy and page metadata
  layouts/         # Shared HTML shell and SEO metadata
  pages/           # Static localized routes, root, 404, sitemap and robots
  styles/          # Mobile-first CSS and custom properties
public/            # Files copied unchanged: CNAME, favicon, temporary SVGs
scripts/verify-build.mjs # Post-build acceptance checks
~~~

## Pages and language policy

| Page | Dutch | English |
| --- | --- | --- |
| Home | /nl/ | /en/ |
| Menu | /nl/menu/ | /en/menu/ |
| About | /nl/over-ons/ | /en/about/ |
| Ingredients | /nl/ingredienten/ | /en/ingredients/ |
| Locations & Events | /nl/locaties-evenementen/ | /en/locations-events/ |

Dutch is the provisional default. The root serves a useful Dutch homepage, canonicalized to /nl/ and marked noindex to avoid a duplicate index entry. No automatic browser-language detection. Language links preserve the corresponding page. Canonicals, reciprocal hreflang (including x-default) and sitemap all share the route map. At launch, a host-level redirect from / to /nl/ can replace the root alias if supported.

## Markdown editing

Add a Markdown file under the appropriate collection and locale directory. Pair translations using the same translationKey. Set draft: true to exclude a burger/event from public views. Set placeholder: false only when content is verified. No prices, supplier claims, dietary guarantees, actual events or business contact details have been invented.

Burgers require locale, translationKey, title and description. Optional fields: order, image, imageAlt, allergens, draft and placeholder. The optional image field is a relative path to a source image (for example ../../../assets/classic.jpg); Astro validates it and supplies image metadata to the responsive image component. Body Markdown renders beneath the summary in menu/home cards. Until confirmed, allergen information is deliberately not presented as complete. Final menu pricing and dietary presentation are later work.

Events share the common fields and add status (unconfirmed/confirmed/cancelled), optional startsAt/endsAt, location and address. Use ISO timestamps with explicit offsets, e.g. 2027-07-01T18:00:00+02:00. Dates are displayed in Europe/Amsterdam. The homepage has an honest unconfirmed next-stop fallback; automatic next-event selection is later work.

### Announcements without daily rebuilds (future phase)

Announcement records have startsAt, endsAt, priority, locale, translationKey, draft and placeholder. Timestamps require offsets and end must follow start. The sample is a draft; there is intentionally no build-time date filtering or public announcement renderer yet.

A static build cannot update its rendered HTML as the date changes. The intended later solution is to emit all published announcement windows into a static JSON asset at build time, then use a small vanilla browser script to select the active localized announcement. This needs no server and no daily rebuild. Content additions or edits still require a build.

Define activation as startsAt <= now < endsAt, use highest priority with a deterministic translationKey tie-break, and re-evaluate at boundaries and on tab visibility changes. Treat Europe/Amsterdam as the editorial timezone; choose +01:00 in winter and +02:00 in summer, rather than the build machine timezone. Add tests around DST changes and midnight. Keep essential contact/location information available in static HTML with JavaScript disabled. Browser time accuracy and the SEO limitations of client-selected messages must be considered before relying on this for time-critical notices.

## Replacing visual placeholders

All temporary artwork is local SVG, with no external image service, font provider, icon library or social embeds. These are illustrative shapes, not final branding. The preview notice, sample badges and image captions make this explicit.

Change the central asset map in src/config/site.ts or the optional burger image/imageAlt frontmatter. Keep layout-independent aspect ratios in Media.astro and CSS. Media.astro wraps Astro Image; for final photographs, put images in src/assets and import their metadata through the central map so Astro can generate optimized output. Extend that component with responsive widths/formats when real photography is available; no page architecture changes are needed. Public SVG files are already small and served unchanged. Eager loading/high fetch priority is reserved for the hero; below-fold imagery is lazy, with explicit dimensions to reserve space.

Current OG artwork is SVG as a temporary local placeholder. Replace it with a 1200×630 JPEG/PNG before launch for broad social-platform compatibility. Replace the text wordmark and favicon with approved designer assets. Video can be introduced behind the same media boundary, with poster artwork and reduced-motion considerations, when provided.

Design tokens for colour, typography, spacing and widths live in src/styles/global.css. System fonts keep this foundation independent of font downloads.

## SEO and launch work

The shared layout supplies unique localized titles/descriptions, canonical URLs, Open Graph fields, language alternatives and minimal FoodEstablishment JSON-LD. Only the business name and existing domain are populated. Add verified address/service model, telephone, hours, social profiles and appropriate business subtype before validating rich-result eligibility. No ratings, opening hours or address are fabricated.

In production, the sitemap lists the ten canonical language pages and robots.txt references it. Staging receives the environment-wide noindex policy described above and an empty, unadvertised sitemap.

Search Console integration is deferred. Later, verify the domain through DNS (preferred) or add the supplied verification tag/file, then submit /sitemap.xml. Do not invent verification tokens.

Before launch: approved brand assets and translations, real menu/allergen data, actual stops, announcement behavior, keyboard/screen-reader and mobile browser QA, final image optimization, measured Core Web Vitals/Lighthouse, structured-data/social validation, and production deployment/rollback configuration. The foundation reserves image space and ships no client JavaScript; performance scores have not been claimed.
