import { jsonStringify, Server } from "azle";
import express, { Request } from "express";

let db = {
  hello: "",
};

let query = {
  participants: 1,
  draws: 1,
};

export default Server(() => {
  const app = express();

  console.log("back start ");
  app.use(express.json());

  app.post("/randomness", async (req: Request<any, any, typeof query>, res) => {
    try {
      console.log("req.body", req.body);
      if (req.body.participants < 1 || req.body.participants > 256) {
        throw new Error("Partcipants number must be 1-256");
      }
      const response = await fetch("icp://aaaaa-aa/raw_rand");
      const responseJson = await response.json();
      const stringify = jsonStringify(responseJson);
      const parsedObject = JSON.parse(stringify);
      const uint8array = parsedObject["__uint8array__"];
      const secondPart = uint8array.slice(1);
      let finalArray = [];
      for (let i = 0; i < req.body.draws; i++) {
        finalArray[i] = Math.round(
          (secondPart[i] * (req.body.participants - 1)) / 255 + 1
        );
      }
      console.log("finale array", finalArray);
      res.send(finalArray);
    } catch (error) {
      console.error(
        "Si è verificato un errore durante la generazione dei numeri casuali:",
        error
      );
      res
        .status(500)
        .send(
          "Si è verificato un errore durante la generazione dei numeri casuali"
        );
    }
  });
  app.use(express.static("/dist"));

  return app.listen();
});
