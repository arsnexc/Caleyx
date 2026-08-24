(() => {
  const PRODUCTS = [
    {
      id: "magnesium-glycinate-400",
      name: "Magnesium Glycinate 400",
      shortName: "Magnesium Glycinate",
      price: 34,
      subscribePrice: 28.9,
      benefit: "Sleep, stress & muscle recovery",
      spec: "60 capsules · 400 mg · chelated",
      cardSpec: "60 capsules · 400 mg · chelated",
      form: "p-bottle",
      accent: "acc-sage",
      labelName: "Magnesium<br />Glycinate",
      labelSpec: "400 MG · 60 CAP",
      eyebrow: "Nightly ritual · Sleep · Stress · Recovery",
      blurb:
        "Fully chelated bisglycinate — the gentlest form of magnesium — dosed at the level used in sleep and recovery research. Two capsules, one hour before bed.",
      facts: [
        ["Serving size", "2 capsules"],
        ["Magnesium (as bisglycinate chelate)", "400 mg †"],
        ["Glycine (from chelate)", "550 mg †"],
        ["Capsule", "Vegetable cellulose"],
        ["Other ingredients", "None"],
      ],
      ritual:
        "Take two capsules with water about sixty minutes before bed. Consistent nightly use for four weeks allows glycine’s effects on sleep architecture to fully develop. Safe to take alongside magnesium-rich foods.",
      testing:
        "Every production run is assayed for potency and screened for heavy metals by Eurofins, an independent laboratory. Scan the lot code on your jar to read its certificate.",
      concerns: ["sleep", "stress", "daily"],
      related: ["ashwagandha-ksm-66", "vitamin-d3-k2", "omega-3-triglyceride"],
    },
    {
      id: "omega-3-triglyceride",
      name: "Omega-3 Triglyceride",
      shortName: "Omega-3 Triglyceride",
      price: 42,
      subscribePrice: 35.7,
      benefit: "Heart & cognitive function",
      spec: "90 softgels · 1,000 mg · rTG form",
      cardSpec: "90 softgels · 1,000 mg · rTG form",
      form: "p-glass",
      accent: "acc-honey",
      labelName: "Omega-3<br />Triglyceride",
      labelSpec: "1000 MG · 90 SG",
      eyebrow: "Daily essential · Heart · Cognition · Eyes",
      blurb:
        "Re-esterified triglyceride fish oil — the form the body recognises — providing 1,000 mg EPA+DHA per serving. Molecularly distilled, from wild-caught anchovy.",
      facts: [
        ["Serving size", "2 softgels"],
        ["Total omega-3 (as rTG)", "1,000 mg †"],
        ["EPA (eicosapentaenoic acid)", "600 mg †"],
        ["DHA (docosahexaenoic acid)", "400 mg †"],
        ["Softgel", "Fish gelatin"],
        ["Other ingredients", "Mixed tocopherols"],
      ],
      ritual:
        "Take two softgels with the first meal of the day. The triglyceride form is absorbed without a high-fat meal. Refrigeration is optional; keep out of direct sun.",
      testing:
        "Each lot is tested for oxidation (TOTOX), heavy metals, and dioxins. Certificates are published against the lot code printed on the base of the bottle.",
      concerns: ["heart", "daily"],
      related: ["vitamin-d3-k2", "marine-collagen-peptides", "probiotic-50-billion"],
    },
    {
      id: "ashwagandha-ksm-66",
      name: "Ashwagandha KSM-66",
      shortName: "Ashwagandha KSM-66",
      price: 38,
      subscribePrice: 32.3,
      benefit: "Daily stress response balance",
      spec: "60 capsules · 600 mg · root only",
      cardSpec: "60 capsules · 600 mg · root only",
      form: "p-jar",
      accent: "acc-clay",
      labelName: "Ashwagandha<br />KSM-66",
      labelSpec: "600 MG · 60 CAP",
      eyebrow: "Daytime ritual · Stress · Focus · Stamina",
      blurb:
        "Full-spectrum KSM-66 root extract — no leaf — at the 600 mg dose used in clinical work on perceived stress and serum cortisol. One capsule, morning.",
      facts: [
        ["Serving size", "1 capsule"],
        ["KSM-66 ashwagandha root extract", "600 mg †"],
        ["Withanolides (5%)", "30 mg †"],
        ["Plant part", "Root only"],
        ["Capsule", "Vegetable cellulose"],
        ["Other ingredients", "None"],
      ],
      ritual:
        "Take one capsule with breakfast. Effects on stress response typically settle between weeks two and eight. Not for use during pregnancy; speak with a clinician if you take thyroid medication.",
      testing:
        "Identity is confirmed by HPLC against the KSM-66 reference standard. Heavy metals and residual solvents are screened every batch.",
      concerns: ["stress", "sleep", "daily"],
      related: ["magnesium-glycinate-400", "probiotic-50-billion", "omega-3-triglyceride"],
    },
    {
      id: "vitamin-d3-k2",
      name: "Vitamin D3 + K2 Drops",
      shortName: "Vitamin D3 + K2",
      price: 28,
      subscribePrice: 23.8,
      benefit: "Immunity & bone health",
      spec: "30 mL · 2,000 IU · MCT base",
      cardSpec: "30 mL · 2,000 IU · MCT base",
      form: "p-dropper",
      accent: "acc-slate",
      labelName: "Vitamin D3 + K2",
      labelSpec: "30 ML · 2000 IU",
      eyebrow: "Morning drops · Immunity · Bone · Mood",
      blurb:
        "Cholecalciferol with MK-7 K2 in a fractionated coconut MCT base. One millilitre delivers 2,000 IU D3 and 75 mcg K2 — no flavouring, no colour.",
      facts: [
        ["Serving size", "1 mL (1 dropper)"],
        ["Vitamin D3 (cholecalciferol)", "2,000 IU (50 mcg)"],
        ["Vitamin K2 (MK-7)", "75 mcg †"],
        ["Base", "MCT oil (coconut)"],
        ["Servings per bottle", "30"],
        ["Other ingredients", "None"],
      ],
      ritual:
        "Take one dropperful by mouth, or stir into the first meal. Fat-soluble — consistency matters more than time of day. Recap tightly; the dropper is calibrated to 1 mL.",
      testing:
        "Potency is verified at fill and at six months. K2 is all-trans MK-7. Heavy metals and peroxide value are published per lot.",
      concerns: ["immunity", "daily"],
      related: ["omega-3-triglyceride", "magnesium-glycinate-400", "marine-collagen-peptides"],
    },
    {
      id: "marine-collagen-peptides",
      name: "Marine Collagen Peptides",
      shortName: "Marine Collagen Peptides",
      price: 52,
      subscribePrice: 44.2,
      benefit: "Skin, hair & joint support",
      spec: "300 g · type I · wild-caught",
      cardSpec: "300 g · type I · wild-caught",
      form: "p-powder",
      accent: "acc-oat",
      labelName: "Marine Collagen<br />Peptides",
      labelSpec: "300 G · TYPE I",
      eyebrow: "Morning tin · Skin · Hair · Joints",
      blurb:
        "Type I peptides from wild-caught whitefish, enzymatically hydrolysed to 2–4 kDa for solubility. Unflavoured. One scoop dissolves in coffee, tea, or cold water.",
      facts: [
        ["Serving size", "10 g (1 scoop)"],
        ["Hydrolysed marine collagen (type I)", "10 g †"],
        ["Protein", "9 g"],
        ["Source", "Wild-caught whitefish"],
        ["Servings per tin", "30"],
        ["Other ingredients", "None"],
      ],
      ritual:
        "Stir one scoop into a warm drink each morning. Heat-stable below a simmer. A tin is thirty days at the research dose used in dermal elasticity studies.",
      testing:
        "Each lot is tested for residual protein identity, heavy metals, and microbiological load. Fish species is confirmed by PCR.",
      concerns: ["skin", "daily"],
      related: ["omega-3-triglyceride", "vitamin-d3-k2", "ashwagandha-ksm-66"],
    },
    {
      id: "probiotic-50-billion",
      name: "Probiotic 50 Billion",
      shortName: "Probiotic 50 Billion",
      price: 44,
      subscribePrice: 37.4,
      benefit: "Gut flora & digestion",
      spec: "30 capsules · 12 strains · shelf-stable",
      cardSpec: "30 capsules · 12 strains · shelf-stable",
      form: "p-bottle",
      accent: "acc-slate",
      labelName: "Probiotic<br />50 Billion",
      labelSpec: "30 CAP · 12 STRAINS",
      eyebrow: "Morning capsule · Gut · Digestion · Immunity",
      blurb:
        "Fifty billion CFU across twelve human-studied strains, delayed-release and shelf-stable — no refrigerator required. One capsule, first thing.",
      facts: [
        ["Serving size", "1 capsule"],
        ["Live cultures (at expiry)", "50 billion CFU †"],
        ["Strains", "12 (Lactobacillus & Bifidobacterium)"],
        ["Capsule", "Delayed-release vegetable cellulose"],
        ["Prebiotic", "None — take with food if preferred"],
        ["Other ingredients", "None"],
      ],
      ritual:
        "Take one capsule on waking, or with breakfast if your stomach is sensitive. No refrigeration. Finish the bottle within sixty days of opening.",
      testing:
        "CFU counts are guaranteed through the printed expiry, not at manufacture. Strain identity is confirmed by 16S sequencing. Moisture is held below 5%.",
      concerns: ["gut", "immunity", "daily"],
      related: ["ashwagandha-ksm-66", "magnesium-glycinate-400", "marine-collagen-peptides"],
    },
  ];

  const CART_KEY = "calyx.cart.v1";
  const PROFILE_KEY = "calyx.profile.v1";
  const NEWS_KEY = "calyx.news.v1";
  const SHIP_FREE = 75;

  const money = (n) =>
    Number(n).toLocaleString("en-US", { style: "currency", currency: "USD" });

  const byId = (id) => PRODUCTS.find((p) => p.id === id) || null;

  const labelHTML = (p, show) => {
    if (!show) return "";
    return `<span class="lbl">
      <span class="lb">CALYX</span>
      <span class="ln">${p.labelName}</span>
      ${p.form === "p-jar" ? '<span class="rule"></span>' : ""}
      <span class="ls">${p.labelSpec}</span>
    </span>`;
  };

  const renderHTML = (p, { mini = false, label = true } = {}) => {
    if (!p) return "";
    const cls = `p ${p.form} ${p.accent}${mini ? " mini" : ""}`;
    if (p.form === "p-dropper") {
      return `<span class="${cls}">
        <span class="bulb"></span>
        <span class="collar"></span>
        <span class="vial">
          <span class="pipette"></span>
          ${labelHTML(p, label)}
        </span>
      </span>`;
    }
    if (p.form === "p-jar") {
      return `<span class="${cls}">
        <span class="lid"></span>
        <span class="pot">${labelHTML(p, label)}</span>
      </span>`;
    }
    if (p.form === "p-powder") {
      return `<span class="${cls}">
        <span class="lid-metal"></span>
        <span class="jar">${labelHTML(p, label)}</span>
      </span>`;
    }
    return `<span class="${cls}">
      <span class="cap"></span>
      <span class="neck"></span>
      <span class="bod">${labelHTML(p, label)}</span>
    </span>`;
  };

  const cardHTML = (p, { delay = 0, reveal = true } = {}) => {
    const d = delay ? ` style="--d: ${delay}ms"` : "";
    const rev = reveal ? " data-reveal" : "";
    return `<article class="card"${rev}${d}>
      <div class="media">
        <a class="card-media" href="product.html?id=${p.id}" aria-label="View ${p.name}">
          <span class="render" aria-hidden="true">${renderHTML(p)}</span>
        </a>
        <button class="quick-add" type="button" data-add data-id="${p.id}">Quick add · ${money(p.price).replace(".00", "")}</button>
      </div>
      <div class="card-info">
        <div class="card-row">
          <h3>${p.name}</h3>
          <span class="price">${money(p.price).replace(".00", "")}</span>
        </div>
        <p class="card-desc">${p.benefit}</p>
        <span class="card-spec">${p.cardSpec}</span>
      </div>
    </article>`;
  };

  const loadCart = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY));
      if (raw && Array.isArray(raw.items)) return raw;
    } catch {
      /* ignore */
    }
    return { items: [] };
  };

  const saveCart = (state) => {
    localStorage.setItem(CART_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("calyx:cart", { detail: state }));
  };

  const unitPrice = (product, plan) =>
    plan === "sub" ? product.subscribePrice : product.price;

  const hydrate = (state) => {
    const items = [];
    for (const line of state.items) {
      const product = byId(line.id);
      if (!product) continue;
      const plan = line.plan === "sub" ? "sub" : "once";
      const qty = Math.min(12, Math.max(1, Number(line.qty) || 1));
      const unit = unitPrice(product, plan);
      items.push({
        id: product.id,
        plan,
        qty,
        product,
        unit,
        line: unit * qty,
      });
    }
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.line, 0);
    const shipping = subtotal === 0 || subtotal >= SHIP_FREE ? 0 : 6;
    return { items, count, subtotal, shipping, total: subtotal + shipping };
  };

  const cart = {
    read: () => hydrate(loadCart()),
    add({ id, plan = "once", qty = 1 }) {
      if (!byId(id)) return hydrate(loadCart());
      const state = loadCart();
      const nextQty = Math.min(12, Math.max(1, Number(qty) || 1));
      const key = plan === "sub" ? "sub" : "once";
      const found = state.items.find((x) => x.id === id && x.plan === key);
      if (found) found.qty = Math.min(12, found.qty + nextQty);
      else state.items.push({ id, plan: key, qty: nextQty });
      saveCart(state);
      return hydrate(state);
    },
    setQty(id, plan, qty) {
      const state = loadCart();
      const line = state.items.find((x) => x.id === id && x.plan === plan);
      if (!line) return hydrate(state);
      const n = Number(qty);
      if (!Number.isFinite(n) || n < 1) {
        state.items = state.items.filter((x) => !(x.id === id && x.plan === plan));
      } else {
        line.qty = Math.min(12, Math.floor(n));
      }
      saveCart(state);
      return hydrate(state);
    },
    remove(id, plan) {
      const state = loadCart();
      state.items = state.items.filter((x) => !(x.id === id && x.plan === plan));
      saveCart(state);
      return hydrate(state);
    },
    clear() {
      saveCart({ items: [] });
      return hydrate({ items: [] });
    },
  };

  const profile = {
    read() {
      try {
        return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null;
      } catch {
        return null;
      }
    },
    save(data) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
      return data;
    },
    signOut() {
      localStorage.removeItem(PROFILE_KEY);
    },
  };

  const news = {
    add(email) {
      const list = (() => {
        try {
          return JSON.parse(localStorage.getItem(NEWS_KEY)) || [];
        } catch {
          return [];
        }
      })();
      if (!list.includes(email)) list.push(email);
      localStorage.setItem(NEWS_KEY, JSON.stringify(list));
    },
  };

  window.Calyx = {
    PRODUCTS,
    SHIP_FREE,
    money,
    byId,
    renderHTML,
    cardHTML,
    cart,
    profile,
    news,
  };
})();
