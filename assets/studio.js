(function () {
  const K = "bambiStudioAppointmentRequest",
    S = {
      "frontal-ponytail-client-hair": {
        title: "Frontal Ponytail Excluding Frontal And Bundles",
        price: "R1 150,00",
        duration: "2h 30min",
        image: "booksy-services/frontal-ponytail-client-hair.jpeg",
        description:
          "Professional frontal ponytail installation and styling. Supply both the frontal and bundles, including a customised frontal.",
        prep: "Arrive with natural hair relaxed or blown out, with no oils or product.",
        includes:
          "Installation and styling using your supplied customised frontal and bundles.",
        disclaimer:
          "The final result depends on the supplied frontal and bundles. The same finish or natural appearance cannot be guaranteed where lace has thick knots, a thicker lace type, or hair unsuitable for the desired style.",
      },
      "hd-lace-lagos-frontal-ponytail": {
        title: "HD lace Lagos Frontal ponytail",
        price: "R3 350,00",
        duration: "2h 55min",
        image: "booksy-services/hd-lace-lagos-frontal-ponytail.jpeg",
        description:
          "A complete Lagos-hairline frontal ponytail service with premium hair and customisation included.",
        prep: "Arrive with hair relaxed or blown out, with no oils or product.",
        includes:
          "Pre-bleached, pre-plucked and customised 14-inch HD lace Lagos-hairline frontal; two 28-inch blended bundles; natural-hair sleek back; frontal installation; middle part, normal slick back, or side part.",
      },
      "basic-installation-straightening": {
        title: "Basic Installation + Straightening",
        price: "R750,00",
        duration: "1h 35min",
        image: "booksy-services/basic-installation-straightening.jpeg",
        description:
          "A streamlined appointment for a polished straight finish.",
        prep: "Bring your unit ready for installation.",
        includes: "Basic installation and straightening.",
      },
      "frontal-ponytail-including-hair": {
        title: "Frontal Ponytail Including Bundles And Frontal",
        price: "R2 200,00",
        duration: "2h 25min",
        image: "booksy-services/frontal-ponytail-including-hair.jpeg",
        description:
          "A complete frontal ponytail service with the frontal, bundles, customisation and styling included.",
        prep: "Arrive with natural hair relaxed or blown out, with no oils or product.",
        includes:
          "Fully customised, bleached and plucked 12-inch transparent lace frontal with natural hairline; two 28-inch blended bundles; frontal installation and styling.",
      },
      "installation-curling": {
        title: "Installation + Curling",
        price: "R950,00",
        duration: "1h 50min",
        image: "booksy-services/installation-curling.jpeg",
        description:
          "Installation and curled styling for a finished, dimensional look.",
        prep: "Arrive with wig lines already done.",
        includes:
          "Installation and curling/styling of the unit, with a side or middle part.",
      },
      "bob-installation": {
        title: "Bob Installation, Curls Or Straight, 10–14” inch",
        price: "R670,00",
        duration: "1h 30min",
        image: "booksy-services/bob-installation.jpeg",
        description: "A focused bob installation finished curled or straight.",
        prep: "Arrive with wig lines already done.",
        includes:
          "Installation and your choice of curls or a straight finish for a 10–14 inch bob.",
      },
      "half-up-half-down": {
        title: "Half Up Half Down With A Wig",
        price: "R1 230,00",
        duration: "2h 10min",
        image: "booksy-services/half-up-half-down.jpeg",
        description:
          "A styled wig installation with a half-up, half-down finish.",
        prep: "Arrive with wig lines already done.",
        includes: "Wig installation and half-up, half-down styling.",
      },
    };
  const esc = (v) =>
      String(v).replace(
        /[&<>'"]/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;",
          })[c],
      ),
    base = document
      .querySelector('link[href*="studio.css"]')
      ?.href.includes("/preview/")
      ? "../assets/"
      : "assets/";
  let slug =
      new URLSearchParams(location.search).get("service") ||
      JSON.parse(localStorage.getItem(K) || "{}").slug ||
      "hd-lace-lagos-frontal-ponytail",
    service = S[slug] || S["hd-lace-lagos-frontal-ponytail"];
  const tomorrow = () => {
    let d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };
  document
    .querySelectorAll("[data-appointment-date]")
    .forEach((e) => (e.min = tomorrow()));
  const menu = document.querySelector("[data-menu-toggle]"),
    nav = document.querySelector("[data-mobile-nav]");
  if (menu && nav) {
    if (!nav.id) nav.id = "mobileMenu";
    menu.setAttribute("aria-controls", nav.id);
    menu.setAttribute("aria-label", "Open menu");
    menu.addEventListener("click", () => {
      let o = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", o);
      menu.setAttribute("aria-label", o ? "Close menu" : "Open menu");
    });
  }
  const set = (q, v) => {
    const e = document.querySelector(q);
    if (e) e.textContent = v;
  };
  function renderService() {
    set("[data-service-title]", service.title);
    set("[data-service-price]", `${service.price} · ${service.duration}`);
    set("[data-service-description]", service.description);
    set("[data-service-duration]", service.duration);
    set("[data-service-includes]", service.includes);
    set("[data-service-prep]", service.prep);
    const disclaimer = document.querySelector("[data-service-disclaimer]");
    if (disclaimer) {
      disclaimer.hidden = !service.disclaimer;
      disclaimer.querySelector("span").textContent = service.disclaimer || "";
    }
    const image = document.querySelector("[data-service-image]");
    if (image) {
      image.src = base + service.image;
      image.alt = `Finished look for ${service.title}`;
    }
  }
  renderService();
  const select = document.querySelector("[data-service-select]");
  if (select) {
    select.innerHTML = Object.entries(S)
      .map(
        ([k, s]) =>
          `<option value="${k}"${k === slug ? " selected" : ""}>${esc(s.title)} — ${s.price}</option>`,
      )
      .join("");
    select.onchange = () => {
      slug = select.value;
      service = S[slug];
      history.replaceState(
        {},
        "",
        `booking.html?service=${encodeURIComponent(slug)}`,
      );
      renderService();
      const acknowledgement = document.querySelector(
        'input[name="properties[Preparation acknowledged]"]',
      );
      if (acknowledgement) {
        acknowledgement.checked = false;
        acknowledgement.focus();
      }
    };
  }
  const get = () => {
      try {
        return JSON.parse(localStorage.getItem(K) || "null");
      } catch {
        return null;
      }
    },
    rows = (p) =>
      Object.entries(p)
        .filter(([, v]) => v)
        .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
        .join(""),
    overlay = document.querySelector("[data-drawer-overlay]"),
    drawer = document.querySelector("[data-drawer]");
  function close() {
    if (overlay) overlay.hidden = true;
    if (drawer) drawer.hidden = true;
  }
  document
    .querySelectorAll("[data-drawer-close]")
    .forEach((b) => (b.onclick = close));
  overlay?.addEventListener("click", close);
  function summary(r) {
    const e = document.querySelector("[data-request-summary]");
    if (!e) return;
    e.innerHTML = `<p class="summary-kicker">Request prepared — not confirmed</p><h3>${esc(r.title)}</h3><p class="request-total">${r.price} · ${r.duration}</p><dl>${rows(r.properties)}</dl><a class="text-link" href="booking.html?service=${r.slug}&edit=request">Edit details</a>`;
  }
  document.querySelectorAll("[data-preview-booking]").forEach((f) => {
    let saved = get();
    if (saved && location.search.includes("edit=request"))
      Object.entries(saved.properties).forEach(([k, v]) => {
        let e = f.querySelector(`[name="properties[${CSS.escape(k)}]"]`);
        if (e)
          e.type === "checkbox" ? (e.checked = v === "Yes") : (e.value = v);
      });
    f.onsubmit = (e) => {
      if (!f.checkValidity()) return;
      e.preventDefault();
      let p = {};
      new FormData(f).forEach((v, k) => {
        let m = k.match(/^properties\[(.+)\]$/);
        if (m && v) p[m[1]] = String(v);
      });
      Object.assign(p, {
        Service: service.title,
        Price: service.price,
        Duration: service.duration,
      });
      let r = {
        slug,
        title: service.title,
        price: service.price,
        duration: service.duration,
        image: service.image,
        properties: p,
      };
      localStorage.setItem(K, JSON.stringify(r));
      summary(r);
      if (overlay) overlay.hidden = false;
      if (drawer) drawer.hidden = false;
    };
  });
  const cart = document.querySelector("[data-preview-cart]");
  if (cart) {
    let r = get();
    cart.innerHTML = r
      ? `<article class="cart-line"><img src="${base}${r.image}" alt="Finished look for ${esc(r.title)}"><div><p class="summary-kicker">Saved appointment request</p><h2>${esc(r.title)}</h2><dl class="properties property-list">${rows(r.properties)}</dl></div><strong>${r.price}<small>${r.duration}</small></strong></article><div class="cart-actions"><p>This request is saved on this device but is not confirmed. Availability and the 50% deposit still require studio review.</p><div><a class="button" href="booking.html?service=${r.slug}&edit=request">Edit request →</a><button class="button outline" data-clear-request>Clear request</button></div></div>`
      : '<div class="empty-state"><p class="eyebrow">Nothing prepared yet</p><h2>Your request is empty.</h2><a class="button" href="services.html">View services →</a></div>';
    cart
      .querySelector("[data-clear-request]")
      ?.addEventListener("click", () => {
        localStorage.removeItem(K);
        location.reload();
      });
  }
  if (!document.querySelector(".footer"))
    document.body.insertAdjacentHTML(
      "beforeend",
      '<footer class="footer"><div class="footer-grid"><div><a class="wordmark" href="index.html"><strong>BAMBÏ BEAUTY</strong><small>BOOKINGS</small></a><p>Luxury hair services by appointment only.</p></div><div><h3>Studio</h3><a href="services.html">Services</a><a href="preparation.html">Preparation</a></div><div><h3>Visit</h3><span>Workpods Midrand<br>Cnr. Brand Road &amp; Swart Dr<br>President Park AH, 1685</span></div></div></footer>',
    );
})();
