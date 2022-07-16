require('dotenv').config();
const express = require('express');
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require('mongodb');

const cors = require('cors');
const { ObjectID } = require('bson');

const app = express();
app.use(express.json());
app.use(express.static("public")) 
app.use(cors({
  origin: '*'
}));

const {
  PORT, DBC, URI, CE
} = process.env


const client = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.listen(PORT, () => {
  console.log(`Serveris paleistas. Laukia užklausų ant ${PORT} porto`);
});

app.get('/users', (req, res) => {
  client.connect(async () => {
    const collection = client.db(DBC).collection(CE);
    try {
      const result = await collection.find({}).toArray();
      res.json(result);
      client.close();
    } catch (err) {
      res.send("Something went wrong!!");
      client.close();
    }

  });
});

app.post('/users', (req, res) => {
  client.connect(async () => {
    const collection = client.db('usersdb').collection('users');
    
    try {
      const result = await collection.insertOne({
        name: req.body.name,
        lname: req.body.lname,
        email: req.body.email,
        age: req.body.age,
        
      });
      res.json(result);
      client.close();

    } catch (err) {
      res.send("Something went wrong!!");
      client.close();
    }
  });
});


app.delete('/users/:id', (req, res) => {
  const id = req.params.id
  client.connect(async () => {
    const collection = client.db('usersdb').collection('users');
    const result = await collection.deleteOne({
      _id: ObjectId(id)
    })
    res.json(result);

    client.close();
  });
});

app.put("/user/:id", (req, res) => {
  const id = req.params.id
  client.connect(async function (err, client) {
    if (err) {
      res.send("Something went wrong!!");
      client.close();
    } else {
      const database = client.db('usersdb')
      const collection = database.collection('users')
      const { name, lname, email, age } = req.body;
      const filter = { _id: ObjectId(id) }

      const newUserData = {
        name: name,
        lname: lname,
        email: email,
        age: age
      };
   
      try {
        const result = await collection.replaceOne(filter, newUserData);
        res.send(result);
        client.close();
      } catch (err) {
        res.send("something went wrong")
        client.close()
      }
    }
  });
});
