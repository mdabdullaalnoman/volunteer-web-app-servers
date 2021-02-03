const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;
require('dotenv').config()
console.log();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdvqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`; 

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('this is working')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const VolunteerCollection = client.db("Volunteer-Web-App").collection("volunteer");
    const FormCollection = client.db("Volunteer-Web-App").collection("fromData");

 // ------------- Volunteer Card Data -------------
 
    // app.post("/volunteerCard", (req, res) => {
    //     const volunteer = req.body;
    //     VolunteerCollection.insertMany(volunteer)
    //         .then(result => {
    //             console.log(result);
    //         })
    // });

    app.get('/volunteerCards' , (req , res) => {
        VolunteerCollection.find({})
        .toArray((err , documents) => {
            res.json(documents);
        })
    });
    
    // ---------------Single volunteer Information------------------------

    app.post("/addBooking",(req, res)=>{
        const newBooking = req.body;
        FormCollection.insertOne(newBooking)
        .then(result =>{
        //   res.send(result.insertedCount);
        })        
    });

    app.get("/singleVolunteer" , (req, res) => {
        // console.log(req.query.email);
        FormCollection.find({email: req.query.email})
        .toArray((err ,documents) => {
            res.json(documents)
        })
    })
// ---------------------All Volunteer Show on Admin ------------------

    app.get ("/allVolunteers" , (req, res) => {
        FormCollection.find({})
        .toArray((err ,documents) => {
            res.json(documents)
        })
    })

//-----------------delete added volunteer ------------------------

app.delete('/delete/:id' , (req,res) =>{
    FormCollection.deleteOne({_id: req.params.id})
    .then( (result )=> {
      res.send(result.deletedCount > 0)
    })
   })
});



app.listen(port);