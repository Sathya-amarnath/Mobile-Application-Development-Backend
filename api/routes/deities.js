const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');
const Deity = require('../models/deity');

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
    Deity.find()
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
    const deity = new Deity({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        image: req.file.path,
        url: req.body.url
    });
    deity.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /deities',
            createddeity: deity
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
   
});

router.get('/:deityId', (req, res, next) => {
    const id = req.params.deityId;
    Deity.findById(id)
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

router.patch('/:deityId', (req, res, next) => {
   const id= req.params.deityId;
   const updateOps1={};
   for (const ops of req.body){
       updateOps1[ops.propName]=ops.value;
   }
   Deity.update({_id:id},{$set:updateOps1})
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

router.delete('/:deityId', (req, res, next) => {
    const id= req.params.deityId;
   Deity.remove({_id:id})
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