import Principal "mo:core/Principal";
import AE "AppEvents";

/// Actor interface definitions for source canisters.
///
/// `MainActor` reflects the public interface of your primary source canister.
/// Extend or replace the methods here to match your canister's .did file.
///
/// If your canister uses different method names or argument shapes, update
/// this file and AppEvents.mo together.
module {

  public type MainActor = actor {
    get_events_filtered : (AE.GetEventsFilteredArg) -> async AE.GetEventsFilteredResponse;
  };

  public func main(id : Principal) : MainActor {
    actor (Principal.toText(id)) : MainActor;
  };

};
