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
        throw new Error("Partcipants number must be 1-256");
      }
      if (req.body.draws < 1 || req.body.draws > 32) {
        throw new Error("Draws number must be 1-32");
      }
      const response = await fetch("icp://aaaaa-aa/raw_rand");
      const responseJson = await response.json();
      console.log("responseJson pura :", responseJson);
      const stringify = jsonStringify(responseJson);
      console.log("stringify :", stringify);
      const parsedObject = JSON.parse(stringify);
      console.log("parseObj", parsedObject);
      const uint8array = parsedObject["__uint8array__"];
      console.log("uint8array", uint8array);
      // const mainPart = uint8array.slice(1);
      // console.log("mainPart",mainPart);
      let finalArray = [];
      const finalDraws = req.body.draws || query.draws;
      const finalParticipants = req.body.participants || query.participants;
      for (let i = 0; i < finalDraws; i++) {
        finalArray[i] =
          Math.round((uint8array[i] * (finalParticipants - 1)) / 255) + 1;
      }
      // console.log("finale array", finalArray);
      //tempppppppppppppppppppppppp
      counter += 1;
      res.send({ main: finalArray, count: counter });

      // res.send(finalArray);
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
