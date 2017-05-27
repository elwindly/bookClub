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
    owner:{type: Schema.ObjectId, ref: 'User', required: true},
    isAskedForTrade:{ type:Boolean, default:false },
    asker: {type: Schema.ObjectId, ref: 'User', required: true},
    isAcceptedByOwner:{ type:Boolean, default:false }
});

var Book = mongoose.model('Book', BookSchema);

module.exports = {Book};