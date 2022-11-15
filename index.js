const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6llxg7j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(uri);

async function run() {
    try {
        const appointmentOptionCollection = client.db('doctorPortal').collection('appointmentOptions');
        const bookingCollection = client.db('doctorPortal').collection('bookings');
        
        app.get('/appointoptions', async (req, res) => {
            const query = {};
            const cursor = appointmentOptionCollection.find(query);
            const options = await cursor.toArray();
            res.send(options);
        })

        app.post('/bookings', async(req,res)=>{
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(error => console.error(error))
app.get('/', (req, res) => {
    res.send('Doctor portal server is running')
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})


