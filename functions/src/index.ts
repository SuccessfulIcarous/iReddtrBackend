import * as functions from "firebase-functions";
import * as express from "express";
import {createProxyMiddleware, Options} from "http-proxy-middleware";

const redditAPI = express();
// eslint-disable-next-line new-cap
const redditAPIRouterV1 = express.Router();

const nonauthHostname = "https://www.reddit.com";
const stylesRedditMediaHostname = "https://styles.redditmedia.com";
const athumbsRedditMediaHostname = "https://a.thumbs.redditmedia.com";
const bthumbsRedditMediaHostname = "https://b.thumbs.redditmedia.com";
const cthumbsRedditMediaHostname = "https://c.thumbs.redditmedia.com";
const dthumbsRedditMediaHostname = "https://d.thumbs.redditmedia.com";
const ethumbsRedditMediaHostname = "https://e.thumbs.redditmedia.com";
const fthumbsRedditMediaHostname = "https://f.thumbs.redditmedia.com";
const gthumbsRedditMediaHostname = "https://g.thumbs.redditmedia.com";

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

redditAPIRouterV1.use("/api/*", generateProxy(nonauthHostname, "^/v1/api"));
redditAPIRouterV1.use("/styles/*", generateProxy(stylesRedditMediaHostname, "^/v1/styles"));
redditAPIRouterV1.use("/athumbs/*", generateProxy(athumbsRedditMediaHostname, "^/v1/athumbs"));
redditAPIRouterV1.use("/bthumbs/*", generateProxy(bthumbsRedditMediaHostname, "^/v1/bthumbs"));
redditAPIRouterV1.use("/cthumbs/*", generateProxy(cthumbsRedditMediaHostname, "^/v1/cthumbs"));
redditAPIRouterV1.use("/dthumbs/*", generateProxy(dthumbsRedditMediaHostname, "^/v1/dthumbs"));
redditAPIRouterV1.use("/ethumbs/*", generateProxy(ethumbsRedditMediaHostname, "^/v1/ethumbs"));
redditAPIRouterV1.use("/fthumbs/*", generateProxy(fthumbsRedditMediaHostname, "^/v1/fthumbs"));
redditAPIRouterV1.use("/gthumbs/*", generateProxy(gthumbsRedditMediaHostname, "^/v1/gthumbs"));

export const reddit = functions.region("asia-southeast2").https.onRequest(redditAPI);
