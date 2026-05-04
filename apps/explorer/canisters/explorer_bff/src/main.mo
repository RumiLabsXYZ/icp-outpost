import Principal "mo:core/Principal";
import Timer "mo:core/Timer";
import Time "mo:core/Time";
import Nat64 "mo:core/Nat64";
import T "Types";
import SourceConfig "SourceConfig";
import Activity "Activity";
import Aggregates "Aggregates";
import Cache "Cache";
import Health "Health";

persistent actor class ExplorerBff(initArgs : SourceConfig.SourceCanistersInit) {

  // Admin principal — read from init args, defaulting to anonymous (2vxsx-fae) for
  // local development. On mainnet, callers MUST pass `admin = opt principal "<real>"`.
  let admin : Principal = switch (initArgs.admin) {
    case (?p) p;
    case null Principal.fromText("2vxsx-fae");
  };

  var sources : SourceConfig.SourceCanisters = SourceConfig.init(initArgs);

  // Overview cache: 30-second TTL.
  // transient so it is not included in upgrade migration (heap-only; rebuilds on next tick).
  transient let overview_cache = Cache.TtlCache<T.OverviewDTO>(30_000_000_000);

  func seedOverview() : async () {
    try {
      let activity = await Aggregates.fetchRecentActivity(sources);
      overview_cache.set({
        recent_activity = activity;
        health = Health.healthOk();
        generated_at_ns = Nat64.fromIntWrap(Time.now());
        cache_age_ms = 0;
      });
    } catch (_e) {
      overview_cache.set({
        recent_activity = [];
        health = Health.healthFromError();
        generated_at_ns = Nat64.fromIntWrap(Time.now());
        cache_age_ms = 0;
      });
    };
  };

  // Schedule a recurring refresh every 30 seconds.
  ignore Timer.recurringTimer<system>(#seconds 30, func() : async () {
    await seedOverview();
  });

  // Seed once on startup so the first user request doesn't wait.
  ignore Timer.setTimer<system>(#seconds 0, func() : async () {
    await seedOverview();
  });

  public query func ping() : async Text {
    "explorer_bff is alive"
  };

  public query func get_health() : async T.HealthSummaryDTO {
    switch (overview_cache.getStale()) {
      case null Health.defaultHealth();
      case (?cached) cached.health;
    };
  };

  public query func get_overview() : async T.OverviewDTO {
    switch (overview_cache.getStale()) {
      case null {
        {
          recent_activity = [];
          health = Health.defaultHealth();
          generated_at_ns = Nat64.fromIntWrap(Time.now());
          cache_age_ms = 0;
        };
      };
      case (?cached) {
        let age = overview_cache.ageMs();
        {
          recent_activity = cached.recent_activity;
          health = cached.health;
          generated_at_ns = cached.generated_at_ns;
          cache_age_ms = age;
        };
      };
    };
  };

  public func get_activity(filter : T.ActivityFilter, cursor : T.ActivityCursor) : async T.ActivityFeedDTO {
    try {
      await Activity.fetch(sources, filter, cursor)
    } catch (_e) {
      {
        events = [];
        next_cursor = null;
        total_estimated = 0;
        filters_applied = filter;
      };
    };
  };

  public func get_entity(kind : Text, id : Text) : async T.EntityDTO {
    // Generic entity lookup. Override in Aggregates.mo for custom entity shapes.
    // Falls back to a minimal DTO with an empty event list.
    {
      id = id;
      kind = kind;
      display_label = kind # " " # id;
      recent_events = [];
      generated_at_ns = Nat64.fromIntWrap(Time.now());
    };
  };

  public func get_event(global_id : Text) : async T.EventDetailDTO {
    {
      global_id = global_id;
      source = "main";
      source_event_id = 0;
      kind = "unknown";
      timestamp_ns = 0;
      payload_summary = "Event detail not yet implemented. Wire get_event in main.mo.";
      payload_json = "{}";
      related_event_ids = [];
      generated_at_ns = Nat64.fromIntWrap(Time.now());
    };
  };

  public query func get_source_canisters() : async { main : Principal; secondary : ?Principal } {
    { main = sources.main; secondary = sources.secondary };
  };

  public shared({ caller }) func set_source_canister(name : Text, id : Principal) : async { #Ok; #Err : Text } {
    if (caller != admin) {
      return #Err("unauthorized: only admin can update source canisters");
    };
    switch (SourceConfig.update(sources, name, id)) {
      case (#ok) #Ok;
      case (#err msg) #Err msg;
    };
  };

};
