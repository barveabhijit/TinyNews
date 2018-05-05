if (!TN) var TN= {};
if (!TN.lightbox) TN.lightbox= {};

(function($lightbox){	
	
	var callback = null;
	var beingDisplayed = false;
	var chatButtonState = false;
	var chatWindowState = false;
	
	function showLightbox(custId, messageId, infoStruct){
		var bodyElem = $('body');
		var lightboxCanvasElem = $('<div id="lightboxCanvas"></div>');
    	var reclipBeingProcessed = false;
		var emailPopupFlag = false;
        var chatPopupFlag = false;
        var NORMAL_CHAT = 1;
        var JOIN_CHAT = 2;
		var NOT_AVAILABLE = 3;
        // originatorFollowed is a dynamically (here) initialized global object for tracking who is
        // and who isn't followed. Since it is custId-indexed, we need to fetch corresponding story
        // originator custId from infoStruct first somehow. But, it seems that old story JSON output
        // format has a null infoStruct.wsBuzz property and instead echoes story originator via
        // infoStruct.wsMessage.sentFromCustomer.
        var originator = "";
        if (infoStruct.wsBuzz === null) originator = infoStruct.wsMessage.sentFromCustomer;
        else originator = infoStruct.wsBuzz.custid;
		if (typeof originatorFollowed === "undefined") {
		    originatorFollowed = {};
		    (infoStruct.isFollowing == "Y") ? originatorFollowed[originator] = true : originatorFollowed[originator] = false;
		}
		else if (typeof originatorFollowed[originator] === "undefined") {
		    (infoStruct.isFollowing == "Y") ? originatorFollowed[originator] = true : originatorFollowed[originator] = false;
        }
        
		function getLightboxHtml(){							
			function getStoryCopy(){
				var itemDetailsBuzz = infoStruct.wsBuzz;
				var opEdItemHtml = "";
				
				if( !!itemDetailsBuzz ){
					if( !!itemDetailsBuzz.who ){
						opEdItemHtml += '<p>Who: '+itemDetailsBuzz.who+'</p>';						
					}
					if( !!itemDetailsBuzz.what ){
						opEdItemHtml += '<p>What: '+itemDetailsBuzz.what+'</p>';						
					}
					if( !!itemDetailsBuzz.where ){
						opEdItemHtml += '<p>Where: '+itemDetailsBuzz.where+'</p>';						
					}
					if( !!itemDetailsBuzz.when ){
						opEdItemHtml += '<p>When: '+itemDetailsBuzz.when+'</p>';						
					}
					if( !!itemDetailsBuzz.how ){
						opEdItemHtml += '<p>How: '+itemDetailsBuzz.how+'</p>';						
					}
					if( !!itemDetailsBuzz.why ){
						opEdItemHtml += '<p>Why: '+itemDetailsBuzz.why+'</p>';						
					}
					if( !!itemDetailsBuzz.oped ){
						opEdItemHtml += '<p>'+itemDetailsBuzz.oped+'</p>';						
					}
				}
				
				return ( !!opEdItemHtml ? opEdItemHtml : '');
			}
			
			function getOriginUrlHtml(){
				var itemDetailsBuzz = infoStruct.wsBuzz;
				var originUrlHtml = "";
				
				if( !!itemDetailsBuzz ){
					var storyUrl = itemDetailsBuzz.storyUrl;
					if( !!storyUrl ){
						originUrlHtml += ' via <a href="' + storyUrl + '">' + TN.utils.getBaseUrl(storyUrl) + '</a>';
					}
				}
				
				return originUrlHtml;
			}
		
			//temp
			var reclipsCount = 0;
			if(TN.chatClient && TN.chatClient.hasOwnProperty('checkOnlineStatus')){
				//making a call to check user online  status
				TN.chatClient.checkOnlineStatus(infoStruct.wsMessage.sentFromCustomer,messageId);	
			}
			
			var lightboxHtml = '\
			<div class="lighboxContainer"> \
			  <div class="lightbox"> \
					<input class="messageId" type="hidden" value="' + messageId + '"/> \
			        <div class="lightboxHeader block"> <div id="btnClosepage"></div></div> \
			        <!--lightboxHeader--> \
			      <section> \
			        <div class="lightboxContent"> \
			          <section> \
			            <div class="lightboxContentMedia block lightboxwrapper"> \
						  <img id="imageUrl" src="' + infoStruct.productImageUrl + '" width="479" alt="main image" title="Main Image"> \
			              <aside> \
			                <nav> \
			                  <ul class="lightboxSocialMedia"> \
			                    <li><a href="#" class="tweet"></a></li> \
			                    <li><a href="#" class="email"></a></li> \
			                    <li id="flag" class="flagNormal"></li> \
				                <li id="share" class="last"></li> \
			                  </ul> \
			                </nav> \
			              </aside> \
			            </div> \
			          </section> \
			          <section> \
			            <div class="lightboxContentText lightboxwrapper"> \
			              <h1>' + (!!infoStruct.wsBuzz && !!infoStruct.wsBuzz.headline ? infoStruct.wsBuzz.headline : "Test headline") + '</h1>'
			              + getStoryCopy() + 
			              '<hr class="lightboxhRuler"> \
			            </div> \
			            <!--/lightboxContentText--> \
			          </section> \
			          <section> \
			            <div class="lightboxAttr block lightboxwrapper"> \
			              <ul class="lightboxAttrList"> \
			                <li class=" like likeNormal"></li> \
			                <li class="dislike dislikeNormal"></li> \
			                <li id="comment"></li> \
		                    <li id="reclip"></li> \
			              </ul> \
			            </div> \
			            <!--/lightboxattr-->  \
			          </section> \
			          <section> \
			            <div class="lightboxStoryOwner block"> \
			            <div class="lightboxwrapper"> \
			              <div class="lightboxStoryOwnerInfo"> \
			              <img src="' + infoStruct.originatorImageUrl + '" width="36" height="36" alt="user-img-1" title="User Image"> \
			                <h2>by <a href="#">'+ infoStruct.originatorName + '</a>' + getOriginUrlHtml() + '</h2>\
			                <p>Posted: '+ ( !!infoStruct.wsMessage ? infoStruct.wsMessage.elapsedTime : '' ) + '</p> \
			              </div> \
			              <!--/lightboxStoryOwnerInfo--> \
			              <div class="lightboxStoryOwnerFollow"> <a href="javascript:void(0);" id="followButton" class="darkBlue-button"></a> </div> \
			              <!--/lightboxStoryOwnerFollow-->  \
			              <div class="lightboxStoryOwnerFolow"> <a href="javascript:void(0);" id="chatButton" class="darkBlue-button">Chat</a> </div> \
			              </div><!--/lightboxwrapper--> \
			            </div> \
			            <!--/lightboxStoryOwner-->  \
			          </section> \
			          <section> \
			            <div class="lightboxStoryRattings block lightboxwrapper"> \
			              <ul>' +
			              	(!!infoStruct.counters ? 
			                '<li class="likesCount"><span class="counter">' + infoStruct.counters.likesCounter + '</span> likes</li> \
			                <li class="dislikesCount"><span class="counter">' + infoStruct.counters.unLikesCounter + '</span> dislike</a></li> \
			                <li class="commentsCount"><span class="counter">' + TN.commentHandler.trueNumOfComments(infoStruct.messageResponseList) + '</span> comments</li> \
			                <li class="reclipsCount last"><span class="counter">' + reclipsCount + '</span> reclips</li>' :
			                '<li>Counters Info Not Available</li>') +
			              '</ul> \
			            </div> \
			            <!--/lightboxStoryRattings-->  \
			          </section> \
			          <section> \
			            <div class="lightboxComments">  \
			            <div class="lightboxwrapper">' +
			              TN.commentHandler.getLBCommentsHtml(infoStruct.messageResponseList) +
			              '</div><!--/lightboxwrapper--> \
			            </div><!--/lightboxComments-->  \
			          </section> \
			          <section> \
			            <div class="lightboxAddCommentBlock block"> \
			            <div class="lightboxwrapper">' +
			              TN.commentHandler.getLBCommentBoxHtml() +
			            '</div><!--/lightboxwrapper--> \
			            </div> \
			            <!--/lightboxAddCommentBlock-->  \
			          </section> \
			        </div> \
			        <!--lightboxContent-->  \
			      </section> \
				</div> \
			</div>';

		    return lightboxHtml;
		}

        function getEmailPopupHtml(){
            var emailPopupCont = '\
            <div id="lightbox_Popup_Cont"> \
                <div class="LB_Popup_head"></div><!--/LB_Popup_head--> \
                    <div class="LB_Popup_mid block"> \
                        <h1>email this story</h1> \
                        <form action="#" method="post" id="LB_PuForm"> \
                            <label class="LB_PuLabel"><h5>name</h5></label> \
                            <input id="LB_PuTextbox_name" type="text" name="formText" class="LB_PuTextbox R5"> \
                            <label class="LB_PuLabel"><h5>email address</h5></label> \
                            <input id="LB_PuTextbox_email" type="text" name="formText" class="LB_PuTextbox R5"> \
                            <label class="LB_PuLabel"><h5>messages</h5></label> \
                            <textarea id="LB_PuTextarea_messages" class="LB_PuTextarea R5"></textarea> \
                        	<input type="submit" id="LB_PuShareBtn" name="LB_PuForm Submit" value="Share" class="LB_PuShareBtn textC R5"> \
                            <a href="javascript:void(0)" class="LB_PuCancelBtn"><h5>Cancel</h5></a> \
                        </form> \
                    </div><!--/LB_Popup_mid--> \
                <div class="LB_Popup_bot"></div><!--/LB_Popup_bot--> \
            </div>';
            return emailPopupCont;
        }

		function unFollow(){
		    $('#followButton').unbind();
            TN.services.unFollow( infoStruct.wsBuzz.custid ).done(function(){
                $('#followButton').text("Follow").click(function(){ 
                    follow();
                });
                originatorFollowed[infoStruct.wsBuzz.custid] = false;
                infoStruct.isFollowing = "N";
            });
        }
        
        function follow(){
            $('#followButton').unbind();
            TN.services.addFollowing( infoStruct.wsBuzz.custid ).done(function(){
                $('#followButton').text("Unfollow").click(function(){ 
                    unFollow();
                });
                originatorFollowed[infoStruct.wsBuzz.custid] = true;
                infoStruct.isFollowing = "Y";
            });
        }
        
		if( !!infoStruct ){
			var refElem = $(window);
			var lightboxElem = $(getLightboxHtml());
			var catType = (!!infoStruct.wsMessage ? infoStruct.wsMessage.messageType : "" );
			
			
			
			bodyElem.append(lightboxCanvasElem);
			bodyElem.append(lightboxElem);
			
			lightboxElem.css('top', refElem.scrollTop())
			.css('left', refElem.scrollLeft() + (refElem.width()-lightboxElem.width())/2);		
						
			lightboxElem.find('.linkAllComments').click(function(){
				var jqElem = $(this);
				TN.commentHandler.getLBAllComments(jqElem, lightboxElem);
			});

			//hiding chat Button if user looking at his ownstory or publisher is not online
			if(!chatButtonState) {
				$("#chatButton").hide();
			}
						
			lightboxCanvasElem.click(function(){
				$lightbox.close(messageId);
			});
			
			lightboxElem.find('#btnClosepage').click(function(){				
				$lightbox.close(messageId);
			});

			if ( infoStruct.wsMessage.sentFromCustomer != custId ) {
                if ( originatorFollowed[infoStruct.wsBuzz.custid] ) {
                    $('#followButton').text("Unfollow").click(function(){ 
                        unFollow();
                    });
                }
                else {
                    $('#followButton').text("Follow").click(function(){
                        follow();
                    });
                };
            }
            else $('#followButton').hide();
            
			TN.commentHandler.addLBCommentBoxFunctions(lightboxElem);
			lightboxElem.imagesLoaded(function(){
				var lightboxElem = $('.lighboxContainer');								
				
				lightboxElem.find('#flag').click(function(){
					var jqElem = $(this);
					
					if( jqElem.hasClass('flagNormal') ){
						TN.services.userFlagRequest(messageId, 'misorganized', custId ).done(function(){
							jqElem.removeClass('flagNormal');
							jqElem.addClass('flagSelected');
						});
					}
				});
				
				lightboxElem.find('.like').click(function(){
					if( !!lightboxElem.data('like') ){
						TN.likeHandler.reverseLikeCount( custId, lightboxElem, catType, $(this)).
							done(function(){
								TN.utils.getDetailItem(messageId).favourCount--;
							});
					}
					else {
						var decrementDislikeCount = !!lightboxElem.data('dislike');
						TN.likeHandler.updateLikeCount( custId, lightboxElem, catType, $(this)).
							done(function(){
								TN.utils.getDetailItem(messageId).favourCount++;
								if( decrementDislikeCount ){
									TN.utils.getDetailItem(messageId).notFavourCount--;
								}
							});
					}
				}).mouseleave(function(){
					var jqElem = $(this);
					
					if( jqElem.hasClass('likeClicked') ){
						var parentCont = jqElem.parents('.lighboxContainer');
						
						jqElem.removeClass('likeClicked');
						if( !!parentCont.data('like') ){
							jqElem.addClass('likeSelected');
						}
						else {
							jqElem.addClass('likeNormal');
						}
					}

				}).mousedown(function(){
					var jqElem = $(this);
					jqElem.removeClass('likeNormal');
					jqElem.removeClass('likeSelected');
					jqElem.addClass('likeClicked');
				});
				
				lightboxElem.find('.dislike').click(function(){
					if( !!lightboxElem.data('dislike') ){
						TN.likeHandler.reverseDislikeCount( custId, lightboxElem, catType, $(this)).
							done(function(){
								TN.utils.getDetailItem(messageId).notFavourCount--;
							});
					}
					else {
						var decrementLikeCount = !!lightboxElem.data('like');
						TN.likeHandler.updateDislikeCount( custId, lightboxElem, catType, $(this)).
							done(function(){
								TN.utils.getDetailItem(messageId).notFavourCount++;
								if( decrementLikeCount ){
									TN.utils.getDetailItem(messageId).favourCount--;
								}
							});
					}					
				}).mouseleave(function(){
					var jqElem = $(this);
					
					if( jqElem.hasClass('dislikeClicked') ){
						var parentCont = jqElem.parents('.lighboxContainer');
						
						jqElem.removeClass('dislikeClicked');
						if( !!parentCont.data('dislike') ){
							jqElem.addClass('dislikeSelected');
						}
						else {
							jqElem.addClass('dislikeNormal');
						}
					}
				}).mousedown(function(){
					var jqElem = $(this);
					jqElem.removeClass('dislikeNormal');
					jqElem.removeClass('dislikeSelected');
					jqElem.addClass('dislikeClicked');
				});				
				
				$('#reclip').click(function(){
					if(!reclipBeingProcessed ){
						reclipBeingProcessed = true;
						TN.services.addToWishListWithFittingRoomData(custId, messageId, 'public').
						done(function(){
							alert('This item has been successfully added to favorites');
						}).
						fail(function(jqXHR, textStatus, errorThrown){
							alert('There was an error in processing your request:' + errorThrown);
						}).
						always(function(){
							reclipBeingProcessed = false;
						});
					}
				});

				lightboxElem.find('#chatButton').on('click',function(e){
					e.preventDefault();
					var chatType = $(this).data('type');
					if(!chatPopupFlag) {
						chatPopupFlag = true;
						if(chatType == NORMAL_CHAT) {
							TN.chatClient.sendChatRequest(infoStruct.wsMessage.sentFromCustomer,custId, messageId);								
						} else if(chatType == JOIN_CHAT) {
							TN.chatClient.joinChat(messageId);
						} 
						TN.lightbox.showChatBox(true,{profileThumbPicUrl : infoStruct.originatorImageUrl, firstName : infoStruct.originatorName},custId,messageId);
					}
				})
                lightboxElem.find('.email').click(function(event){
                    event.preventDefault();
                    if (!emailPopupFlag) {
                        emailPopupFlag = true;
                        var emailPopup = $(getEmailPopupHtml());
                        emailPopup.css('top', $('.lighboxContainer').position().top+$('.email').position().top+$('.email').height()+15)
                            .css('left', $('.lighboxContainer').position().left+510);
                        emailPopup.find('.LB_PuCancelBtn').click(function(){
                            $('#lightbox_Popup_Cont').remove();
                            emailPopupFlag = false;
                        });
                        emailPopup.find('#LB_PuShareBtn').click(function(event){
                            event.preventDefault();
                            var LB_PuTextbox_email = $('#LB_PuTextbox_email').val();
                            var LB_PuTextarea_messages = TN.utils.isBlank($('#LB_PuTextarea_messages').val()) ? '' : $('#LB_PuTextarea_messages').val();
                            var LB_PuTextbox_name = TN.utils.isBlank($('#LB_PuTextbox_name').val()) ? '' : $('#LB_PuTextbox_name').val();
                            var fullyQualifiedImgUrl = 'http://'+TNServerAddress+'/'+$('#imageUrl').attr('src');
                            if (TN.utils.isBlank(LB_PuTextbox_email)) {
                                alert("Please enter email");
                            }
                            else {
                                TN.services.sharePhotoInfoViaEmail(LB_PuTextbox_email, LB_PuTextarea_messages, infoStruct.wsMessage.messageType,
                                    (!!infoStruct.wsBuzz.headline) ? infoStruct.wsBuzz.headline : "Test Headline", fullyQualifiedImgUrl, LB_PuTextbox_name,
                                    infoStruct.wsBuzz.oped, infoStruct.wsBuzz.who, infoStruct.wsBuzz.what, infoStruct.wsBuzz.when, infoStruct.wsBuzz.where,
                                    infoStruct.wsBuzz.how, infoStruct.wsBuzz.why)
                                    .done(function(msg){
                                        //alert("Server response: "+msg);
                                        if (msg[0] != "false") {
                                            alert("Story successfully sent");
                                            $('#lightbox_Popup_Cont').hide();
                                        }
                                        else alert("Story sending failed");
                                    })
                                    .fail(function(){
                                        alert("Story sending failed");
                                    });
                            }
                        });
                        bodyElem.append(emailPopup);
                    }
                    else {
                        $('#lightbox_Popup_Cont').toggle();
                    }
                });
				
			});
			
		}

	}
	
	$lightbox.show = function( custId, messageId, callbackFunc ){
		var data;
		if( beingDisplayed ){
			return;
		}
		if(arguments[3]) {
			showChatBox = true;
		}
		beingDisplayed = true;
		
		var infoStruct = TN.utils.getDetailItem(messageId);
		
		callback = callbackFunc;
		
		// If infoStruct is passed and it has .wsBuzz (indicative of gFRR story format), then use it else get 
		// infoStruct but with getFittingRoomRequest this time
		if( ( !!infoStruct ) && ( !!infoStruct.wsBuzz ) ){
			showLightbox(custId, messageId, infoStruct );
		}
		else {
			TN.services.getFittingRoomRequest(custId, messageId).done(function(json){
				// json[0].wsMessage.originalMessageId is non-empty string in cases when getFittingRoomRequest
				// calls a messageId which is actually a comment of some story. In that case we call 
				// getFittingRoomRequest second time with that same message id to fetch the original story:
				if (json[0].wsMessage.originalMessageId) {
						var originalMessageId = json[0].wsMessage.originalMessageId;
						TN.services.getFittingRoomRequest(custId, originalMessageId).done(function(json){
						TN.services.getMesageStats(originalMessageId).done(function(countersJson){
							showLightbox(custId, originalMessageId, TN.utils.storeDetailItem(originalMessageId, json[0], countersJson[0]));
						}).fail( function(){
							showLightbox(custId, originalMessageId, TN.utils.storeDetailItem(originalMessageId, json[0]));
						});
					});
				}
				else {
					TN.services.getMesageStats(messageId).done(function(countersJson){
						showLightbox(custId, messageId, TN.utils.storeDetailItem(messageId, json[0], countersJson[0]));
					}).fail( function(){
						showLightbox(custId, messageId, TN.utils.storeDetailItem(messageId, json[0]));
					});
				}
			});
		}
		//(to show the chat Box) if you change the arguments order or number it will break !!
		if(arguments[3]){
			data = arguments[3];
			TN.lightbox.showChatBox(true,data.pinfo,data.cid,data.mid);
		}
	};

	$lightbox.showChatButton = function(status) {
		chatButtonState = false;
		var NORMAL_CHAT = 1, JOIN_CHAT = 2, NOT_AVAILABLE = 3;
		if(!!status.ust || status.rst) {
			chatButtonState = true;
		} 
		if($("#chatButton")) {
			if(chatButtonState){
				if(status.rst){
					$("#chatButton").data('type',JOIN_CHAT);
					$("#chatButton").text('Join Chat').show();
				} else if(!status.rst && status.bst){
					$("#chatButton").data('type',NOT_AVAILABLE);
					$("#chatButton").text('N/A').show();
				} else {
					$("#chatButton").data('type',NORMAL_CHAT);
					$("#chatButton").text('Chat').show();
				}
			} else {
				$("#chatButton").hide();
			}
		}
		
	};

	$lightbox.showChatBox = function(show,userInfo,publisherId,messageId) {
		chatWindowState = true;
		function getChatPopupHtml(pubinfo) {
			var pubImage = pubinfo.profileThumbPicUrl,
				pubName  = pubinfo.firstName;
        	var chatPopupCont = ' \
        	<div id="ChatContainer"> \
  				<div class="chatBlock block"> \
    				<div class="chatBlock_Head block"> \
      					<img src="'+ pubImage +'" alt="User Image" title="User Image" width="49" height="48"> \
        				<h1>'+ pubName +'</h1> \
      				</div> <!--/chatBlock_Head--> \
      				<div id="scrollbar2"> \
						<div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div> \
							<div class="viewport"> \
			 					<div class="overview"> \
    							</div> \
    						</div> \
    					</div> \
    				</div> \
					<div class="roomActivity"></div> \
    				<div class="chatBlock_typingbox"> \
      					<form action="#" method="get"> \
       						<input type="text" name="chat box" id="chat_message" class="chatBox_text"> \
      					</form> \
					</div> <!--/chatBlock_typingbox--> \
					<div class="userCount">online users count : <span id="count"> 1 </span></div> \
				</div> <!--/chatBlock--> \
			</div>';
			return chatPopupCont; 

        }

		if(show) {		 
			var refElem = $(window);
			var chatPopupElem = $(getChatPopupHtml(userInfo));			
			$('body').append(chatPopupElem);	
			chatPopupElem.css('top',refElem.scrollTop()).css('left',refElem.scrollLeft() + (refElem.width()- 639)/2+638);
			$("#scrollbar2").tinyscrollbar();
			chatPopupElem.find('form').on('submit',function(e){
					e.preventDefault();
					var message = $("#chat_message").val();
					$("#chat_message").val('');
					$lightbox.updateChat(message,TN.userInfo);
					TN.chatClient.sendMessage(message,publisherId,messageId);
			});
		} else {
			log("publisher not accepted your request");
		}
	};
	var chatBlockColor = 0;
	$lightbox.updateChat = function(message,userInfo){
			var tempClass,
				userImage = userInfo.profileThumbPicUrl,
				userName = userInfo.firstName + userInfo.lastName;
			if(chatBlockColor) {
				 tempClass = '';
				chatBlockColor = 0;
			} else {
				chatBlockColor = 1;
				tempClass = 'white';
			}
			var htmlMarkup = ' \
			<div class="newsBlock '+ tempClass +'"> <img src="'+ userImage +'" width="32" height="32" alt="user\'s friend image" title="Friend Image"> \
        		<h1><a href="#">'+ userName +'</a></h1> \
        		<p>'+ message +'</p> \
      		</div>';
      		$("#scrollbar2 .overview").append(htmlMarkup);
      		$("#scrollbar2").tinyscrollbar_update('bottom');
	};

	$lightbox.close = function(messageId){
		if( !!callback ){
			var lightboxElem = $('.lightbox');
			callback(parseFloat(lightboxElem.find('.likesCount span').html()), 
					parseFloat(lightboxElem.find('.dislikesCount span').html()),
					parseFloat(lightboxElem.find('.commentsCount span').html()));
		}
		if(TN.chatClient && TN.chatClient.hasOwnProperty('exitChat') && chatWindowState){
				//making a call to notify the server that user left
			TN.chatClient.exitChat(messageId);	
		}
		$('.lighboxContainer').remove();
		$('#lightboxCanvas').remove();
        $('#lightbox_Popup_Cont').remove();
        $('#ChatContainer').remove();
		beingDisplayed = false;
	};
	
	$lightbox.notifyUserMovement = function(userInfo, isLeft){
		var text;
		if(isLeft){
			text = userInfo.firstName + ' joined the chat';
		} else {
			text = userInfo.firstName + ' left the chat';
		}
		$('.roomActivity').text(text).show();
	}
	$lightbox.updateUserCount = function(count) {
		$('.userCount #count').text(count);
	};
	
}(TN.lightbox));

