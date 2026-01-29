import { CameraAngles, Piller } from "../../../types";

export interface CompetetitionGetAtheletesBody {
  year: number;
  pop: string;
  tournament_name: string;
}

export interface CompetetitionGetTableDataBody {
  primary_key: string;
  player_id: string;
}

export interface CompetetitionGetMatchPrimaryKeysBody {
  year: number;
  pop: string;
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