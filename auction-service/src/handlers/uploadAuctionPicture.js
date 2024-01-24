import { getAuctionById } from "./getAuction";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createHttpError from "http-errors";
import {setAuctionPictureUrl} from "../lib/setAuctionPictureUrl";
import validator from "@middy/validator";
import uploadAuctionPictureSchema from "../lib/schemas/uploadAuctionPictureSchema";

export async function uploadAuctionPicture(event) {
    const {id} = event.pathParameters;
    const auction = await getAuctionById(id);
    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const {email} = event.requestContext.authorizer;
    if (auction.seller !== email) {
        throw new createHttpError.Forbidden(`You are not the seller of this auction!`);
    }


    let updatedAuction;    
    try {
        const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer);
        updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl);
    } catch (error) {
        console.error(error);
        throw new createHttpError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    }
}

export const handler = middy(uploadAuctionPicture)
    .use(httpErrorHandler());