const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index=async(req,res) =>{
   const allListings = await Listing.find({});
   res.render('listings/index.ejs',{allListings});
};

module.exports.new= (req,res) =>{
   res.render('listings/new.ejs');
};

module.exports.show=async(req,res,next) =>{
   let {id}=req.params;
   try {
      // Check if any listings exist
      const count = await Listing.countDocuments();           
      const listing=await Listing.findById(id)
      .populate({
         path:'reviews',
         populate: {
            path:'author'
         }
      })
      .populate('owner');
      
      if(!listing){
         req.flash('error','Cannot find that listing');
         return res.redirect('/listings');
      }
      let originalImageUrl=listing.image.url;
      originalImageUrl=originalImageUrl.replace ('/upload','/upload/w_200,h_300');
      res.render('listings/show.ejs',{listing,originalImageUrl});
   } catch(err) {
      next(err);
   }
};

module.exports.post=async(req,res,next)=>{
   try {
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);
      
      // Skip geocoding temporarily due to invalid token
      // const geocodingResponse = await geocodingClient
      // .forwardGeocode({
      //    query: req.body.listing.location + ", " + req.body.listing.country,
      //    limit:1,
      // })
      // .send();

      let newListing =  new Listing(req.body.listing)
      if(req.file){
         let url=req.file.path;
         let filename=req.file.filename;
         newListing.image={url,filename}; 
      }
      
      // Skip coordinates temporarily
      // if (geocodingResponse.body && geocodingResponse.body.features && geocodingResponse.body.features.length > 0) {
      //    const coordinates = geocodingResponse.body.features[0].geometry.coordinates;
      //    newListing.geometry = {
      //       type: 'Point',
      //       coordinates: coordinates
      //    };
      // }
      
      newListing.owner=req.user._id;
      await newListing.save();
      req.flash('success','Successfully made a new listing');
      res.redirect('/listings');
   } catch(err) {
      console.error('Error creating listing:', err);
      req.flash('error', err.message);
      res.redirect('/listings/new');
   }
};

module.exports.edit=async(req,res) =>{
   let {id}=req.params;
   const listing=await Listing.findById(id);
   let originalImageUrl=listing.image.url;
   originalImageUrl=originalImageUrl.replace ('/upload','/upload/w_200,h_300');
   res.render('listings/edit.ejs',{listing,originalImageUrl});
}

module.exports.update=async (req,res) =>{
   let {id}=req.params;
   const listing = await Listing.findByIdAndUpdate(id, req.body.listing);
   if(req.file){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename}; 
      await listing.save();
   }
   req.flash('success','Successfully updated a listing');
   res.redirect(`/listings/${id}`);
}

module.exports.delete=async (req,res) =>{
   let {id}=req.params;
   await Listing.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a listing');
   res.redirect('/listings');
}

module.exports.search=async(req,res) =>{
   const { country } = req.query;
   let searchQuery = country ? country.trim() : '';
   
   if (!searchQuery) {
      const allListings = await Listing.find({});
      return res.render('listings/index.ejs',{allListings});
   }
   
   const searchResults = await Listing.find({
      country: { $regex: searchQuery, $options: 'i' }
   });
   
   res.render('listings/index.ejs',{
      allListings: searchResults,
      searchQuery
   });
};