const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');
const Product = require('../models/product');

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
   Product.find()
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

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /products',
            createdProduct: product
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
   
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
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

router.patch('/:productId', (req, res, next) => {
   const id= req.params.productId;
   const updateOps={};
   for (const ops of req.body){
       updateOps[ops.propName]=ops.value;
   }
   Product.update({_id:id},{$set:updateOps})
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

router.delete('/:productId', (req, res, next) => {
    const id= req.params.productId;
   Product.remove({_id:id})
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