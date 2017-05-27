var {User} = require('./../models/members');

var authenticate = (req,res,next)=>{
    //var token = req.header('x-auth');
    var token = req.session.xAuth;
    console.log(token);
    User.findByToken(token).then((user) => {
        console.log(user);
        if (!user) {
         return Promise.reject();
        }
        req.user = user;
        next();
    }).catch((e)=>{
        console.log(e);
        res.status(401).send();
    });
};

module.exports = {authenticate};