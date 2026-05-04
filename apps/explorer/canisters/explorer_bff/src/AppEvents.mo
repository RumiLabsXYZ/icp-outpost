import Principal "mo:core/Principal";

/// Edit this file to declare what your source canister(s) return.
///
/// The framework expects a `get_events_filtered` method matching the type below.
/// If your source canister exposes events under a different name or shape,
/// adapt the SourceActors.mo bindings accordingly.
///
/// The `kind` field in EventSummary must match the `id` field in your frontend
/// events.ts EVENT_KINDS array so glyphs resolve correctly.
module {

  public type EventTypeFilter = {
    #Create; #Update; #Delete; #Transfer;
  };

  public type TimeRange = { from_ns : Nat64; to_ns : Nat64 };

  public type GetEventsFilteredArg = {
    start : Nat64;
    length : Nat64;
    types : ?[EventTypeFilter];
    principal : ?Principal;
    time_range : ?TimeRange;
  };

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

};
