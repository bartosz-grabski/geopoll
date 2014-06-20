
var today = new Date();

db.polls.insert(
	{ "_id" : ObjectId("537be34a80dd1ffa0e8ed8d6"), "creation_token" : "5DFSL64sgP", "name" : "asd", "creator_mail" : "b.grabski92@gmail.com", "start_time" : ISODate("2014-05-21T23:20:00Z"), "end_time" : ISODate("2014-05-22T23:20:00Z"), "declaration_end_time" : ISODate("2014-05-28T23:20:00Z"), "required_groups" : [ "IT", "HR", "Marketing" ], "creator_name" : "asd", "creator_id" : null, "is_declaration_closed" : false, "description" : "dasd", "__v" : 0 }
)


var userPolls = [
	{
		poll_id : ObjectId("537be34a80dd1ffa0e8ed8d6"),
		user_name : "Bill Gates",
		chosen_groups : [ "IT", "Marketing"],
		time_slots : [
		{ 
			timeStart: today.setDate(15),
			timeEnd: today.setDate(16),
			type: "yes" 
		},
		{ 
			timeStart: today.setDate(13),
			timeEnd: today.setDate(14),
			type: "maybe" 
		}
		]
	},
	{
		poll_id : ObjectId("537be34a80dd1ffa0e8ed8d6"),
		user_name : "Steve Jobs",
		chosen_groups : [ "IT", "HR"],
		time_slots : [
		{ 
			timeStart: today.setDate(14),
			timeEnd: today.setDate(16),
			type: "no" 
		},
		{ 
			timeStart: today.setDate(18),
			timeEnd: today.setDate(19),
			type: "maybe"
		}
		]
	}
]


db.userpolls.insert(userPolls);
