var server = io.connect("http://localhost:8080");

server.on('connect', function(data){
	/**/
	var nickname = null;
	while (nickname === null || nickname.replace(/(^\s*)|(\s*$)/g,'') === ""){
		nickname = prompt("Enter a username:");
	}
	
	server.emit('join chat', nickname.replace(/(^\s*)|(\s*$)/g,''));
	//server.emit('join chat', 'Dave');
});

server.on('add chatter', function(name){
	var chatter = $('<li>'+name+'</li>').attr('data-name', name);
	console.log(chatter.data());
	$("ul.chatter_list").append(chatter);
});

server.on('remove chatter', function(name){
	$("ul.chatter_list li[data-name=" + name + "]").remove();
});

server.on('add message', function(text){ 
	insertMessage(text); 
});

var insertMessage = function(text){

}