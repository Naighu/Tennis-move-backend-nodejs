-- Params: $1=min_rank, $2=max_rank_or_null, $3=year, $4=population_id,
--         $5=filter_lower, $6=filter_upper
-- Optional: replace LIMIT 10 with LIMIT $7 if you want N as a param
WITH filtered_players AS (
  SELECT DISTINCT
    reference_match_id,
    elem->>'competition_player_id' AS player_id
  FROM competition_matches
  CROSS JOIN LATERAL jsonb_array_elements(player_ids) AS elem
  WHERE (elem->>'ranking')::int >= $1
    AND ($2::int IS NULL OR (elem->>'ranking')::int <= $2)
    AND year = $3
    AND population_id = $4
),
base_rows AS (
  SELECT
    t.row_id,
    t.{{FILTER_ID}}            AS filter_val,
    t.competition_player_id    AS competition_player_id,
    ({{FEATURE_EXPR}})::float  AS metric
  FROM {{TABLE}} t
  JOIN competition_points cp ON t.point_id = cp.point_id
  JOIN filtered_players fp
    ON cp.reference_match_id = fp.reference_match_id
   AND t.competition_player_id = fp.player_id
  WHERE t.{{FILTER_ID}} BETWEEN $5 AND $6
    AND ({{FEATURE_EXPR}}) IS NOT NULL
),
per_player_best AS (
  SELECT row_id, metric, filter_val, competition_player_id
  FROM (
    SELECT
      row_id, metric, filter_val, competition_player_id,
      ROW_NUMBER() OVER (
        PARTITION BY competition_player_id
        ORDER BY metric DESC, row_id
      ) AS rn_per_player
    FROM base_rows
  ) s
  WHERE rn_per_player = 1
),
top_n AS (
  SELECT
    row_id, metric, filter_val, competition_player_id
  FROM per_player_best
  ORDER BY metric DESC, row_id
  LIMIT 10
)
SELECT
  t.row_id,
  t.metric,
  t.filter_val,
  t.competition_player_id,
  a.athlete_name AS name
FROM top_n t
LEFT JOIN athletes a
  ON a.competition_player_id = t.competition_player_id
ORDER BY t.metric DESC, t.row_id;
