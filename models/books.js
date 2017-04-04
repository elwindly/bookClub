const mongoose = require('mongoose');

const commonRules = {
    type:String,
    required:true,
    trim:true,
    minlength:1
};

var BookSchema = new mongoose.Schema({
    title:commonRules,
    link:commonRules,
    owner:commonRules,
    isAskedForTrade:{ type:Boolean, default:false },
    askerName: { type: String },
    isAcceptedByOwner:{ type:Boolean, default:false }
});

var Book = mongoose.model('Book', BookSchema);

module.exports = {Book};