const express = require('express');
const router = express.Router();
const Entreprise = require('../models/entreprise');

// Ajouter une entreprise
router.post('/add', async (req, res) => {
    try {
        const newEntreprise = new Entreprise(req.body);
        const savedEntreprise = await newEntreprise.save();
        res.status(201).json(savedEntreprise);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Récupérer les entreprises avec recherche, pagination et tri
router.get('/all', async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "", sort = "nom" } = req.query;
        
        page = parseInt(page);
        limit = parseInt(limit);

        const query = {
            $or: [
                { nom: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { adresse: { $regex: search, $options: "i" } }
            ]
        };

        const entreprises = await Entreprise.find(query)
            .sort({ [sort]: 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Entreprise.countDocuments(query);

        // S'assurer que les données sont envoyées sous forme de tableau
        res.json({
            entreprises: entreprises || [],  // Assurez-vous que c'est un tableau
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprimer une entreprise
router.delete('/delete/:id', async (req, res) => {
    try {
        await Entreprise.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Entreprise supprimée avec succès" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mettre à jour une entreprise
router.put('/update/:id', async (req, res) => {
    try {
        const updatedEntreprise = await Entreprise.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedEntreprise);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Nouvelle route pour récupérer uniquement les noms et IDs des entreprises
router.get('/names', async (req, res) => {
    try {
        // On récupère uniquement les champs "_id" et "nom" des entreprises
        const entreprises = await Entreprise.find({}, '_id nom');

        // Retourner les entreprises avec leurs _id et nom
        res.json(entreprises);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;


// const express =require('express');
// const router =express.Router();
// const Entreprise= require('../models/entreprise'); 

// router.post('/add', (req , res)=>{
//         data =req.body;
//         en= new Entreprise(data);
//         en.save()
//             .then(
//                 (savedEn)=>{ 
//                     res.status(200).send(savedEn) 
//                 }
//             )
//             .catch(
//                 (err)=>{
//                     res.status(400).send(err)
//                 }
//             )
// });
// router.get('/all',async (req,res)=>{
//     try {
//         entreprise = await Entreprise.find();
//         res.status(200).send(entreprise);
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })

// router.get('/byid/:id' , async (req,res)=>{
//     try {
//         id=req.params.id;
//         entreprise= await Entreprise.findOne({_id :id})
//         res.send(entreprise)
//     } catch (error) {
//         res.send(error)
//     }
// })

// router.delete('/delete/:id', async(req, res)=>{
//     try {
//         id=req.params.id
//         Delete = await Entreprise.findByIdAndDelete({_id:id});
//         res.status(200).send(Delete);
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })


// router.put('/update/:id' , async(req,res)=>{
//     try {
//         id=req.params.id;
//         newData=req.body;
//         updated= await Entreprise.findByIdAndUpdate({_id:id} , newData);
//         res.status(200).send(updated)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })

// module.exports=router;