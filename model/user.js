// The User model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    user_id: ObjectId,
    user_name: String,
    first_name: String,
    last_name: String,
    email: String,
    hashed_password: String
});


module.exports = mongoose.model('User', userSchema);