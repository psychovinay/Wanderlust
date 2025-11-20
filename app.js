if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const wrapAsync=require('./utils/wrapAsync');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path=require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MOngoStore=require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');


const listingsRouter= require('./routes/listings.js')
const reviewsRouter= require('./routes/review.js')
const userRouter= require('./routes/user.js')
const listingController= require('./controlers/listings.js');
const dbUrl = process.env.ATLASBD_URL


async function main() {
    await mongoose.connect(dbUrl);
}
main().catch(err => console.error(err));  

app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

//to store sessiondata

// const store=MOngoStore.create({
//     mongoUrl:dbUrl,
//     touchAfter: 24 * 60 * 60,
//     crypto: {
//         secret: process.env.SECERET
//     }
// });

// store.on('error',  ()=> {
//     console.log('Session Store Error', err)
// });

const sessionOption={
    // store,
    secret :process.env.SECERET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    },

};


app.get('/', (_req,res) =>{
    res.redirect('/listings');
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    next();
})

// app.get('/demouser' ,async (req,res)=>{
//  let fakeUser = new User({
//     email:'student@gmail.com',
//     username:'delta-student'
//  });
//   let registeredUser=await User.register(fakeUser,'chicken');
//  res.send(registeredUser);
// });

//Listings router
app.use('/listings',listingsRouter);
//Reviews router
app.use('/listings/:id/reviews',reviewsRouter)
//User router
app.use('/',userRouter)

//search route
app.get('/search', wrapAsync(listingController.search));

app.use((err,_req,res,_next)=>{
   let{statusCode,message}=err;
   res.render("error.ejs", {message,statusCode});
});

app.listen(8080, () =>{
    console.log('Server is running on port 8080');
});