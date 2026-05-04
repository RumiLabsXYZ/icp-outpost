# ICP Labels — Discovery (v1)

**Status**: draft
**Date**: 2026-05-04
**Companion**: [`icp-labels-v1.md`](./icp-labels-v1.md) — the JSON format being discovered

This spec defines how a tool (an explorer, wallet, analytics dashboard) discovers label sets relevant to a canister or principal. The label JSON format is defined separately. This document covers only "given a canister X, where do I find labels for it?"

The format spec is small and obvious. **Discovery is the actually-hard problem.** This spec lays out three discovery paths in order of increasing decentralization, with a recommended layered approach.

## Goals

- Given an arbitrary canister principal, a compliant tool can find associated labels (if any) without manual user effort.
- The discovery mechanism shouldn't depend on a single point of failure or central trust authority.
- It should be easy for a small team to publish a label set for their protocol and have it discovered by any compliant tool — no permission required.
- Tools that don't implement auto-discovery can still benefit from labels via manual user import.

## Non-goals

- Verifying that a label set's claims are true. (Trust is the user's choice.)
- Defining curation rules for a registry. (Each registry decides for itself.)

## The three discovery mechanisms

Three mechanisms, layered. A complete implementation tries them in order. A minimal implementation can ship with only manual.

### Mechanism 1 — Canister self-attestation (most decentralized)

The canister itself declares where its labels live. Two channels, both optional:

#### 1a. Query method

A canister MAY expose a query method:

```candid
icp_label_directory : () -> (opt text) query;
```

The returned text, if present, is a URL pointing at a label set conforming to `icp-labels-v1`.

A tool implementing self-attestation:
1. Probes the target canister for the `icp_label_directory` method (a candid type-check; does NOT require knowing the canister's `.did` upfront).
2. If the method exists and returns `?text` with a URL, fetches the URL.
3. If the response parses as a valid label set, makes it available to the user.

#### 1b. HTTP `.well-known` path

For canisters served via the IC HTTP gateway (i.e., asset canisters or canisters implementing `http_request`), a tool MAY fetch:

```
https://<canister-id>.icp0.io/.well-known/icp-labels.json
```

A 200 response with a parseable label set is treated as authoritative for that canister.

#### Why self-attestation is the strongest path

The canister is the source of truth for "where do my labels live." Anyone can publish a label set claiming to describe Rumi's canisters; only the canister's controller can update the canister's own self-attestation. A tool that finds labels via self-attestation knows the canister's controller endorses them.

#### Why it's not enough on its own

Most existing canisters don't expose `icp_label_directory` or `.well-known/icp-labels.json` and likely never will. We need a path that works for canisters that haven't opted in, AND for ecosystem-wide label sets (e.g., "all known ICPSwap pools") that don't belong to a single canister.

### Mechanism 2 — Community registry (most pragmatic)

A registry is a single JSON document mapping canister IDs to label-set URLs. Anyone can fork or run their own registry; tools agree on a default.

#### Registry JSON shape

```json
{
  "version": "1",
  "name": "ICP Labels Registry",
  "homepage": "https://github.com/RumiLabsXYZ/icp-labels-registry",
  "generated_at": "2026-05-04T12:00:00Z",
  "sources": [
    {
      "for_canister": "tfesu-vyaaa-aaaap-qrd7a-cai",
      "name": "Rumi Protocol",
      "labels_url": "https://rumi-labs.github.io/labels/labels.json",
      "trust_level": "publisher_attested"
    },
    {
      "for_canister": "*",
      "name": "ICPSwap Known Pools",
      "labels_url": "https://icpswap.com/labels.json",
      "trust_level": "community"
    },
    {
      "for_canister": "ryjl3-tyaaa-aaaaaaba-cai",
      "name": "ICP Foundation Known Principals",
      "labels_url": "https://internetcomputer.org/known-principals.json",
      "trust_level": "publisher_attested"
    }
  ]
}
```

| Field | Type | Notes |
|---|---|---|
| `version` | string | Must be `"1"` for this spec. |
| `sources` | array | Registry entries. |

Each entry:

| Field | Type | Notes |
|---|---|---|
| `for_canister` | string | The canister ID this entry applies to. The wildcard `"*"` indicates an ecosystem-wide set (not specific to one canister). |
| `name` | string | A human-readable name for this label set. |
| `labels_url` | string | URL of an `icp-labels-v1` JSON document. |
| `trust_level` | string | One of `publisher_attested`, `community`, `experimental`. See "Trust levels" below. |
| `description` | string | Optional. Short description shown in the UI when prompting the user. |

#### Trust levels

| Level | Meaning |
|---|---|
| `publisher_attested` | The label set was contributed by the canister's controller (verified out-of-band by the registry maintainers). Highest trust. |
| `community` | Curated by community contributors. Reasonable trust. |
| `experimental` | Unverified or low-quality. Display with a warning. |

Trust levels are advisory; tools MAY treat them differently in UI but MUST always allow users to load any registered set.

#### How a tool uses the registry

1. Tool fetches the registry index on startup or first user interaction (cache for ~1 hour).
2. When the user opens a view for canister `X`, the tool looks up entries with `for_canister == X` OR `for_canister == "*"`.
3. For each match, the tool either:
   - Auto-loads it (if the user has previously approved this `labels_url`)
   - Surfaces a banner: "Labels available for this canister: '{name}'. Load?" with the source URL visible

#### Default registry

The reference implementation defaults to:

```
https://raw.githubusercontent.com/RumiLabsXYZ/icp-labels-registry/main/registry.json
```

Tools MAY allow users to configure additional registries or replace the default entirely. Multiple registries can be used in priority order.

#### Adding to the registry

Open a pull request against `RumiLabsXYZ/icp-labels-registry`. The maintainer manually checks:
- The `labels_url` is reachable and parses as `icp-labels-v1`
- The claimed `for_canister` is real and the contributor has reasonable claim to publish for it (or is contributing a `*` ecosystem set)

This is intentionally low-ceremony. Better: someone forks and runs a stricter registry; tools point at that.

### Mechanism 3 — Manual user import (always available)

The user pastes a `labels_url` (or a raw JSON paste) into a "Add label set" UI. The tool fetches/parses, validates against `icp-labels-v1`, and merges it in. No auto-discovery; entirely user-driven.

This MUST be available regardless of whether the tool implements mechanisms 1 or 2 — it's the universal escape hatch.

## Recommended discovery flow

A complete implementation tries the mechanisms in order, presents results to the user, and respects user consent before applying labels:

```
User opens explorer for canister C
    ↓
[1] Self-attestation probe in parallel:
    - Try: fetch /.well-known/icp-labels.json from C's HTTP gateway
    - Try: query C for `icp_label_directory` method
    ↓
    if either returns a parseable label set → "C self-publishes labels" (auto-trust;
    no user prompt needed since the canister itself attested)
    ↓
[2] Registry lookup:
    - Fetch (cached) registry index
    - Find entries where for_canister == C or for_canister == "*"
    ↓
    for each match:
      - if user has previously approved this labels_url → load silently
      - else → surface banner: "Labels available for {name}. Load?"
    ↓
[3] Manual:
    - User can always paste a URL or JSON to add a custom set
    ↓
Merge all loaded sets per icp-labels-v1 §"Merging multiple sets"
Render labels in UI; show provenance on hover
```

## User consent model

The default behavior MUST require user consent before loading registry-discovered or manually-added label sets, BECAUSE:

- A label set is metadata served from an arbitrary URL. The user should know what they're loading and from where.
- A "load this label set" decision SHOULD persist (per `labels_url`) so the user isn't prompted on every visit. Persistence in localStorage is sufficient.

Self-attested labels MAY auto-load without prompt, since the canister itself is the publisher (this is comparable to a website serving its own page).

## Caching and refresh

- Registry index: cache for at least 1 hour. Honor HTTP cache headers if the registry server supplies stricter ones.
- Individual label sets: cache for at least 24 hours. Refresh proactively in the background; users SHOULD NOT see stale labels for more than a day.
- Self-attestation probes (`.well-known/icp-labels.json`, query method): cache for 24 hours.

## Security considerations

- Discovery is **not** authentication. A registry entry asserting "labels for X live at URL Y" doesn't prove that Y belongs to X. The user is choosing to trust the registry maintainer's claim.
- A tool MUST NEVER auto-execute or auto-apply labels without giving the user a way to see the source URL and disable a set.
- A label set served from a malicious URL can render misleading labels (e.g., labeling an attacker's principal as "ICP Foundation"). UIs MUST always make the underlying principal verifiable on hover/click and SHOULD NEVER hide the principal entirely.
- Future v2 may introduce signed label sets. v1 has no signing; trust is established by the user opting into specific sources.

## Operational responsibilities of a registry maintainer

The team running a community registry SHOULD:

- Document their inclusion criteria
- Validate that each entry's `labels_url` is reachable and parseable BEFORE merging the PR
- Document a process for removing entries (e.g., when a project is deprecated or compromised)
- Publish the registry itself under version control so changes are auditable

The reference registry at `RumiLabsXYZ/icp-labels-registry` documents these in its README.

## Worked example

Rumi Protocol publishes labels:

1. Rumi creates `https://rumi-labs.github.io/labels/labels.json` containing all their canister IDs with friendly names. Format: `icp-labels-v1`.
2. Rumi opens a PR to `RumiLabsXYZ/icp-labels-registry/registry.json` adding entries for each Rumi canister pointing at the `labels.json` URL.
3. Optionally, Rumi adds `icp_label_directory` to their backend canister returning the same URL — opt-in self-attestation.

Now, anywhere this discovery spec is implemented:

- A user pastes `tfesu-vyaaa-aaaap-qrd7a-cai` into their explorer.
- The explorer:
  - Pings the canister's HTTP gateway for `.well-known/icp-labels.json` (assume Rumi's backend doesn't have one — skip)
  - Queries the canister for `icp_label_directory` — Rumi added this, returns the URL → labels auto-load with attestation
- The user sees "Rumi Backend" in the UI instead of `tfesu-…`.

Same flow works in OhShii Explorer, an Outpost-based explorer, or any other compliant tool. No coordination required between tools — they all just speak `icp-labels-v1` and follow this discovery spec.

## Implementation checklist

A tool claiming "icp-labels-discovery-v1 compliant" SHOULD support:

- [ ] Manual import of label sets via URL paste
- [ ] Manual import of label sets via raw JSON paste
- [ ] Persistent record of which `labels_url`s the user has approved
- [ ] Display of label-set provenance (source URL, origin name) on hover or in settings
- [ ] At least one of: registry lookup OR self-attestation probe

A tool claiming **full** compliance SHOULD support all of the above PLUS:

- [ ] Registry lookup (default registry configurable)
- [ ] Self-attestation probe via `icp_label_directory` query method
- [ ] Self-attestation probe via `.well-known/icp-labels.json`
- [ ] Configurable cache TTLs
- [ ] Background refresh of cached label sets

## Changelog

- **v1, 2026-05-04** — Initial specification.
