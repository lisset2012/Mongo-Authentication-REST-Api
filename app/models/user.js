//load the things we need
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//define the schema for our model
const userSchema = mongoose.Schema({
    email: {type:String,lowercase:true,trim:true},
    password:String,
    name:{type:String,trim:true},
    emailConfirmed: {type:Boolean,default:false},
    emailConfirmationToken:String,
    resetPasswordToken:String,
    resetPasswordExpires:Number
});

//Generating a hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,this.password);
};

//checking if password is valid
userSchema.methods.isValidPassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

//checking email confirmation

userSchema.methods.isEmailConfirmed = function(){
    return this.emailConfirmed;
}

//create the model and expose it our app
module.exports = mongoose.model('User',userSchema);
