SELECT json_object_agg(
  year::text,
  tournament_map
) AS result
FROM (
  SELECT
    year,
    json_object_agg(
      tournament_id::text,
      populations
    ) AS tournament_map
  FROM (
    SELECT
      year,
      tournament_id,
      array_agg(DISTINCT population_id ORDER BY population_id) AS populations
    FROM competition_matches
    GROUP BY year, tournament_id
  ) AS grouped
  GROUP BY year
) AS nested;