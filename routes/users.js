const express=require('express');
const route=express.Router();
const bcrypt=require('bcryptjs');

//User Model
const User=require('../models/User');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
route.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
route.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
 //Login Page
route.get('/login',(req,res)=>{
    res.render('login')

})
//Register Page

route.get('/register',(req,res)=>{
    res.render('register')

})
// Register handle
route.post('/register',(req,res)=>{
   const {name,email,password,password2}=req.body
   let errors=[];
   //check required Field
   if(!name || !email || !password || !password2){
       errors.push({msg:'please fill in all fields'})
   }
   //check password Match
   if(password !== password2){
       errors.push({msg:'password do not match'})
   }
   // check password lenght
  if (password.length<6){
      errors.push({msg:'password should be at least 6 characters'})
  }
  if(errors.length>0){
    res.render('register',{
       errors,
       name,
        email,
        password,
        password2    
    })
  }else{
    //validation passed
    User.findOne({email:email})
    .then(user=>{
        if(user){
            errors.push({msg:'Email already exists'})
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            })
        }else {
            const newUser=new User({
              name,
              email,
              password  
              })
                //hash password
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        //set password to hash
                        newUser.password=hash;
                        newUser.save()
                        .then(user=>{
                            req.flash('success_msg','you are now registered and can log in')
                            res.redirect('/users/login')
                        })
                        .catch(err=>console.log(err))
                    })
                }

                 ) }

    })
    }
}) 
//login handle
route.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
})
 //logout handle
    route.get('/logout',(req,res)=>{
        req.logout();
        req.flash('success_msg','you are logged out')
        res.redirect('/users/login')
    })
module.exports=route;