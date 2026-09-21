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

  const updateCoverImages = () => {
    const covers = {
      "Fashion Visuals": "/covers/stories-of-life.jpg",
      "Object Worlds": "/covers/stories-of-objects.jpg",
    };
    Object.entries(covers).forEach(([alt, source]) => {
      document.querySelectorAll(`img[alt="${alt}"]`).forEach((image) => {
        image.removeAttribute("srcset");
        image.removeAttribute("sizes");
        image.src = source;
      });
    });
  };

  const updateIntroCta = () => {
    if (window.location.pathname !== "/elle-intro") return;
    document.querySelectorAll("a").forEach((link) => {
      if (link.textContent?.trim() === "Enter the Archive") {
        link.textContent = "Enter the Story";
      }
    });
  };

  const updateArchivePrompt = () => {
    if (window.location.pathname !== "/elle") return;
    document.querySelectorAll("p span").forEach((label) => {
      if (label.textContent?.trim().toLowerCase() === "enter the archive") {
        label.textContent = "Scroll to explore";
      }
    });
  };

  const updateElleArchiveMark = () => {
    if (window.location.pathname !== "/elle") return;
    const existing = document.querySelector("body > img[data-naato-archive-mark]");
    const anchor = document.querySelector("[data-naato-archive-anchor]");
    if (existing && !anchor) existing.remove();
    if (existing || anchor) return;

    const mark = [...document.querySelectorAll('svg[viewBox="0 0 38 14"]')]
      .find((element) => element.style.color);
    if (!mark) return;

    mark.dataset.naatoArchiveAnchor = "true";
    const markContainer = mark.parentElement;
    if (markContainer) {
      const archiveImage = document.createElement("img");
      archiveImage.alt = "NAATO";
      archiveImage.decoding = "async";
      archiveImage.draggable = false;
      archiveImage.dataset.naatoArchiveImage = "true";
      Object.assign(markContainer.style, { position: "relative" });
      Object.assign(archiveImage.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        objectFit: "contain",
        pointerEvents: "none",
      });
      archiveImage.addEventListener("load", () => {
        mark.style.visibility = "hidden";
      }, { once: true });
      archiveImage.src = "/images/naato-elle-wordmark.png";
      markContainer.append(archiveImage);
    }

    // TODO: 待废弃 全屏开场图已按需求停用，保留代码便于回滚。
    const showFullscreenArchiveImage = false;
    if (!showFullscreenArchiveImage) return;

    const image = document.createElement("img");
    image.src = "/images/naato-elle-banner-hd.png";
    image.alt = "NAATO";
    image.className = "block";
    Object.assign(image.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100dvh",
      maxWidth: "none",
      objectFit: "cover",
      pointerEvents: "none",
      zIndex: "100000",
    });
    image.dataset.naatoArchiveMark = "true";
    document.body.append(image);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      image.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1200, fill: "forwards" });
    }
    const dismiss = () => image.remove();
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("touchmove", dismiss, { once: true, passive: true });
  };

  const updatePageOverrides = () => {
    updateStoryLabels();
    updateCoverImages();
    updateIntroCta();
    updateArchivePrompt();
    updateElleArchiveMark();
  };

  new MutationObserver(updatePageOverrides).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  updatePageOverrides();
})();
