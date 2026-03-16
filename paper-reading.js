(function () {
    const DATA = window.PAPER_READING_DATA;
    const CONTENT = window.PAPER_READING_CONTENT || {};
    const VENUES = window.PAPER_READING_VENUES || {};
    const SOURCE_HEADER_PATTERN = /^##\s+来源(?:周报|笔记)$/;
    const SOURCE_NOTE_PATTERN = /^##\s+(\d{1,2})\.(\d{1,2})-(\d{1,2})\.(\d{1,2})(?:周报|笔记)\.md$/;
    const READING_PASS_MARKER = "__PAPER_READING_PASS__";
    const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const articleOrderCache = new Map();
    const REPO_RAW_BASE = "https://raw.githubusercontent.com/lemonoscar/lemonoscar.github.io/main/";
    const REQUEST_VERSION = String(Date.now());
    let mathRenderQueue = Promise.resolve();

    if (!DATA) {
        return;
    }

    const body = document.body;
    const pageType = body.dataset.page;
    const currentCategory = body.dataset.category || null;

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function resolveAsset(url) {
        if (url.startsWith("../png/")) {
            return `paper/png/${url.slice("../png/".length)}`;
        }
        if (url.startsWith("./")) {
            return `paper/articles/${url.slice(2)}`;
        }
        return url;
    }

    function renderInline(text) {
        const extracted = extractInlineMath(text);
        let output = escapeHtml(extracted.text);
        output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
            const safeHref = resolveAsset(href);
            return `<a href="${safeHref}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
        });
        output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
        output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        output = output.replace(/_([^_]+)_/g, "<em>$1</em>");
        output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
        for (const token of extracted.tokens) {
            output = output.replace(token.placeholder, token.html);
        }
        return output;
    }

    function makeInlineMathToken(content, index) {
        return {
            placeholder: `@@PAPERREADINGMATH${index}@@`,
            html: `<span class="math-inline">\\(${escapeHtml(content)}\\)</span>`
        };
    }

    function extractInlineMath(text) {
        const tokens = [];
        let output = "";
        let index = 0;
        let tokenIndex = 0;

        while (index < text.length) {
            if (text[index] === "\\" && text[index + 1] === "(") {
                const end = text.indexOf("\\)", index + 2);
                if (end !== -1) {
                    const token = makeInlineMathToken(text.slice(index + 2, end), tokenIndex);
                    tokens.push(token);
                    output += token.placeholder;
                    tokenIndex += 1;
                    index = end + 2;
                    continue;
                }
            }

            if (text[index] === "$" && text[index + 1] !== "$" && text[index - 1] !== "\\") {
                let end = index + 1;
                while (end < text.length) {
                    if (text[end] === "$" && text[end - 1] !== "\\" && text[end + 1] !== "$") {
                        break;
                    }
                    end += 1;
                }
                if (end < text.length && text[end] === "$") {
                    const token = makeInlineMathToken(text.slice(index + 1, end), tokenIndex);
                    tokens.push(token);
                    output += token.placeholder;
                    tokenIndex += 1;
                    index = end + 1;
                    continue;
                }
            }

            output += text[index];
            index += 1;
        }

        return { text: output, tokens };
    }

    function renderMathBlock(content) {
        return `<div class="math-display">\\[${escapeHtml(content)}\\]</div>`;
    }

    function consumeMathBlock(lines, startIndex, openToken, closeToken) {
        const firstLine = lines[startIndex].replace(/\r/g, "");
        const trimmed = firstLine.trim();
        const afterOpen = trimmed.slice(openToken.length).trim();

        if (afterOpen.endsWith(closeToken) && afterOpen.length > closeToken.length) {
            return {
                html: renderMathBlock(afterOpen.slice(0, -closeToken.length).trim()),
                nextIndex: startIndex
            };
        }

        const parts = [];
        if (afterOpen) {
            parts.push(afterOpen);
        }

        let index = startIndex + 1;
        while (index < lines.length) {
            const currentLine = lines[index].replace(/\r/g, "");
            const currentTrimmed = currentLine.trim();
            if (currentTrimmed === closeToken) {
                return {
                    html: renderMathBlock(parts.join("\n")),
                    nextIndex: index
                };
            }

            if (currentTrimmed.endsWith(closeToken)) {
                parts.push(currentTrimmed.slice(0, -closeToken.length).trimEnd());
                return {
                    html: renderMathBlock(parts.join("\n")),
                    nextIndex: index
                };
            }

            parts.push(currentLine);
            index += 1;
        }

        return {
            html: renderMathBlock(parts.join("\n")),
            nextIndex: lines.length - 1
        };
    }

    function normalizeMonth(month) {
        return month < 7 ? month + 12 : month;
    }

    function formatSourceDate(month, day) {
        return `${MONTH_LABELS[month - 1] || `M${month}`} ${day}`;
    }

    function getArticleOrder(article) {
        if (articleOrderCache.has(article.file)) {
            return articleOrderCache.get(article.file);
        }

        const markdown = CONTENT[article.file];
        let earliest = null;

        if (typeof markdown === "string") {
            const sourceScanner = new RegExp(SOURCE_NOTE_PATTERN.source, "gm");
            for (const match of markdown.matchAll(sourceScanner)) {
                const month = Number(match[1]);
                const day = Number(match[2]);
                const value = normalizeMonth(month) * 100 + day;
                if (!earliest || value < earliest.value) {
                    earliest = {
                        value,
                        month,
                        day,
                        label: formatSourceDate(month, day)
                    };
                }
            }
        }

        const result = earliest || {
            value: Number.MAX_SAFE_INTEGER,
            month: null,
            day: null,
            label: ""
        };
        articleOrderCache.set(article.file, result);
        return result;
    }

    function compareArticles(left, right) {
        const leftOrder = getArticleOrder(left);
        const rightOrder = getArticleOrder(right);
        if (leftOrder.value !== rightOrder.value) {
            return leftOrder.value - rightOrder.value;
        }
        return left.title.localeCompare(right.title);
    }

    function stripSourceBlocks(markdown) {
        const lines = markdown.split("\n");
        const cleaned = [];
        let inSourceIndex = false;

        for (const rawLine of lines) {
            const line = rawLine.replace(/\r/g, "");
            const trimmed = line.trim();

            if (SOURCE_HEADER_PATTERN.test(trimmed)) {
                inSourceIndex = true;
                continue;
            }

            if (inSourceIndex) {
                if (/^##\s+/.test(trimmed)) {
                    inSourceIndex = false;
                } else {
                    continue;
                }
            }

            if (SOURCE_NOTE_PATTERN.test(trimmed)) {
                cleaned.push(READING_PASS_MARKER);
                continue;
            }

            cleaned.push(line);
        }

        return cleaned.join("\n");
    }

    function markdownToHtml(markdown) {
        const lines = stripSourceBlocks(markdown).split("\n");
        const html = [];
        let paragraph = [];
        let passCount = 0;

        function flushParagraph() {
            if (!paragraph.length) {
                return;
            }
            html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
            paragraph = [];
        }

        for (let index = 0; index < lines.length; index += 1) {
            const rawLine = lines[index];
            const line = rawLine.replace(/\r/g, "");
            const trimmed = line.trim();

            if (!trimmed) {
                flushParagraph();
                continue;
            }

            if (trimmed === READING_PASS_MARKER) {
                flushParagraph();
                passCount += 1;
                if (passCount > 1) {
                    html.push(`<div class="note-pass">Reading Pass ${passCount}</div>`);
                }
                continue;
            }

            if (trimmed.startsWith("# ")) {
                continue;
            }

            if (trimmed.startsWith("$$")) {
                flushParagraph();
                const mathBlock = consumeMathBlock(lines, index, "$$", "$$");
                html.push(mathBlock.html);
                index = mathBlock.nextIndex;
                continue;
            }

            if (trimmed.startsWith("\\[")) {
                flushParagraph();
                const mathBlock = consumeMathBlock(lines, index, "\\[", "\\]");
                html.push(mathBlock.html);
                index = mathBlock.nextIndex;
                continue;
            }

            const imageMatch = trimmed.match(/^!\[(.*?)\]\(([^)]+)\)$/);
            if (imageMatch) {
                flushParagraph();
                html.push(
                    `<figure><img src="${resolveAsset(imageMatch[2])}" alt="${escapeHtml(imageMatch[1] || "paper figure")}"></figure>`
                );
                continue;
            }

            if (/^###\s+/.test(trimmed)) {
                flushParagraph();
                html.push(`<h4>${renderInline(trimmed.slice(4))}</h4>`);
                continue;
            }

            if (/^##\s+/.test(trimmed)) {
                flushParagraph();
                html.push(`<h3>${renderInline(trimmed.slice(3))}</h3>`);
                continue;
            }

            const bulletMatch = line.match(/^(\s*)([-+*])\s+(.*)$/);
            if (bulletMatch) {
                flushParagraph();
                const depth = Math.min(3, Math.floor(bulletMatch[1].length / 4));
                html.push(
                    `<div class="md-item depth-${depth}"><span class="md-bullet"></span><div>${renderInline(bulletMatch[3])}</div></div>`
                );
                continue;
            }

            paragraph.push(trimmed);
        }

        flushParagraph();
        return html.join("");
    }

    function getArticles(categoryKey) {
        return DATA.articles.filter((article) => article.category === categoryKey).slice().sort(compareArticles);
    }

    function basename(file) {
        return file.split("/").pop().replace(".md", "");
    }

    function withCacheBust(url) {
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}v=${REQUEST_VERSION}`;
    }

    function getArticleFetchUrls(articleFile) {
        const encodedFile = encodeURI(articleFile);
        const urls = [];

        if (window.location && /(^|\.)github\.io$/i.test(window.location.hostname || "")) {
            urls.push(withCacheBust(`${REPO_RAW_BASE}${encodedFile}`));
        }

        urls.push(withCacheBust(articleFile));
        return urls;
    }

    async function fetchMarkdown(articleFile) {
        const urls = getArticleFetchUrls(articleFile);

        for (const url of urls) {
            try {
                const response = await fetch(url, { cache: "no-store" });
                if (!response.ok) {
                    continue;
                }

                const markdown = await response.text();
                if (!markdown.trim() || /^\s*<!DOCTYPE html>/i.test(markdown)) {
                    continue;
                }

                return markdown;
            } catch (error) {
                continue;
            }
        }

        throw new Error("No live markdown source available");
    }

    function getVenue(article) {
        return VENUES[article.file] || { label: "", url: "" };
    }

    function createTabs() {
        const tabs = document.getElementById("pageTabs");
        if (!tabs) {
            return;
        }

        const items = [
            { title: "Overview", href: "paper-reading.html", current: pageType === "overview" }
        ].concat(
            Object.entries(DATA.categories).map(([key, category]) => ({
                title: category.title,
                href: category.page,
                current: key === currentCategory
            }))
        );

        tabs.innerHTML = items
            .map(
                (item) => `
                    <a class="page-tab${item.current ? " is-current" : ""}" href="${item.href}">
                        ${item.title}
                    </a>
                `
            )
            .join("");
    }

    function highlightNav() {
        document.querySelectorAll(".nav a[data-category]").forEach((link) => {
            const key = link.dataset.category;
            const active = currentCategory === key || (pageType === "overview" && key === "overview");
            link.classList.toggle("is-current", active);
        });
    }

    function renderOverview() {
        const mount = document.getElementById("overviewGrid");
        if (!mount) {
            return;
        }

        const totalArticles = DATA.articles.length;
        const totalImages = DATA.imageCount;
        const stats = {
            totalArticles,
            totalImages,
            shelfCount: Object.keys(DATA.categories).length,
            categoryCount: Object.keys(DATA.categories).length
        };

        const totalEl = document.getElementById("stat-total");
        const imageEl = document.getElementById("stat-images");
        const shelfEl = document.getElementById("stat-shelves");
        if (totalEl) totalEl.textContent = String(stats.totalArticles);
        if (imageEl) imageEl.textContent = String(stats.totalImages);
        if (shelfEl) shelfEl.textContent = String(stats.shelfCount);

        mount.innerHTML = Object.entries(DATA.categories)
            .map(([key, category]) => {
                const items = getArticles(key);
                const previews = items.slice(0, 4).map((article) => `<li>${article.title}</li>`).join("");
                return `
                    <article class="overview-card" data-accent="${category.accent}">
                        <div class="overview-card-header">
                            <div>
                                <h2>${category.title}</h2>
                                <p>${category.description}</p>
                            </div>
                            <div class="count-pill">${items.length} notes</div>
                        </div>
                        <ul class="preview-list">${previews}</ul>
                    </article>
                `;
            })
            .join("");
    }

    function decorateFigures(mount) {
        mount.querySelectorAll("figure").forEach((figure) => {
            const img = figure.querySelector("img");
            if (!img) {
                return;
            }

            function applyFigureClass() {
                if (!img.naturalWidth || !img.naturalHeight) {
                    return;
                }

                figure.classList.remove("is-landscape", "is-portrait", "is-square");
                const ratio = img.naturalWidth / img.naturalHeight;
                if (ratio > 1.2) {
                    figure.classList.add("is-landscape");
                    return;
                }
                if (ratio < 0.85) {
                    figure.classList.add("is-portrait");
                    return;
                }
                figure.classList.add("is-square");
            }

            if (img.complete) {
                applyFigureClass();
            } else {
                img.addEventListener("load", applyFigureClass, { once: true });
            }
        });
    }

    function typesetMath(mount) {
        const ready = window.__paperReadingMathReady;
        if (!ready || typeof ready.then !== "function") {
            return;
        }

        mathRenderQueue = mathRenderQueue
            .then(() => ready)
            .then(() => {
                if (!window.MathJax || typeof window.MathJax.typesetPromise !== "function") {
                    return;
                }
                return window.MathJax.typesetPromise([mount]);
            })
            .catch(() => {});
    }

    async function loadArticle(article, mount) {
        try {
            try {
                const markdown = await fetchMarkdown(article.file);
                mount.innerHTML = markdownToHtml(markdown);
                decorateFigures(mount);
                typesetMath(mount);
                return;
            } catch (fetchError) {
                const bundled = CONTENT[article.file];
                if (typeof bundled === "string") {
                    mount.innerHTML = markdownToHtml(bundled);
                    decorateFigures(mount);
                    typesetMath(mount);
                    return;
                }
            }
        } catch (error) {
            mount.innerHTML = `
                <div class="note-error">
                    Note content is unavailable in this build.
                </div>
            `;
        }
    }

    function renderCategoryPage(categoryKey) {
        const category = DATA.categories[categoryKey];
        if (!category) {
            return;
        }

        const heroTitle = document.getElementById("categoryTitle");
        const heroDescription = document.getElementById("categoryDescription");
        const heroCount = document.getElementById("categoryCount");
        if (heroTitle) heroTitle.textContent = category.title;
        if (heroDescription) heroDescription.textContent = category.description;

        const articles = getArticles(categoryKey);
        if (heroCount) heroCount.textContent = `${articles.length} expanded notes`;

        const toc = document.getElementById("tocList");
        const notes = document.getElementById("notesColumn");
        if (!toc || !notes) {
            return;
        }

        toc.innerHTML = articles
            .map((article, index) => {
                const anchor = `note-${basename(article.file)}`;
                return `<a class="toc-item" href="#${anchor}">${String(index + 1).padStart(2, "0")} · ${article.title}</a>`;
            })
            .join("");

        notes.innerHTML = articles
            .map((article, index) => {
                const anchor = `note-${basename(article.file)}`;
                const order = getArticleOrder(article);
                const venue = getVenue(article);
                const venueTag = venue.label
                    ? venue.url
                        ? `<a class="note-tag note-tag-venue" href="${venue.url}" target="_blank" rel="noreferrer">${escapeHtml(venue.label)}</a>`
                        : `<span class="note-tag note-tag-venue">${escapeHtml(venue.label)}</span>`
                    : "";
                return `
                    <article class="note-card" id="${anchor}" data-accent="${category.accent}">
                        <div class="note-head">
                            <span class="note-index">${String(index + 1).padStart(2, "0")}</span>
                            <div>
                                <h2>${article.title}</h2>
                                <div class="note-badges">
                                    <span class="note-tag note-tag-category" data-accent="${category.accent}">${category.title}</span>
                                    ${venueTag}
                                </div>
                                ${order.label ? `<p class="note-meta">First noted ${order.label}</p>` : ""}
                            </div>
                        </div>
                        <div class="note-body" data-file="${article.file}">
                            <div class="note-loading">Loading note...</div>
                        </div>
                    </article>
                `;
            })
            .join("");

        notes.querySelectorAll(".note-body").forEach((mount) => {
            const article = articles.find((item) => item.file === mount.dataset.file);
            if (article) {
                loadArticle(article, mount);
            }
        });
    }

    createTabs();
    highlightNav();

    if (pageType === "overview") {
        renderOverview();
        return;
    }

    if (pageType === "category" && currentCategory) {
        renderCategoryPage(currentCategory);
    }
})();
