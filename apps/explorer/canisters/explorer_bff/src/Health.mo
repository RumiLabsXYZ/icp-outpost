import Time "mo:core/Time";
import Nat64 "mo:core/Nat64";
import T "Types";

module {

  public func defaultHealth() : T.HealthSummaryDTO {
    {
      level = #Yellow;
      message = "Initializing — cache not yet seeded.";
      source_lag_seconds = 0 : Nat64;
      any_error = false;
      generated_at_ns = Nat64.fromIntWrap(Time.now());
    };
  };

  public func healthFromError() : T.HealthSummaryDTO {
    {
      level = #Red;
      message = "Source canister unreachable.";
      source_lag_seconds = 0 : Nat64;
      any_error = true;
      generated_at_ns = Nat64.fromIntWrap(Time.now());
    };
  };

  public func healthOk() : T.HealthSummaryDTO {
    {
      level = #Green;
      message = "All systems nominal.";
      source_lag_seconds = 0 : Nat64;
      any_error = false;
      generated_at_ns = Nat64.fromIntWrap(Time.now());
    };
  };

};
