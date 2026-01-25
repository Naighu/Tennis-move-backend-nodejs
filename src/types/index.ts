export const PopulationCategory: Record<string, string[]> = {
  "Men's Singles": ["BS", "MS"],
  "Women's Singles": ["GS", "WS"],
  "Women's Qualifying Singles": ["GSQ", "WSQ"],
  "Men's Qualifying Singles": ["BSQ", "MSQ"]
};

// Helper function to get population key from PopulationCategory
export const getPopulationKey = (population: string): string | undefined => {
  return Object.keys(PopulationCategory).find((key) =>
    PopulationCategory[key].includes(population)
  );
};
export enum CameraAngle {
  C1 = "c1",
  C2 = "c2",
  C3 = "c3",
}

export enum AWSKey {
  TennisMoveBucket = "tennis-move-resources",
  TennisMoveDynamoDB = "tennis-move",
}