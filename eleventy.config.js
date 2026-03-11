const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("sites/*/assets");

  // Watch for changes in sites directory
  eleventyConfig.addWatchTarget("./sites/");

  // Global data: Load all site configs as an array for pagination
  eleventyConfig.addGlobalData("allSites", () => {
    const sitesDir = path.join(__dirname, "sites");
    const sites = [];

    if (fs.existsSync(sitesDir)) {
      const siteFolders = fs.readdirSync(sitesDir).filter((f) => {
        return fs.statSync(path.join(sitesDir, f)).isDirectory();
      });

      for (const slug of siteFolders) {
        const configPath = path.join(sitesDir, slug, "config.json");
        const contentPath = path.join(sitesDir, slug, "content.json");

        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          const content = fs.existsSync(contentPath)
            ? JSON.parse(fs.readFileSync(contentPath, "utf-8"))
            : {};

          sites.push({ ...config, content, slug });
        }
      }
    }

    return sites;
  });

  // Filter to get a specific site
  eleventyConfig.addFilter("getSite", (sites, slug) => sites[slug]);

  // Filter for JSON stringification
  eleventyConfig.addFilter("jsonify", (obj) => JSON.stringify(obj, null, 2));

  // Shortcode for phone link
  eleventyConfig.addShortcode("phoneLink", (phone) => {
    const digits = phone.replace(/\D/g, "");
    return `<a href="tel:${digits}">${phone}</a>`;
  });

  // Format phone number
  eleventyConfig.addFilter("formatPhone", (phone) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    const normalized = digits.startsWith("1") && digits.length === 11
      ? digits.slice(1)
      : digits;
    if (normalized.length === 10) {
      return `${normalized.slice(0, 3)}.${normalized.slice(3, 6)}.${normalized.slice(6)}`;
    }
    return phone;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
