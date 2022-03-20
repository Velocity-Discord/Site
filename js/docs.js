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