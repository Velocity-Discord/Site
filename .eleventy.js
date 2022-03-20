module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./src/css')
    eleventyConfig.addPassthroughCopy("./src/js");
    eleventyConfig.addPassthroughCopy("./src/assets");

    return {
        dir: {
            input: "src",
            output: "public",
        },
    };
}