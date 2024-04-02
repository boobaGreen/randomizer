import { jsonStringify, Server } from "azle";
import express, { Request } from "express";

let db = {
  hello: "",
};

let query = {
  participants: 256,
  draws: 1,
};

export default Server(() => {
  const app = express();

  app.use(express.json());

  app.post("/randomness", async (req: Request<any, any, typeof query>, res) => {
    try {
      if (req.body.participants < 1 || req.body.participants > 256) {
        throw new Error("Partcipants number must be 1-256");
      }
      if (req.body.draws < 1 || req.body.draws > 32) {
        throw new Error("Draws number must be 1-32");
      }
      const response = await fetch("icp://aaaaa-aa/raw_rand");
      const responseJson = await response.json();
      const stringify = jsonStringify(responseJson);
      const parsedObject = JSON.parse(stringify);
      const uint8array = parsedObject["__uint8array__"];
      const mainPart = uint8array.slice(1);
      let finalArray = [];
      const finalDraws = req.body.draws || query.draws;
      const finalParticipants = req.body.participants || query.participants;
      for (let i = 0; i < finalDraws; i++) {
        finalArray[i] = Math.round(
          (mainPart[i] * (finalParticipants - 1)) / 255 + 1
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
