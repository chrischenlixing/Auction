
import AWS from "aws-sdk";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import createHttpError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
    let auctions;
    try {
        const result = await dynamodb.scan({
            TableName: process.env.AUCTIONS_TABLE_NAME,
        }).promise();
        auctions = result.Items;
    } catch (error) {
        console.error(error);
        throw new createHttpError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}
export const handler = middy(getAuctions)
.use(httpEventNormalizer())
.use(httpErrorHandler());