# Page Template Reference

This is the structural blueprint for an advertorial landing page in this project. Derived from analysis of [verified-choice.com/motobike/v1](https://www.verified-choice.com/motobike/v1#ranked), which the client identified as the "perfect example" of what we're building.

Every new page should follow this structure unless we deliberately deviate.

---

## Page anatomy (top to bottom)

| # | Section | Purpose | ~Length |
|---|---|---|---|
| 1 | **Editorial header** — date, author byline + photo, "VERIFIED" badge, "Independent · Honest · X Tested" tagline | Establishes credibility as independent reviewer | ~50 words |
| 2 | **Hero claim** — large statement of the problem + warning visual | Creates urgency around the pain point | ~30 words |
| 3 | **Narrative hook** — personal story of a past failure ("last summer we…") | Relatable; grounds the review in lived experience | ~150 words |
| 4 | **Why we tested** — methodology, references to academic study or pro adoption | Justifies rigor; cites authority figures | ~200 words |
| 5 | **Quick nav (anchor links)** | Reduces friction for skimmers | 6–7 jumplinks |
| 6 | **Test parameters** — "5 weeks, 4 testers, 2000+ km" badges | Quantifies effort, removes lab-test skepticism | Visual badges |
| 7 | **Phase 1 results** — short-duration tests, eliminates 2 weak candidates | Disqualification arc begins | ~300 words |
| 8 | **Phase 2 results** — extended tests, finalists fail at specific hours | Winner is the one that endures | ~400 words |
| 9 | **Winner reveal** — large product image, 9.x/10 score, hero CTA | Eliminates choice paralysis | ~200 words + CTA |
| 10 | **Comparison table** — 5 brands × 5 features with ✓/~/✕ | Visual proof of winner's superiority | Table |
| 11 | **Ranked list** — gold/silver/bronze with detailed cards (~250 words each). Only winner has a CTA. | Provides comparison context without diluting CTA | ~1200 words |
| 12 | **Recap narrative** — "Our route is locked in" (testers using it themselves) | Anchors credibility | ~100 words |
| 13 | **FAQ** — 6 common objections answered | Reduces purchase friction | ~400 words |
| 14 | **Testimonials** — 3 customer quotes, all 5-star, names + brief context | Social proof | ~150 words |
| 15 | **Disclosure footer** — affiliate language, sponsorship denial, regulatory caveats, copyright | Compliance | Small gray text |

Total target: **~1500–3000 words**, **600–800 lines of HTML** including inline CSS.

---

## Visual style

| Element | Choice |
|---|---|
| Background | White (#fff or near-white) |
| Body text | Charcoal (#1a1a1a or similar), 16px |
| Heading scale | 44–52px hero, 28px section, 20px subsection |
| Accent color | Gold for winner, blue for CTA buttons (~#2878dc) |
| Typeface | Sans-serif (modern geometric: Inter, system-ui, or similar) |
| Reading width | Narrow (~600–700px content column) on desktop |
| Spacing | Generous — 40–60px between sections |
| Imagery | Real photography (product flat-lays + lifestyle), not stock illustrations |
| Iconography | Emoji (✓ ✕ ~ 🥇 🥈 🥉 ★) — zero external icon dependencies |
| Animation | None or minimal — credibility > flashiness |

---

## Voice & copy patterns

- **First-person plural** ("we", "our") to distribute authorship across the implied team
- **Specific, measurable observations** — never "comfortable", always "after 6 hours of wear, no shifting at the waistband"
- **Confessional tone** — admit past failures to seem honest ("we underestimated this")
- **Eliminate via specifics** — runners-up fail at specific hours or under specific conditions
- **Author anonymity trick** — byline like "Jens R. · VERIFIED" with a photo, but no way to verify identity. Persona without accountability.

Establishing credibility phrases (adapt to category):
- *"Independent · Honest · [Category] Tested"*
- *"X weeks, Y testers, multiple [conditions]"*
- *"tested in real conditions, not a lab"*
- Reference to one academic study + one pro/celebrity adoption claim

---

## CTAs

- **Same button repeated 8–10 times** across the page
- **Same destination** — all link to the merchant product URL (with UTM passthrough)
- **Button copy variants**: "Shop the Winner at [Merchant]", "View Deal", "Check Price" — keep it transactional, not "Learn More"
- **Visual**: solid colored background (blue), bold white sans-serif, generous padding (~12–16px vertical), 100% width on mobile
- **Runner-up products have NO buy buttons** — that's the funnel trick. Only the winner gets CTAs. Other brands get a "Compare to Winner" link at most.
- **Sticky bottom CTA on mobile** is implied — worth adding

---

## Trust signal stack (use most of these)

- Byline photo + name + credential ("14 years riding")
- "VERIFIED" badge next to author name
- "Editor's Pick 2026" / "Verified Choice" header badges
- Quantified social proof ("250,000+ verified buyers", "rated by Y users")
- Star ratings (5-star average, no 3- or 4-star reviews shown)
- Academic / professional reference (one study, one pro-adopter group)
- 3 customer testimonials, all 5-star, named, with short specific quotes
- "Risk-free trial" / "Free worldwide shipping" guarantee badges
- "All products were purchased with our own funds" sponsorship denial (in fine print)

---

## Disclosure pattern

Small gray text at very bottom. Specific enough to be credible, vague enough not to spook the reader.

Standard wording to adapt:

> *Advertising disclosure: this page contains commercial links.*
>
> *All products were purchased by the authors with their own funds; no free product was provided by any brand.*
>
> *[Product] is sold as [category]; it is not a medical device and is not intended to diagnose, treat, or cure any condition.* (if relevant)
>
> *Product availability and pricing may vary by region and over time.*
>
> *© 2026 [Site Name]. Independent editorial.*

---

## Lingerie / shapewear adaptation

How each pattern maps to our category:

| Reference element | Adapted version |
|---|---|
| Hearing damage urgency | Body-confidence pain point ("last summer in swimwear, three of us felt self-conscious") |
| MotoGP pros wear earplugs | Red-carpet stylists / celebrities wear understructure shapewear |
| 5 weeks of riding | 5 weeks of wear-testing across casual + formal occasions |
| Hour-6 wind-noise failure | Hour-6 waistband-rolling failure, visible lines under satin, sweat management |
| 4 rider testers | 4 testers across sizes (S–XL) |
| Wind reduction sub-rating | Invisibility under fabric, edge-grip, 12+ hour comfort, sweat-wicking, easy of removal |
| Earplug product image | Product flat-lay + worn-on-body shot (avoid overly suggestive) |

**Tone shift:** keep investigative + specific-failure-point. Replace "wind noise at 130 km/h" with "visible panty line after 6 hours of sitting" or "back bulge above the band when seated."

---

## Risk notes

- **Meta/TikTok ad policy**: this pattern is in a gray area. Ad accounts get pulled for clearly-undisclosed advertorials. Adding a small "in partnership with" footer reduces ad-account risk; doesn't materially hurt conversion.
- **FTC**: in the US, material connections must be "clearly and conspicuously" disclosed. "Contains commercial links" in 10px gray text at the footer would not survive an FTC challenge. Worth knowing.
- **Single-product framing** with named competitors that receive negative reviews could expose the brand to defamation claims if any review point isn't substantiable. Keep all negative claims testable / true.

These are the client's risks to weigh, not ours to decide unilaterally.
