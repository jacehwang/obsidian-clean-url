export interface CleanUrlOptionInput {
  preserveHash?: boolean;
  extraTrackingParams?: Iterable<string>;
  preservedTrackingParams?: Iterable<string>;
}

export interface CleanUrlOptions {
  preserveHash: boolean;
  extraTrackingParams: ReadonlySet<string>;
  preservedTrackingParams: ReadonlySet<string>;
}
