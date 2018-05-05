/* Socket io client
 * Autor: kishorevarma
 */
if (!TN) var TN= {};
if (!TN.chatClient) TN.chatClient= {};
 $.getScript("http://192.95.18.122:1330/socket.io/socket.io.js",function(){

 		var $chatClient = TN.chatClient;
		$chatClient.isUserEngaged = '';
		$chatClient.roomId;
		var userInfo = TN.userInfo,
			loginId = userInfo.emailid,
			chatUsersinfo = {};
		
		try {
			var socket = io.connect('192.95.18.122:1330');
		}
		catch(err) {
			return;
		}
		
		socket.on('connect', function (data) {
			socket.emit('registerOnline', loginId);
		});
		
		socket.on('receiveChatRequest', function(data) {   // Message Event from server
			var clientInfo,
				clientId = data.uid,
				messageId = data.mid;

			 TN.services.loadUserInfo(clientId, loginId).done(function( msg ) {
                  clientInfo = msg[0];
                  $chatClient.renderRequestPrompt(clientId,clientInfo.firstName,messageId);
            }); 

		});

	/*	socket.on('onSuccessRequest',function(data){
			$chatClient.roomId = data.rid;
			TN.services.loadUserInfo(data.pid, loginId).done(function( msg ) {
				var publisherInfo = msg[0];
				TN.lightbox.showChatBox(true,publisherInfo,data.pid,data.mid);
            }); 

		});

		socket.on('onFailureRequest', function(publisherId){
			log(publisherId + " Not accepted");
			 TN.services.loadUserInfo(publisherId, loginId).done(function( msg ) {
				var publisherInfo = msg[0];
				TN.lightbox.showChatBox(false,publisherInfo);
            });
		}); */

		socket.on('chatMessage', function(data) { 
			log("got the data from server",data);
			
			if(chatUsersinfo.hasOwnProperty(data.pid)) {
				TN.lightbox.updateChat(data.msg, chatUsersinfo[data.pid]);
			} else {
				TN.services.loadUserInfo(data.pid, loginId).done(function( msg ) {
					var publisherInfo = msg[0];
					chatUsersinfo[data.pid] = publisherInfo; //storing all the chat users data in local array , this reduce the webservices calls
					TN.lightbox.updateChat(data.msg, publisherInfo);
				});
			}

		});
		
		socket.on('userLeft', function(data) { //receive data from server that user left the chat
			log('user Left the chat',data);
			if(chatUsersinfo.hasOwnProperty(data.uid)) {
				TN.lightbox.notifyUserMovement(chatUsersinfo[data.uid],0);
			} else {
				TN.services.loadUserInfo(data.uid, loginId).done(function( msg ) {
					var userInfo = msg[0];
					//storing all the chat users data in local array , this reduce the webservices calls ,will be used if user comes next time.
					chatUsersinfo[data.uid] = userInfo; 
					TN.lightbox.notifyUserMovement(userInfo,0); //0 is for user left
				});
			}
		});

		socket.on('userJoin', function(data) { // receive data from server that user joined the chat
			log("user joined",data);
			if(chatUsersinfo.hasOwnProperty(data.uid)) {
				TN.lightbox.notifyUserMovement(chatUsersinfo[data.uid],1);
			} else {
				TN.services.loadUserInfo(data.uid, loginId).done(function( msg ) {
					var userInfo = msg[0];
					chatUsersinfo[data.uid] =  userInfo;
					TN.lightbox.notifyUserMovement(userInfo,1); //1 is for user joined
				});
			}
		});
		
		socket.on('updateUserCount', function(count) {
			TN.lightbox.updateUserCount(count);
		});
		$chatClient.sendChatRequest = function(creator,custId,messageId) {
			var data = {ct : creator, user: loginId, cid: custId, mid: messageId};
			socket.emit('sendChatRequest', data);
		};

		$chatClient.checkOnlineStatus = function(publisherId,messageId) {
			var data = {};
			if(publisherId == loginId) {
				TN.lightbox.showChatButton(0);
				return;
			}
			data.cid = publisherId;
			data.mid = messageId;
			socket.emit('checkUserOnline',data,function(status){
					log(status);
					TN.lightbox.showChatButton(status);
			});
		};

		$chatClient.renderRequestPrompt = function(clientId,name,messageId) {
			var cId = clientId.replace(/[\.@#]/g,'_'),
				uniqueIdentity = cId + '_' + messageId;
			var publisherInfo;
			TN.services.loadUserInfo(clientId, loginId).done(function( msg ) {
				publisherInfo = msg[0];
			});
			var html = ' \
			<div id="chatRequest_'+ uniqueIdentity + '" class="chatRequest_cont"> \
				<p> Request to Chat</p> \
				<p>'+ name +' is requesting a chat session with you</p> \
				<div style="float:left;margin:20px"><button id="ignore_'+ uniqueIdentity +'" class="lightGrey-button">Ignore</button></div> \
				<div style="float:left;margin:20px"><button id="accept_'+ uniqueIdentity +'" class="darkBlue-button">Accept</button></div> \
			</div> ';

			$('body').append(html);

			$("#accept_"+uniqueIdentity).on('click',function(){
				socket.emit('joinChat',messageId);
				$("#chatRequest_"+ uniqueIdentity).remove();
				$chatClient.roomId = messageId;
				TN.lightbox.show(clientId, messageId, '', {pinfo:publisherInfo,cid:clientId,mid:messageId});	
				
			});

			$("#ignore_"+uniqueIdentity).on('click',function(){
				$("#chatRequest_"+ uniqueIdentity).remove();
				//socket.emit('rejectChatRequest',clientId);
			});
		};
		
		$chatClient.joinChat = function(messageId) { // send to server that user joined in the chat
			socket.emit('joinChat',messageId);
		};
		
		$chatClient.exitChat = function(messageId) { //send to server that user left the chat
			socket.emit('exitChat', messageId);
		};
		
		$chatClient.sendMessage = function(message,pubId,messageId) {
			//var roomId = pubId+'_'+ messageId;
			var roomId = messageId;
			var data = {rid: roomId, msg:message};
			log('message emitting from client', data);
			socket.emit('sendMessage', data);
		};
 });