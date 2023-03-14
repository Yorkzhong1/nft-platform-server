const axios = require ('axios')


const serverUrl = 'http://localhost:3000'

//create an NFT
let newNFT={
    name:"Check",
    pic:"url",
    chain:1337,
    contractAdd:'0xxxx',
    ownerAdd:"0x00",
    active:false
}


const createNFT=async ()=>{
    try{
        // console.log(`${serverUrl}/addNFT`)
        await axios.post(`${serverUrl}/addNFT`,newNFT)
        .then((res)=>{console.log(res.data)})
    }catch (error) {
        console.log(error);
      }
  }

//   createNFT()

//get list of active NFT, change the input to "true" or "false" to get active or inactive lists of NFT
const getNFT=async (active)=>{
    try{
        await axios.post(`${serverUrl}/getNFT`,{active:active})
        .then((res)=>{console.log(res.data)})
    }catch (error) {
        console.log(error);
      }
  }

//   getNFT(false) 


//deActive a specific NFT

const deactiveNFT=async (contractAdd)=>{
    try{
        await axios.post(`${serverUrl}/deActive`,{contractAdd:contractAdd})
        .then((res)=>{console.log(res.data)})
    }catch (error) {
        console.log(error);
      }
  }

//   deactiveNFT('0x000')

//   remove 
const removeNFT=async (contractAdd)=>{
    try{
        await axios.post(`${serverUrl}/remove`,{contractAdd:contractAdd})
        .then((res)=>{console.log(res.data)})
    }catch (error) {
        console.log(error);
      }

    }
  removeNFT("0xxxx")