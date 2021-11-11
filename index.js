const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
//midleware
app.use(cors());
app.use(express.json());
//mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.be8dg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("drone_world");
    const servicesCollection = database.collection("services");

    //get api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(qurey);
      res.json(service);
    });
    //post services
    app.post("/services", async (req, res) => {
      const services = req.body;
      const result = await servicesCollection.insertOne(services);
      console.log("hit the post", services);
      res.send(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(` listening at http://localhost:${port}`);
});
