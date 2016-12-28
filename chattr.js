var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var redisClient = redis.createClient();

app.use(express.static('public'));

app.get('/',function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client){
	console.log("Client connected. . .");

	client.on('join chat', function(name){
		client.broadcast.emit('add chatter', name);

		redisClient.smembers('chat_members', function(err, member_names){
			member_names.forEach(function(member_name){
				client.emit('add chatter', member_name);
			});
		});

		client.nickname = name;
		redisClient.sadd('chat_members', name);
		client.emit('add chatter', name);
		console.log(client.nickname + " has joined the chat!");
	});

	client.on('disconnect', function(_name){
		client.broadcast.emit('remove chatter', client.nickname);
		redisClient.srem('chat_members', client.nickname);
		console.log(client.nickname + " has left the chat. . .");
	});

	client.on('add message', function(text){
		storeMessage(client.nickname, text);
		client.broadcast.emit('add message');
	});
});

var storeMessage = function(name, text){
	message = JSON.stringify({name: name, text: text});
	redisClient.lpush('messages', message, function(err, response){
		//redisClient.ltrim('messages',0,9); // keep only the 10 newest messages
	});
}

server.listen(8080);