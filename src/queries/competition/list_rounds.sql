SELECT DISTINCT
    sub.round,
    sub.reference_match_id
FROM (
    SELECT 
        round,
        match_id,
        reference_match_id,
        elem->>'competition_player_id' AS player_id
    FROM competition_matches
    CROSS JOIN LATERAL jsonb_array_elements(player_ids) AS elem
    WHERE year = $1
      AND population_id = $2
) AS sub
WHERE sub.player_id = $3;