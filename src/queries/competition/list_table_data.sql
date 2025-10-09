SELECT
    t.row_id,
    cm.reference_match_id,
    cp.point_id,
    cm.final_score,
    cp.current_score,
    t.set_num,
    t.game_num,
    t.serve_num,
    t.results
FROM {{TABLE}} t
JOIN competition_points cp ON t.point_id = cp.point_id
JOIN competition_matches cm ON cp.reference_match_id = cm.reference_match_id
WHERE cm.reference_match_id = $1
    AND t.competition_player_id = $2;