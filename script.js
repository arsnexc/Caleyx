(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);
  const store = window.Calyx;
  if (!store) return;

  const toast = (() => {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    let timer = 0;
    return (msg) => {
      el.textContent = msg;
      el.classList.add("show");
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove("show"), 2200);
    };
  })();

  const syncBadges = () => {
    const { count } = store.cart.read();
    $$(".ct").forEach((ct) => {
      ct.textContent = String(count);
      const parent = ct.closest("[aria-label]");
      if (parent) {
        parent.setAttribute("aria-label", `Cart, ${count} ${count === 1 ? "item" : "items"}`);
      }
    });
  };
  syncBadges();
  window.addEventListener("calyx:cart", syncBadges);

  const hdr = $("#hdr");
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = "↑";
  document.body.appendChild(toTop);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.setProperty("--progress", `${percent}%`);
    hdr && hdr.classList.toggle("scrolled", window.scrollY > 8);
    toTop.classList.toggle("visible", window.scrollY > 560);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop.addEventListener("click", () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
  });

  const tgl = $("#navTgl");
  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    if (tgl) tgl.setAttribute("aria-expanded", "false");
  };
  if (tgl) {
    tgl.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      tgl.setAttribute("aria-expanded", String(open));
    });
    $$("#mnav a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  const bindReveals = (root = document) => {
    const nodes = $$("[data-reveal]", root).filter((el) => !el.classList.contains("is-in"));
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    nodes.forEach((el) => io.observe(el));
  };
  bindReveals();

  const flashAdded = (btn) => {
    if (!btn) return;
    const original = btn.dataset.label || btn.innerHTML;
    btn.dataset.label = original;
    btn.classList.add("added");
    btn.innerHTML = "Added";
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = btn.dataset.label;
      btn.classList.remove("added");
      btn.disabled = false;
    }, 1400);
  };

  const addFromButton = (btn) => {
    const id = btn.dataset.id;
    if (!id || !store.byId(id)) return;
    const qty = Number(btn.dataset.qty) || 1;
    const plan = btn.dataset.plan === "sub" ? "sub" : "once";
    store.cart.add({ id, plan, qty });
    const product = store.byId(id);
    toast(`${product.shortName} added to bag`);
    flashAdded(btn);
  };

  const bindAdds = (root = document) => {
    $$("[data-add]", root).forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => addFromButton(btn));
    });
  };
  bindAdds();

  const ensureSearch = () => {
    if ($("#searchOverlay")) return $("#searchOverlay");
    const wrap = document.createElement("div");
    wrap.id = "searchOverlay";
    wrap.className = "search-overlay";
    wrap.hidden = true;
    wrap.innerHTML = `
      <div class="search-panel" role="dialog" aria-modal="true" aria-labelledby="searchTitle">
        <div class="search-head">
          <h2 id="searchTitle" class="eyebrow">Search the collection</h2>
          <button type="button" class="icon-btn" data-search-close aria-label="Close search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <label class="search-field">
          <span class="visually-hidden">Search products</span>
          <input id="searchInput" type="search" placeholder="Magnesium, collagen, sleep…" autocomplete="off" />
        </label>
        <div id="searchResults" class="search-results"></div>
      </div>`;
    document.body.appendChild(wrap);
    return wrap;
  };

  const searchOverlay = ensureSearch();
  const searchInput = $("#searchInput");
  const searchResults = $("#searchResults");

  const paintSearch = (q) => {
    const query = q.trim().toLowerCase();
    const hits = store.PRODUCTS.filter((p) => {
      if (!query) return true;
      const hay = `${p.name} ${p.benefit} ${p.spec} ${p.eyebrow} ${p.concerns.join(" ")}`.toLowerCase();
      return hay.includes(query);
    });
    if (!hits.length) {
      searchResults.innerHTML = `<p class="empty-copy">No formulas match “${escapeHTML(q.trim())}”.</p>`;
      return;
    }
    searchResults.innerHTML = hits
      .map(
        (p) => `<a class="search-hit" href="product.html?id=${p.id}">
          <span class="search-thumb render" aria-hidden="true">${store.renderHTML(p, { mini: true })}</span>
          <span>
            <strong>${p.name}</strong>
            <em>${p.benefit}</em>
          </span>
          <span class="price">${store.money(p.price).replace(".00", "")}</span>
        </a>`
      )
      .join("");
  };

  const openSearch = () => {
    searchOverlay.hidden = false;
    document.body.classList.add("overlay-open");
    paintSearch(searchInput.value);
    setTimeout(() => searchInput.focus(), 20);
  };
  const closeSearch = () => {
    searchOverlay.hidden = true;
    document.body.classList.remove("overlay-open");
  };

  $$("[data-search], .icon-btn[aria-label='Search']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openSearch();
    });
  });
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay || e.target.closest("[data-search-close]")) closeSearch();
  });
  searchInput.addEventListener("input", () => paintSearch(searchInput.value));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSearch();
      closeMenu();
    }
    const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
    if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && !typing) {
      e.preventDefault();
      openSearch();
    }
  });

  const bindAccordion = (acc) => {
    const btn = $(".acc-btn", acc);
    const panel = $(".acc-panel", acc);
    if (!btn || !panel || btn.dataset.bound) return;
    btn.dataset.bound = "1";
    const setOpen = (open) => {
      acc.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    };
    btn.addEventListener("click", () => setOpen(!acc.classList.contains("open")));
    if (acc.id && location.hash === `#${acc.id}`) setOpen(true);
  };
  $$(".acc").forEach(bindAccordion);

  const newsForm = $("#newsForm");
  if (newsForm) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsForm.email?.value?.trim();
      if (!email) return;
      store.news.add(email);
      newsForm.style.display = "none";
      const done = $("#newsDone");
      if (done) done.style.display = "block";
    });
  }

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Shop grid ---------- */
  const shopGrid = $("#shopGrid");
  if (shopGrid) {
    const filters = $$("[data-filter]");
    const paint = (concern) => {
      const list =
        concern === "all"
          ? store.PRODUCTS
          : store.PRODUCTS.filter((p) => p.concerns.includes(concern));
      shopGrid.innerHTML = list.length
        ? list.map((p, i) => store.cardHTML(p, { delay: (i % 3) * 80 })).join("")
        : `<p class="empty-copy">Nothing in this ritual yet.</p>`;
      bindAdds(shopGrid);
      bindReveals(shopGrid);
      filters.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === concern)));
    };
    filters.forEach((b) => b.addEventListener("click", () => paint(b.dataset.filter)));
    const start = new URLSearchParams(location.search).get("filter") || "all";
    paint(start);
  }

  /* ---------- Home collection (ensure IDs even if markup is static) ---------- */
  $$(".grid-cards .card").forEach((card) => {
    const link = $("a.card-media", card);
    if (!link) return;
    const id = new URL(link.href, location.href).searchParams.get("id");
    const add = $("[data-add]", card);
    if (id && add && !add.dataset.id) add.dataset.id = id;
  });

  /* ---------- Product page ---------- */
  const pdp = $("#pdp");
  if (pdp) {
    const params = new URLSearchParams(location.search);
    const product = store.byId(params.get("id")) || store.PRODUCTS[0];
    if (!params.get("id")) {
      history.replaceState(null, "", `product.html?id=${product.id}`);
    }
    document.title = `${product.name} — Calyx`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", product.blurb);

    pdp.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <span class="sep" aria-hidden="true">/</span>
        <a href="shop.html">Collection</a>
        <span class="sep" aria-hidden="true">/</span>
        <span aria-current="page">${product.name}</span>
      </nav>
      <div class="pdp-grid">
        <div class="gal" data-reveal>
          <div class="render stage" id="stage" data-view="front" aria-label="Product imagery" role="group">
            ${store.renderHTML(product)}
            <span class="swatch" aria-hidden="true"></span>
          </div>
          <div class="thumbs" role="group" aria-label="Alternate views">
            <button class="thumb" type="button" data-view="front" aria-current="true" aria-label="Front view">
              ${store.renderHTML(product, { mini: true, label: false })}
            </button>
            <button class="thumb" type="button" data-view="detail" aria-current="false" aria-label="Label detail view">
              ${store.renderHTML(product, { mini: true, label: false })}
            </button>
            <button class="thumb thumb-swatch" type="button" data-view="texture" aria-current="false" aria-label="Texture view"></button>
          </div>
        </div>
        <div class="buy">
          <span class="eyebrow" data-reveal>${product.eyebrow}</span>
          <h1 class="display" data-reveal style="--d: 60ms">${product.name}</h1>
          <p class="buy-sub" data-reveal style="--d: 120ms">${product.blurb}</p>
          <div class="buy-meta" data-reveal style="--d: 180ms">
            <span class="buy-price" id="buyPrice">${store.money(product.price)}</span>
            <span class="buy-was" id="buyWas">${store.money(product.price)}</span>
            <span class="buy-save" id="buySave">Save 15% · every 30 days</span>
          </div>
          <div class="seg" role="group" aria-label="Purchase options" data-reveal style="--d: 240ms">
            <button type="button" id="planOnce" aria-pressed="true">
              One-time
              <small>${store.money(product.price)}</small>
            </button>
            <button type="button" id="planSub" aria-pressed="false">
              Subscribe &amp; save
              <small>${store.money(product.subscribePrice)} · 30 days</small>
            </button>
          </div>
          <div class="qty-row" data-reveal style="--d: 300ms">
            <div class="qty">
              <button type="button" id="qtyMinus" aria-label="Decrease quantity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path d="M5 12h14" /></svg>
              </button>
              <output id="qtyOut" aria-live="polite">1</output>
              <button type="button" id="qtyPlus" aria-label="Increase quantity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </div>
            <button class="btn" type="button" id="atc" data-add data-id="${product.id}" data-qty="1" data-plan="once">
              Add to cart — <span id="atcTotal">${store.money(product.price)}</span>
            </button>
          </div>
          <p class="buy-reassure" data-reveal style="--d: 360ms">
            <span>Ships within 48h</span>
            <span>Carbon neutral</span>
            <span>30-day returns</span>
          </p>
          <div class="accs" data-reveal style="--d: 420ms">
            ${[
              ["Supplement facts", `<table class="facts"><tbody>${product.facts
                .map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`)
                .join("")}</tbody></table><p class="facts-note">† Daily value not established</p>`],
              ["The ritual", product.ritual],
              ["Testing & purity", product.testing],
              [
                "Shipping & returns",
                "Orders leave our facility within 48 hours in plastic-free, carbon-neutral packaging. Unopened items may be returned within 30 days; your first opened order is covered by a 60-night guarantee.",
              ],
            ]
              .map(
                ([title, body]) => `<div class="acc">
                <button class="acc-btn" type="button" aria-expanded="false">
                  ${title}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </button>
                <div class="acc-panel"><div class="acc-panel-inner">${body}</div></div>
              </div>`
              )
              .join("")}
          </div>
        </div>
      </div>`;

    const related = $("#relatedMount");
    if (related) {
      const picks = product.related.map((id) => store.byId(id)).filter(Boolean);
      related.innerHTML = picks.map((p, i) => store.cardHTML(p, { delay: i * 80 })).join("");
      bindAdds(related);
      bindReveals(related);
    }

    let qty = 1;
    let plan = "once";
    const price = $("#buyPrice");
    const was = $("#buyWas");
    const save = $("#buySave");
    const onceBtn = $("#planOnce");
    const subBtn = $("#planSub");
    const atc = $("#atc");
    const atcTotal = $("#atcTotal");
    const qtyOut = $("#qtyOut");

    const unit = () => (plan === "sub" ? product.subscribePrice : product.price);
    const renderBuy = () => {
      price.textContent = store.money(unit());
      was.classList.toggle("show", plan === "sub");
      save.classList.toggle("show", plan === "sub");
      onceBtn.setAttribute("aria-pressed", String(plan === "once"));
      subBtn.setAttribute("aria-pressed", String(plan === "sub"));
      atc.dataset.plan = plan;
      atc.dataset.qty = String(qty);
      atcTotal.textContent = store.money(unit() * qty);
    };
    onceBtn.addEventListener("click", () => {
      plan = "once";
      renderBuy();
    });
    subBtn.addEventListener("click", () => {
      plan = "sub";
      renderBuy();
    });
    $("#qtyMinus").addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      qtyOut.textContent = String(qty);
      renderBuy();
    });
    $("#qtyPlus").addEventListener("click", () => {
      qty = Math.min(6, qty + 1);
      qtyOut.textContent = String(qty);
      renderBuy();
    });

    $$(".acc", pdp).forEach((acc) => {
      const btn = $(".acc-btn", acc);
      const panel = $(".acc-panel", acc);
      btn.addEventListener("click", () => {
        const open = acc.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
        panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
      });
    });

    const stage = $("#stage");
    $$(".thumb[data-view]", pdp).forEach((t) => {
      t.addEventListener("click", () => {
        stage.dataset.view = t.dataset.view;
        $$(".thumb", pdp).forEach((x) => x.setAttribute("aria-current", "false"));
        t.setAttribute("aria-current", "true");
      });
    });

    bindAdds(pdp);
    bindReveals(pdp);
  }

  /* ---------- Cart page ---------- */
  const cartRoot = $("#cartRoot");
  if (cartRoot) {
    const paint = () => {
      const bag = store.cart.read();
      if (!bag.items.length) {
        cartRoot.innerHTML = `
          <div class="empty-state" data-reveal>
            <p class="eyebrow">Your bag</p>
            <h1 class="display">Nothing here yet.</h1>
            <p class="lede">Six formulas. Add one when you are ready.</p>
            <a class="btn" href="shop.html">Shop the collection</a>
          </div>`;
        bindReveals(cartRoot);
        return;
      }
      const shipNote =
        bag.shipping === 0
          ? "Complimentary carbon-neutral shipping"
          : `${store.money(store.SHIP_FREE - bag.subtotal)} away from complimentary shipping`;
      cartRoot.innerHTML = `
        <div class="cart-layout">
          <div>
            <p class="eyebrow" data-reveal>Your bag · ${bag.count} ${bag.count === 1 ? "item" : "items"}</p>
            <h1 class="display" data-reveal>Review &amp; continue.</h1>
            <ul class="bag-list">
              ${bag.items
                .map(
                  (line) => `<li class="bag-item" data-reveal>
                    <a class="bag-media render" href="product.html?id=${line.id}" aria-hidden="true">${store.renderHTML(line.product)}</a>
                    <div class="bag-info">
                      <div class="bag-top">
                        <div>
                          <h2><a href="product.html?id=${line.id}">${line.product.name}</a></h2>
                          <p>${line.plan === "sub" ? "Subscribe · every 30 days" : "One-time purchase"}</p>
                        </div>
                        <span class="price">${store.money(line.line)}</span>
                      </div>
                      <div class="bag-actions">
                        <div class="qty qty-sm">
                          <button type="button" data-qty-change="${line.id}" data-plan="${line.plan}" data-delta="-1" aria-label="Decrease quantity">−</button>
                          <output>${line.qty}</output>
                          <button type="button" data-qty-change="${line.id}" data-plan="${line.plan}" data-delta="1" aria-label="Increase quantity">+</button>
                        </div>
                        <button type="button" class="text-btn" data-remove="${line.id}" data-plan="${line.plan}">Remove</button>
                      </div>
                    </div>
                  </li>`
                )
                .join("")}
            </ul>
          </div>
          <aside class="cart-sum" data-reveal>
            <h2>Summary</h2>
            <dl>
              <div><dt>Subtotal</dt><dd>${store.money(bag.subtotal)}</dd></div>
              <div><dt>Shipping</dt><dd>${bag.shipping === 0 ? "Complimentary" : store.money(bag.shipping)}</dd></div>
              <div class="sum-total"><dt>Total</dt><dd>${store.money(bag.total)}</dd></div>
            </dl>
            <p class="ship-note">${shipNote}</p>
            <a class="btn btn-wide" href="checkout.html">Checkout</a>
            <a class="arrow-link cart-cont" href="shop.html">Continue shopping
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15" /><path d="M13 6l6 6-6 6" /></svg>
            </a>
          </aside>
        </div>`;
      bindReveals(cartRoot);
    };

    cartRoot.addEventListener("click", (e) => {
      const rem = e.target.closest("[data-remove]");
      if (rem) {
        store.cart.remove(rem.dataset.remove, rem.dataset.plan);
        paint();
        return;
      }
      const q = e.target.closest("[data-qty-change]");
      if (q) {
        const bag = store.cart.read();
        const line = bag.items.find((i) => i.id === q.dataset.qtyChange && i.plan === q.dataset.plan);
        if (!line) return;
        store.cart.setQty(line.id, line.plan, line.qty + Number(q.dataset.delta));
        paint();
      }
    });
    paint();
  }

  /* ---------- Checkout ---------- */
  const checkoutForm = $("#checkoutForm");
  if (checkoutForm) {
    const bag = store.cart.read();
    const summary = $("#orderSummary");
    const empty = $("#checkoutEmpty");
    if (!bag.items.length) {
      checkoutForm.hidden = true;
      if (empty) empty.hidden = false;
    } else if (summary) {
      summary.innerHTML = `
        <ul class="mini-lines">
          ${bag.items
            .map(
              (l) => `<li>
                <span>${l.product.shortName} × ${l.qty}${l.plan === "sub" ? " · sub" : ""}</span>
                <span>${store.money(l.line)}</span>
              </li>`
            )
            .join("")}
        </ul>
        <dl class="mini-tot">
          <div><dt>Subtotal</dt><dd>${store.money(bag.subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd>${bag.shipping === 0 ? "Complimentary" : store.money(bag.shipping)}</dd></div>
          <div class="sum-total"><dt>Total</dt><dd>${store.money(bag.total)}</dd></div>
        </dl>`;
    }

    const saved = store.profile.read();
    if (saved) {
      Object.entries(saved).forEach(([k, v]) => {
        if (checkoutForm.elements[k] && typeof v === "string") checkoutForm.elements[k].value = v;
      });
    }

    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const current = store.cart.read();
      if (!current.items.length) return;
      const data = Object.fromEntries(new FormData(checkoutForm).entries());
      store.profile.save({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        region: data.region,
        postal: data.postal,
        country: data.country,
      });
      const orderId = `CYX-${String(Date.now()).slice(-7)}`;
      const order = {
        id: orderId,
        at: new Date().toISOString(),
        email: data.email,
        name: data.name,
        total: current.total,
        items: current.items.map((i) => ({
          id: i.id,
          name: i.product.name,
          qty: i.qty,
          plan: i.plan,
          line: i.line,
        })),
      };
      const prev = JSON.parse(localStorage.getItem("calyx.orders.v1") || "[]");
      prev.unshift(order);
      localStorage.setItem("calyx.orders.v1", JSON.stringify(prev));
      store.cart.clear();
      location.href = `order.html?id=${orderId}`;
    });
  }

  /* ---------- Order confirmation ---------- */
  const orderRoot = $("#orderRoot");
  if (orderRoot) {
    const id = new URLSearchParams(location.search).get("id");
    const orders = JSON.parse(localStorage.getItem("calyx.orders.v1") || "[]");
    const order = orders.find((o) => o.id === id) || orders[0];
    if (!order) {
      orderRoot.innerHTML = `<div class="empty-state"><h1 class="display">No order found.</h1><a class="btn" href="shop.html">Return to shop</a></div>`;
    } else {
      orderRoot.innerHTML = `
        <p class="eyebrow" data-reveal>Order ${order.id}</p>
        <h1 class="display" data-reveal>Thank you, ${order.name.split(" ")[0]}.</h1>
        <p class="lede" data-reveal style="--d:80ms">A payment link and packing note will go to ${order.email}. Orders leave Portland within 48 hours.</p>
        <ul class="order-lines" data-reveal style="--d:140ms">
          ${order.items
            .map((i) => `<li><span>${i.name} × ${i.qty}${i.plan === "sub" ? " · subscription" : ""}</span><span>${store.money(i.line)}</span></li>`)
            .join("")}
          <li class="sum-total"><span>Total</span><span>${store.money(order.total)}</span></li>
        </ul>
        <a class="btn" href="shop.html">Continue</a>`;
      bindReveals(orderRoot);
    }
  }

  /* ---------- Account ---------- */
  const accountRoot = $("#accountRoot");
  if (accountRoot) {
    const paint = () => {
      const me = store.profile.read();
      const orders = JSON.parse(localStorage.getItem("calyx.orders.v1") || "[]");
      if (!me) {
        accountRoot.innerHTML = `
          <p class="eyebrow" data-reveal>Account</p>
          <h1 class="display" data-reveal>Sign in to Calyx.</h1>
          <p class="lede" data-reveal>We keep a local note of your details on this device — no password, no cloud.</p>
          <form class="stack-form" id="signinForm" data-reveal>
            <label>Full name<input name="name" required autocomplete="name" /></label>
            <label>Email<input name="email" type="email" required autocomplete="email" /></label>
            <button class="btn" type="submit">Continue</button>
          </form>`;
        $("#signinForm").addEventListener("submit", (e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.target).entries());
          store.profile.save(data);
          toast("Welcome back.");
          paint();
        });
        bindReveals(accountRoot);
        return;
      }
      accountRoot.innerHTML = `
        <p class="eyebrow" data-reveal>Signed in</p>
        <h1 class="display" data-reveal>${me.name}</h1>
        <p class="lede" data-reveal>${me.email}</p>
        <h2 class="subhead">Orders</h2>
        ${
          orders.length
            ? `<ul class="order-list">${orders
                .map(
                  (o) => `<li>
                    <a href="order.html?id=${o.id}">
                      <strong>${o.id}</strong>
                      <span>${new Date(o.at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · ${store.money(o.total)}</span>
                    </a>
                  </li>`
                )
                .join("")}</ul>`
            : `<p class="empty-copy">No orders on this device yet.</p>`
        }
        <button class="text-btn" type="button" id="signOut">Sign out</button>`;
      $("#signOut").addEventListener("click", () => {
        store.profile.signOut();
        paint();
      });
      bindReveals(accountRoot);
    };
    paint();
  }

  /* ---------- Contact ---------- */
  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactForm.hidden = true;
      const done = $("#contactDone");
      if (done) done.hidden = false;
    });
  }
})();
