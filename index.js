
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ygq6chl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let coffeeCollection;

async function run() {
    try {
        await client.connect();

        coffeeCollection = client.db('coffeeDB').collection('coffee');

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        // await client.close();
        console.error('Error Connecting to MongoDB, error');
        process.exit(1);
    }
}

app.post('/coffee', async (req, res) => {
    const newCoffee = req.body;
    console.log(newCoffee);

    try {
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);
    } catch (error) {
        console.error('Error Inserting Coffee, error');
        res.json({ error: 'Failed to Add Coffee' });
    }
})

app.get('/', (req, res) => {
    res.send('Coffee making server is running.');
})


run().then(() => {
    app.listen(port, () => {
        console.log(`Coffee making server is running on port: ${port}`);
    });
});


