import _Principal "mo:core/Principal";

module {

  public type HealthLevel = {
    #Green;
    #Yellow;
    #Red;
  };

  public type FormattedNumber = {
    raw_e8s : Nat64;
    decimals : Nat8;
    formatted : Text;
  };

  public type EventRowDTO = {
    source : Text;
    source_event_id : Nat64;
    global_id : Text;
    kind : Text;
    timestamp_ns : Nat64;
    primary_principal : ?Principal;
    primary_amount : ?FormattedNumber;
    secondary_principal : ?Principal;
    approximate : Bool;
    payload_summary : Text;
  };

  public type HealthSummaryDTO = {
    level : HealthLevel;
    message : Text;
    source_lag_seconds : Nat64;
    any_error : Bool;
    generated_at_ns : Nat64;
  };

  public type OverviewDTO = {
    recent_activity : [EventRowDTO];
    health : HealthSummaryDTO;
    generated_at_ns : Nat64;
    cache_age_ms : Nat64;
  };

  public type ActivityFilter = {
    sources : ?[Text];
    types : ?[Text];
    filter_principal : ?Principal;
    from_ns : ?Nat64;
    to_ns : ?Nat64;
  };

  public type ActivityCursor = {
    before_global_id : ?Text;
    page_size : Nat32;
  };

  public type ActivityFeedDTO = {
    events : [EventRowDTO];
    next_cursor : ?Text;
    total_estimated : Nat64;
    filters_applied : ActivityFilter;
  };

  public type EntityDTO = {
    id : Text;
    kind : Text;
    display_label : Text;
    recent_events : [EventRowDTO];
    generated_at_ns : Nat64;
  };

  public type EventDetailDTO = {
    global_id : Text;
    source : Text;
    source_event_id : Nat64;
    kind : Text;
    timestamp_ns : Nat64;
    payload_summary : Text;
    payload_json : Text;
    related_event_ids : [Text];
    generated_at_ns : Nat64;
  };

};
