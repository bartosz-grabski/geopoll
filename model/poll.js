// The Poll model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    randtoken = require('rand-token');

var pollSchema = new Schema({
    poll_id: ObjectId,
    name: String,
    description: {type: String, "default": ""},
    start_time: Date,
    end_time: Date,
    declaration_end_time: Date,
    is_declaration_closed: {type: Boolean, "default": false},
    is_closed: {type:Boolean, "default":false},
    creator_id: {type: String, "default": null},
    creator_name: {type: String, "default": "guest"},
    creator_mail: String,
    creation_token: String,
    required_groups: {type: Array, "default": []},
    selected_terms: {type: Array, "default": []}    //object { termId, startDate, endDate, count }
});

pollSchema.virtual('id')
    .get(function () {
        return this._id.toHexString();
    });

pollSchema.virtual('idWithToken').get(function () {
    return this._id.toHexString() + this.creation_token;
});

pollSchema.statics.isIDWithOrWithoutTokenFormatCorrect =  function(idWithOrWithoutToken){
    var match = getMatch(idWithOrWithoutToken, /^([a-zA-Z0-9]{24})([a-zA-Z0-9]{10}){0,1}$/g);
    return (match!==null);
};

pollSchema.statics.isIDWithTokenFormatCorrect = function(idWithToken){
    var match = getMatch(idWithToken, /^([a-zA-Z0-9]{24})([a-zA-Z0-9]{10}){1}$/g);
    return (match!==null);
};

pollSchema.statics.extractID = function(idWithToken){
    var match = getMatch(idWithToken, /^([a-zA-Z0-9]{24})([a-zA-Z0-9]{10}){0,1}$/g);
    return match[1];
};

pollSchema.statics.extractToken = function(idWithToken){
    var match = getMatch(idWithToken, /^([a-zA-Z0-9]{24})([a-zA-Z0-9]{10}){0,1}$/g);
    return match[2];
};

pollSchema.statics.generateCreationToken = function () {
    return randtoken.generate(10);
};

function getMatch(str, reg){
    return reg.exec(str);
}


module.exports = mongoose.model('Poll', pollSchema);