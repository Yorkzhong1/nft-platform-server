const Generator = require('./generator')
require('dotenv').config()
let bodyParser=require('body-parser')
const {useEffect, useState}=require("react")

let express = require('express');
let app = express();
let contracts=[]

let mongoose=require('mongoose')
const Schema = mongoose.Schema;


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

var nftSchema = new mongoose.Schema({
    name: {type:String,required:true},
    pic: {type:String,required:true},
    chain: {type:Number,required:true},
    contractAdd: {type:String,required:true},
    ownerAdd: {type:String,required:true},
    active:{type:Boolean,required:true}
   });

var NFT = mongoose.model("NFT", nftSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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












// const [fileNames, setFileNames] = useState();

// app.use("/public",express.static(__dirname +"/public"))
app.use(bodyParser.json())
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
})

// app.post('/fileNames',(req,res)=>{
//     const {fileNames}= req.body;
//     console.log('fileNames first',fileNames)
//     res.send('fileNames recevied')

// })

app.post('/meta',(req,res)=>{
    // const [metaDataCDI,setMetaDataCDI] =useState("")
    const {name,description,number,CID,fileNames}= req.body;
    let files = JSON.parse(fileNames)
    console.log('Start generating metadata...')
    console.log(files)
//execute generator which generate metaData and upload to IPFS, then return the CDI of metadata
    let metaDataCDI
    Generator.generator(name,description,number,CID,files,(CDI)=>{
        console.log('CDI is',CDI)
        res.send(CDI) 
    })
})


app.post('/contracts',(req,res)=>{
    // const [metaDataCDI,setMetaDataCDI] =useState("")
    const {name,pic,chain,contractAdd,myAddress}= req.body;
    // console.log(name,contractAdd,myAddress)
    contracts.push({name,pic,chain,contractAdd,myAddress})
})

app.post('/delete',(req,res)=>{
    contracts=[]
    res.send('服务器端数据已经清零')
})

app.get('/contracts',(req,res)=>{
    res.json(JSON.stringify(contracts))
})

app.get('/test',(req,res)=>{
    res.send("Hello")
})


 module.exports = app;
