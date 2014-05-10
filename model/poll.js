// The Poll model

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId
    , randtoken = require('rand-token');

var pollSchema = new Schema({
    poll_id: ObjectId,
    name: String,
    description: {type: String, "default": ""},
    start_time: Date,
    end_time: Date,
    declaration_end_time: Date,
    is_declaration_closed: {type: Boolean, "default": false},
    creator_id: {type: String, "default": null},
    creator_name: {type: String, "default": "guest"},
    creator_mail: String,
    creation_token: String,
    required_groups: {type: Array, "default": []}
});

pollSchema.virtual('id')
    .get(function () {
        return this._id.toHexString();
    });

pollSchema.statics.generateCreationToken = function () {
    return randtoken.generate(10);
}
module.exports = mongoose.model('Poll', pollSchema);