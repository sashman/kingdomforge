function Pinger(socket) {
    this.socket = socket;
    this.socket.on('pong', this.handlePong.bind(this));
}

var p = Pinger.prototype;

p.startPing = function() {
    setInterval(this.ping.bind(this), 1000);
};

p.ping = function() {
    this.socket.emit('ping', (new Date).getTime());
};

p.handlePong = function(data) {
    var server_time = data['server_time'];
    var ping_time = data['ping_time'];
    var pong_time = (new Date).getTime() - server_time;
    var total_time = ping_time + pong_time;

    console.log('ping', total_time, 'ms');
};


exports = Pinger;