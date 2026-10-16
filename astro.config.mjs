import { defineConfig } from 'astro/config';
import { writeFile, unlink } from 'node:fs/promises';
import { resolveDeployment } from './config/environment.mjs';
const deployment = resolveDeployment(process.env);
export default defineConfig({
  site: deployment.url,
  vite: { define: { 'import.meta.env.DEPLOY_ENV': JSON.stringify(deployment.environment) } },
  output: 'static',
  trailingSlash: 'always',
  i18n: { defaultLocale: 'nl', locales: ['nl', 'en'], routing: { prefixDefaultLocale: true } },
  integrations: [{
    name: 'deployment-policy',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (deployment.staging) {
          await writeFile(new URL('_headers', dir), '/*\n  X-Robots-Tag: noindex, nofollow\n');
          await unlink(new URL('CNAME', dir));
        } else {
          // Match only Pages hostnames, including commit and branch aliases.
          // Absolute _headers patterns also match HTTP; www remains unrestricted.
          await writeFile(new URL('_headers', dir),
            'https://:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n\n' +
            'https://:version.:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n');
        }
      },
    },
  }],
});
