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
  LIMIT 10
),
stats AS (
  SELECT
    AVG(({{FEATURE_EXPR}})::float)     AS mean_val,
    STDDEV_POP(({{FEATURE_EXPR}})::float) AS sd_val
  FROM {{TABLE}} t
  JOIN competition_points cp ON t.point_id = cp.point_id
  JOIN filtered_players fp
    ON cp.reference_match_id = fp.reference_match_id
   AND t.competition_player_id = fp.player_id
  WHERE t.{{FILTER_ID}} BETWEEN $5 AND $6
)
SELECT
  mean_val,
  sd_val,
  mean_val + sd_val AS upper_limit,
  mean_val - sd_val AS lower_limit
FROM stats;
