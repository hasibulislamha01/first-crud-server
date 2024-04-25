const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json())

// hasibulislamha01
//

// Escape the password
const escapedPassword = encodeURIComponent("*hasIbul0203#");


const uri = `mongodb+srv://hasibulislamha01:${escapedPassword}@cluster0.75ieoxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection


        // Connect to the "insertDB" database and access its "users" collection
        const database = client.db("usersDB");
        const usersCollection = database.collection("users");

        // Query for movies that have a runtime less than 15 minutes
        const query = {};
        const options = {
            // Sort returned documents in ascending order by title (A->Z)
            // sort: { title: 1 },
            // Include only the `title` and `imdb` fields in each returned document
            // projection: { _id: 0, title: 1, imdb: 1 },
        };

        app.get('/users', async (req, res) => {

            // Execute query 
            const cursor = usersCollection.find(query, options);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user', user)
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        app.delete('/users/:userId', async (req, res) => {

            const id = req.params.userId;
            console.log('deleting id', id)
            /* Delete the user using the id */
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('simple crud is running')
})



app.listen(port, () => {
    console.log(`simple crud is running on port ${port}`)
})