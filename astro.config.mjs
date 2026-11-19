process.env.ASTRO_TELEMETRY_DISABLED = '1';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://aptinfosoft.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/product-engineering-services.html': '/services/product-engineering/',
    '/custom-application-development.html': '/services/application-development/',
    '/saas.html': '/services/saas/',
    '/application-modernization.html': '/services/application-modernization/',
    '/testing-services.html': '/services/testing/',
    '/business-analytics.html': '/services/business-analytics/',
    '/about-us.html': '/about/',
    '/software-engineer.html': '/careers/',
    '/contact-us.php': '/contact/',
    '/contact-us.html': '/contact/',
    '/Flexibility.html': '/#why-apt',
    '/Reliability-and-Scalability.html': '/#why-apt',
    '/Efficiency.html': '/#why-apt',
  },
});
