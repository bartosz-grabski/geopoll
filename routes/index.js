
/*
 * GET home page.
 */

var index = function(req, res){
	res.render('index');
};

var poll = function(req,res) {
	res.render('poll');
};

module.exports = { 
	index: index,
	poll: poll
}