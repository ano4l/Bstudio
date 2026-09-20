import fs from "node:fs";
import path from "node:path";
const root = path.resolve(
  decodeURIComponent(new URL("..", import.meta.url).pathname).replace(
    /^\/(.:)/,
    "$1",
  ),
);
const required = [
  "layout/theme.liquid",
  "templates/index.json",
  "templates/collection.json",
  "templates/product.json",
  "templates/page.about.json",
  "templates/page.preparation.json",
  "templates/page.contact.json",
  "templates/cart.json",
  "sections/header.liquid",
  "sections/footer.liquid",
  "sections/hero-studio.liquid",
  "sections/featured-services.liquid",
  "sections/process.liquid",
  "sections/main-booking-product.liquid",
  "sections/main-collection.liquid",
  "sections/main-rich-page.liquid",
  "sections/main-contact.liquid",
  "sections/main-cart.liquid",
  "assets/studio.css",
  "assets/studio.js",
  "assets/studio-curly-install.jpg",
  "assets/studio-bob.png",
  "assets/studio-curls.png",
  "assets/studio-detail.png",
  "assets/studio-wave.png",
  "data/booksy-service-images.json",
  "config/settings_schema.json",
  "config/settings_data.json",
  "locales/en.default.json",
  "scripts/build.mjs",
  "vercel.json",
];
let errors = [];
for (const f of required)
  if (!fs.existsSync(path.join(root, f))) errors.push(`Missing ${f}`);
for (const dir of ["templates", "config", "locales", "sections"]) {
  for (const f of fs
    .readdirSync(path.join(root, dir))
    .filter((x) => x.endsWith(".json"))) {
    try {
      JSON.parse(fs.readFileSync(path.join(root, dir, f), "utf8"));
    } catch (e) {
      errors.push(`Invalid JSON ${dir}/${f}: ${e.message}`);
    }
  }
}
const product = fs.readFileSync(
  path.join(root, "sections/main-booking-product.liquid"),
  "utf8",
);
for (const needle of [
  "properties[Appointment date]",
  "properties[Appointment time preference]",
  "properties[Preparation acknowledged]",
  "content_for 'blocks'",
  '"type":"@app"',
])
  if (!product.includes(needle))
    errors.push(`Booking section missing ${needle}`);
for (const file of fs
  .readdirSync(path.join(root, "preview"))
  .filter((x) => x.endsWith(".html"))) {
  const s = fs.readFileSync(path.join(root, "preview", file), "utf8");
  if (/https?:\/\/[^"']+\.(png|jpg|jpeg|webp)/i.test(s))
    errors.push(`External image URL in preview/${file}`);
}
const hero = fs.readFileSync(
    path.join(root, "sections/hero-studio.liquid"),
    "utf8",
  ),
  previewHome = fs.readFileSync(path.join(root, "preview/index.html"), "utf8"),
  script = fs.readFileSync(path.join(root, "assets/studio.js"), "utf8"),
  previewBundle = fs
    .readdirSync(path.join(root, "preview"))
    .filter((x) => x.endsWith(".html"))
    .map((x) => fs.readFileSync(path.join(root, "preview", x), "utf8"))
    .join("\n");
if (!hero.includes("booksy-services/bambi-beauty-business.jpeg") || !previewHome.includes("booksy-services/bambi-beauty-business.jpeg"))
  errors.push("Home hero is not using the local Bambï Beauty business image");
if (hero.includes("studio-hero.png") || previewHome.includes("studio-hero.png"))
  errors.push("Deprecated retail hero reference remains");
for (const token of [
  "localStorage",
  "bambiStudioAppointmentRequest",
  "data-preview-cart",
  "Clear request",
  "Edit request",
])
  if (!script.includes(token) && !previewBundle.includes(token))
    errors.push(`Persisted request flow missing ${token}`);
const services = [
  ["Frontal Ponytail Excluding Frontal And Bundles", "R1 150,00", "2h 30min"],
  ["HD lace Lagos Frontal ponytail", "R3 350,00", "2h 55min"],
  ["Basic Installation + Straightening", "R750,00", "1h 35min"],
  ["Frontal Ponytail Including Bundles And Frontal", "R2 200,00", "2h 25min"],
  ["Installation + Curling", "R950,00", "1h 50min"],
  ["Bob Installation, Curls Or Straight, 10–14” inch", "R670,00", "1h 30min"],
  ["Half Up Half Down With A Wig", "R1 230,00", "2h 10min"],
];
const catalogueSource = `${previewBundle}\n${script}\n${fs.readFileSync(path.join(root, "data/shopify-services.csv"), "utf8")}`;
for (const facts of services) for (const fact of facts) if (!catalogueSource.includes(fact)) errors.push(`Catalogue fact missing: ${fact}`);
const servicesPreview = fs.readFileSync(
  path.join(root, "preview/services.html"),
  "utf8",
);
const previewServiceCards = [
  ...servicesPreview.matchAll(/<a\s+class="service-card[^"]*"[\s\S]*?<\/a>/g),
];
if (previewServiceCards.length !== services.length)
  errors.push(
    `Expected ${services.length} static service cards, found ${previewServiceCards.length}`,
  );
for (const [index, match] of previewServiceCards.entries()) {
  if (!/<img\s+[\s\S]*?src="\.\.\/assets\/booksy-services\/[^\"]+"[\s\S]*?>/.test(match[0]))
    errors.push(`Static service card ${index + 1} is missing a local image`);
  const alt = match[0].match(/<img\s+[\s\S]*?alt="([^"]*)"[\s\S]*?>/)?.[1]?.trim();
  if (!alt || alt.length < 12)
    errors.push(`Static service card ${index + 1} is missing meaningful alt text`);
}
const imageManifest = JSON.parse(fs.readFileSync(path.join(root, "data/booksy-service-images.json"), "utf8"));
if (Object.keys(imageManifest.services || {}).length !== services.length)
  errors.push("Booksy service image manifest must map exactly seven services");
for (const [slug, service] of Object.entries(imageManifest.services || {})) {
  if (!fs.existsSync(path.join(root, "assets", service.asset))) errors.push(`Missing local service image for ${slug}`);
  if (!service.sourceUrl?.includes("d375139ucebi94.cloudfront.net")) errors.push(`Missing public provenance URL for ${slug}`);
  if (!script.includes(`image: \"${service.asset}\"`)) errors.push(`Booking image does not match manifest for ${slug}`);
}
for (const source of [previewBundle, script, ...["sections/main-collection.liquid", "sections/featured-services.liquid", "sections/hero-studio.liquid"].map(file => fs.readFileSync(path.join(root, file), "utf8"))])
  if (source.includes("d375139ucebi94.cloudfront.net")) errors.push("Booksy image URL must not be used at runtime");
for (const liquidSection of ["sections/main-collection.liquid", "sections/featured-services.liquid"]) {
  const source = fs.readFileSync(path.join(root, liquidSection), "utf8");
  for (const token of ["product.featured_image", "image_tag", "fallback_asset", "asset_url", "alt:"])
    if (!source.includes(token))
      errors.push(`${liquidSection} is missing image fallback support: ${token}`);
}
for (const expectedAsset of Object.values(imageManifest.services).map(entry => entry.asset)) {
  if (!fs.readFileSync(path.join(root, "sections/main-collection.liquid"), "utf8").includes(expectedAsset))
    errors.push(`Shopify collection fallback missing ${expectedAsset}`);
}
const stylesheet = fs.readFileSync(path.join(root, "assets/studio.css"), "utf8");
const packageScript = fs.readFileSync(path.join(root, "scripts/package.ps1"), "utf8");
for (const token of ["-Recurse -File", "RelativePath", "DestinationDirectory"])
  if (!packageScript.includes(token)) errors.push(`Theme package must retain nested Booksy assets: ${token}`);
for (const token of ["--paper: #ede6d8", "--ivory: #f7f1e7", "--stone: #cdbfa9", "--black: #12110f"])
  if (!stylesheet.includes(token)) errors.push(`Warm palette token missing: ${token}`);
const catalogueFigureRule = stylesheet.match(
  /\.services-catalogue \.service-thumb\s*\{([\s\S]*?)\}/,
)?.[1];
for (const declaration of ["margin: 0", "min-width: 0", "position: relative"])
  if (!catalogueFigureRule?.includes(declaration))
    errors.push(`Catalogue figure rule missing ${declaration}`);
if (!/\.required-note\s*\{[\s\S]*?font-size:\s*14px\s*!important/.test(stylesheet))
  errors.push("Required appointment guidance must remain at least 14px");
for (const legacy of ["#541d27", "#3c121a", "#d7b8b2", "--oxblood", "--wine", "--blush", "Price set in Shopify"]) {
  const sources = ["assets/studio.css", "config/settings_data.json", "config/settings_schema.json", ...fs.readdirSync(path.join(root,"preview")).filter(f=>f.endsWith(".html")).map(f=>`preview/${f}`)];
  if (sources.some(file=>fs.readFileSync(path.join(root,file),"utf8").includes(legacy))) errors.push(`Legacy palette or placeholder remains: ${legacy}`);
}
const brandFiles = [
  "assets/studio.js",
  "config/settings_schema.json",
  ...fs.readdirSync(path.join(root, "sections")).filter((file) => file.endsWith(".liquid")).map((file) => `sections/${file}`),
  ...fs.readdirSync(path.join(root, "preview")).filter((file) => file.endsWith(".html")).map((file) => `preview/${file}`),
];
const exactWordmark = "<strong>BAMBÏ BEAUTY</strong><small>BOOKINGS</small>";
for (const file of brandFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (/Bambï Studio|<small>\s*STUDIO\s*<\/small>/i.test(source))
    errors.push(`Retired Bambï Studio branding remains in ${file}`);
  for (const match of source.matchAll(/<a\s+class=["']wordmark["'][\s\S]*?<\/a>/gi))
    if (!match[0].includes(exactWordmark))
      errors.push(`Incorrect Bambï Beauty Bookings wordmark in ${file}`);
}
for (const file of ["sections/header.liquid", "sections/footer.liquid", "assets/studio.js"])
  if (!fs.readFileSync(path.join(root, file), "utf8").includes(exactWordmark))
    errors.push(`Required Bambï Beauty Bookings wordmark missing from ${file}`);
const themeSettings = JSON.parse(fs.readFileSync(path.join(root, "config/settings_schema.json"), "utf8"));
if (themeSettings[0]?.theme_name !== "Bambï Beauty Bookings")
  errors.push("Shopify theme name must be Bambï Beauty Bookings");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Validated ${required.length} required theme files, JSON schemas, booking properties and ${fs.readdirSync(path.join(root, "preview")).filter((x) => x.endsWith(".html")).length} preview pages.`,
);
