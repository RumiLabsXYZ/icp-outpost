import Principal "mo:core/Principal";

/// ICRC-3 block shape adapter for ICRC-1 ledgers.
///
/// ICRC-3 exposes `icrc3_get_blocks` which returns an array of generic blocks.
/// Each block has a `kind` text field and a value record. This module defines
/// the shadow types the BFF uses to decode these blocks into EventSummary.
///
/// The BFF's SourceActors.mo should bind to `icrc3_get_blocks` and the
/// Activity.mo should map each block's `kind` field to the kinds defined here.
///
/// Standard ICRC-3 block kinds: "transfer", "mint", "burn", "approve".
///
/// Drop this into apps/explorer/canisters/explorer_bff/src/AppEvents.mo
/// when deploying the ICRC-1 ledger explorer.
module {

  // ICRC-3 block request
  public type GetBlocksArgs = [{
    start : Nat;
    length : Nat;
  }];

  // A single ICRC-3 block value (simplified — full ICRC-3 uses a generic Value type)
  public type BlockValue = {
    #Nat : Nat;
    #Int : Int;
    #Blob : Blob;
    #Text : Text;
    #Array : [BlockValue];
    #Map : [(Text, BlockValue)];
  };

  public type Block = {
    id : Nat;
    block : BlockValue;
  };

  public type GetBlocksResponse = {
    first_index : Nat;
    log_length : Nat;
    blocks : [Block];
    archived_blocks : [{
      args : GetBlocksArgs;
      callback : shared query (GetBlocksArgs) -> async GetBlocksResponse;
    }];
  };

  // Simplified EventSummary shape — matches what the generic BFF framework expects.
  // The Activity.mo adapter maps ICRC-3 blocks into this shape.
  public type EventSummary = {
    global_index : Nat64;
    kind : Text;
    timestamp_ns : Nat64;
    primary_principal : ?Principal;
    amount_e8s : ?Nat64;
    payload_summary : Text;
  };

  public type GetEventsFilteredResponse = {
    total : Nat64;
    events : [EventSummary];
  };

  // These types are used in AppEvents.mo to mirror the source canister interface.
  // For ICRC-3 the "filter" is start/length pagination — no server-side kind filter.
  public type TimeRange = { from_ns : Nat64; to_ns : Nat64 };

  public type EventTypeFilter = {
    #Transfer; #Mint; #Burn; #Approve;
  };

  public type GetEventsFilteredArg = {
    start : Nat64;
    length : Nat64;
    types : ?[EventTypeFilter];
    principal : ?Principal;
    time_range : ?TimeRange;
  };

};
