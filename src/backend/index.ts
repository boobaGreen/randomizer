import { jsonStringify, Server } from "azle";
import express, { Request } from "express";

let query = {
  participants: 256,
  draws: 32,
};
let counter = 0;
export default Server(() => {
  const app = express();

  app.use(express.json());

  app.post("/randomness", async (req: Request<any, any, typeof query>, res) => {
    try {
      if (req.body.participants < 1 || req.body.participants > 256) {
        throw new Error("Participants number must be between 1 and 256");
      }
      if (req.body.draws < 1 || req.body.draws > 32) {
        throw new Error("Draws number must be between 1 and 32");
      }

      const response = await fetch("icp://aaaaa-aa/raw_rand");
      const responseJson = await response.json();
      console.log("responseJson pure :", responseJson);
      const stringify = jsonStringify(responseJson);
      console.log("stringify :", stringify);
      const parsedObject = JSON.parse(stringify);
      console.log("parseObj", parsedObject);
      const uint8array = parsedObject["__uint8array__"];
      console.log("uint8array", uint8array);

      let finalArray = [];
      const finalDraws = req.body.draws || query.draws;
      const finalParticipants = req.body.participants || query.participants;

      for (let i = 0; i < finalDraws; i++) {
        finalArray[i] =
          Math.round((uint8array[i] * (finalParticipants - 1)) / 255) + 1;
      }

      counter += 1;
      res.send({ main: finalArray, count: counter });
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while generating random numbers:",
          error.message
        );
      }
      if (error instanceof Error) {
        if (error.message.includes("Participants number")) {
          res.status(400).send(error.message);
        } else if (error.message.includes("Draws number")) {
          res.status(400).send(error.message);
        } else {
          res
            .status(500)
            .send("An error occurred while generating random numbers");
        }
      } else {
        res
          .status(500)
          .send("An error occurred while generating random numbers");
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
