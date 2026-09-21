(function () {
  const STORAGE_KEY = "bambiStudioAppointmentRequest";
  const SERVICES = {
    "traditional-frontal-ponytail": { title: "Traditional Frontal ponytail (hair included)", price: "R1 800,00", duration: "2 hours 40 minutes", image: "service-portfolio/classic-frontal-ponytail-01.jpeg", description: "A traditional frontal ponytail appointment with hair included.", prep: "Please come with your hair relaxed or finely blown out for a clean, seamless installation.", includes: "Hair includes a pre-bleached, pre-plucked transparent lace + 2 synthetic bundles." },
    "fluffy-frontal-ponytail": { title: "Fluffy frontal ponytail (hair included)", price: "R2 800,00", duration: "3 hours", image: "service-portfolio/fluffy-ponytail-01.jpeg", description: "A voluminous frontal ponytail appointment with hair included.", prep: "Preparation details are confirmed when your request is reviewed.", includes: "Includes 2 and a half 100% human hair bundles and a pre-bleached & plucked transparent lace frontal. Add-ons can be requested during appointment, e.g. edges." },
    "clean-installation-curling": { title: "Clean installation + Curling", price: "R950,00", duration: "2 hours", image: "service-portfolio/image00010.jpeg", description: "A clean installation finished with curling.", prep: "Please come with your wig lines already done.", includes: "Clean installation and curling finish." },
    "clean-installation-straightening": { title: "Clean installation + Straightening", price: "R750,00", duration: "1 hour 40 minutes", image: "service-portfolio/straightening-replacement.jpeg", gallery: ["service-portfolio/clean-straightening-face-blurred.png"], description: "A clean installation finished with straightening.", prep: "Please come with your wig lines already done.", includes: "Clean installation and straightening finish." },
    "half-up-half-down": { title: "Half up half down", price: "R1 150,00", duration: "Timing confirmed after request", image: "service-portfolio/image00015.jpeg", description: "A clean half-up, half-down finish.", prep: "Preparation details are confirmed when your request is reviewed.", includes: "Half-up, half-down styling." },
    "bob-installation-10-14-inch": { title: "Bob installation 10-14 inch", price: "R680,00", duration: "Timing confirmed after request", image: "service-portfolio/bob-01.jpeg", description: "A clean bob installation for a 10-14 inch length.", prep: "Preparation details are confirmed when your request is reviewed.", includes: "Bob installation for 10-14 inch hair." },
    "hd-lace-lagos-frontal-ponytail": { title: "HD lace Lagos frontal ponytail (hair included)", price: "R3 350,00", duration: "Timing confirmed after request", image: "service-portfolio/image00018.jpeg", description: "An HD lace Lagos frontal ponytail appointment with hair included.", prep: "Preparation details are confirmed when your request is reviewed.", includes: "Hair included." },
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const assetBase = document.querySelector('link[href*="studio.css"]')?.href.includes("/preview/") ? "../assets/" : "assets/";
  const setText = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value; };
  const nextFrame = (callback) => requestAnimationFrame(() => requestAnimationFrame(callback));
  const tomorrow = () => { const date = new Date(); date.setDate(date.getDate() + 1); return date.toISOString().slice(0, 10); };

  document.documentElement.classList.add("motion-ready");
  document.querySelectorAll("[data-appointment-date]").forEach((element) => { element.min = tomorrow(); });

  const header = document.querySelector(".site-header");
  if (header) {
    let ticking = false;
    const updateHeader = () => { header.classList.toggle("is-scrolled", window.scrollY > 18); ticking = false; };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); } };
    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  let menuReturnFocus = null;
  const setMenu = (open, restoreFocus = true) => {
    if (!menuButton || !mobileNav) return;
    if (!mobileNav.id) mobileNav.id = "mobileMenu";
    menuButton.setAttribute("aria-controls", mobileNav.id);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) {
      menuReturnFocus = document.activeElement;
      nextFrame(() => mobileNav.querySelector("a")?.focus());
    } else if (restoreFocus && menuReturnFocus instanceof HTMLElement) {
      menuReturnFocus.focus({ preventScroll: true });
      menuReturnFocus = null;
    }
  };
  menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  mobileNav?.addEventListener("click", (event) => { if (event.target.closest("a")) setMenu(false, false); });
  document.addEventListener("pointerdown", (event) => {
    if (mobileNav?.classList.contains("open") && !mobileNav.contains(event.target) && !menuButton?.contains(event.target)) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNav?.classList.contains("open")) setMenu(false);
  });

  const revealTargets = document.querySelectorAll("main > section, .service-card, .step, .content-page > *, .booking-image, .booking-copy, .cart-line, .empty-state");
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-item");
    if (element.matches(".service-card, .step")) element.style.setProperty("--reveal-order", String(index % 4));
  });
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealTargets.forEach((element) => observer.observe(element));
  }

  let slug = new URLSearchParams(location.search).get("service") || readRequest()?.slug || "traditional-frontal-ponytail";
  let service = SERVICES[slug] || SERVICES["traditional-frontal-ponytail"];
  const serviceImage = document.querySelector("[data-service-image]");
  function applyServiceCopy() {
    setText("[data-service-title]", service.title);
    setText("[data-service-price]", `${service.price} · ${service.duration}`);
    setText("[data-service-description]", service.description);
    setText("[data-service-duration]", service.duration);
    setText("[data-service-includes]", service.includes);
    setText("[data-service-prep]", service.prep);
    const disclaimer = document.querySelector("[data-service-disclaimer]");
    if (disclaimer) disclaimer.hidden = true;
  }
  function renderService(animate = false) {
    applyServiceCopy();
    if (!serviceImage) return;
    const source = assetBase + service.image;
    if (!animate || reduceMotion.matches || serviceImage.src.endsWith(service.image)) {
      serviceImage.src = source;
      serviceImage.alt = `Finished look for ${service.title}`;
      return;
    }
    serviceImage.classList.add("is-changing");
    const preload = new Image();
    preload.onload = () => {
      serviceImage.src = source;
      serviceImage.alt = `Finished look for ${service.title}`;
      nextFrame(() => serviceImage.classList.remove("is-changing"));
    };
    preload.onerror = () => serviceImage.classList.remove("is-changing");
    preload.src = source;
  }
  renderService();

  const serviceSelect = document.querySelector("[data-service-select]");
  if (serviceSelect) {
    serviceSelect.innerHTML = Object.entries(SERVICES).map(([key, item]) => `<option value="${key}"${key === slug ? " selected" : ""}>${escapeHtml(item.title)} — ${item.price}</option>`).join("");
    serviceSelect.addEventListener("change", () => {
      slug = serviceSelect.value;
      service = SERVICES[slug];
      history.replaceState({}, "", `booking.html?service=${encodeURIComponent(slug)}`);
      renderService(true);
      const acknowledgement = document.querySelector('input[name="properties[Preparation acknowledged]"]');
      if (acknowledgement) acknowledgement.checked = false;
    });
  }

  function readRequest() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; } }
  const rows = (properties) => Object.entries(properties).filter(([, value]) => value).map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
  const overlay = document.querySelector("[data-drawer-overlay]");
  const drawer = document.querySelector("[data-drawer]");
  let drawerReturnFocus = null;
  let drawerTimer = 0;
  function openDrawer(trigger) {
    if (!overlay || !drawer) return;
    clearTimeout(drawerTimer);
    drawerReturnFocus = trigger || document.activeElement;
    overlay.hidden = false;
    drawer.hidden = false;
    document.body.classList.add("drawer-open");
    nextFrame(() => {
      overlay.classList.add("is-open");
      drawer.classList.add("is-open");
      drawer.querySelector("[data-drawer-close]")?.focus({ preventScroll: true });
    });
  }
  function closeDrawer() {
    if (!overlay || !drawer || drawer.hidden) return;
    overlay.classList.remove("is-open");
    drawer.classList.remove("is-open");
    document.body.classList.remove("drawer-open");
    const finish = () => {
      overlay.hidden = true;
      drawer.hidden = true;
      if (drawerReturnFocus instanceof HTMLElement) drawerReturnFocus.focus({ preventScroll: true });
      drawerReturnFocus = null;
    };
    if (reduceMotion.matches) finish();
    else drawerTimer = window.setTimeout(finish, 300);
  }
  document.querySelectorAll("[data-drawer-close]").forEach((button) => button.addEventListener("click", closeDrawer));
  overlay?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && drawer && !drawer.hidden) closeDrawer(); });

  function renderSummary(request) {
    const element = document.querySelector("[data-request-summary]");
    if (!element) return;
    element.innerHTML = `<p class="summary-kicker">Request prepared — not confirmed</p><h3>${escapeHtml(request.title)}</h3><p class="request-total">${request.price} · ${request.duration}</p><dl>${rows(request.properties)}</dl><a class="text-link" href="booking.html?service=${request.slug}&edit=request">Edit details</a>`;
  }
  document.querySelectorAll("[data-preview-booking]").forEach((form) => {
    const saved = readRequest();
    if (saved && location.search.includes("edit=request")) Object.entries(saved.properties).forEach(([key, value]) => {
      const field = form.querySelector(`[name="properties[${CSS.escape(key)}]"]`);
      if (field) field.type === "checkbox" ? (field.checked = value === "Yes") : (field.value = value);
    });
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) return;
      event.preventDefault();
      const submit = form.querySelector('[type="submit"]');
      if (submit?.classList.contains("is-loading")) return;
      const properties = {};
      new FormData(form).forEach((value, key) => {
        const match = key.match(/^properties\[(.+)\]$/);
        if (match && value) properties[match[1]] = String(value);
      });
      Object.assign(properties, { Service: service.title, Price: service.price, Duration: service.duration });
      const request = { slug, title: service.title, price: service.price, duration: service.duration, image: service.image, properties };
      if (submit) {
        submit.dataset.label = submit.innerHTML;
        submit.classList.add("is-loading");
        submit.disabled = true;
        submit.innerHTML = 'Preparing request <span class="button-progress" aria-hidden="true"></span>';
      }
      window.setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(request));
        renderSummary(request);
        if (submit) {
          submit.classList.remove("is-loading");
          submit.disabled = false;
          submit.innerHTML = submit.dataset.label;
        }
        openDrawer(submit);
      }, reduceMotion.matches ? 0 : 260);
    });
  });

  const cart = document.querySelector("[data-preview-cart]");
  if (cart) {
    const request = readRequest();
    cart.innerHTML = request ? `<article class="cart-line"><img src="${assetBase}${request.image}" alt="Finished look for ${escapeHtml(request.title)}"><div><p class="summary-kicker">Saved appointment request</p><h2>${escapeHtml(request.title)}</h2><dl class="properties property-list">${rows(request.properties)}</dl></div><strong>${request.price}<small>${request.duration}</small></strong></article><div class="cart-actions"><p>This request is saved on this device but is not confirmed. Availability and the 50% deposit still require studio review.</p><div><a class="button" href="booking.html?service=${request.slug}&edit=request">Edit request →</a><button class="button outline" data-clear-request>Clear request</button></div></div>` : '<div class="empty-state"><p class="eyebrow">Nothing prepared yet</p><h2>Your request is empty.</h2><a class="button" href="services.html">View services →</a></div>';
    cart.querySelector("[data-clear-request]")?.addEventListener("click", () => { localStorage.removeItem(STORAGE_KEY); location.reload(); });
  }

  if (!document.querySelector(".footer")) document.body.insertAdjacentHTML("beforeend", '<footer class="footer"><div class="footer-grid"><div><a class="wordmark" href="index.html"><strong>BAMBÏ BEAUTY</strong><small>BOOKINGS</small></a><p>Luxury hair services by appointment only.</p></div><div><h3>Studio</h3><a href="services.html">Services</a><a href="preparation.html">Preparation</a></div><div><h3>Visit</h3><span>Workpods Midrand<br>Cnr. Brand Road &amp; Swart Dr<br>President Park AH, 1685</span></div></div></footer>');
})();
