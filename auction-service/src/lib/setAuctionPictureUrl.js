
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();
export async function setAuctionPictureUrl(id, pictureUrl){
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set pictureUrl = :pictureUrl',
        ExpressionAttributeValues: {
            ':pictureUrl': pictureUrl,
        },
        ReturnValues: 'ALL_NEW',
    };
    let updatedAuction;
    try{
        const result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;
    }
    catch(error){
        console.error(error);
        throw new createHttpError.InternalServerError(error);

    }
    return updatedAuction
}