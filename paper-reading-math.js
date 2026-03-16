(function () {
    if (window.__paperReadingMathInitialized) {
        return;
    }

    window.__paperReadingMathInitialized = true;

    let resolveReady;
    window.__paperReadingMathReady = new Promise((resolve) => {
        resolveReady = resolve;
    });

    window.MathJax = {
        tex: {
            inlineMath: [["$", "$"], ["\\(", "\\)"]],
            displayMath: [["$$", "$$"], ["\\[", "\\]"]],
            processEscapes: true
        },
        svg: {
            fontCache: "global"
        },
        options: {
            skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"]
        },
        startup: {
            ready() {
                MathJax.startup.defaultReady();
                resolveReady();
            }
        }
    };

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    script.async = true;
    script.addEventListener("error", () => {
        resolveReady();
    });
    document.head.appendChild(script);
})();
