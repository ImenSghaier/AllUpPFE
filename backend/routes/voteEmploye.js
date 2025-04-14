const express =require('express');
const router =express.Router();
const VoteEmploye= require('../models/voteEmploye'); 

router.post('/add', (req , res)=>{
        data =req.body;
        ve= new VoteEmploye(data);
        ve.save()
            .then(
                (savedVE)=>{ 
                    res.status(200).send(savedVE) 
                }
            )
            .catch(
                (err)=>{
                    res.status(400).send(err)
                }
            )
});
router.get('/all',async (req,res)=>{
    try {
        ve = await VoteEmploye.find();
        res.status(200).send(ve);
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/byid/:id' , async (req,res)=>{
    try {
        id=req.params.id;
        voteE= await VoteEmploye.findOne({_id :id})
        res.send(voteE)
    } catch (error) {
        res.send(error)
    }
})

router.delete('/delete/:id', async(req, res)=>{
    try {
        id=req.params.id
        Delete = await VoteEmploye.findByIdAndDelete({_id:id});
        res.status(200).send(Delete);
    } catch (error) {
        res.status(400).send(error)
    }
})


router.put('/update/:id' , async(req,res)=>{
    try {
        id=req.params.id;
        newData=req.body;
        updated= await VoteEmploye.findByIdAndUpdate({_id:id} , newData);
        res.status(200).send(updated)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports=router;