const {mongoose} = require('./../db/mongoose');
const {ObjectID} = require('mongodb');
const {Book} = require('./books');
const fetch = require('fetch').fetchUrl;
const user = new ObjectID();
const user2 ="58e3951e31fbf8119492ab92"
const books = require('google-books-search');

var options = {
    field: 'title',
    offset: 0,
    limit: 10,
    type: 'books',
    order: 'relevance',
    lang: 'en'
};
// books.search("Egri csillagok", options, function(error, results, apiResponse) {
//     if ( ! error ) {
//         for(let i = 0;i < results.length; i++) {
//           console.log(results[i].title);
//           //console.log(results[i].thumbnail);
//         }
//     } else {
//         console.log(error);
//     }
// });
  // Book.find({"$or" : [{owner: "tester"}, {askerName : "tester"}]}).then((books)=>{  
  //   let bookList = books.map((book)=>{
  //     //return _.pick(book,['title','link','_id','isAskedForTrade']);
  //     return book.title;
  //   });
  //   console.log(bookList);
  //   },(err)=>{
  //       console.log(err);
  //   });
    // let bookList = [1,2,3,];
    // let edfse = bookList.length;
    // console.log(edfse);
 let terms = ["Protected men robert merle", "Édes Anna", "Anne of green gables", "1984", "Egri Csillagok"]

for (let i = 0; i < terms.length;i++) {
    let term = terms[i];

fetch(`https://stark-hamlet-16318.herokuapp.com/imagesearch/${term} book cover?offset=5`, (err, meta,body)=>{
    let rand = Math.floor(Math.random() * 5);
    let results = JSON.parse(body);
    console.log(results);
    // //console.log(results[rand].thumbnailUrl);
    // let book = new Book({
    //     title: term,
    //     link: results[rand].thumbnailUrl,
    //     owner:user2,
    // })
    // book.save().then((book)=>{
    //   console.log(book);
    // });
});

}
// fetch(`https://stark-hamlet-16318.herokuapp.com/imagesearch/${term}?offset=10`, (err, meta,body)=>{
//     let rand = Math.floor(Math.random() * 10);
//     let results = JSON.parse(body);
//     console.log(results[rand].thumbnailUrl);
// });

// firstPoll.save().then((doc)=>{
//     console.log(doc);
// },(err)=>{
//     console.log(err);
// });

//var id = "5865407c8d578438c0bd2099";
//var opId = "5865407c8d578438c0bd209b";

// Pool.findById(id).then((pool)=>{
//     if(!pool){
//         return console.log('pool Id was not found');
//     }
//     console.log(pool);
// }).catch((e)=>console.log(e))



// Poll.update( {
//       _id: id,
//       "options._id": opId
//     }, {
//       $inc: {"options.$.voteCount": 1,"numVotes":1},
//     }, function(err, raw) {
//       if (err) return console.log(err);
//       console.log("ok");
//     });

// Poll.findOneAndUpdate( {
//       _id: id
//     }, {
//       $push: {options:{option:"New option jeah"}},
//     }, function(err, raw) {
//       if (err) console.log(err);
//       console.log(raw);
//     });
// Poll.findOneAndUpdate( {
//       _id: id
//     }, {
//       $pull: {options:{option:"New option jeah"}},
//     }, function(err, raw) {
//       if (err) console.log(err);
//       console.log(raw);
//     });
// Poll.count({},(err,count)=>{
//   console.log(count);
// });
// Poll.findOneAndUpdate({_id:id},{$inc:{options[0].voteCount:1}},{new:true}).then((pool)=>{
//         if(!pool){
//             return console.log('Something went wrong');
//         }

//         console.log(pool);
//     }).catch((e)=>console.log(e))



// Poll.findOne({_id:id}, function (err, doc){

//   doc.options[0].voteCount.$inc();

//   doc.save();
// });

// Poll.findOne({_id:id}).then((doc) => {
//     doc.options[0].voteCount++;
//     doc.options.push({
//         option:"new option22333"
//     });
//     //doc.options.shift();
//     doc.save();
// });
// let id = "587695aa9098a82f8000957f";
// let creator = "tester";

// Poll.findOneAndRemove({
//         _id:id,
//         _creator:creator
//     }).then((poll)=>{
//         console.log(poll);

//     }).catch((e)=> console.log(e));




