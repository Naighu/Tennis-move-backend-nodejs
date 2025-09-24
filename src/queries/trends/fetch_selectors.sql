SELECT json_object_agg(
  year::text,
  populations
) AS result
FROM (
  SELECT
    year,
    array_agg(DISTINCT population_id ORDER BY population_id) AS populations
  FROM competition_matches
  GROUP BY year
) AS grouped;