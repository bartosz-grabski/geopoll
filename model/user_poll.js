// The UserPoll model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userPollSchema = new Schema({
    poll_id: ObjectId,
    user_id: ObjectId,
    user_name: String,
    user_mail: String,
    chosen_groups: {type: Array, "default": []},
    time_slots: {
    	type : Array,
        "default" : []
    }
    // {timeStart,timeEnd,type}
});


module.exports = mongoose.model('UserPoll', userPollSchema);