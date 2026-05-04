import Principal "mo:core/Principal";
import Result "mo:core/Result";

module {

  /// The set of source canisters the BFF queries.
  ///
  /// `main` is your primary source canister (required).
  /// `secondary` is an optional second canister (e.g., an analytics aggregator).
  /// Additional sources can be added here and wired in SourceActors.mo.
  public type SourceCanisters = {
    var main : Principal;
    var secondary : ?Principal;
  };

  public type SourceCanistersInit = {
    main : Principal;
    secondary : ?Principal;
    admin : ?Principal;
  };

  public func init(args : SourceCanistersInit) : SourceCanisters {
    {
      var main = args.main;
      var secondary = args.secondary;
    };
  };

  public func update(s : SourceCanisters, name : Text, id : Principal) : Result.Result<(), Text> {
    switch (name) {
      case "main" { s.main := id; #ok };
      case "secondary" { s.secondary := ?id; #ok };
      case _ { #err("unknown source canister: " # name) };
    };
  };

};
