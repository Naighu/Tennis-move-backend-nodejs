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
),
stats_top AS (
  SELECT
    AVG(metric)        AS mean_val,
    STDDEV_POP(metric) AS sd_val
  FROM top_n
)
SELECT
  jsonb_build_object(
    'distribution',
    jsonb_build_object(
      'mean_val',    st.mean_val,
      'sd_value',    st.sd_val,
      'upper_limit', st.mean_val + st.sd_val,
      'lower_limit', st.mean_val - st.sd_val
    ),
    'top_rows',
    (
      SELECT jsonb_agg(x)
      FROM (
        SELECT
          to_jsonb(t)
          || jsonb_build_object('name', a.athlete_name) AS x
        FROM top_n t
        LEFT JOIN athletes a
          ON a.competition_player_id = t.competition_player_id
        ORDER BY t.metric DESC, t.row_id
      ) AS s
    )
  ) AS payload
FROM stats_top st;
