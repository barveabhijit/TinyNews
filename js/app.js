/* Tiny news Chat server
 * version: 1.0
 * author: kishorevarma
 */ 

var io = require('socket.io').listen(1330);

io.set('log level', 1);
//logging uncaught exceptions handling server crash
process.on('uncaughtException', function (err) {
  log(err); //console.error(err);
  log("Node NOT Exiting...");
}); 

var User = function() {
	this.onlineUsers = {};
	this.busyUsers = [];
};

User.prototype = {
	add : function(userId,socket){
		if(!this.onlineUsers.hasOwnProperty[userId]) {
			this.onlineUsers[userId] = socket;
		}
	},
	remove : function(userId) {
		delete this.onlineUsers[userId];
	},
	getSocket : function(userId){
		return this.onlineUsers[userId];
	},
	getOnlineUsers : function(){
		return this.onlineUsers;
	},
	addBusyUser : function(id){
		this.busyUsers.push(id);
	},
	removeBusyUser : function(id){
		var index = this.busyUsers.indexOf(id);
		this.busyUsers.splice(index,1);
	},
	getBusyUsers : function() {
		return this.busyUsers;
	},
	checkBusy : function(id) {
		if(this.busyUsers.indexOf(id) === -1){
			return false;
		}
		return true;
	}
};

var Channel = function() {
	this.channels = {};

	this.add =  function(channelId){
		this.channels[channelId] = [];
	};
	this.deleteChannel = function(channelId) {
		delete this.channels[channelId];
	};
	this.subscribe = function(channelId,uid) {
		if(typeof(this.channels[channelId]) == 'undefined') {
			this.channels[channelId] = [];
		}
		this.channels[channelId].push(uid);
		this.addBusyUser(uid);
	};
	this.unsubscribe = function(channelId,uid) {
		log("in unsubscribe");
		log(channelId);
		var allSubscribers = this.channels[channelId],
		    index;
		log(allSubscribers);
		this.removeBusyUser(uid);
		if(typeof(allSubscribers) != 'undefined') {
			index = allSubscribers.indexOf(uid);
			allSubscribers.splice(index,1);
			if(allSubscribers.length == 0) {
				this.deleteChannel(channelId);
			} else {
				this.channels[channelId] = allSubscribers;
			}
		}
	};
	this.getRooms = function(){
		return this.channels;
	};
	this.getUserCount = function(channelId) {
		var users = this.channels[channelId];
		if(typeof(users) != 'undefined') {
			return users.length;
		}
		return 0;
	};
}

Channel.prototype = new User();

var user = new User();
var channel = new Channel();

io.sockets.on('connection', function(socket) {
	//when client is connected client notify his online presence
	socket.on('registerOnline', function(userId) {
		socket.set('uid',userId);
		user.add(userId,socket);
	});

	socket.on('checkUserOnline', function(data,fn) {
		var onlineUsers = user.getOnlineUsers(),
		    channels = channel.getRooms(),
		    clientId = data.cid,
		    messageId = data.mid;
		var roomStatus = channels.hasOwnProperty(messageId);
		var publisherStatus = onlineUsers.hasOwnProperty(clientId);
		var publisherBusystatus = channel.checkBusy(clientId);
			
		fn({ust: publisherStatus , rst:roomStatus, bst:publisherBusystatus});
	});

	socket.on('sendChatRequest',function(data) {
		var clientId =  data.user,
		    publisherId = data.ct,//creator
		    roomId = data.mid; // we are using messageId as roomid
		    
		var publisherSocket = user.getSocket(publisherId);
		var dt = {uid: clientId, cid:data.cid, mid:data.mid};
		socket.join(roomId);
		channel.add(roomId);
		channel.subscribe(roomId,clientId);
		publisherSocket.emit('receiveChatRequest',dt);
	});
		
/*	socket.on('acceptChatRequest', function(data) {
		var clientSocket = user.getSocket(data.clid),
		    roomId = data.mid,
		    publisherId,roomId; 
		socket.get('uid',function(err,userId){
			publisherId = userId;		
		});
		//publisher joined the room
		socket.join(roomId);
		channel.subscribe(roomId,publisherId);
//		clientSocket.emit('onSuccessRequest',{pid:publisherId,mid:roomId,rid:roomId});
	});

	socket.on('rejectChatRequest', function(clientId) {
		var clientSocket = user.getSocket(clientId),
		    publisherId;
		socket.get('uid',function(err,userId){
                        publisherId = userId;
                });
		clientSocket.emit('onFailureRequest', publisherId);
	}); */
	
	socket.on('joinChat', function(messageId) {
		socket.join(messageId);
		socket.set('mid',messageId);
		socket.get('uid', function(err,userId) {
			channel.subscribe(messageId,userId);
			socket.broadcast.to(messageId).emit('userJoin', {uid:userId});
		});
		io.sockets.in(messageId).emit('updateUserCount', channel.getUserCount(messageId));
	});
	
	socket.on('exitChat', function(messageId){
		socket.set('mid','');
		socket.get('uid', function(err,userId) {
			channel.unsubscribe(messageId,userId);
			socket.broadcast.to(messageId).emit('userLeft', {uid:userId});
			log("in exit chat" + messageId);
			socket.leave(messageId);
			log("socket clients of room");
			log(io.sockets.clients(messageId).length);
		});
		io.sockets.in(messageId).emit('updateUserCount', channel.getUserCount(messageId));
	});
	socket.on('sendMessage', function(data) {
		var myId;
		socket.get('uid',function(err,userId){
                        myId = userId;
                });
		log("msg"+data.msg);
		socket.broadcast.to(data.rid).emit('chatMessage', {msg:data.msg,pid:myId});
		log(data.rid);
		log(io.sockets.clients(data.rid).length);
	});
	socket.on('disconnect', function(){
		var roomId ;
		socket.get('mid', function(err, mid) {
			roomId = mid;
		});
		socket.get('uid', function(err,userId) {
			if(roomId) {
				channel.unsubscribe(roomId,userId);
				socket.broadcast.to(roomId).emit('userLeft', {uid:userId,uc:channel.getUserCount(roomId)});
				io.sockets.in(roomId).emit('updateUserCount', channel.getUserCount(roomId));	
			}
			user.remove(userId);
		});
	});
	
	
});
