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
    t.{{FILTER_ID}}           AS filter_val
  FROM {{TABLE}} t
  JOIN competition_points cp ON t.point_id = cp.point_id
  JOIN filtered_players fp
    ON cp.reference_match_id = fp.reference_match_id
   AND t.competition_player_id = fp.player_id
  WHERE t.{{FILTER_ID}} BETWEEN $5 AND $6
    AND ({{FEATURE_EXPR}}) IS NOT NULL
),
ranked AS (
  SELECT
    row_id, metric, filter_val,
    ROW_NUMBER() OVER (ORDER BY metric DESC, row_id) AS rn
  FROM base_rows
),
top_n AS (
  SELECT row_id, metric, filter_val
  FROM ranked
  WHERE rn <= 10 
),
stats_top AS (
  SELECT
    AVG(metric)        AS mean_val_top,
    STDDEV_POP(metric) AS sd_val_top
  FROM top_n
)
SELECT
  st.mean_val_top,
  st.sd_val_top,
  st.mean_val_top + st.sd_val_top AS upper_limit_top,
  st.mean_val_top - st.sd_val_top AS lower_limit_top,
  (SELECT COUNT(*) FROM base_rows) AS population_size,
  (SELECT COUNT(*) FROM top_n)     AS n_top,
  (
    SELECT jsonb_agg(
             to_jsonb(t)
             || jsonb_build_object(
                  'z_score',
                  CASE WHEN st.sd_val_top > 0
                       THEN (t.metric - st.mean_val_top) / st.sd_val_top
                       ELSE NULL END)
           ORDER BY t.metric DESC, t.row_id)
    FROM top_n t
  ) AS top_rows
FROM stats_top st;
