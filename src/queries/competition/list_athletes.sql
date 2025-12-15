SELECT DISTINCT
    ath.competition_player_id,
    ath.athlete_name
FROM (
    SELECT jsonb_array_elements_text(jsonb_agg(elem->>'competition_player_id')) AS player_id
    FROM competition_matches cm
    CROSS JOIN LATERAL jsonb_array_elements(player_ids) AS elem
    WHERE cm.year = $1
      AND cm.tournament_id =$2
      AND cm.population_id = $3
) AS player_list
JOIN athletes ath
  ON player_list.player_id = ath.competition_player_id;

-- SELECT DISTINCT , player_id FROM competition_matches WHERE match_id LIKE $1;
