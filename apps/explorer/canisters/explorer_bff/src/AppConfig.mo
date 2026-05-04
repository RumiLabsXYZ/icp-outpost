import Principal "mo:core/Principal";

/// Edit this file to configure admin access for your explorer deployment.
///
/// The admin principal is the only caller permitted to call `set_source_canister`.
/// For local development, leave `defaultAdmin` returning null — the BFF will
/// default to the anonymous principal (2vxsx-fae) and accept any caller.
///
/// For mainnet, pass a real admin principal in the init args when deploying.
module {

  /// Placeholder: override by passing `admin = opt principal "<your-principal>"` in init args.
  public let defaultAdmin : ?Principal = null;

};
