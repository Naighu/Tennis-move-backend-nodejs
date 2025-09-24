WITH filtered_players AS (
  SELECT
    reference_match_id,
    jsonb_array_elements_text(jsonb_agg(elem->>'competition_player_id')) AS player_id
  FROM competition_matches
  CROSS JOIN LATERAL jsonb_array_elements(player_ids) AS elem
  WHERE (elem->>'ranking')::int >= $1
    AND ($2::int IS NULL OR (elem->>'ranking')::int <= $2)
    AND year = $3
    AND population_id = $4
  GROUP BY reference_match_id
)
SELECT
  percentile_cont(ARRAY[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])
    WITHIN GROUP (ORDER BY ({{FEATURE_EXPR}})::float) AS "percentiles"
FROM {{TABLE}} t
JOIN competition_points cp ON t.point_id = cp.point_id
JOIN filtered_players fp
  ON cp.reference_match_id = fp.reference_match_id
 AND t.competition_player_id = fp.player_id
WHERE t.{{FILTER_ID}} BETWEEN $5 AND $6;
