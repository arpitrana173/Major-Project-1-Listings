const mongoose = require("mongoose")
const initdata = require("./data.js")
const listing = require("../models/listing.js")
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Project1')
}
main().then((res)=>{
    console.log("Connection Established")
}).catch((err)=>{
    console.log(err)
})

const initDB=async()=>{
    await listing.deleteMany({})
    initdata.data=initdata.data.map((obj)=>({
        ...obj,
        owner : "68dcd744fad08d13c8d0e4e9"
    }))
    await listing.insertMany(initdata.data)
    console.log("DB init done")
}

initDB();