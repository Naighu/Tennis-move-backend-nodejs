export enum ServeCalls {
  FIRST_SERVE_IN = "first_serve_in",
  FIRST_SERVE_OUT = "first_serve_out",
  SECOND_SERVE_IN = "second_serve_in",
  SECOND_SERVE_OUT = "second_serve_out",
}

type ServeCallTuple = ["In" | "Out", 1 | 2];

export function expandServeCall(
  serveCall: ServeCalls
): ServeCallTuple[] {
  switch (serveCall) {
    case ServeCalls.FIRST_SERVE_IN:
      return [["In", 1]];

    case ServeCalls.FIRST_SERVE_OUT:
      return [["Out", 1]];

    case ServeCalls.SECOND_SERVE_IN:
      return [["In", 2]];

    case ServeCalls.SECOND_SERVE_OUT:
      return [["Out", 2]];

    default:
      return [];
  }
}



export enum ServeFeatureMetrics {
  FAST_ARM = "fast_arm",
  SERVE_SPEED = "serve_speed",
  LEG_DRIVE = "leg_drive",
  IMPACT_HEIGHT = "impact_height",
  STACK_CHANGE = "stack_change",
  TOSS_STACK = "toss_stack",
  IMPACT_STACK = "impact_stack",
  SEPARATION_ANGLE = "separation_angle",
  KNEE_FLEXION = "knee_flexion",
  TROPHY_TIME = "trophy_time"
}
