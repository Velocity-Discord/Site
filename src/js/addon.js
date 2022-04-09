let md = new Remarkable({
    html: true,
    breaks: true,
});

const mainRegex = /.*github(usercontent)?.com\/(.*)\/(.*)\/(.*)\/(.*)\//i;

async function getReadme() {
    let p = document.querySelector("#readme");

    fetch(readmeURL)
        .then((response) => response.json())
        .then((data) => console.log(data));

    const input = p.innerHTML;
    p.innerHTML = md.render(input);
}