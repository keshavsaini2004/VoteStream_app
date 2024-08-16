const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const { jwtAuthMiddleware,generateToken} = require('./../jwt');

router.post('/signup', async (req, res) => {
  
    try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
  
    console.log("Data saved successfully");

    const payload ={
      id: response.id,
    }
    console.log(JSON.stringify(payload));
    const token =  generateToken(payload);
    console.log("Token is : ", token)
    res.status(200).json({
      status: 200,
      message: "Data saved successfully",
      data: response,
      token :token
    });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message 
    });
  }
   //login route
   router.post('/login',async(req,res)=>{
    try{
     //Extract  aadharCardNumber and password from request body
     const { aadharCardNumber, password}=req.body;
     //find the user by username 
     const user  = await Person.findOne({aadharCardNumber:aadharCardNumber});
      
      //If user does not exist  or password does not match return error
      if(!user ||(await user.comparePassword(password))){
        return res.status(400).json({error:'Invalid username or password'});
      }
      //generate token 
      const payload = {
        id:user.id, 
      }
     
    }catch(err){
      console.log(err);
      res.status(500).json({error:'Internal Server Error'});
    }
  })
  //profile route
  router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{ 
      const userData = req.user;
      console.log("User data:" ,userData);

      const userId = userData.id;
      const user = await Person.findById(userId);

      res.status(200).json({user});


    }catch(err){
         console.log(err);
         res.status(500).json({error:'Internal Server Error'});
    }
  })
  
  });

  
  router.put('/profile/password',async(req,res)=>{
    try{
      const personId = req.params.id; // Extract the id from the URL parameter
      const {currentPassword,newPassword} =req.body//extract the new ande current password the req.body
      
      //fimd the user by UserId
      const response = await User.findById(userId);
      //if password does not match,  return error
      if(!(await user.comparePassword(password))){
        return res.status(400).json({error:'Invalid username or password'});
      }
      //Update the user's password
      user.passowrd = newPassword;
      await user.save();

      console.log('password updated');
        res.status(200).json(response); 

    }catch(err){
      console.log(err);
      res.status(500).json({error:'Internal Server Error'});
   
    }
  })


module.exports = router;
