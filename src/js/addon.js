let md = new Remarkable({
    html: true,
    breaks: true,
});

if (readmeURL !== "") {
    async function getReadme() {
        let p = document.querySelector("#readme");

        let input
        let readme

        await fetch(readmeURL)
            .then((response) => response.text())
            .then((data) => (readme = data));

        input = '<h1 class="path">'
        readmeURL
            .replace("https://raw.githubusercontent.com/", "")
            .split("/")
            .forEach((item) => {
                input += item + " / ";
            });
        input += "</h1> \n\n" + readme;

        p.innerHTML = md.render(input);
    }

    getReadme()
}