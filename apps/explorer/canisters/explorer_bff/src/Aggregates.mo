import T "Types";
import SourceConfig "SourceConfig";

/// Edit this file to add custom overview tiles.
///
/// The `fetch` function is called every 30 seconds to refresh the overview cache.
/// Return a list of EventRowDTOs as the overview's recent_activity, and any
/// additional aggregated data your frontend reads from the OverviewDTO.
///
/// For most apps, you'll query your source canister here and map the results
/// into EventRowDTOs. Wrap calls in try/catch so a transient error doesn't
/// break the entire overview — return an empty list and log the failure.
module {

  public func fetchRecentActivity(
    _sources : SourceConfig.SourceCanisters,
  ) : async [T.EventRowDTO] {
    // TODO: call your source canister and return recent events.
    // Example:
    //   let actor = SourceActors.main(sources.main);
    //   let resp = await actor.get_events_filtered({ start = 0; length = 5; ... });
    //   Array.map(resp.events, mapEvent)
    [];
  };

};
