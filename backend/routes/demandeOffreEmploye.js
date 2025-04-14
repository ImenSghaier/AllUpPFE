const express =require('express');
const router =express.Router();
const DOE= require('../models/demandeOffreEmploye'); 

router.post('/add', (req , res)=>{
        data =req.body;
        doe= new DOE(data);
        doe.save()
            .then(
                (savedDOE)=>{ 
                    res.status(200).send(savedDOE) 
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
        doe = await DOE.find();
        res.status(200).send(doe);
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/byid/:id' , async (req,res)=>{
    try {
        id=req.params.id;
        doe= await DOE.findOne({_id :id})
        res.send(doe)
    } catch (error) {
        res.send(error)
    }
})

router.delete('/delete/:id', async(req, res)=>{
    try {
        id=req.params.id
        Delete = await DOE.findByIdAndDelete({_id:id});
        res.status(200).send(Delete);
    } catch (error) {
        res.status(400).send(error)
    }
})


router.put('/update/:id' , async(req,res)=>{
    try {
        id=req.params.id;
        newData=req.body;
        updated= await DOE.findByIdAndUpdate({_id:id} , newData);
        res.status(200).send(updated)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports=router;