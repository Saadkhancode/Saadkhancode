const express=require('express');
const route=express.Router();
const {ensureAuthenticated}=require('../config/auth');
 //home
route.get('/',(req,res)=>{
    res.render('welcome')

})
 //dashboard
route.get('/dashboard', ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{user:req.user})

})
module.exports=route;