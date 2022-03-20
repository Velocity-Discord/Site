let md = new Remarkable({
    html: true,
    breaks: true,
});

const toRender = document.querySelectorAll(".markdown")

toRender.forEach(ele => {
    let input = ele.getAttribute("markdown")

    ele.innerHTML = md.render(input);
    
    const toID = ele.querySelectorAll("h1")

    toID.forEach(e => {
        let i = e.innerHTML.replace(/ .*/, "").toLowerCase()

        if (i === "the") i = e.innerHTML.charAt(4).toLowerCase()

        e.id = i
    })
    hljs.highlightAll();
})

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
if (urlParams.has("beta") && window.location.href.includes("installation")) {
    let p = document.querySelector(".markdown");

    let input = `
 # BETA Installation
<div class="notice">
    This guide assumes you already have GitHub access to the project.
</div>

# Downloading Repo
1. Go to the GitHub repo and select \`Code > Download ZIP\`
2. Unzip the file and place the folder where you like (take note of the FULL file path to it)

# Installation
## MacOS
1. Open Finder and navigate to your \`[Discord Version].app\`
4. Right-Click on it and select "Show Package Contents"
5. Go to  \`Contents/Resources\`
6. Create a folder called \`app\`
7. Inside, create a \`index.js\` and a \`package.json\`
8. inside \`package.json\` enter:
\`\`\`
{
    "name": "velocity",
    "main": "./index.js"
}
\`\`\`
9. inside \`index.js\` enter:
\`\`\`
require("/FULL/PATH/TO/Velocity/FOLDER");
\`\`\`
(replace \`"/FULL/PATH/TO/Velocity/FOLDER"\` with the path)

## Windows
1. Press \`Win+R\` and paste in \`%appdata%\` then open the folder for your discord version
4. Go down the file levels until you get into \`Resources\`
6. Create a folder called \`app\`
7. Inside, create a \`index.js\` and a \`package.json\`
8. inside \`package.json\` enter:
\`\`\`
{
    "name": "velocity",
    "main": "./index.js"
}
\`\`\`
9. inside \`index.js\` enter:
\`\`\`
require("/FULL/PATH/TO/Velocity/FOLDER");
\`\`\`
(replace \`"/FULL/PATH/TO/Velocity/FOLDER"\` with the path)

`;
    p.innerHTML = md.render(input);
}