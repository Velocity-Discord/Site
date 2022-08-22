const fs = require("fs/promises");
const path = require("path");
const frontMatter = require("front-matter");

const baseApiPath = path.resolve(__dirname, "../src/api");
const baseAddonPath = path.resolve(__dirname, "../src/store");
const baseApiAddonPath = path.resolve(__dirname, "../src/api/store");
const storeFile = path.join(baseApiPath, "store.json");
const bothFile = path.join(baseApiAddonPath, "addons.json");
const pluginFile = path.join(baseApiAddonPath, "plugins.json");
const themeFile = path.join(baseApiAddonPath, "themes.json");

const URL = "https://velocity-discord.netlify.app";

console.log("\x1b[1;94mVelocity Backend \x1b[0m");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
    let pluginsToWrite = [];
    let themesToWrite = [];

    console.log("Creating Store File...");
    await fs.writeFile(
        storeFile,
        JSON.stringify({
            STORE_URL: `${URL}/api/store.json`,
            PLUGINS_URL: `${URL}/api/store/plugins.json`,
            THEMES_URL: `${URL}/api/store/themes.json`,
            ADDONS_URL: `${URL}/api/store/addons.json`,
            SUBMUSSIONS_URL: `${URL}/api/store/submissions.json`,
        })
    );
    console.log(`Done`);
    console.log("Reading Addon Directories...");

    const themeDir = await fs.readdir(path.join(baseAddonPath, "theme"));
    const pluginDir = await fs.readdir(path.join(baseAddonPath, "plugin"));

    let tIndex = 0;
    themeDir.forEach(async (file) => {
        if (!file.endsWith(".md")) return;
        const obj = {
            name: file,
            path: path.join(baseAddonPath, "theme", file),
        };
        const data = await fs.readFile(obj.path, "utf8");
        const parsed = frontMatter(data);
        const { attributes } = parsed;
        themesToWrite.push({
            TYPE: "theme",
            MODULE: attributes.module,
            NAME: attributes.name,
            DESCRIPTION: attributes.description,
            AUTHOR: attributes.author,
            VERSION: attributes.version,
            URL: `${URL}/store/theme/${attributes.name}`,
            SOURCE: {
                RAW_BASEPATH: attributes.source,
                RAW_FILE: attributes.sourceFile,
                RAW_README: attributes.readme,
                URL: attributes.sourceURL,
            },
            IMAGE: attributes.image,
            TAGS: attributes.tags || ["themes"],
            DATE_UPLOADED: attributes.date,
            DATE_UPDATED: attributes.updated,
        });
        tIndex++;
    });

    let pIndex = 0;
    pluginDir.forEach(async (file) => {
        if (!file.endsWith(".md")) return;
        const obj = {
            name: file,
            path: path.join(baseAddonPath, "plugin", file),
        };
        const data = await fs.readFile(obj.path, "utf8");
        const parsed = frontMatter(data);
        const { attributes } = parsed;
        pluginsToWrite.push({
            TYPE: "plugin",
            MODULE: attributes.module,
            NAME: attributes.name,
            DESCRIPTION: attributes.description,
            AUTHOR: attributes.author,
            VERSION: attributes.version,
            URL: `${URL}/store/plugin/${attributes.name}`,
            SOURCE: {
                RAW_BASEPATH: attributes.source,
                RAW_FILE: attributes.sourceFile,
                RAW_README: attributes.readme,
                URL: attributes.sourceURL,
            },
            IMAGE: attributes.image,
            TAGS: attributes.tags || ["plugins"],
            DATE_UPLOADED: attributes.date,
            DATE_UPDATED: attributes.updated,
        });
        pIndex++;
    });

    await new Promise(async (resolve) => {
        const ps = pluginDir.filter((file) => file.endsWith(".md"));
        const ts = themeDir.filter((file) => file.endsWith(".md"));

        while (ps.length !== pIndex && ts.length !== tIndex) await sleep(100);

        resolve();
    });

    console.log("Writing Store Files...");

    await fs.writeFile(pluginFile, JSON.stringify(pluginsToWrite));
    await fs.writeFile(themeFile, JSON.stringify(themesToWrite));
    await fs.writeFile(bothFile, JSON.stringify({ ...pluginsToWrite, ...themesToWrite }));

    console.log(`Done`);
})();
