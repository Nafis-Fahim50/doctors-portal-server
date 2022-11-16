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
            const date = req.query.date;
            const query = {};
            const cursor = appointmentOptionCollection.find(query);
            const options = await cursor.toArray();

            const bookingQuery = {appointmentDate: date}
            const alreadyBooked = await bookingCollection.find(bookingQuery).toArray()

            options.forEach(option =>{
                const optionBooked = alreadyBooked.filter(book => book.treatmentName === option.name);
                // console.log(optionBooked);
                const bookedSlots = optionBooked.map(book => book.slot);
                const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot))
                option.slots = remainingSlots
                // console.log(date, option.name, bookedSlots);
            })
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


