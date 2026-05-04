# Outpost

A read-only explorer template for ICP applications. Clone it, edit ~5 files, deploy to mainnet in an hour.

> Outpost gives you the framework — activity feed, entity drilldowns, configurable dashboard, search, theme system, cycles monitoring, deployment config. You bring the schema of your app.

## What you get for free

- 📜 **Activity feed** with cursor pagination, type filters, and URL-deep-linkable state
- 🔍 **Entity pages** — paste a principal or any ID, see its history
- 📊 **Configurable dashboard** with metric tiles you define
- 🎨 **A real design system** (vellum/ink/quartz palette — not default Tailwind/shadcn)
- 🌗 **Light + dark themes** with system-default detection
- 🔎 **Smart search** that auto-routes by content type
- ❤️ **Health pill** showing source-canister freshness, breaker state, cycles
- 🚀 **icp-cli config** that just works (Motoko BFF + asset canister)

## Getting started

```bash
npx degit RumiLabsXYZ/icp-outpost my-app-explorer
cd my-app-explorer
npm install

# Edit the 5 customization files (see "Customizing" below)

icp network start -d
icp deploy           # local dev
icp deploy -e ic     # mainnet, when you're ready
```

## Customizing — the whole list

The template is structured so the bulk of the code (BFF actor, routing, theme, layout, ledger entries, search, cycles wiring) **doesn't need to be edited**. You change configuration:

| File | What it defines |
|---|---|
| `apps/explorer/frontend/src/app.config.ts` | Branding (name, color), source canisters, top nav |
| `apps/explorer/frontend/src/events.ts` | Your event kinds — labels and glyphs |
| `apps/explorer/canisters/explorer_bff/src/AppEvents.mo` | Shadow types for your source canister(s) |
| `apps/explorer/frontend/src/dashboard.ts` | Overview metric tiles (optional) |
| `apps/explorer/frontend/src/entities.ts` | Custom entity pages (optional) |

Five files. Most apps don't need all five.

## Examples

Two complete examples ship with the template, each in `examples/`:

### `examples/rumi/`
The original explorer this template was extracted from. Watches a CDP stablecoin protocol — vaults, peg, stability pool, liquidations. Demonstrates Rumi-specific signature components (`PegMeridian`, `VaultGlyph`) layered on top of the base template.

### `examples/icrc1-ledger/`
A generic ICRC-1 ledger explorer. Point it at any token canister (the ICP ledger, ckBTC, ckUSDC, your own token) and get a transfer activity feed, balance lookup, and supply dashboard. Demonstrates the template works for non-DeFi apps.

## Architecture

```
Browser → asset canister (SPA + ic_env cookie)
            ↓
        explorer_bff (Motoko)  ←→  source canister(s) (your app)
            ↓
       (composed DTOs, cached, served as queries)
```

The BFF is a thin compositional layer: it hides multi-canister fan-out from the frontend, caches hot reads, and shapes the source canister responses into the DTOs the frontend renders. You write a small `AppEvents.mo` shadow type matching what your canister emits; the rest of the BFF is generic.

## Why a Motoko BFF?

- ICP devs are roughly half Motoko, half Rust. The Motoko BFF surface lets a Motoko shop adopt this without learning Rust. Rust shops can call the BFF's `.did` exactly the same way.
- The patterns this template demonstrates (typed actor refs, timer-refreshed caches, init-arg-driven source IDs) are widely useful Motoko patterns regardless.
- A Rust port of the BFF is straightforward and may ship as `examples/explorer-bff-rust/` later.

## Status

This is **v1**. The framework works. Two examples deploy and run on mainnet. Some rough edges:

- Frontend bundle is unsplit recharts (~250 kB gzip) — code-splitting is a known follow-up
- Dashboard tiles are evaluated client-side; server-side composed reads coming later
- Entity pages have a generic fallback but custom rendering needs a small amount of code per entity type

See `docs/roadmap.md` for what's planned.

## License

MIT.
