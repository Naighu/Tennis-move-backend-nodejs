SELECT
    year,
    tournament_id,
    population_id,
    round,
    match_id,
    player_ids,
    winner,
    final_score
FROM competition_matches
WHERE reference_match_id::text = $1;