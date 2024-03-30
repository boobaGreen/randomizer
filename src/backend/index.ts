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

  console.log("back start 3");
  app.use(express.json());

  app.get("/db", (req, res) => {
    res.json(db);
  });

  app.post("/db/update", (req: Request<any, any, typeof db>, res) => {
    console.log("req.body", req.body);
    db = req.body;
    // console.log("Request", Request);
    res.json(db);
  });

  app.post("/randomness", async (req: Request<any, any, typeof query>, res) => {
    // console.log("req", req);
    console.log("req.body", req.body);
    // console.log("req : ", req);
    const response = await fetch("icp://aaaaa-aa/raw_rand");
    const responseJson = await response.json();
    // console.log("response json", responseJson);
    const stringify = jsonStringify(responseJson);
    // Parsa la stringa JSON
    const parsedObject = JSON.parse(stringify);

    // Estrai l'array di uint8
    const uint8array = parsedObject["__uint8array__"];

    // Estrapola la seconda parte dell'array
    const secondPart = uint8array.slice(1);
    console.log("second part", secondPart);
    // Estrapola il primo valore
    // const primoValore = uint8array[0];

    let finalArray = [];

    for (let i = 0; i < req.body.draws; i++) {
      finalArray[i] = Math.round(
        (secondPart[i] * (req.body.participants - 1)) / 255 + 1
      );
    }

    // const randomNumberInRange = Math.round(
    //   (primoValore * (req.body.participants - 1)) / 255 + 1
    // );
    console.log("finale array", finalArray);
    res.send(finalArray);
  });

  app.use(express.static("/dist"));

  return app.listen();
});
