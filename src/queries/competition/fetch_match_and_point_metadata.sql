SELECT
    cp.point_id,
    cp.reference_match_id,
    cp.serve_id,
    cp.player_id_of_server,
    cp.player_id_of_point_winner,
    cp.current_score,
    cm.year,
    cm.tournament_id,
    cm.population_id,
    cm.round,
    cm.match_id,
    cm.player_ids,
    cm.winner,
    cm.final_score
FROM competition_points cp
JOIN competition_matches cm ON cp.reference_match_id = cm.reference_match_id
WHERE cp.point_id = %s;