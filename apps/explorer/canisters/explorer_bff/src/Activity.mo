import Array "mo:core/Array";
import Nat64 "mo:core/Nat64";
import T "Types";
import AE "AppEvents";
import SA "SourceActors";
import Format "Format";
import SourceConfig "SourceConfig";

module {

  func mapEvent(ev : AE.EventSummary) : T.EventRowDTO {
    {
      source = "main";
      source_event_id = ev.global_index;
      global_id = "main:" # debug_show(ev.global_index);
      kind = ev.kind;
      timestamp_ns = ev.timestamp_ns;
      primary_principal = ev.primary_principal;
      primary_amount = switch (ev.amount_e8s) {
        case null null;
        case (?amt) ?Format.e8s(amt, 8, "");
      };
      secondary_principal = null;
      approximate = false;
      payload_summary = ev.payload_summary;
    };
  };

  public func fetch(
    sources : SourceConfig.SourceCanisters,
    filter : T.ActivityFilter,
    cursor : T.ActivityCursor,
  ) : async T.ActivityFeedDTO {
    let start : Nat64 = switch (cursor.before_global_id) {
      case null 0;
      case (?_id) 0; // TODO: parse cursor for real pagination
    };
    let length : Nat64 = Nat64.fromNat32(cursor.page_size);

    // Convert frontend text type filters into AppEvents EventTypeFilter.
    // Since AppEvents.EventTypeFilter is user-defined, we pass types = null
    // (fetch all) and filter client-side via the kind string. If your source
    // canister supports server-side filtering, adapt this mapping.
    let arg : AE.GetEventsFilteredArg = {
      start = start;
      length = length;
      types = null;
      principal = filter.filter_principal;
      time_range = switch (filter.from_ns, filter.to_ns) {
        case (?f, ?t) ?{ from_ns = f; to_ns = t };
        case _ null;
      };
    };

    try {
      let mainActor = SA.main(sources.main);
      let resp = await mainActor.get_events_filtered(arg);

      // Apply kind filter client-side if types were specified
      let events = Array.map<AE.EventSummary, T.EventRowDTO>(resp.events, mapEvent);
      let filtered = switch (filter.types) {
        case null events;
        case (?types) Array.filter<T.EventRowDTO>(events, func(e) {
          // include if kind is in the requested types list
          var found = false;
          for (t in types.vals()) {
            if (t == e.kind) found := true;
          };
          found;
        });
      };

      {
        events = filtered;
        next_cursor = if (resp.total > start + length) {
          ?("main:" # debug_show(start + length))
        } else null;
        total_estimated = resp.total;
        filters_applied = filter;
      };
    } catch (_e) {
      {
        events = [];
        next_cursor = null;
        total_estimated = 0;
        filters_applied = filter;
      };
    };
  };

};
