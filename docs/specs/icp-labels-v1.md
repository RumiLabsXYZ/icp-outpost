# ICP Labels — JSON Format (v1)

**Status**: draft
**Date**: 2026-05-04
**Companion**: [`icp-labels-discovery-v1.md`](./icp-labels-discovery-v1.md) — how a label set is found

This spec defines a portable JSON format for assigning human-readable labels to ICP principals (and ICRC-1 accounts). A label set conforming to this spec is interoperable across any explorer, wallet, or analytics tool that implements it.

The format is deliberately minimal. **A spec implementer should be able to read this document and write a parser in under an hour.**

## Goals

- A user looking at `tfesu-vyaaa-aaaap-qrd7a-cai` should be able to see "Rumi Backend" instead.
- A label set published once should be readable by any compliant tool — explorer, wallet, dashboard, social-graph viewer.
- Label sets should be composable: a tool can merge multiple sets (built-in + community + personal) without conflict.
- The format should age gracefully: future versions can add fields without breaking older readers.

## Non-goals

- Defining who is allowed to publish labels for a given principal. (Anyone can publish anything; consumers decide whom to trust.)
- Mandating a particular hosting strategy. (Files can live on a website, in a git repo, on IPFS, in a canister, in browser localStorage — the format is the same.)
- Authentication or signing. (Optional in a future version. v1 is plain JSON; trust is established at the discovery layer — see the discovery spec.)

## Format

A label set is a single JSON object with the shape below. UTF-8 encoded. No specific filename required, but the conventional name is `labels.json`.

```json
{
  "version": "1",
  "source": "rumi-protocol-v1",
  "generated_at": "2026-05-04T12:00:00Z",
  "description": "Official canister labels for the Rumi Protocol",
  "homepage": "https://rumiprotocol.com",
  "labels": [
    {
      "principal": "tfesu-vyaaa-aaaap-qrd7a-cai",
      "label": "Rumi Backend",
      "kind": "protocol_core"
    },
    {
      "principal": "tlg74-oiaaa-aaaap-qrd6a-cai",
      "label": "Rumi Treasury",
      "kind": "treasury",
      "color": "#5DA67E"
    },
    {
      "principal": "tfesu-vyaaa-aaaap-qrd7a-cai",
      "subaccount": "0xa1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00",
      "label": "Rumi Insurance Fund",
      "kind": "treasury"
    }
  ]
}
```

### Required top-level fields

| Field | Type | Notes |
|---|---|---|
| `version` | string | Must be `"1"` for this spec. Bumps to `"2"` etc. for future versions. Readers MUST refuse files with unrecognized versions. |
| `labels` | array of label objects | Can be empty. |

### Optional top-level fields

| Field | Type | Notes |
|---|---|---|
| `source` | string | An identifier for who/what produced this set. Used by readers to track provenance and dedupe. Convention: lowercase, hyphenated. e.g., `"rumi-protocol-v1"`, `"icpswap-pools-2026"`. |
| `generated_at` | string (RFC 3339 timestamp) | When this set was generated. |
| `description` | string | Free-form description of what's in this set. |
| `homepage` | string (URL) | Where the publisher lives. |

Readers MUST ignore any unknown top-level fields (forward compatibility).

### Label objects

Each entry in the `labels` array describes one principal-or-account label.

#### Required fields

| Field | Type | Notes |
|---|---|---|
| `principal` | string | The textual principal, e.g., `"tfesu-vyaaa-aaaap-qrd7a-cai"`. Required even when also providing a subaccount. |
| `label` | string | The human-readable name. SHOULD be ≤ 60 characters. |

#### Optional fields

| Field | Type | Notes |
|---|---|---|
| `subaccount` | string | A 32-byte ICRC-1 subaccount, hex-encoded with optional `0x` prefix. When present, the label applies to the specific `(principal, subaccount)` ICRC-1 account; when absent, the label applies to the default subaccount AND serves as a fallback for the principal as a whole. See "Account scoping" below. |
| `kind` | string | An open-enum hint about what this principal represents. See "Kind taxonomy" below. |
| `color` | string | A `#RRGGBB` or `#RRGGBBAA` color hint for UIs that style labels. |
| `tags` | array of strings | Free-form tags, e.g., `["audited", "team", "verified"]`. Readers MAY use them for filtering. |
| `description` | string | A longer description of what this principal is. Tooltip-length is appropriate. |
| `link` | string (URL) | Optional canonical URL for this principal (e.g., a docs page, a profile). |

Readers MUST ignore unknown fields on label objects.

### Kind taxonomy

`kind` is an OPEN enum. Producers SHOULD pick from the values below when applicable; if no value fits, picking a new lowercase, snake_case identifier is fine. Readers MUST tolerate unknown kinds (typically by treating them as `"other"`).

Suggested values:

| Kind | Meaning |
|---|---|
| `protocol_core` | A core canister of an application protocol |
| `treasury` | A treasury / reserve account |
| `dex_pool` | A DEX liquidity pool canister |
| `lending_pool` | A lending market or vault |
| `ledger` | An ICRC-1/-2/-3 ledger canister |
| `governance` | A governance / DAO canister |
| `bridge` | A cross-chain bridge endpoint |
| `team` | A team-controlled wallet or canister |
| `creator` | A token's creator/deployer principal |
| `locker` | A token-locking canister |
| `service` | A general utility / infrastructure canister |
| `personal` | A user's personal account |
| `nft_collection` | An NFT collection canister |
| `subnet` | A network/subnet identifier (rare; for system explorers) |
| `other` | Default fallback |

## Account scoping

A label entry can target either a **principal** (broad — applies to that canister/identity in general) or a specific **(principal, subaccount)** pair (narrow — applies to one ICRC-1 account).

When a reader looks up labels for an ICRC-1 account `(P, S)`:
1. First check entries matching exactly `(principal=P, subaccount=S)`.
2. If S is the default subaccount (all-zero bytes) and there's an entry with `(principal=P)` and no subaccount field, that entry applies.
3. If S is not the default and no exact match exists, the reader MAY display the principal-level label PLUS an indicator that the subaccount is unlabeled (e.g., "Rumi Treasury · sub:0xa1b2…").

The reader MUST NOT silently apply a principal-level label to a non-default subaccount as if it were the same account; they're different accounts and should be visually distinguishable.

## Subaccount encoding

Subaccounts MUST be hex-encoded representations of 32 bytes. Both forms are valid:

- `"0xa1b2c3d4e5f6..."` (64 hex chars + `0x` prefix, total 66 chars)
- `"a1b2c3d4e5f6..."` (64 hex chars, no prefix, total 64 chars)

Producers SHOULD include the `0x` prefix. Readers MUST accept both.

The default ICRC-1 subaccount (all-zero bytes) is conventionally written as `"0x0000000000000000000000000000000000000000000000000000000000000000"` but a label entry referring to a default-subaccount account SHOULD just omit the `subaccount` field entirely.

## Merging multiple sets

A reader will commonly load several sets at once: a built-in set that ships with the explorer, a community-curated set, and the user's personal labels. Merging strategy:

- The reader MUST maintain a stable priority order across sets. Common order:
  1. **User personal labels** (highest — user's local edits always win)
  2. **Built-in / app-shipped labels** (the protocol's own published set)
  3. **Community / overlay sets** (lowest — most volatile, lowest trust)
- For each `(principal, subaccount?)` key, the highest-priority set's entry wins.
- A reader MAY surface "this label was overridden" provenance in tooltips for transparency.

## Versioning and forward compatibility

The `version` field is a **major version**. Spec changes that don't break readers (new optional fields) DON'T bump it. Breaking changes (renamed fields, changed semantics) DO.

A reader implementing v1 MUST refuse files with `version: "2"` or higher. A reader implementing v2 MAY also accept v1 files transparently.

Adding a new value to the open `kind` enum is NOT a breaking change.

## Size and performance

Producers SHOULD keep label sets reasonably small. As a soft guideline:

- A single set under 5 MB
- Under 100,000 entries
- If a producer needs more, splitting into multiple sets keyed by subdomain or topic is preferred

Readers SHOULD cache fetched sets locally and respect HTTP `Cache-Control` headers.

## Security considerations

Labels are advisory metadata, not authentication. A label saying "Foundation Treasury" does not prove the principal is the foundation's treasury — it proves only that whoever published this set asserts that.

Readers MUST always present the underlying principal alongside or behind any label (e.g., on hover, in a tooltip, or on click) so users can verify. UIs SHOULD make it easy to see "where did this label come from?" via the `source` field of the originating set.

A future v2 of this spec may introduce signed sets (DCAP, IC certificates, or X.509 chain). v1 is unsigned plain JSON; trust is established at the discovery layer (the user explicitly opted to load this set).

## Reference example

A complete, valid label set:

```json
{
  "version": "1",
  "source": "rumi-protocol-v1",
  "generated_at": "2026-05-04T12:00:00Z",
  "description": "Official canister labels for the Rumi Protocol",
  "homepage": "https://rumiprotocol.com",
  "labels": [
    {
      "principal": "tfesu-vyaaa-aaaap-qrd7a-cai",
      "label": "Rumi Backend",
      "kind": "protocol_core",
      "description": "Core CDP engine — vaults, collateral, minting, liquidations",
      "link": "https://rumiprotocol.com/docs/backend"
    },
    {
      "principal": "dtlu2-uqaaa-aaaap-qugcq-cai",
      "label": "Rumi Analytics",
      "kind": "service"
    },
    {
      "principal": "tlg74-oiaaa-aaaap-qrd6a-cai",
      "label": "Rumi Treasury",
      "kind": "treasury",
      "color": "#5DA67E"
    },
    {
      "principal": "tmhzi-dqaaa-aaaap-qrd6q-cai",
      "label": "Rumi Stability Pool",
      "kind": "protocol_core"
    },
    {
      "principal": "fohh4-yyaaa-aaaap-qtkpa-cai",
      "label": "Rumi 3Pool",
      "kind": "dex_pool",
      "tags": ["stable", "icusd"]
    },
    {
      "principal": "ijlzs-2yaaa-aaaap-quaaq-cai",
      "label": "Rumi AMM",
      "kind": "dex_pool"
    },
    {
      "principal": "t6bor-paaaa-aaaap-qrd5q-cai",
      "label": "icUSD Ledger",
      "kind": "ledger",
      "tags": ["icrc1", "icrc2", "stable"]
    },
    {
      "principal": "nygob-3qaaa-aaaap-qttcq-cai",
      "label": "Liquidation Bot",
      "kind": "service"
    }
  ]
}
```

## Reference JSON Schema

A machine-readable JSON Schema (Draft 2020-12) is published alongside this spec at `icp-labels-v1.schema.json`. Producers SHOULD validate their output against it; readers MAY use it for input validation.

## Changelog

- **v1, 2026-05-04** — Initial specification.
