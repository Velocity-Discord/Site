module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./src/css')
    eleventyConfig.addPassthroughCopy("./src/js");
    eleventyConfig.addPassthroughCopy("./src/assets");
    eleventyConfig.addPassthroughCopy("./src/admin")

    return {
        dir: {
            input: "src",
            output: "public",
        },
    };
}