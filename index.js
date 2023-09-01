const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017";

const dbName = "SamsungOceanProject_JornadaBackEnd";
const client = new MongoClient(url);

async function main() {
  console.info("Conectando ao banco de dados...");
  await client.connect();
  console.info("Banco de dados conectado com sucesso!");

  const db = client.db(dbName);
  const collection = db.collection("heroes");
  const app = express();

  //enable JSON processing
  app.use(express.json());

  // Main Endpoint  => /
  app.get("/", function (req, res) {
    res.send("First successful request");
  });

  // Secondary Endpoint => /oi
  app.get("/oi", function (req, res) {
    res.send("New request made successfully");
  });

  // Endpoint of heroes
  const list = ["Wonder Woman ", "Deadpool", "Constantine"];

  //Read All => [GET] /heroes
  app.get("/heroes", async function (req, res) {
    const itens = await collection.find().toArray();
    res.send(itens);
  });

  //Creat => [POST] /heroes
  app.post("/heroes", async function (req, res) {
    // console.log(req.body, typeof req.body)

    //Extract the name from the request body
    const item = req.body;

    //Insert the item into the collection
    await collection.insertOne(item);

    //Submit a successful response
    res.status(201).send(item);
  });

  //Read by Id => [GET] /heroes/:id
  app.get("/heroes/:id", async function (req, res) {
    //Get route parameter from ID
    const id = req.params.id;

    //Get the information from the collection
    const item = await collection.findOne({
      _id: new ObjectId(id),
    });

    //Show item in endpoint response
    res.send(item);
  });

  // Update => [PUT] /heroes/:id
  app.put("/heroes/:id", async function (req, res) {
    // Get route ID parameter
    const id = req.params.id;

    // Extract the name from the body of the request
    const item = req.body;

    //Updates the information in the collection
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: item });

    res.send(item);
  });

  // Delete => [DELETE] /heroes/:id
  app.delete("/heroes/:id", async function (req, res) {
    // Get route ID parameter
    const id = req.params.id;

    // Delete item from collection
    await collection.deleteOne({ _id: new ObjectId(id) });

    res.status(204).send();
  });

  app.listen(2000, () =>
    console.log("💀 Server is up and running on 💻 http://localhost:2000 💀")
  );
}

main();
