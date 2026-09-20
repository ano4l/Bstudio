# Bambï Beauty Bookings

## Booksy catalogue migration (captured 20 September 2026)

The seven-service catalogue in `data/shopify-services.csv` was transcribed from the published Bambï Beauty Booksy listing. In Shopify Admin, go to **Products → Import**, upload that CSV, review the seven draft products, add them to the services collection, assign imagery, and only then publish. The CSV includes price plus `custom.duration`, `custom.inclusions`, and `custom.preparation` metafield columns. Create matching product metafield definitions if Shopify prompts for them.

## Public portfolio image provenance

The local files in `assets/booksy-services/` are public Bambï Beauty portfolio images captured from the supplied Booksy listing on 20 September 2026. The exact service-to-image mapping and original public URLs are recorded in `data/booksy-service-images.json`; the site never loads Booksy image URLs at runtime. Verify rights and current use with Bambï Beauty before public launch.

The local preview stores an appointment request on the device. It does not inspect live availability, confirm a slot, collect the 50% deposit, or publish products to Shopify. A configured booking app must own live slots and confirmation.

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
4. In Shopify Admin, use Products → Import to upload `data/shopify-services.csv`. Its seven draft products already contain the exact service names, prices, durations, descriptions, inclusions and preparation details captured from Booksy on 20 September 2026. Add the imported products to a services collection.
5. Create product metafields:
   - `custom.duration` for the confirmed duration.
   - `custom.inclusions` for confirmed service inclusions.
   - `custom.preparation` for the service-specific arrival guidance.
6. Choose the services collection in the Header and Featured services sections.
7. Create About, Preparation and Contact pages and assign their matching templates.
8. Verify the captured service facts, policies, preparation rules, location and hours against the business's current records before publishing; update only if the business confirms that a fact has changed.

The product form stores preferred date, time, optional stylist, notes and preparation acknowledgement as Shopify line-item properties. The cart surfaces these properties.

## Booking app boundary

The product section includes a Shopify `@app` block. Install and configure Sesami, Tipo, Cowlendar or another suitable booking app if the store needs live capacity, slots, reminders and confirmations. The app should own real availability. Test the complete booking, notification and payment/deposit workflow inside Shopify before publishing.

## Final production checks

- Verify all seven imported service records and prices against the current business records.
- Confirm that the captured appointment and deposit policies remain current.
- Confirm that the captured Workpods Midrand location and operating hours remain current.
- Configure the final Bambï Beauty shop URL before turning the hair-collection label into a link.
- Test mobile navigation, keyboard behavior, booking-app integration and real Shopify checkout.
