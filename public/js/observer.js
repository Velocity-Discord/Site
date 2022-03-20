const fades = document.querySelectorAll(".fade-in")

const appearOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -200px 0px"
}

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return
        } else {
            entry.target.classList.add("appear");
            appearOnScroll.unobserve(entry.target)
        }

    })
}, appearOptions)

fades.forEach(fade => {
    appearOnScroll.observe(fade)
})