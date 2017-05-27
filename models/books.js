const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commonRules = {
    type:String,
    required:true,
    trim:true,
    minlength:1
};

var BookSchema = new mongoose.Schema({
    title:commonRules,
    link:commonRules,
    owner:{type: Schema.Types.ObjectId, ref: 'User', required: true},
    isAskedForTrade:{ type:Boolean, default:false },
    asker: {type: Schema.Types.ObjectId, ref: 'User'},
    isAcceptedByOwner:{ type:Boolean, default:false }
});

var Book = mongoose.model('Book', BookSchema);

module.exports = {Book};