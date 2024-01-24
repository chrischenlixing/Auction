import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import createHttpError from "http-errors";
import JSONErrorHandlerMiddleware from 'middy-middleware-json-error-handler';
import cors from "@middy/http-cors";

export default handler => middy(handler)
    .use([
        httpEventNormalizer(),
        httpErrorHandler(),
        JSONErrorHandlerMiddleware(),
        cors(),
    ]);