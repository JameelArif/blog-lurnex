/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_URL || "https://lurnex.com",
  generateRobotsTxt: true,
  exclude: ["/studio", "/api/*", "/server-sitemap.xml"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/studio", "/api"] },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_URL || "https://lurnex.com"}/server-sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Default priority and change frequency
    let priority = 0.7;
    let changefreq = 'daily';

    // Assign priority based on path
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/post')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.startsWith('/category') || path.startsWith('/author')) {
      priority = 0.8;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
