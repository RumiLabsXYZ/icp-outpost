import Principal "mo:core/Principal";

/// Rumi Protocol backend event shape.
///
/// These types match rumi_protocol_backend.get_events_filtered exactly.
/// Drop this into apps/explorer/canisters/explorer_bff/src/AppEvents.mo
/// when deploying the Rumi-specific BFF.
module {

  public type EventTypeFilter = {
    #OpenVault; #CloseVault; #AdjustVault;
    #Borrow; #Repay;
    #Liquidation; #PartialLiquidation;
    #Redemption; #ReserveRedemption;
    #StabilityPoolDeposit; #StabilityPoolWithdraw;
    #AdminMint; #AdminSweepToTreasury;
    #Admin;
    #PriceUpdate; #AccrueInterest;
  };

  public type TimeRange = { from_ns : Nat64; to_ns : Nat64 };

  public type GetEventsFilteredArg = {
    start : Nat64;
    length : Nat64;
    types : ?[EventTypeFilter];
    principal : ?Principal;
    collateral_token : ?Principal;
    time_range : ?TimeRange;
    min_size_e8s : ?Nat64;
    admin_labels : ?[Text];
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
