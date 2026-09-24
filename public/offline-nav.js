(() => {
  const currentPath = window.location.pathname
    .replace(/^\/life(?=\/|$)/, "/elle")
    .replace(/^\/objects(?=\/|$)/, "/esquire");
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

  document.addEventListener("contextmenu", (event) => {
    if (event.target.closest?.("img")) event.preventDefault();
  });
  document.addEventListener("dragstart", (event) => {
    if (event.target.closest?.("img")) event.preventDefault();
  });

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

  const updatePublicNamesAndLinks = () => {
    const routes = [[/^\/elle-intro(?=\/|$)/, "/life-intro"], [/^\/esquire-intro(?=\/|$)/, "/objects-intro"], [/^\/elle(?=\/|$)/, "/life"], [/^\/esquire(?=\/|$)/, "/objects"]];
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href") || "";
      const replacement = routes.reduce((value, [pattern, route]) => value.replace(pattern, route), href);
      if (replacement !== href) link.setAttribute("href", replacement);
    });
    const labels = new Map([["ELLE", "LIVING STORIES"], ["ESQUIRE", "OBJECT STORIES"], ["ELLE × ESQUIRE", "NAATO"]]);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent?.trim();
      if (labels.has(text)) walker.currentNode.textContent = walker.currentNode.textContent.replace(text, labels.get(text));
    }
  };

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

  const elleGalleryImages = ["/images/life/01.jpg","/images/life/02.jpg","/images/life/03.jpg","/images/life/04.jpg","/images/life/05.jpg","/images/life/06.jpg","/images/life/07.jpg","/images/life/08.png","/images/life/09.jpg","/images/life/10.jpg","/images/life/11.jpg","/images/life/12.jpg","/images/life/13.jpg","/images/life/14.png","/images/life/15.jpg","/images/life/16.jpg","/images/life/17.jpg","/images/life/18.jpg","/images/life/19.png","/images/life/20.png","/images/life/21.png","/images/life/22.png","/images/life/23.jpg","/images/life/24.png","/images/life/25.jpg","/images/life/26.jpg","/images/life/27.jpg","/images/life/28.jpg","/images/life/29.jpg","/images/life/30.png","/images/life/31.png","/images/life/32.jpg","/images/life/33.png","/images/life/34.jpg","/images/life/35.png","/images/life/36.jpg","/images/life/37.jpg","/images/life/38.jpg","/images/life/39.jpg","/images/life/40.png","/images/life/41.jpg","/images/life/42.jpg","/images/life/43.jpg","/images/life/44.jpg","/images/life/45.jpg","/images/life/46.jpg","/images/life/47.jpg"];
  const elleDetailDescriptions = ["Chasing Daylight","Passing Light","First Departure","Through Crowds","Resting Light","Green Court","Red Shelter","Sunlit Gaze","Amber Touch","Side by Side","Dusk Walk","Shadow Line","Through Petals","In Transit","Chance Meeting","Sea Whisper","Window Light","Windblown Joy","Looking Back","Face the Sun","Sunlit Drive","Quiet Sun","City Stride","Sea Laugh","Beyond Court","Wings Rising","Coastal Hours","Windward","Twin Silence","Chasing Light","Shared Joy","Window Pause","City Gaze","Blue Horizon","Open Stride","Quiet Interior","At the Door","Turning Wind","Metal Glow","Mirror Glow","Street Poise","Noon Pause","Side Glance","White in Motion","Last Light","Winged Sonata","Light Stays"];
  const elleChangeImages = {3:"/images/life/03.jpg",4:"/images/life/04.jpg",6:"/images/life/06.jpg",10:"/images/life/10.jpg",11:"/images/life/11.jpg",16:"/images/life/16.jpg",17:"/images/life/17.jpg",27:"/images/life/27.jpg",34:"/images/life/34.jpg",37:"/images/life/37.jpg",47:"/images/life/47.jpg"};
  const elleChangeDescriptions = {3:"Free Ride",4:"Make Waves",6:"City Frequency",10:"Grounded Power",11:"Court Focus",16:"Beach Motion",17:"Skybound Motion",27:"Poised Strength",34:"Game Rhythm",37:"Ocean Pulse",47:"Sunlit Passage"};
  Object.assign(elleChangeDescriptions, {
    3: "Own the Ride", 4: "Chase the Break", 6: "Move Your Way",
    10: "Power in Motion", 11: "Play Beyond Limits", 16: "Rise Above Routine",
    17: "Ride the Sky", 27: "Strength Looks Effortless", 34: "Own Every Move",
    37: "Find Your Wave", 47: "Live in Light",
  });
  const esquireGalleryImages = Array.from({ length: 40 }, (_, index) => `/images/objects/${String(index + 1).padStart(2, "0")}.jpg`);
  const esquireDetailCopy = [["Emerald Precision","Light, skin, and geometry turn jewellery into quiet architecture."],["Wild Emerald","Precious stones meet the untamed textures of nature."],["Designed Companionship","Pet fashion becomes a joyful extension of personal style."],["Companion Motion","Everyday mobility designed around comfort, character, and companionship."],["Domestic Heat","Fashion and technology meet in a cinematic domestic moment."],["Quiet Living","Space, material, and light create an atmosphere of considered calm."],["Soft Confidence","Comfort is expressed through colour, texture, and effortless presence."],["Shared Ritual","Thoughtful design brings people and their companions closer."],["Reflected Form","A mirrored perspective transforms movement into visual sculpture."],["Framed Horizon","Fashion, landscape, and geometry become one composed image."],["Emerald Night","Emerald light gives classical jewellery a mysterious modern presence."],["Light Structure","Architecture and illumination shape a new silhouette of elegance."],["Moving Form","A functional object is elevated through texture and sculptural detail."],["Colour Walk","Pet accessories become expressive objects of contemporary fashion."],["Warm Technology","Intelligent design belongs naturally within the rhythms of home."],["New Familiar","Fashion and companionship meet through colour, intimacy, and character."],["Evening Ritual","Designed objects transform an open landscape into a place of gathering."],["Future Surface","Reflection turns technology into a cinematic fashion environment."],["Clean Frequency","Everyday technology is reimagined with energy, colour, and attitude."],["Home Ritual","Warmth, food, and companionship define the emotional life of objects."],["Blue Cycle","Precision technology meets the immersive visual language of water."],["Shared Table","Everyday rituals become stories of warmth, care, and connection."],["Fresh Horizon","Performance and fashion move together beneath an open sky."],["Quiet Craft","A simple gesture reveals care, precision, and sensory pleasure."],["Electric Expression","Personal technology becomes bold, playful, and unapologetically visible."],["New Signal","Colour and technology shape a confident new creative identity."],["Moving Interface","Utility becomes style when technology responds to human gesture."],["Open System","A familiar device becomes an object of performance and self-expression."],["Mediterranean Bloom","Citrus, colour, and flowers translate fragrance into a vivid landscape."],["Pure Reflection","Surface and silhouette give technology an unexpected sense of elegance."],["Framed Escape","A distant figure turns landscape into a story of possibility."],["Liquid Heritage","Fragrance floats between tradition, clarity, and modern restraint."],["Scent Focus","A classic fragrance is reframed with youthful visual intelligence."],["Cool Precision","Tailoring and technology share the same language of exact form."],["Future Familiar","The everyday city becomes a stage for imagined futures."],["Moving Colonia","Fabric, water, and gesture translate scent into visual sensation."],["Interior Red","A single colour gives domestic space confidence and theatrical presence."],["Veiled Light","Transparency softens the portrait into a tactile study of intimacy."],["Scent Unfolded","Fragrance appears through shadow, movement, and translucent layers."],["Garden Reverie","Light, literature, and nature create a private world of reflection."]];
  Object.assign(esquireDetailCopy, {
    3: ["See Beyond", "Innovation becomes meaningful when it changes how we see the everyday. NAATO gives functional design a sharper identity through light, movement, and confident visual direction."],
    5: ["Designed to Flow", "The best environments make complexity feel effortless. Order, usability, and visual clarity work together to turn everyday preparation into a seamless experience."],
    6: ["Hold the Moment", "Scent creates an instant connection between feeling and memory. A restrained visual language makes that invisible experience feel personal and tangible."],
    19: ["Make Time Beautiful", "Daily routines deserve considered design. Warmth, technology, and human presence come together to create a more intuitive way of living."],
    27: ["Keep What Matters", "Lasting identity is built through materials that feel honest and details that invite attention. Every object becomes part of a more meaningful personal world."],
    28: ["Return to Origin", "A powerful brand story begins with something elemental. Nature, memory, and craftsmanship give fragrance a character that feels both grounded and timeless."],
    29: ["Scent Becomes Memory", "Fragrance lives beyond the bottle. Through atmosphere, texture, and association, it becomes a visual world people can recognise and remember."],
    30: ["Power, Refined", "Performance does not need visual noise. Precision, control, and confident proportion make technology feel desirable before its function is explained."],
    31: ["Live with Intention", "Thoughtful spaces shape better habits. Every surface and interaction contributes to an environment designed for clarity, confidence, and ease."],
    32: ["Make Space Iconic", "A distinctive point of view turns an interior into a brand statement. Fashion, technology, and architecture combine to create immediate recognition."],
    34: ["Let Freshness Linger", "A clear sensory idea can make fragrance visible. Lightness, movement, and natural energy express a freshness designed to remain in memory."],
    36: ["Curate the Everyday", "The objects around us reveal how we choose to live. Culture, design, and personal ritual come together in a world that feels considered and individual."],
    39: ["Stories Stay Close", "The strongest objects carry meaning beyond their function. Fragrance becomes a quiet companion to memory, emotion, and the stories we keep."],
  });

  const updateElleGalleryImages = () => {
    if (currentPath !== "/elle") return;
    document.querySelectorAll('a[href^="/elle/"]').forEach((link, index) => {
      const image = link.querySelector("img");
      const source = elleChangeImages[index + 1] || elleGalleryImages[index];
      if (!image || !source || image.dataset.naatoSource === source) return;
      image.removeAttribute("srcset");
      image.removeAttribute("sizes");
      image.src = source;
      image.dataset.naatoSource = source;
    });
  };

  const updateElleDetail = () => {
    const match = currentPath.match(/^\/elle\/(\d+)\/?$/);
    const detailIndex = match ? Number(match[1]) - 1 : -1;
    if (detailIndex < 0 || detailIndex >= elleGalleryImages.length) return;

    const images = [...document.querySelectorAll("img")].filter((image) => image.alt);
    images.forEach((image, index) => {
      const sourceIndex = index === 0 ? detailIndex : (index - 1) % elleGalleryImages.length;
      const source = elleChangeImages[sourceIndex + 1] || elleGalleryImages[sourceIndex];
      if (!source || image.dataset.naatoSource === source) return;
      image.removeAttribute("srcset");
      image.removeAttribute("sizes");
      image.src = source;
      image.dataset.naatoSource = source;
    });

    const heading = document.querySelector("h1[aria-label]");
    if (heading && heading.textContent?.replace(/\s/g, "") !== "LivingSTORIES") {
      heading.innerHTML = '<span class="block font-ivy-headline! text-headline-10 tracking-[0.05em]">Living</span><span class="block font-ivy-headline! tracking-[0.05em] text-headline-20 uppercase">STORIES</span>';
    }
    if (heading?.getAttribute("aria-label") !== "Living STORIES") heading?.setAttribute("aria-label", "Living STORIES");
    const description = elleChangeDescriptions[detailIndex + 1] || elleDetailDescriptions[detailIndex];
    const dateLabel = [...document.querySelectorAll("span.block.font-instrument-sans")]
      .find((element) => /\d{4}/.test(element.textContent || ""));
    if (dateLabel && dateLabel.textContent !== description) dateLabel.textContent = description;
    document.querySelectorAll("span").forEach((element) => {
      if (/^(PHOTOGRAPH|VISUAL) BY /i.test(element.textContent?.trim() || "")) element.hidden = true;
    });
    if (document.title !== "Living STORIES") document.title = "Living STORIES";
  };

  const updateEsquireImages = () => {
    if (currentPath === "/esquire") {
      document.querySelectorAll('a[href^="/esquire/"]').forEach((link, index) => {
        const image = link.querySelector("img");
        const source = esquireGalleryImages[index];
        if (!image || !source) return;
        Object.assign(image.style, { objectFit: "contain", objectPosition: "center" });
        if (image.dataset.naatoSource === source) return;
        image.removeAttribute("srcset");
        image.removeAttribute("sizes");
        image.src = source;
        image.dataset.naatoSource = source;
      });
      return;
    }
    const match = currentPath.match(/^\/esquire\/(\d+)\/?$/);
    const detailIndex = match ? Number(match[1]) - 1 : -1;
    if (detailIndex < 0 || detailIndex >= esquireGalleryImages.length) return;
    [...document.querySelectorAll("img")].filter((image) => image.alt).forEach((image, index) => {
      const sourceIndex = index === 0 ? detailIndex : (index - 1) % esquireGalleryImages.length;
      const source = esquireGalleryImages[sourceIndex];
      if (!source) return;
      Object.assign(image.style, { objectFit: "contain", objectPosition: "center" });
      if (image.dataset.naatoSource === source) return;
      image.removeAttribute("srcset");
      image.removeAttribute("sizes");
      image.src = source;
      image.dataset.naatoSource = source;
    });
  };

  const updateEsquireDetailCopy = () => {
    const match = currentPath.match(/^\/esquire\/(\d+)\/?$/);
    const detailIndex = match ? Number(match[1]) - 1 : -1;
    const copy = esquireDetailCopy[detailIndex];
    if (!copy) return;

    const [title, text] = copy;
    const dateLabel = document.querySelector("p.flex.flex-col span.block.font-instrument-sans");
    if (dateLabel && dateLabel.dataset.naatoCopy !== title) {
      dateLabel.textContent = title;
      dateLabel.dataset.naatoCopy = title;
    }
    const credit = document.querySelector("p.flex.flex-col span.block.font-arizona");
    if (credit) credit.hidden = true;
    const body = document.querySelector('p.font-instrument-sans[class~="text-[#909090]"]');
    if (body && body.dataset.naatoCopy !== title) {
      const animatedText = body.querySelector("span");
      if (animatedText) animatedText.textContent = text;
      else body.textContent = text;
      body.dataset.naatoCopy = title;
    }
    const heading = document.querySelector("h1[aria-label]");
    if (heading && heading.getAttribute("aria-label") !== "Aesthetic STORIES") {
      const parts = [...heading.querySelectorAll("span.block")];
      if (parts[0]) parts[0].textContent = "Aesthetic";
      if (parts[1]) parts[1].textContent = "STORIES";
      heading.setAttribute("aria-label", "Aesthetic STORIES");
    }
    if (document.title !== title) document.title = title;
  };

  const updateIntroCta = () => {
    if (currentPath !== "/elle-intro") return;
    document.querySelectorAll("a").forEach((link) => {
      if (link.textContent?.trim() === "Enter the Archive") {
        link.textContent = "Enter the Story";
      }
    });
  };

  const updateArchivePrompt = () => {
    if (currentPath !== "/elle") return;
    document.querySelectorAll("p span").forEach((label) => {
      if (label.textContent?.trim().toLowerCase() === "enter the archive") {
        label.textContent = "Scroll to explore";
      }
    });
  };

  const updateElleHeaderMark = () => {
    if (currentPath !== "/elle") return;
    const mark = document.querySelector('header button[aria-label="Open menu"] svg[viewBox="0 0 38 14"]');
    if (!mark || mark.dataset.naatoHeaderAnchor) return;

    mark.dataset.naatoHeaderAnchor = "true";
    const container = mark.parentElement;
    if (!container) return;

    const logo = document.createElement("img");
    logo.alt = "NAATO";
    logo.decoding = "async";
    logo.draggable = false;
    logo.dataset.naatoHeaderImage = "true";
    Object.assign(container.style, { position: "relative", width: "90px", height: "21px" });
    Object.assign(logo.style, {
      position: "absolute", inset: "0", width: "100%", height: "100%",
      objectFit: "contain", pointerEvents: "none",
    });
    logo.addEventListener("load", () => { mark.style.visibility = "hidden"; }, { once: true });
    logo.src = "/images/naato-header-logo.jpg";
    container.append(logo);
  };

  const updateElleArchiveMark = () => {
    if (currentPath !== "/elle") return;
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
      archiveImage.src = "/images/brand/life-archive.png";
      markContainer.append(archiveImage);
    }

    // TODO: 待废弃 全屏开场图已按需求停用，保留代码便于回滚。
    const showFullscreenArchiveImage = false;
    if (!showFullscreenArchiveImage) return;

    const image = document.createElement("img");
    image.src = "/images/brand/life-banner.png";
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

  const updateEsquireArchiveMark = () => {
    if (currentPath !== "/esquire") return;
    const mark = [...document.querySelectorAll('svg[viewBox="0 0 68 10"]')]
      .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];
    if (!mark || mark.dataset.naatoEsquireAnchor) return;
    const container = mark.parentElement;
    if (!container) return;

    mark.dataset.naatoEsquireAnchor = "true";
    const logo = document.createElement("img");
    logo.src = "/images/brand/wordmark.png";
    logo.alt = "NAATO";
    logo.decoding = "async";
    logo.draggable = false;
    logo.dataset.naatoEsquireImage = "true";
    Object.assign(container.style, { position: "relative" });
    Object.assign(logo.style, {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: "50%",
      height: "50%",
      transform: "translate(-50%, -50%)",
      objectFit: "contain",
      pointerEvents: "none",
    });
    logo.addEventListener("load", () => { mark.style.visibility = "hidden"; }, { once: true });
    container.append(logo);
  };

  const updateEsquireHeaderMark = () => {
    if (currentPath !== "/esquire") return;
    const mark = document.querySelector('header svg[viewBox="0 0 68 10"]');
    if (!mark || mark.dataset.naatoEsquireHeader) return;
    const container = mark.parentElement;
    if (!container) return;

    mark.dataset.naatoEsquireHeader = "true";
    const logo = document.createElement("img");
    logo.src = "/images/brand/wordmark.png";
    logo.alt = "NAATO";
    logo.decoding = "async";
    logo.draggable = false;
    Object.assign(container.style, { position: "relative" });
    Object.assign(logo.style, {
      position: "absolute", inset: "0", width: "100%", height: "100%",
      objectFit: "contain", pointerEvents: "none",
    });
    logo.addEventListener("load", () => { mark.style.visibility = "hidden"; }, { once: true });
    container.append(logo);
  };

  const updatePageOverrides = () => {
    updateStoryLabels();
    updateCoverImages();
    updateElleGalleryImages();
    updateElleDetail();
    updateEsquireImages();
    updateEsquireDetailCopy();
    updateIntroCta();
    updateArchivePrompt();
    updateElleHeaderMark();
    updateElleArchiveMark();
    updateEsquireArchiveMark();
    updateEsquireHeaderMark();
    updatePublicNamesAndLinks();
  };

  new MutationObserver(updatePageOverrides).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  updatePageOverrides();
})();
