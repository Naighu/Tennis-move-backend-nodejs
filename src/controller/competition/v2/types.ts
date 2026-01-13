export interface CompetetitionGetAtheletesBody {
  year: number;
  pop: string;
  tid: number;
}
export interface CompetetitionGetMatchIdsBody {
  year: number;
  pop: string;
  player_id: string;
  tid: number;
  piller: string;
}

export interface CompetetitionGetTableDataBody {
  sort_key: string;
  reference_match_id: string;
}

export interface CompetetitionGetSelectedVideosBody {      
   video_key: string;
   reference_match_id: string;
   piller: string;
}