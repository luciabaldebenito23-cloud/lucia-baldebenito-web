module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the output folder. These live at
  // the repo root (not under src/) so there's a single copy of every image,
  // font, and the css/js files shared with the rest of the project.
  eleventyConfig.addPassthroughCopy({ css: "css" });
  eleventyConfig.addPassthroughCopy({ js: "js" });
  eleventyConfig.addPassthroughCopy({ fonts: "fonts" });
  eleventyConfig.addPassthroughCopy({ img: "img" });
  // Panel de edición visual (Sveltia CMS): vive en /admin/ en la raíz del
  // repo, fuera de src/, así que también hay que copiarlo tal cual.
  eleventyConfig.addPassthroughCopy({ admin: "admin" });

  // Sort helper: newest-first isn't needed yet (dates aren't tracked per
  // property/post), so collections are ordered by the "orden" front-matter
  // field when present, otherwise by filename.
  function byOrden(a, b) {
    return (a.data.orden ?? 999) - (b.data.orden ?? 999);
  }

  eleventyConfig.addCollection("propiedades", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/propiedades/*.md").sort(byOrden);
  });

  eleventyConfig.addCollection("blogposts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/blog/*.md").sort(byOrden);
  });

  eleventyConfig.addFilter("whereTrue", function (arr, key) {
    return (arr || []).filter((item) => item.data && item.data[key]);
  });

  eleventyConfig.addFilter("whereEq", function (arr, key, value) {
    return (arr || []).filter((item) => item.data && item.data[key] === value);
  });

  eleventyConfig.addFilter("urlencode", function (str) {
    return encodeURIComponent(str);
  });

  eleventyConfig.addFilter("formatNumero", function (precio) {
    if (precio === undefined || precio === null || precio === "") return "";
    var n = Number(precio);
    if (Number.isNaN(n)) return precio;
    return n.toLocaleString("es-AR");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
