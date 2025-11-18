export interface CompetetitionGetAtheletesBody {
  year: number;
  pop: string;
}
export interface CompetetitionGetMatchIdsBody {
  year: number;
  pop: string;
  player_id: string;
}

export interface CompetetitionGetTableDataBody {
  table: string;
  reference_match_id: string;
  player_id: string;
}

export interface CompetetitionGetSelectedVideosBody {      
    match: string; 
    source: string;
    camera: string;
    selected_row: string;
}