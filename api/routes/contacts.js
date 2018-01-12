const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');
const Contact = require('../models/contact');

const multer=require('multer');

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
});

const upload=multer({storage:storage});
router.get('/', (req, res, next) => {
    Contact.find()
   .exec()
   .then(docs=>{
       console.log(docs);
       res.status(200).json(docs);
    /*   if(docs.length>=0){
       res.status(200).json(docs);
    }
    else{
        res.status(404).json({
            message:"no entries found"
        });
    }*/
   })
   .catch(err=>{
       console.log(err);
       res.status(500).json({
           error:err
       });
   });
});

router.post('/', upload.single('image'), (req, res, next) => {
    console.log(req.file);
    const contact = new Contact({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        designation: req.body.designation,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.path
        
    });
    contact.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /deities',
            createdcontact: contact
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
   
});

router.get('/:contactId', (req, res, next) => {
    const id = req.params.contactId;
    Contact.findById(id)
    .exec()
    .then(doc=>{
        console.log("from database",doc);
        if(doc){
        res.status(200).json(doc);
    }
    else{
        res.status(404).json({message:"no valid entry found"});
    }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })
});

router.patch('/:contactId', (req, res, next) => {
   const id= req.params.contactId;
   const updateOps1={};
   for (const ops of req.body){
       updateOps1[ops.propName]=ops.value;
   }
   Contact.update({_id:id},{$set:updateOps1})
   .exec()
   .then(result=>{
        console.log(result);
        res.status(200).json(result);
   })
   .catch(err=>{
       console.log(err);
       res.status(500).json({
           error:err
       });
   });
});

router.delete('/:contactId', (req, res, next) => {
    const id= req.params.contactId;
   Contact.remove({_id:id})
   .exec()
   .then(result=>{
       res.status(200).json(result);
   })
   .catch(err=>{
       console.log(err);
       res.status(500).json({
           error:err
       });
   });
});

module.exports = router;