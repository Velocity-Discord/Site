module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./src/css')
    eleventyConfig.addPassthroughCopy("./src/js");
    eleventyConfig.addPassthroughCopy("./src/assets");
    eleventyConfig.addPassthroughCopy("./src/admin")
    eleventyConfig.addPassthroughCopy("./src/_redirects");

    return {
        dir: {
            input: "src",
            output: "public",
        },
    };
}