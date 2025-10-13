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
),
base_rows AS (
  SELECT
    t.row_id,
    ({{FEATURE_EXPR}})::float AS metric,
    t.{{FILTER_ID}}          AS filter_val
  FROM {{TABLE}} t
  JOIN competition_points cp ON t.point_id = cp.point_id
  JOIN filtered_players fp
    ON cp.reference_match_id = fp.reference_match_id
   AND t.competition_player_id = fp.player_id
  WHERE t.{{FILTER_ID}} BETWEEN $5 AND $6
    AND ({{FEATURE_EXPR}}) IS NOT NULL       
)
SELECT
  row_id,
  metric,
  filter_val,
  cume_dist()    OVER (ORDER BY metric)           AS percentile,    
  percent_rank() OVER (ORDER BY metric)           AS percent_rank,   
  ntile(10)      OVER (ORDER BY metric)           AS decile         
FROM base_rows
ORDER BY metric DESC NULLS LAST, row_id         
LIMIT 10                     
