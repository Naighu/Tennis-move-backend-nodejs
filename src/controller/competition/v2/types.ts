import { CameraAngle, Piller } from "../../../types";

export interface CompetetitionGetAtheletesBody {
  year: number;
  pop: string;
  tid: number;
}

export interface CompetetitionGetTableDataBody {
  primary_key: string;
}

export interface CompetetitionGetMatchPrimaryKeysBody {
  year: number;
  pop: string;
  player_id: string;
  tid: number;
}

export interface CompetetitionGetSelectedVideosBody {      
   video_key: string;
   primary_key: string;
   camera_angle: CameraAngle;
}