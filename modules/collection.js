var Collection = function() {
	this.collection = [];
};

var p = Collection.prototype;

p.add = function(item) {
	this.collection[item.id] = item;
};

p.remove = function(itemid) {
	this.collection = this.collection.splice(itemid, 1);
};

p.getItem = function(itemid) {
	return this.collection[itemid];
};

p.all = function() {
	return this.collection;
};

p.count = function() {
	return this.collection.length;
};

module.exports = Collection;