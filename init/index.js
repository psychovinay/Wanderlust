const mongoose= require('mongoose');
const initData= require('./data.js');
const Listing= require('../models/listing');

async function main() {       
    await mongoose.connect('mongodb://localhost:27017/wanderlust');                           
}
main().catch(err => console.error(err));  

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data.map((obj)=>({...obj ,owner:"6916dd001ec83e4d6ea26cc0"}));
    const normalized = initData.data.map((d)=> ({
        ...d,
        owner: "6916dd001ec83e4d6ea26cc0",
        image: d.image && d.image.url ? d.image : (typeof d.image === 'string' ? d.image : {url: d.image, filename: "listingimage"}),
    }));
    await Listing.insertMany(normalized);
}

initDB();
