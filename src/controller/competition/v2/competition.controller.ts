import { Request, Response } from "express";
import { sendNoContent, sendOk } from "../../../utils/respond";
import { AppError } from "../../../types/error.type";
import { CompetetitionGetAtheletesBody, CompetetitionGetAvailableCameraAnglesBody, CompetetitionGetMatchPrimaryKeysBody, CompetetitionGetSelectedVideosBody, CompetetitionGetTableDataBody } from "./types";
import { listObjectsInS3, presignGet } from "../../../services/s3";
import { fetchMatchList } from "./helpers/extract_match_list";
import { queryDynamoDb } from "../../../services/dyanmo_db";
import { AWSKey, CameraAngles, getCameraAngleKey, Piller, PopulationCategory } from "../../../types";




export async function getPopulation(req: Request, res: Response) {
  try {
    const populations = Object.values(PopulationCategory);
    return sendOk(res, populations);
  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}
export async function getMatchPrimaryKeys(req: Request, res: Response) {
  try {
    const body = req.query as unknown as CompetetitionGetMatchPrimaryKeysBody;

    const matchListObject = await fetchMatchList();
    const selectors = matchListObject[body.pop][body.player_name]["details"];
    return sendOk(res, selectors);

  } catch (err: any) {
    console.log(err);

    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }

}

export async function getAthletes(req: Request, res: Response) {
  try {

    const body = req.query as unknown as CompetetitionGetAtheletesBody;
    const matchListObject = await fetchMatchList();
    const players = Object.keys(matchListObject[body.pop])
    const result = [];
    for (const player of players) {
      result.push({ player_name: player, player_id: matchListObject[body.pop][player]['player_id'] });
    }

    return sendOk(res, result);

  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}


export async function getTableData(req: Request, res: Response) {
  try {
    const piller = req.params.piller as string;
    if (Object.values(Piller).includes(piller as Piller) === false)
      throw new AppError("VALIDATION_ERROR", "Invalid piller value", undefined);
    const body = req.query as unknown as CompetetitionGetTableDataBody;

    const rows = await queryDynamoDb<{ stats: any[] }>({
      TableName: "tennis-move",
      KeyConditionExpression: "primary_key = :pk AND begins_with(sort_key, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": body.primary_key,
        ":skPrefix": `competition#${piller}`,
      },
    });

    const result: any[] = [];
    for (const row of rows) {

      if ((row.stats as any)[0]['player_id'] === body.player_id)
        result.push(...row.stats);
    }

    return sendOk(res, result);

  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}


export async function getAvailableCameraAngles(req: Request, res: Response) {
  try {
    const body = req.query as unknown as CompetetitionGetAvailableCameraAnglesBody;
    const year = body.primary_key.split("_")[0];
    const tournament_id = body.primary_key.split("_")[1];
    const match_id = body.primary_key.split("_")[2];
    const video_prefix = `video/year=${year}/competition=${tournament_id}/match=${match_id}/`;

    const objects = await listObjectsInS3(AWSKey.TennisMoveBucket, video_prefix);

    const angles = objects.CommonPrefixes?.map((prefixObj) => {
      const angle = prefixObj.Prefix?.split("/")[4].split("=")[1];
      return CameraAngles[getCameraAngleKey(angle!) as keyof typeof CameraAngles];
    });


    return sendOk(res, angles);
  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}

export async function getSelectedVideos(req: Request, res: Response) {
  try {
    const body = req.query as unknown as CompetetitionGetSelectedVideosBody;;
    const year = body.primary_key.split("_")[0];
    const tournament_id = body.primary_key.split("_")[1];
    const match_id = body.primary_key.split("_")[2];
    const video_key = `video/year=${year}/competition=${tournament_id}/match=${match_id}/angle=${body.camera_angle}/clips/${body.video_key}.mp4`

    const url = await presignGet(AWSKey.TennisMoveBucket, video_key);

    return sendOk(res, { "url": url });
  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}
