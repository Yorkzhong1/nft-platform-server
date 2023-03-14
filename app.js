const express = require("express");
require('dotenv').config();
const { download } = require('@primer/octicons');
let mongoose=require('mongoose')
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
var bodyParser = require('body-parser');
var app = express();
var port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var nftSchema = new mongoose.Schema({
    name: {type:String,required:true},
    pic: {type:String,required:true},
    chain: {type:Number,required:true},
    contractAdd: {type:String,required:true},
    ownerAdd: {type:String,required:true},
    active:{type:Boolean,required:true}
   });

var NFT = mongoose.model("NFT", nftSchema);

// app.use("/", (req, res,next) => {
//     res.sendFile(__dirname + "/views/index.html");
//     next()
//    });

app.get("/", (req, res) => {
 res.send("server respond correctly");
});

 //end point to create a new NFT contract
app.post("/addNFT", (req, res) => {
    console.log('req body:',req.body)
    var myData = new NFT(req.body);
    myData.save()
    .then(item => {
    res.send("item saved to database");
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
   });

//end point to get the list of active or inactive NFT contract
app.post("/getNFT", async (req, res) => {
    const wetherActive = req.body.active
    console.log('request content:',wetherActive)
    const contracts = await NFT.find({active:wetherActive})
    .sort({name:1})
    console.log(contracts)
    res.json(contracts);
   }
   );



//end point to update a specific NFT contract

app.post("/deActive", async (req, res) => {
    const contractAdd = req.body.contractAdd
    await NFT.updateOne({ contractAdd: contractAdd }, { active: false});
    res.send(`contract ${contractAdd} is deActivated`)
   })

//remove all existing nft contracts
app.post("/remove", async (req, res) => {
    const contractAdd = req.body.contractAdd
    console.log(contractAdd)
    await NFT.remove({contractAdd:contractAdd});
    res.send(`contracts with contract Address ${contractAdd} are removed`)
   })

//
app.listen(port, () => {
 console.log("Server listening on port " + port);
});