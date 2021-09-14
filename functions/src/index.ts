import * as functions from "firebase-functions";
import * as express from "express";
import {createProxyMiddleware, Options} from "http-proxy-middleware";

const redditAPI = express();
// eslint-disable-next-line new-cap
const redditAPIRouterV1 = express.Router();

const nonauthHostname = "https://www.reddit.com";

redditAPI.use("/v1", redditAPIRouterV1);

const generateProxy = (hostname: string, pathToRewrite: string) => {
  const proxyOption: Options = {
    target: hostname,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {
      [pathToRewrite]: "",
    },
  };
  return createProxyMiddleware(proxyOption);
};

redditAPIRouterV1.use("/proxy/*", (req, res, next) => {
  const forwardedHostName = req.header("Brata-Forward-To") || nonauthHostname;
  const proxyMiddleware = generateProxy(forwardedHostName, "^.*/proxy");
  return proxyMiddleware(req, res, next);
});

export const reddit = functions.region("asia-southeast2").https.onRequest(redditAPI);
