import * as functions from "firebase-functions";
import * as express from "express";
// import * as querystring from "querystring";
// import * as https from "https";
// import * as url from "url";
import { createProxyMiddleware, Options } from "http-proxy-middleware";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const redditAPI = express();
// eslint-disable-next-line new-cap
const redditAPIRouterV1 = express.Router();

const nonauthHostname = "https://www.reddit.com";

redditAPI.use("*/v1", redditAPIRouterV1);
/*
redditAPIRouterV1.get("/*", async (req, res) => {
  const bearerToken = req.headers.authorization;
  functions.logger.debug(`${bearerToken ? "Has Bearer Token" : "No Bearer Token"}`);
  let data = "";

  const newUrl = new url.URL(`${req.path}?${querystring.stringify(req.query as any)}`, nonauthHostname);
  functions.logger.debug(`Reddit URL: ${newUrl.toString()}`);

  const apiReq = https.get(newUrl, (apiRes) => {
    apiRes.on("data", (chunk) => {
      data += chunk;
    });

    apiRes.on("end", () => {
      res.send(JSON.parse(data));
    });
  });

  apiReq.on("error", (apiError) => {
    functions.logger.error(apiError);
    res.sendStatus(500);
  });

  apiReq.end();
});
*/

const proxyOption: Options = {
  target: nonauthHostname, changeOrigin: true, logLevel: "debug", pathRewrite: { '^/v1': ""},
}
const httpProxyToReddit = createProxyMiddleware(proxyOption);
redditAPIRouterV1.get("/*", httpProxyToReddit);


export const reddit = functions.region("asia-southeast2").https.onRequest(redditAPI);
