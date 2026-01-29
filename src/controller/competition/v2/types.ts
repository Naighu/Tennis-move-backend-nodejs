import { CameraAngles, Piller } from "../../../types";

export interface CompetetitionGetAtheletesBody {
  pop: string;
}

export interface CompetetitionGetMatchPrimaryKeysBody {
  pop: string;
  player_name: string
}

export interface CompetetitionGetTableDataBody {
  primary_key: string;
  player_id: string;
}

export interface CompetetitionGetAvailableCameraAnglesBody {      
   primary_key: string;
}

export interface CompetetitionGetSelectedVideosBody {      
   video_key: string;
   primary_key: string;
   camera_angle: string;
}