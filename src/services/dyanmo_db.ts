import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  QueryCommand, 
  QueryCommandInput, 
  QueryCommandOutput 
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-southeast-2", // Sydney region
});

export const ddbDocClient = DynamoDBDocumentClient.from(client);

export async function queryDynamoDb<T>(params: QueryCommandInput): Promise<T[]> {
  try {
    const data: QueryCommandOutput = await ddbDocClient.send(new QueryCommand(params));
    return (data.Items ?? []) as T[];
  } catch (err) {
    console.error("Query failed", err);
    throw err;
  }
}
