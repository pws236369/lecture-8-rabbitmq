import { createServer, IncomingMessage, ServerResponse } from "http";

// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions
import { getExample, mainRoute } from "./routes.js";
import { GET_SEGEL } from "./const.js";

const port = 3000;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const route = req.url;
  switch (route) {
    case GET_SEGEL:
      getExample(req, res);
      break;
    default:
      mainRoute(req, res, "Publisher");
      break;
  }
});

server.listen(port);
console.log(`Publisher running! port ${port}`);
