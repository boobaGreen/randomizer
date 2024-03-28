import { jsonStringify, Server } from "azle";
import express, { Request } from "express";

let db = {
  hello: "",
};

export default Server(() => {
  const app = express();

  console.log("back start 3");
  app.use(express.json());

  app.get("/db", (req, res) => {
    res.json(db);
  });

  app.post("/db/update", (req: Request<any, any, typeof db>, res) => {
    db = req.body;

    res.json(db);
  });

  app.post("/randomness", async (req, res) => {
    const response = await fetch("icp://aaaaa-aa/raw_rand");
    const responseJson = await response.json();
    console.log("response json", responseJson);

    const stringify = jsonStringify(responseJson);
    // Parsa la stringa JSON
    const parsedObject = JSON.parse(stringify);

    // Estrai l'array di uint8
    const uint8array = parsedObject["__uint8array__"];

    // Estrapola la seconda parte dell'array
    const secondPart = uint8array.slice(1);

    // Estrapola il primo valore
    const primoValore = uint8array[0];

    res.send([primoValore]);
  });

  app.use(express.static("/dist"));

  return app.listen();
});