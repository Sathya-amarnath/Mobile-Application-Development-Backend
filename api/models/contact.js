const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String, required: true},
    designation :{type:String, required:true},
    email:{type:String, required:true },
    phone:{type:Number,required:true},
    image: {type: String}
});

module.exports = mongoose.model('Contact', contactSchema);