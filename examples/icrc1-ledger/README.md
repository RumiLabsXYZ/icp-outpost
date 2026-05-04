# ICRC-1 Ledger Explorer — Outpost Example

This directory shows how to use Outpost to build a transfer explorer for any ICRC-1/ICRC-3 compatible token on the Internet Computer.

By default it points at the ICP ledger (`ryjl3-tyaaa-aaaaa-aaaba-cai`). Change the `main` canister ID in `app.config.ts` to point at any other token: ckBTC, ckETH, your own token, etc.

## Files

| File | Purpose |
|---|---|
| `app.config.ts` | Name, ICP ledger canister ID as default source, minimal nav |
| `events.ts` | ICRC-3 block kinds: transfer, mint, burn, approve |
| `dashboard.ts` | Tiles: total supply, transfers 24h, transfer fee |
| `entities.ts` | Account entity: /e/account/:principal shows recent transfers |
| `AppEvents.mo` | ICRC-3 GetBlocksResponse shadow types + EventSummary adapter |

## Wiring

The BFF's `SourceActors.mo` needs to bind to `icrc3_get_blocks` instead of `get_events_filtered`. The `Activity.mo` adapter maps ICRC-3 blocks into the generic `EventSummary` shape.

Copy the 5 files into the appropriate locations in `apps/explorer/` and update `SourceActors.mo` to call `icrc3_get_blocks` on the source canister.
