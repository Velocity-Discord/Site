let md = new Remarkable({
    html: true,
    breaks: true,
});

const mainRegex = /.*github(usercontent)?.com\/(.*)\/(.*)\/(.*)\/(.*)\//i;

async function getReadme() {
    let p = document.querySelector("#readme");

    let input

    await fetch(readmeURL)
        .then((response) => response.text())
        .then((data) => input = data);

    input = '<h1 class="path">' + readmeURL.match(mainRegex)[2] + " / " + readmeURL.match(mainRegex)[3] + " / " + readmeURL.match(mainRegex)[5] + " / README.md </h1> \n\n" + input;

    p.innerHTML = md.render(input);
}

getReadme()