const User = require('../models/user.js');

module.exports.post=async(req,res) =>{
    try{
         let {username,email,password}=req.body;
    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Successfully Signed Up');
    res.redirect('/listings');
    })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
   
}

module.exports.login=async(req,res) =>{
   req.flash('success','Successfully Logged In');
   res.redirect(res.locals.redirectUrl || '/listings');
}

module.exports.logout=(req,res) =>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Successfully Logged Out');
        res.redirect('/listings');
    });
}