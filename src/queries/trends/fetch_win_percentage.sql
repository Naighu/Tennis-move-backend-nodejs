-- $1 :: text[]   e.g. ARRAY['ATPD994','ATPMM58']
WITH matches AS (
  SELECT
    cm.match_id,
    cm.winner  -- plain text winner id
  FROM competition_matches cm
  WHERE EXISTS (
    SELECT 1
    FROM jsonb_array_elements(cm.player_ids) AS p
    WHERE p->>'competition_player_id' = ANY($1::text[])
  )
)
SELECT
  COUNT(*)::int AS matches_played,
  COUNT(*) FILTER (WHERE winner = ANY($1::text[]))::int AS matches_won,
  COUNT(*) FILTER (WHERE winner = ANY($1::text[]))::numeric
    / NULLIF(COUNT(*), 0) AS win_ratio,
  ROUND(
    COUNT(*) FILTER (WHERE winner = ANY($1::text[]))::numeric
    * 100 / NULLIF(COUNT(*), 0), 2
  ) AS win_pct
FROM matches;
