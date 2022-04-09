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

    console.log(input)

    p.innerHTML = md.render(input);
}

getReadme()