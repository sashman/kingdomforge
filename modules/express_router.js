var path = require('path');

var ExpressRouter = function() {
	// express.get('/', this.handleGetRoot.bind(this));
	// express.get('/*', this.handleGetFile.bind(this));
};

var p = ExpressRouter.prototype;

p.handleGetRoot = function(req, res) {
	res.sendfile(path.resolve(__dirname + '/../', 'index.html'));
};

p.handleGetFile = function(req, res, next) {
	var file = req.params[0];
	res.sendfile(path.resolve(__dirname + '/../', file));
};


module.exports = ExpressRouter;