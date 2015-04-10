var path = require('path');

var ExpressRouter = function(express) {
	express.get('/', this.handleGetRoot.bind(this));
	express.get('/*', this.handleGetFile.bind(this));
};

var p = ExpressRouter.prototype;

p.handleGetRoot = function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../', 'index.html'));
};

p.handleGetFile = function(req, res, next) {
	var file = req.params[0];
	console.log('\t :: Express :: file requested : ' + file);
	res.sendFile(path.resolve(__dirname + '/../', file));
};


module.exports = ExpressRouter;