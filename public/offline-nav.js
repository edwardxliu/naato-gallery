(() => {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const raw = typeof input === "string" ? input : input?.url;
    if (raw) {
      const url = new URL(raw, window.location.href);
      if (url.origin === window.location.origin && url.searchParams.has("_rsc")) {
        return Promise.resolve(new Response("", { status: 204 }));
      }
    }
    return nativeFetch(input, init);
  };

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest?.("a[href]");
    if (!anchor || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin || url.hash) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(url.pathname + url.search);
  }, true);

  const updateStoryLabels = () => {
    document.querySelectorAll("span.font-safira-march.text-headline-50").forEach((heading) => {
      if (heading.textContent?.trim() !== "WELCOME") return;
      const line = heading.parentElement?.parentElement?.querySelector("span.flex");
      const label = [...(line?.querySelectorAll("span") ?? [])].find((element) =>
        ["NAATO", "STORIES"].includes(element.textContent?.trim())
      );
      if (!line || !label) return;

      const destination = label.textContent.trim() === "NAATO" ? "LIFE" : "OBJECTS";
      heading.textContent = "STORIES";
      label.textContent = destination;

      const svg = line.querySelector("svg");
      if (!svg) return;
      const target = svg.parentElement?.parentElement === line ? svg.parentElement : svg;
      target.replaceChildren();
      target.classList.add("text-headline-10");
      target.style.fontFamily = "var(--font-haigrast)";
      target.style.fontSize = "calc(var(--text-headline-10) * 1.8)";
      target.style.lineHeight = "1";
      target.textContent = "of";
    });
  };

  new MutationObserver(updateStoryLabels).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  updateStoryLabels();
})();
