/* Params: $1=minRank, $2=maxRank (nullable), $3=year, $4=pop, $5=lower, $6=upper */

SELECT
  t.row_id,
  ({{FEATURE_EXPR}})::float AS metric,
  t.{{FILTER_ID}}          AS filter_val
FROM {{TABLE}} t
JOIN competition_points cp ON t.point_id = cp.point_id
WHERE t.{{FILTER_ID}} BETWEEN $5 AND $6
  AND EXISTS (
    SELECT 1
    FROM competition_matches cm
    CROSS JOIN LATERAL jsonb_array_elements(cm.player_ids) AS elem
    WHERE cm.reference_match_id = cp.reference_match_id
      AND cm.year = $3
      AND cm.population_id = $4
      AND (elem->>'competition_player_id') = t.competition_player_id
      AND (elem->>'ranking')::int >= $1
      AND ($2::int IS NULL OR (elem->>'ranking')::int <= $2)
  )
ORDER BY ({{FEATURE_EXPR}})::float DESC
LIMIT 10;
