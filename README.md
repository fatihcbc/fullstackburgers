# Fullstack Burgers

Static Astro website for Fullstack Burgers, an Almere-based smash burger food truck, with Dutch and English pages, vanilla CSS and Markdown collections. The menu, prices and regular locations use confirmed business information. No React, Tailwind, CMS, database or backend.

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

Production currently runs on GitHub Pages from main's repository root. Retain its generated files, .nojekyll, root CNAME and public/CNAME unchanged as the rollback site. The approved target is a separate Cloudflare Pages production project building Astro source from main into dist; beta continues building development. No new build output needs to be copied into main's root. Project creation, pushes, DNS cutover and GitHub Pages retirement require separate authorization; this preparation does not deploy anything.

## Brand identity

The official palette is defined in `src/styles/brand.css`: yellow `#FFD000`, black `#0D0802`, and gray `#BEBEBE`. Both existing stylesheets use these shared variables and Roboto as the primary font. Body text uses weight 400, navigation 600, buttons 700, and headings 700–900 according to hierarchy.

Roboto v51 is self-hosted as official Google Fonts WOFF2 files under `public/fonts/roboto/`. Normal and italic variable faces support weights 400–900, with Latin and Latin Extended subsets for Dutch and English. `src/styles/fonts.css` preserves Google's Unicode ranges and uses `font-display: swap`. Only the regular Latin face is preloaded; other subsets/styles load when needed. Arial/Helvetica provide fallbacks. No Google font requests are made at runtime, and no font package dependency is required. The SIL Open Font License and download provenance/checksums are included as `OFL.txt` and `SOURCE.txt`. SVG logo lettering is unchanged; Uni 05_53 is not downloaded or used.

`BrandLogo.astro` references the original `public/media/logo/10x10 cm logo drukwerk.svg` directly, preserving its square canvas, colors, proportions, and outlined lettering. It is used for the header and footer branding, including the retained prototype header. `PixelMascot.astro` displays the original `public/media/pixel/10x10 cm drukwerk.svg` as a small decorative hero accent on both homepage designs. Do not crop, recolor, rewrite, rename, or duplicate these source assets.

## Confirmed business content

The homepage and About page describe Fullstack Burgers as an Almere-based smash burger food truck. The original `public/media/truck-2.png` supplies responsive WebP/JPEG photography without cropping or artwork changes. `public/media/truck-1.jpeg` remains as an unused backup. The original `public/media/posters-01.jpg` is displayed on both menu pages, with an accessible HTML price list and a link to the full-size original. Poster text such as “Grand Opening Specials” is preserved as artwork; no promotion dates or additional dietary claims have been added to website copy.

Published burger records are `single-smash.md`, `double-smash.md` and `triple-smash.md` in each language. Opening burger/combo prices in cents are 795/1095, 995/1295 and 1195/1495 respectively. Future standard burger/combo prices are 895/1295, 1095/1495 and 1295/1695. `OpeningPricesNotice.astro` displays the localized OPENINGSPRIJZEN / OPENING PRICES badge and explains that standard prices apply later. `BurgerGrid.astro` makes opening prices prominent, with smaller gray future standard prices and no strikethrough. This shared presentation appears on the menu, homepage and retro prototype in both languages. The original poster is unchanged. No promotion end date is assumed.

`src/config/business.ts` holds the unchanged sides (fries 350 cents, soft drinks 325 cents), and the regular locations: Sunday in Almere Muziekwijk; Monday at Homerusplein, Almere Poort. Combo means burger + fries + soft drink. No opening times have been supplied. Sunday uses the exact business-supplied directions URL, https://maps.app.goo.gl/EsycCHAQrW5B5s397; Monday uses the exact business-supplied directions URL for Homerusplein, Almere Poort, https://maps.app.goo.gl/9kqmWKQLQ9rSy3kZ9. Shared location buttons say “Route bekijken” / “Get directions” and open a new tab with noopener/noreferrer and location-specific accessible names.

The Ingredients page, navigation item and sections have been removed in both languages. Header/footer links, hreflang and the production sitemap derive from the remaining four-page route map. Existing home, menu, about, location and prototype URLs are preserved. Unconfirmed sample events are drafts and do not appear on public pages; sample announcements remain unpublished. No official asset is removed.

Favicons use Hakan’s original mascot face, isolated using its existing SVG silhouette as a clip around the original paths/polygons, including its eyes and smile. No character features are redrawn. The original SVG remains untouched. `scripts/generate-favicons.mjs` uses Astro’s existing Sharp dependency to create `public/icons/favicon.svg`, 16/32/48px PNGs, a 180px Apple touch icon, and `public/favicon.ico`. Run `node scripts/generate-favicons.mjs` to regenerate. `FaviconHead.astro` supplies shared references on every HTML page, including root, both languages, prototypes and 404. The generic favicon has been removed.

## Retro homepage prototype

Review the isolated prototype at `/design/retro/` (Dutch) or `/en/design/retro/` (English). The existing homepages and route map remain unchanged. The language switch stays within the prototype; content links open the existing localized pages.

`src/components/RetroPrototype.astro` shares the markup and localized content. `src/styles/retro.css` uses the shared brand colors and self-hosted Roboto. The full truck photograph in `public/media/truck-2.png` is rendered without cropping and optimized by Astro into responsive WebP/JPEG variants. No client JavaScript or additional dependencies are used.

Both prototype routes always emit `noindex,nofollow`, including production builds, and remain outside the production sitemap. Staging continues to apply its existing environment-wide headers. `npm run verify:all` checks both languages, optimized image assets, links, and indexing policy in both environments.

## Cloudflare Pages deployment policy

The shared policy in config/environment.mjs uses DEPLOY_ENV=production (the local default) or DEPLOY_ENV=staging. Cloudflare builds require an explicit DEPLOY_ENV and accept only development + staging or main + production. Missing environments, missing/unknown branches and mismatched combinations fail. This policy sets both Astro's site URL and application SEO URLs. Staging uses https://beta.fullstackburgers.nl; production retains https://www.fullstackburgers.nl. Configure DEPLOY_ENV as a process/build environment variable, not in a local .env file. Astro's production build mode does not identify the hosting environment. The repository .node-version pins Node 22.23.3; set NODE_VERSION=22.23.3 in each Pages project as well.

Staging adds noindex,nofollow to every HTML page, emits a Cloudflare _headers rule for all responses, omits the sitemap advertisement from robots.txt, and emits an empty sitemap. Crawling remains allowed so search engines can read noindex. The build removes only the output CNAME in staging; both source CNAME files and the production output CNAME are preserved. Header/footer staging indicators render only in staging. Production emits no staging _headers file, keeps public pages including the root indexable, excludes 404/prototypes from indexing, and lists eight localized canonical URLs in its sitemap.

Run npm run verify for the selected environment, or npm run verify:all to check both staging and production using their actual Cloudflare branch/environment pairs plus the invalid configuration matrix. The latter leaves a production build in dist. No new dependencies are needed.

~~~powershell
$env:DEPLOY_ENV = 'staging'
npm run verify
$env:DEPLOY_ENV = 'production'
npm run verify
npm run verify:all
~~~

Manual dashboard setup, only after deployment authorization:

| Setting | Existing staging project (retain) | New production project |
| --- | --- | --- |
| Project name | fullstackburgers-beta | fullstackburgers-production |
| Git provider/repository | GitHub: fatihcbc/fullstackburgers | GitHub: fatihcbc/fullstackburgers |
| Production branch | development | main |
| Automatic production-branch deployments | Enabled | Enabled |
| Preview branch deployments | None / disabled | None / disabled |
| Framework preset | Astro | Astro |
| Root directory | Repository root (leave blank) | Repository root (leave blank) |
| Build command | npm run verify | npm run verify |
| Build output directory | dist | dist |
| Production environment: DEPLOY_ENV | staging | production |
| Production environment: NODE_VERSION | 22.23.3 | 22.23.3 |
| Custom domain | beta.fullstackburgers.nl | www.fullstackburgers.nl |

1. Preserve the existing beta project. Its Cloudflare "Production" settings refer to development, so DEPLOY_ENV=staging belongs in that project's Production environment, not only Preview.
2. First merge the approved guard/SEO source changes into main using the rollback-preserving procedure below. Creating the new project against the old main would fail its existing staging-only guard.
3. In Cloudflare Workers & Pages, choose Pages > Connect to Git / Import an existing Git repository. Use the existing GitHub app connection, granting access only to fatihcbc/fullstackburgers if authorization is required. Enter the production column above before Save and Deploy. Project creation can immediately deploy and is not part of local preparation. Cloudflare supplies CF_PAGES and CF_PAGES_BRANCH; do not override them. Leave dependency installation enabled so the existing npm lockfile is used. No adapter, Wrangler config, GitHub Actions deployment workflow or deployment token is needed.
4. After a successful production build, add www.fullstackburgers.nl under the new project's Custom domains. Do not attach beta or the apex to this project. Do not switch www's STRATO CNAME yet: first review domain validation and certificate readiness, test the assigned pages.dev deployment with production canonicals, and obtain cutover approval. The default production pages.dev hostname should receive hostname-specific noindex protection or a custom-domain redirect before public promotion; do not apply global production noindex headers. This separate hostname handling is not implemented in the current preparation.
5. For the later approved cutover, change only www's CNAME from fatihcbc.github.io to the actual hostname assigned to fullstackburgers-production (expected fullstackburgers-production.pages.dev; confirm in the dashboard). Keep beta's CNAME to fullstackburgers-beta.pages.dev, nameservers, apex and all mail records unchanged. DNS remains at STRATO. Verify HTTPS and all existing paths on www and recheck beta's meta/header protections. Certificate activation may depend on DNS validation; do not promise zero downtime without confirming the validation sequence.

Branch and rollback procedure, after commit/push approval:

1. Commit only the approved source, deployment policy, verification, Node pin and documentation changes on development. Push development and verify beta before merging.
2. Record the existing main rollback SHA (currently 8228aab9220460cbdba06faf615ed330920acaa6), save its generated-file manifest/hashes, and refresh both remote refs. Main contains the same baseline Astro source as development plus published GitHub Pages files and different deployment documentation.
3. Merge development into main with a normal reviewed merge, not a branch reset, force push or replacement of main's tree. Resolve any README conflict by retaining these new deployment instructions and the explicit GitHub Pages rollback policy.
4. Before pushing main, compare all existing generated root files with the saved main baseline byte-for-byte: index.html, 404.html, nl/, en/, design/, _astro/, media/, fonts/, icons/, favicon.ico, robots.txt, sitemap.xml, .nojekyll and CNAME. Preserve all of them. Do not run a dist-to-root copy or delete any publication files. Source changes may trigger a GitHub Pages rebuild on push, but its static output should remain the retained version. Cloudflare independently builds src/ into dist.
5. Keep GitHub Pages hosting/settings and its custom domain available throughout cutover and the agreed rollback window. A DNS rollback restores www CNAME fatihcbc.github.io; it is not instantaneous because of caching. Removing old publication files or retiring GitHub Pages is a separate later task.

No Cloudflare project creation or DNS change is performed by these scripts. Indexing directives are not authentication; beta is intended to be publicly accessible but excluded from search results.

## Project structure

~~~text
src/
  assets/          # Place final imported image assets here when supplied
  components/      # Header, footer, media, home sections and collection views
  config/         # Environment, site identity, regular locations and sides
  content/         # burgers/, announcements/, events/; each has nl/ and en/
  content.config.ts # Typed collection schemas
  i18n.ts          # Localized routes, interface copy and page metadata
  layouts/         # Shared HTML shell and SEO metadata
  pages/           # Static localized routes, root, 404, sitemap and robots
  styles/          # Mobile-first CSS and custom properties
public/            # Original brand assets, poster, truck photograph, fonts, CNAME, favicon
scripts/verify-build.mjs # Post-build acceptance checks
~~~

## Pages and language policy

| Page | Dutch | English |
| --- | --- | --- |
| Home | /nl/ | /en/ |
| Menu | /nl/menu/ | /en/menu/ |
| About | /nl/over-ons/ | /en/about/ |
| Locations & Events | /nl/locaties-evenementen/ | /en/locations-events/ |

Dutch is the default. The root serves an accessible Dutch homepage, canonicalized to /nl/, without a production noindex directive. The existing static GitHub Pages root publishing setup cannot provide a custom HTTP 301 for this path through Astro output alone; no JavaScript or meta-refresh redirect is used. A future host-level redirect requires separate approval. Language links preserve the corresponding page. Canonicals, reciprocal hreflang (including x-default) and sitemap all share the route map, with /nl/ remaining the only Dutch homepage canonical. Staging protects both root and localized pages with noindex,nofollow.

## Markdown editing

Add a Markdown file under the appropriate collection and locale directory. Pair translations using the same translationKey. Set draft: true to exclude a burger/event from publication. Set placeholder: false only when content is verified. Burger cards exclude both drafts and placeholders. Prices currently published were supplied by the business; no supplier claims, dietary guarantees, opening times or contact details have been invented.

Burgers require locale, translationKey, title, description, openingPriceCents, openingComboPriceCents, standardPriceCents and standardComboPriceCents (positive integer euro cents). Future standard prices must be at least the opening prices. Optional fields: order, draft and placeholder. Cards render the confirmed title, description and labeled opening/future standard prices; no invented product photography is shown. There is no published allergen list or ingredient claim.

Events share the common fields and add status (unconfirmed/confirmed/cancelled), optional startsAt/endsAt, location and address. Use ISO timestamps with explicit offsets. The previous sample events are drafts; public location cards use the confirmed weekly schedule in src/config/business.ts. No opening times or automatic next-event selection are implemented.

### Announcements without daily rebuilds (future phase)

Announcement records have startsAt, endsAt, priority, locale, translationKey, draft and placeholder. Timestamps require offsets and end must follow start. The sample is a draft; there is intentionally no build-time date filtering or public announcement renderer yet.

A static build cannot update its rendered HTML as the date changes. The intended later solution is to emit all published announcement windows into a static JSON asset at build time, then use a small vanilla browser script to select the active localized announcement. This needs no server and no daily rebuild. Content additions or edits still require a build.

Define activation as startsAt <= now < endsAt, use highest priority with a deterministic translationKey tie-break, and re-evaluate at boundaries and on tab visibility changes. Treat Europe/Amsterdam as the editorial timezone; choose +01:00 in winter and +02:00 in summer, rather than the build machine timezone. Add tests around DST changes and midnight. Keep essential contact/location information available in static HTML with JavaScript disabled. Browser time accuracy and the SEO limitations of client-selected messages must be considered before relying on this for time-critical notices.

## Replacing visual placeholders

Temporary burger, story, social and social-card SVG illustrations have been removed. Homepage/About photography, the menu poster, logo and mascot use original business assets. Fonts are self-hosted. There is no external image service, icon library or social embed.

TruckPhoto.astro and Menu.astro use Astro Picture to generate responsive WebP/JPEG assets while retaining each original aspect ratio. Original public files remain available unchanged. The hero or menu poster uses eager loading/high fetch priority; below-fold photography is lazy. All images have intrinsic dimensions to reserve space. The poster has an equivalent HTML menu for mobile readability and accessibility.

Open Graph metadata uses the original truck JPEG, replacing the temporary SVG card. A dedicated approved social card can be supplied later. The truck photograph is not cropped or edited to manufacture a social image.

Shared color and font tokens live in src/styles/brand.css; layout tokens remain in src/styles/global.css. Self-hosted WOFF2 assets keep the website independent of external font requests.

## SEO and launch work

The shared layout supplies unique localized titles/descriptions, canonical URLs, Open Graph fields, language alternatives and FoodEstablishment JSON-LD. The business name, stable #business identifier, environment URL, smash burger cuisine and Almere service area are retained. Confirmed logo, truck-2 image and localized hasMenu URLs use absolute environment URLs; production never includes beta URLs. No permanent address, telephone, hours, social profiles or ratings are fabricated. Without a confirmed physical business address, this markup does not claim eligibility for Google's LocalBusiness rich results. The locations page describes only the confirmed Sunday/Monday stops and keeps their exact supplied Maps links.

In production builds, the sitemap lists the eight canonical language pages and robots.txt references it. Staging receives the environment-wide noindex policy described above and an empty, unadvertised sitemap. These source changes do not change the currently deployed production site.

Search Console integration is deferred. Later, verify the domain through DNS (preferred) or add the supplied verification tag/file, then submit /sitemap.xml. Do not invent verification tokens.

Before launch: approved brand assets and translations, real menu/allergen data, actual stops, announcement behavior, keyboard/screen-reader and mobile browser QA, final image optimization, measured Core Web Vitals/Lighthouse, structured-data/social validation, and production deployment/rollback configuration. The foundation reserves image space and ships no client JavaScript; performance scores have not been claimed.
