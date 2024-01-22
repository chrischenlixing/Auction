import { getEndedAuctions } from "../lib/getEndedAuctions";
import { closeAuction } from "../lib/closeAuctions";
import createHttpError from "http-errors";

async function processAuctions(event, context) {

  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map((auction) => {
      return closeAuction(auction);
    });
    await Promise.all(closePromises);
    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }
  
}

export const handler = processAuctions;