# Rumi Protocol — Outpost Example

This directory shows how Rumi Protocol uses the Outpost template.

Rumi is a CDP (Collateralized Debt Position) stablecoin protocol on the Internet Computer. Users deposit ICP as collateral to mint icUSD.

## Files

| File | Purpose |
|---|---|
| `app.config.ts` | Name, sources (analytics + backend canisters), nav with all 6 lenses |
| `events.ts` | All Rumi event kinds: open_vault, borrow, liquidation, redemption, etc. |
| `dashboard.ts` | Overview tiles: TVL, icUSD Supply, Peg, Open Vaults |
| `entities.ts` | Custom entity types: vault, pool, token |
| `AppEvents.mo` | Shadow types matching rumi_protocol_backend.get_events_filtered |
| `extras/VaultGlyph.tsx` | Stratified rectangle glyph representing collateral health |
| `extras/PegMeridian.tsx` | Recharts reference line anchoring peg-sensitive charts |

## How it works

Copy the 5 config files (`app.config.ts`, `events.ts`, `dashboard.ts`, `entities.ts`, `AppEvents.mo`) into the corresponding locations in `apps/explorer/`. The extras components (`VaultGlyph`, `PegMeridian`) are used in Rumi's custom lens pages, which extend the base template.

The live Rumi explorer also deploys extended BFF endpoints (`get_lens_collateral`, etc.) that the base template doesn't include — those are wired in the Rumi-specific BFF build, not shown here.
