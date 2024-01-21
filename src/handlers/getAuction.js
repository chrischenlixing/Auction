
import AWS from "aws-sdk";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import createHttpError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
    let auctions;
    const { id } = event.pathParameters;
    try {
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
        }).promise();
        auctions = result.Item;
    } catch (error) {
        console.error(error);
        throw new createHttpError.InternalServerError(error);
    }

    if (!auctions) {
        throw new createHttpError.NotFound(`Auction with ID "${id}" not found!`);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}
export const handler = middy(getAuction)
.use(httpEventNormalizer())
.use(httpErrorHandler());