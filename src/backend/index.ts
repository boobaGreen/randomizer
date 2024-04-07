import { jsonStringify, Server } from "azle";
import express, { Request } from "express";

let query = {
  range: 256,
  draws: 32,
};
let counter = 0;
export default Server(() => {
  const app = express();

  app.use(express.json());

  app.post("/randomness", async (req: Request<any, any, typeof query>, res) => {
    try {
      if (req.body.range < 1 || req.body.range > 256) {
        throw new Error("range number must be between 1 and 256");
      }
      if (req.body.draws < 1 || req.body.draws > 32) {
        throw new Error("Draws number must be between 1 and 32");
      }

      const response = await fetch("icp://aaaaa-aa/raw_rand");

      const responseJson = await response.json();

      const stringify = jsonStringify(responseJson);

      const parsedObject = JSON.parse(stringify);

      const uint8array = parsedObject["__uint8array__"];

      let finalArray = [];
      const finalDraws = req.body.draws || query.draws;
      const finalrange = req.body.range || query.range;

      for (let i = 0; i < finalDraws; i++) {
        finalArray[i] =
          Math.round((uint8array[i] * (finalrange - 1)) / 255) + 1;
      }

      counter += 1;
      res.send({ main: finalArray, count: counter });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("Range number") ||
          error.message.includes("Draws number")
        ) {
          console.log("error.message :", error.message);
          res.status(400).send(error.message);
        }
      }
    }
  });

  app.use(express.static("/dist"));
  // set route for all no match routes
  // app.all("*", (req, res, next) => {
  //   next(new AppError(`Can't find${req.originalUrl} on this server`, 404));
  // });

  //Global Error Handling Middleware - 4 argument express recognize is a error middleware

  return app.listen();
});
