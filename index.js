const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://<username>:<password>@cluster0.6llxg7j.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/',(req,res)=>{
    res.send('doctors portal server is running')
})

app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
})