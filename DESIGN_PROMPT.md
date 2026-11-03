# Rebuild or migrate Truth with Data

Copy the prompt below into your coding assistant. Attach this repository and your current website's source when available. Replace the implementation-mode choice before starting.

---

You are redesigning **Truth with Data**, a publication and growing data consultancy. Build a polished contemporary editorial experience that serves curious readers, data practitioners, businesses, and individuals. The goals are to increase readership and make it easy for relevant visitors to book a consultancy call.

**Implementation mode:** [Choose: recreate this prototype from scratch / migrate my existing production website to this design.]

Inspect my existing code, content, source assets, tool implementations, and deployment setup first. Use `site-config.js`, the supplied article exports, and the prototype as the content and behavior references. Preserve the existing stack for a migration unless there is a concrete technical reason to change it. For a fresh prototype, prefer portable HTML/CSS/JavaScript unless I request a framework.

## Visual direction

- Crisp, contemporary editorial design: white backgrounds, dark ink, cobalt accents, precise grids, and intentional spacing.
- Starting tokens: ink `#15202c`, blue `#2055eb`, muted text `#647080`, borders `#dfe4ea`, pale surfaces `#f2f5fa`.
- Use expressive but restrained sans-serif headlines and comfortable body typography. The prototype uses Manrope and DM Sans with system fallbacks.
- Maintain the Truth with Data name and supplied logo. Use actual research and charts as the visual focus. Label any conceptual illustration as such; never present invented marks as measured data.
- Use subtle borders, clear hierarchy, meaningful section changes, and consistent controls. Avoid full-screen decorative heroes and repetitive feature cards.
- Design for desktop and small screens. Ensure strong focus states, readable contrast, comfortable touch targets, semantic markup, and reduced-motion support.

## Background animation

Use the supplied React Bits Grainient effect (https://reactbits.dev/c/backgrounds/grainient). Port its lifecycle into the existing stack; do not introduce React solely for a background. The reference adaptation is in `grainient.js`. Use **one consistent palette** everywhere: white, ice blue, cobalt, and soft slate. Vary angle, flow, and seed slightly by page; do not give each page a different color theme. Make Grainient a full-viewport page backdrop rather than a background constrained to a component. Extend it behind the shared header on all pages using a transparent header, while preserving navigation readability. Give the homepage featured analysis a bordered white box within the content width; do not extend it into a full-width white slab. Calculator panels and resource cards must also have solid white backgrounds. Remove the header’s bottom divider so its backdrop continues seamlessly. Fade it smoothly to white as the visitor scrolls past the introduction, and restore it on return to the top. Use white overlays that protect text contrast. Reading and calculator surfaces should remain calm. Study cards are an intentional exception to the single-palette backdrop: preserve their restrained blue, teal, violet, and warm surfaces.

Pause offscreen and hidden-tab rendering, respect reduced motion dynamically, cap pixel ratio/frame rate, and clean up animation frames, observers, listeners, and WebGL resources on route changes. Provide a static gradient fallback. Keep backgrounds decorative and out of the accessibility tree; do not intercept clicks. Preserve source attribution and verify the upstream license before redistribution.

## Page architecture

### Homepage

Use the exact hero title **Discovering Truth Through Data** and subtitle **Transforming complex data into clear insights with rigorous analysis and statistics**. Do not restore the removed homepage straplines or the footer’s “Local design preview” label.

Use a compact introduction and a featured analysis, followed by stories/tutorials, selected research, practical tools, and a concise consultancy invitation. Keep “Book a call” in the shared header. Balance editorial exploration with the consulting conversion goal.

### Insights directory and full articles

Offer clear categories and working filters. Display full article bodies locally, including the introduction, findings, tables, methods, limitations, citations, FAQs, and code. Do not substitute summaries or buttons that send readers elsewhere for the rest of the article.

Use a clear article header, metadata, a readable body column, and a sticky contents rail on desktop. Provide section navigation, reading progress, horizontally scrollable tables, expandable code blocks, responsive figures, and related reading. On mobile, move the contents controls above the body. Keep technical and financial caveats that are part of the actual analysis.

### Research studies

Use a two-column collection on desktop and one column on mobile. Each card should have a prominent real finding, a clear research question, a short description, topic tags, and an explicit reading action. Use restrained, distinct surface colors to separate study topics.

Show the full supplied study on its reading page. Do not add repetitive disclaimers such as “These are independent demonstration projects, not commissioned client work” to the collection, homepage, or footer. Do not misrepresent the projects as commissioned client engagements or invent clients or outcomes.

### Tools workspace

Use a compact **left-hand selector** and a large main panel that switches tools in place. Preserve the selected tool in the URL. On mobile, place the selector above the tool in a scrollable row. Avoid a long directory as the primary tools experience.

Support the supplied calculators: sample size, ROI, descriptive statistics, standard deviation/variance, percentiles/quartiles, correlation, covariance, AI job exposure, and UK rent vs buy. Preserve original numerical methods and explanatory context when porting. Validate empty, non-numeric, insufficient, and undefined inputs. Show useful errors and clear results.

The sample-size tool estimates one population proportion; do not describe it as an A/B-test power calculator. The ROI tool distinguishes total returned from net profit.

If using frames, sandbox them and measure their natural body height. Never use the iframe viewport's scroll height plus padding in a resize loop. Ignore unchanged measurements and validate message source. Vendor required data/model scripts for production; do not silently replace a missing model with invented outputs.

### Resources

Use a centered, responsive grid of available products. Align pricing and purchase controls without fixed heights that clip text. Preserve actual product details, prices, preview destinations, and checkout behavior. Use `currency.js` and `data-price-amount`/`data-price-currency` markup to show approximate local prices. Keep original amounts immutable, apply formatting after every page render, reveal a checkout-currency note only after conversion, and retain original prices when conversion is unavailable. Preserve geo detection, timezone/language fallback, cache, API mirrors, and fallback rates. The static preview does not implement `/api/geo`; use an existing authorized geolocation endpoint if available in production. Avoid emphasizing unavailable products or presenting a mailto enquiry as an instant checkout.

### Services and consultancy

Add a brief homepage service section and a dedicated Services navigation page. Use all supplied service descriptions, features, and the transparency note; the note can be expandable. Connect service actions to the consultancy conversation/booking journey.

Explain the problems the supplied services help solve, show relevant work, and offer an explicit route to the existing 30-minute Calendly booking page. Keep email available as an alternative. Never invent credentials, testimonials, client logos, or guaranteed results. Booking and other external actions require a user click.

## Content and integration rules

- Preserve supplied substantive content, statistics, methodology, citations, code, and scientific limitations. Do not invent missing sections or data. Flag suspected factual issues for review rather than silently changing conclusions during a design migration.
- Keep article/study links local when their content exists. Maintain source citations to external research.
- Use real figure assets, preserve alt text, and host required charts locally for production. Chart descriptions are a fallback, not a substitute for acquiring available assets.
- Import only needed content. Exclude original tracking, advertising, duplicate navigation, and unrelated scripts from the redesigned shell.
- Include real calculation code, data files, and runtime dependencies. Saved HTML alone may omit AI or housing models, report generation, downloads, or live-demo backends. Identify and resolve each missing dependency explicitly.
- Preserve the original configuration fields or provide a documented migration adapter. Keep content editing straightforward.
- Do not deploy or modify the live website unless I explicitly request that step. Build and review the replacement locally first.

## Static deployment

Keep the sample deployable as static HTML/CSS/JavaScript. `npm run build` packages the browser runtime into `dist/`, excluding source exports, documentation, Git bundles, and tests. Set the hosting publish directory to `dist`. Hash routes work on static hosting without server rewrites. The files still depend on original remote chart assets and the AI/housing model scripts until those are vendored. A production migration can replace hash routing with preserved public paths as described below.

## Production migration requirements

Preserve existing public URLs, or supply explicit redirects. Add per-page titles, descriptions, canonical URLs, social metadata, appropriate structured data, and a sitemap using the real domain. Avoid using prototype hash routes as the production URL scheme unless specifically required.

Integrate existing forms, newsletter subscriptions, payments, and report downloads only when their code and authorized configuration are available. Keep credentials out of source control. Confirm the intended analytics/consent behavior rather than adding trackers by default.

## Acceptance checks

- All full articles and studies are readable locally, including original code examples and source references.
- Every local navigation link and contents control works, including keyboard navigation and browser back/forward.
- Tool selection appears on the left on desktop and above the main panel on mobile.
- Repeated tool switches and changing results do not cause continuous frame growth.
- Calculator results match known fixtures from the original implementation. Cover valid, invalid, boundary, and undefined cases; inspect the AI/housing tools with their actual data loaded.
- Resource cards remain centered with aligned actions at wide, medium, and narrow widths.
- Tables, code blocks, charts, and long headings fit the layout without making the whole page scroll sideways.
- Consultancy booking uses the intended destination; tests do not book appointments, submit forms, or make purchases.
- Verify rendered desktop and mobile layouts in a browser. Distinguish checks actually performed from those blocked by the environment.

Deliver the implementation, a readable README, meaningful verification, and a short account of remaining dependencies. Keep working through routine implementation choices; ask only when a decision materially changes the intended product or requires information absent from the supplied sources.
