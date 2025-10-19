export const TABLES = {
  competition_serves: "competition_serves",
  end_range: "competition_end_range",
  ros: "competition_return_of_serve"

} as const;

export const FILTERS = {
  //serve
  serve_speed_kph_filt: "serve_speed_kph_filt",

  //ros
  ros_serve_speed_kph_filt:"ros_serve_speed_kph_filt",
  return_reach_filt: "return_reach_filt",

  //end-range
  distance_in_m_filt: "distance_in_m_filt"
} as const;

export const FEATURES = {
  fast_arm_ms: "t.results->>'fast_arm_ms'",
  serve_speed: "t.serve_speed",
  leg_drive_ms: "t.results->>'leg_drive_ms'",
  impact_height_m: "t.results->>'impact_height_m'",

  // ros metrics
  return_reach: "t.results->>'return_reach'",
  return_stiffness: "t.results->>'return_stiffness'",
  return_movement_duration: "t.results->>'return_movement_duration'",
  return_movement_velocity: "t.results->>'return_movement_velocity'",
  return_split_timing: "t.results->>'return_split_timing'",
  return_movement_displacement: "t.results->>'return_movement_displacement'",

  //endrange
  peak_velocity_ms: "t.results->>'peak_velocity_ms'",
  peak_acceleration_mss: "t.results->>'peak_acceleration_mss'",
  peak_deceleration_mss: "t.results->>'peak_deceleration_mss'",
  time_in_turn_s: "t.results->>'time_in_turn_s'",
  cadence_spm: "t.results->>'cadence_spm'",
} as const;

export const RANKING_BRACKETS = {
  "Top 10": [1, 10],
  "Top 50": [11, 50],
  "Top 100": [51, 100],
  "Top 250": [101, 250],
  "250+": [251, 5000],
  "All": [1, 5000]
} as const;

// Derive TS unions from the maps (no duplication)
type TableKey = keyof typeof TABLES;   // "competition_serves"
type FilterKey = keyof typeof FILTERS;  // "serve_speed_kph_filt" | ...
type FeatureKey = keyof typeof FEATURES; // "fast_arm_ms" | "serve_speed"
type RankingBracketKey = keyof typeof RANKING_BRACKETS; // "Top 10" | ...

export interface TrendsTopPlayersBody {
  table: TableKey;
  year: number;
  feature: FeatureKey;
  filter_feature: FilterKey;
  lower_value: number;
  upper_value: number;
  pop: string;
  ranking_bracket?: RankingBracketKey;
}



export interface TrendsDistributionBody {
  table: TableKey;
  year: number;
  feature: FeatureKey;
  filter_feature: FilterKey;
  lower_value: number;
  upper_value: number;
  pop: string;
}

export interface TrendsGetVideoBody {
  selected_row: string;
  source: string;
  camera: string;
} 

export interface TrendsGetWinPercentageBody {
  player_ids: string[];
}