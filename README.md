# Bambï Studio

An editorial appointment-request website with two distinct delivery paths:

- `dist/` is the seven-page static website for Vercel.
- `bambi-studio-theme.zip` is the Shopify Online Store 2.0 theme for a separate booking store.

Neither preview nor theme invents live availability. Appointment dates and times are preferences until reviewed by the studio or a configured booking app.

## Commands

```powershell
npm run check
npm run build
npm run package
```

`check` validates required Shopify paths, JSON, booking properties, the differentiated Studio hero, preview routes, and persisted-request invariants. It is not a substitute for Shopify Theme Check.

## Local static preview

```powershell
npm run build
python -m http.server 4174 --directory dist
```

Open `http://localhost:4174/`. The root and all six linked pages are emitted directly into `dist/`.

The booking preview saves a prepared request to localStorage. `cart.html` renders the chosen date, time, service option, acknowledgement and optional notes. Users can edit or clear it. This remains a local request demonstration, not a confirmed appointment.

## Deploy the static site to Vercel

1. Push this project to the intended Git repository.
2. Import the repository in Vercel.
3. Vercel reads `vercel.json`, runs `npm run build`, and publishes `dist/`.
4. Confirm the production URL, every route, and the saved request flow before sharing it.

No framework preset is required. `cleanUrls` is enabled and no SPA fallback is used.

## Upload the Shopify theme

1. Run `npm run package`.
2. In Shopify Admin, open Online Store → Themes → Add theme → Upload zip file.
3. Upload `bambi-studio-theme.zip` and preview it before publishing.
4. Create a collection for installation services and add each service as a Shopify product.
5. Create product metafields:
   - `custom.duration` for the confirmed duration.
   - `custom.inclusions` for confirmed service inclusions.
6. Choose the services collection in the Header and Featured services sections.
7. Create About, Preparation and Contact pages and assign their matching templates.
8. Replace all demo copy with confirmed prices, policies, preparation rules, location and hours.

The product form stores preferred date, time, optional stylist, notes and preparation acknowledgement as Shopify line-item properties. The cart surfaces these properties.

## Booking app boundary

The product section includes a Shopify `@app` block. Install and configure Sesami, Tipo, Cowlendar or another suitable booking app if the store needs live capacity, slots, reminders and confirmations. The app should own real availability. Test the complete booking, notification and payment/deposit workflow inside Shopify before publishing.

## Final production checks

- Configure actual service content and prices.
- Replace policy placeholders with confirmed merchant policies.
- Add location and hours only when confirmed.
- Configure the final Bambï Beauty URL before turning the sister-store label into a link.
- Test mobile navigation, keyboard behavior, booking-app integration and real Shopify checkout.
