const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const { jwtAuthMiddleware,generateToken} = require('../jwt');
const  Candidate =require('../models/candidate')

const checkAdminRole =async(userID)=>{
    try{
      const user  = await User.findById(userID);
      if(user.role === 'admin'){
        return true;
      };
    }catch(err){
      return false;
    }
}
//POST route    to add a  candidate
router.post('/', jwtAuthMiddleware,async (req, res) => {
  
    try {
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message:'user does not have  admin role'});
 
        const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
  
    console.log("Data saved successfully");
    res.status(200).json({
      status: 200,
      message: "Data saved successfully",
      data: response,
    });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message 
    });
  }
})
  router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message:'user does not have  admin role'});

        const candidateID = req.params.candidateID; // Extract the id from the URL parameter
        const updatedCandidateData= req.body;
    
        const response = await Person.findByIdAndUpdate(candidateID, updatedCandidateData,{
            new: true, // Return the updated document
            runValidators: true, //Run mongoose validation
          }
        );
        if (!response) {
          return res.status(404).json({ error: "candidate not found" });
        }
        console.log(" candidate data updated");
        res.status(200).json(response);
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
  })
  router.delete("/:candidateID",jwtAuthMiddleware, async (req, res) => {
    try {
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message:'user does not have  admin role'});

      const candidateID = req.params.candidateID; //Extact the person's Id from the URL parameters
      //Assuming  you have a person model
      const response = await Person.findByIdAndDelete(candidateID);
      if (!response) {
        return res.status(404).json({ error: "candidate not found" });
      }
      console.log(" candidate data deleted");
      res.status(200).json({ message: "candidate data deleted successfullly" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  // let's starts voting
  router.post('/vote/:candidateID',jwtAuthMiddleware,async(req,res) =>{
    //no dmin can vote
    //only user can vote once only
    
     candidateID = req.params.candidateID;
     userId = req.user.id;

     try{
    //find the candidate document   with the specified candidateI
    const candidate  =  await Candidate.findById(candidateID);
    if(!candidate){
        res.status(404).json({error:'Internal Server Error'});
    }
     const user = await  User.findById(candidateID);
   if(!user){
    res.status(404).json({error:'user not found'});
   }
   if(user.isVoted){
    res.status(404).json({error:'You have already voted'});
   }
   if(user.role == 'admin'){
    res.status(404).json({error:'admin is not allowed'});
   }
   //update the candidate document to record the vote
   candidate.votes.push({user:userId})
   candidate.voteCount++;
   await candidate.save();

   //update  the user document
   user.isVoted = true
   await user.save();

   
   res.status(200).json({message:'vote recorded'});

     }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
     }
  })

  // vote count
  router.get('/vote/count' , async  (req,res) =>  {
    try{
     //find all candidate  and count them by voteCount in descending order
     const candidate = await Candidate.find().sort({voteCount:'desc'});


     //map  the candidates to only  return their name and vote count
     const voteRecord = candidate.map((data)=>{
        return{
            party: data.party,
            count: data.voteCount,
        }
     })
       return res.status(200).json(voteRecord)
    }catch(err){
        console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }

  })

  //comment added for testing version
  
  module.exports = router;