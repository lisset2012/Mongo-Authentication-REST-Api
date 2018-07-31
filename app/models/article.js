//load the things we need
const mongoose = require('mongoose');

//define the schema for our model
const artSchema = mongoose.Schema({
    art: {type:String,trim:true},
    author:{type:String,trim:true},
    date: { type: Date, default: Date.now },
    art_title: {type:String,trim:true},
    url_pic:String
});

//create the model and expose it our app
module.exports = mongoose.model('Art',artSchema);
