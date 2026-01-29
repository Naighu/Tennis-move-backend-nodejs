import { title } from "node:process";

export enum Piller {
  SERVE = "serve",
  RETURN_OF_SERVE = "ros",
  END_RANGE = "endrange",
}

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
export const CameraAngles = {
  C1: { angle: "c1", description: "Main Broadcast Angle", title: "Main" },
  C2: { angle: "c2", description: "C2", title: "C2" },
  C3: { angle: "c3", description: "C3", title: "C3" },
  C4: { angle: "c4", description: "C4", title: "C4" },
  C5 : { angle: "c5", description: "C5", title: "C5" },
  C25: { angle: "c25", description: "C25", title: "C25" },
  C26: { angle: "c26", description: "C26", title: "C26" },
};
// Helper function to get camera angle key from CameraAngles

export const getCameraAngleKey = (angle: string): string | undefined => {
  return Object.keys(CameraAngles).find((key) =>
    CameraAngles[key as keyof typeof CameraAngles].angle === angle
  );
};


export enum RankGroupEnum {
  TOP10 = "top_10",
  TOP11_50 = "top_11_50",
  TOP51_100 = "top_51_100",
  TOP101_250 = "top_101_250",
}



// Helper function to get RankGroup key from RankGroupEnum
export const getRankGroupKey = (rankGroup: string): string | undefined => {
  return Object.keys(PopulationCategory).find((key) =>
    PopulationCategory[key].includes(rankGroup)
  );
};



export enum AWSKey {
  TennisMoveBucket = "tennis-move-resources",
  TennisMoveDynamoDB = "tennis-move",
}