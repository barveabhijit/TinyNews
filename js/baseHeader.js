if (!TN) var TN= {};
if (!TN.baseHeader) TN.baseHeader= {};

(function($baseHeader){

    $baseHeader.answerFriendshipNotifs = function(answer, sourceElem) {
        var originator = $(sourceElem).parent().find('.requestOriginator').val();
        $(".requestOriginator[value='"+originator+"']").parent().find('.notifsReqAccept, .notifsReqReject').unbind();
        TN.services.answerFriendRequest(originator, answer).done(function(){
            $(".requestOriginator[value='"+originator+"']").parent().find('.notifsReqAccept, .notifsReqReject').hide();
            if (answer == "Y") {
                $(".requestOriginator[value='"+originator+"']").parent().append("Accepted");
            }
            else {
                $(".requestOriginator[value='"+originator+"']").parent().append("Rejected");
            }
        }).fail(function(){
            alert("Error occurred");
        });
    };

    $baseHeader.findFriends = function() {
        var inviteBoxContHtml = '\
        <div>\
            <div class="TN-addFriend_Header block">\
                <h1>Invite Friends</h1>\
            </div>\
            <div class="TN-addFriend_Cont">\
                <ul class="TN-addFriend_Cont_list block">\
                    <li><a href="#"><img src="images/addfriend/email_img.gif" alt="email" title="Email" style="cursor:pointer" onclick="alert(\'Coming soon!\')"></a></li>\
                    <li><a href="#"><img src="images/addfriend/yahoo_img.gif" alt="yahoo" title="Yahoo" style="cursor:pointer" onclick="alert(\'Coming soon!\')"></a></li>\
                    <li><a href="#"><img src="images/addfriend/gmail_img.gif" alt="gmail" title="Gmail" style="cursor:pointer" onclick="alert(\'Coming soon!\')"></a></li>\
                    <li><a href="#"><img src="images/addfriend/fb_img.gif" alt="facebook" title="Facebook" style="cursor:pointer" onclick="alert(\'Coming soon!\')"></a></li>\
                    <li><a href="#"><img src="images/addfriend/twitter-img.gif" alt="twitter" title="Twitter" style="cursor:pointer" onclick="alert(\'Coming soon!\')"></a></li>\
                </ul>\
                <h2>find friends</h2>\
                <div class="TN-addFriend_Cont_searchBox block">\
                    <input type="text" name="searchbox" value="Search Tiny News to see who you know" class="TN-AF_searchBox">\
                    <a href="javascript:void(0);" class="TN-AF_search"><img src="images/addfriend/search-icon.png" width="40"\
                    height="36" alt="search icon" title="search"></a>\
                </div>\
                <div class="TN-addFriend_Cont_searchResult block">\
                    <ul class="searchResult_list">\
                    </ul>\
                </div>\
            </div>\
        </div>';

        function fillResultTemplate(obj, isFriend){
            return '\
            <li>\
                <a href="myPage.html?view=' + obj.emailid + '">\
                    <img src="' + obj.profileThumbPicUrl + '" onload="TN.utils.normalizeImage(this, 50, 50);" style="width:50px; height:50px">\
                    <h1>' + obj.firstName + ' ' + obj.lastName + '</h1>\
                </a>\
                <p>&nbsp;</p>\
                <input name="emailid" type="hidden" value="' + obj.emailid + '">\
            ' + (isFriend ? '' : '<a href="javascript:void(0);" class="searchResult_AddBtn">send request</a>') +'\
            </li>';
        }

        function injectResult(searchResult) {
            $('.searchResult_list').html('');
            jQuery.each(searchResult[0].nonFriends, function(index, val){
                $('.searchResult_list').append(fillResultTemplate(val, false));
            });
            jQuery.each(searchResult[0].friends, function(index, val){
                $('.searchResult_list').append(fillResultTemplate(val, true));
            });
            $('.searchResult_AddBtn').click(function(event){
                $(event.target).unbind();
                var emailid = $(event.target).parent().find('[name="emailid"]').val();
                TN.services.addShopBeeFriends(emailid).done(function(msg){
                    $(event.target).text('Friendship pending');
                });
            })
        }

        function initiateSearch() {
            var searchString = $('.TN-AF_searchBox').val();
            TN.services.shopbeeUsersSearch(searchString, 1, 5).done(function(json){
                injectResult(json);
            }).fail(function(){
                $('.searchResult_list').html("<li>No match found</li>");
            });
        }

        var jqInviteBox = $(inviteBoxContHtml);
        jqInviteBox.css("padding-left", "20px").css("padding-right", "15px").css("padding-bottom", "15px").css("margin-top", "-20px");
        jqInviteBox.find('.TN-AF_searchBox').click(function(event){
            if (event.target.value == 'Search Tiny News to see who you know') event.target.value = '';
        }).focusout(function(event){
            if (event.target.value == '') event.target.value = 'Search Tiny News to see who you know';
        }).keyup(function(event){
            if( event.which === 13 ) {
                initiateSearch();
            }
        });
        jqInviteBox.find('.TN-AF_search').click(function(){
            initiateSearch();
        });
        LightboxTool.displayLightbox(jqInviteBox, {showHeader:true, width:625});
        $(window).keyup(function(event){
            if( event.which === 27 ) {
                LightboxTool.close();
            }
        });

    };

	$baseHeader.initialize = function(){
        
		custId = TN.utils.getCookie('TNUser');
        TNServerAddress = null;
        if (TN.utils.getQueryStringParam("view")) viewId = TN.utils.getQueryStringParam("view");
        else viewId = TN.utils.getCookie('TNUser');
        var totalNPages = 0;
		var currNPage = 0;
//		TN.homepage = false;
        var notificationsNum = 0;
        var notificationsLoaded = false;
        var uncheckedNotifs = 0;
        servAddressFetch = $.ajax({ type:'GET', dataType:'text', url:'/php/server_address.php' });
        servAddressFetch.done(function( msg ) {
            TNServerAddress = msg;
        });

        // usage: log('inside coolFunc',this,arguments);
        // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
        window.log = function(){
          log.history = log.history || [];   // store logs to an array for reference
          log.history.push(arguments);
          if(this.console){
            console.log( Array.prototype.slice.call(arguments) );
          }
        };

        var pollNotifications = function() {
            if (notificationsLoaded) {
                TN.services.getNotificationTrayDetails(1, 1).done(function(json){
                    if (json[0].totalRecords > notificationsNum) {
                        var incomingNotifsN = parseFloat(json[0].totalRecords) - parseFloat(notificationsNum);
                        loadNotifications(1, true, incomingNotifsN);
                        uncheckedNotifs += incomingNotifsN;
                        $('#id_newNotifiactionsNum').text('['+uncheckedNotifs+']');
                        // log("incomingNotifsN: "+incomingNotifsN+" uncheckedNotifs: "+uncheckedNotifs);
                    }
                });
            }
            setTimeout(pollNotifications, 60000);
        }

        setTimeout(pollNotifications, 60000);

		function loadNotifications(pageNum, prependOnly, prependNum) {

			function populateNotificationsHtml( response ){

				function getNotificationItemHtml(notificationItem){
				    
				    function contentTypeTemplate (messageType) {
                        if ((messageType == "FollowingRequest") || (messageType == "AcceptOrReject") || (messageType == "AcceptedFriendRequest")) {
                            return 'myPage.html?view=' + notificationItem.custId;
                        }
                        else {
                            if (notificationItem.messageId == "") return 'javascript:alert(\'Missing message ID (a notification for a duplicate like?)\')';
                            else return 'javascript:TN.lightbox.show(\'' + notificationItem.custId + '\', ' + notificationItem.messageId + ')';
                        }
                    }

                    function friendshipControls (requestOriginator) {
                        TN.services.loadUserInfo(requestOriginator, custId).done(function(msg){
                            if (msg[0].isFriend == "Y")
                                $(".requestOriginator[value='"+requestOriginator+"']").parent().text('Accepted');
                            else if (msg[0].friendRequestType == "") {
                                // Commented out because currently both friend request withdrawn and friend request rejected
                                // states fall into this same case:
                                // $(".requestOriginator[value='"+requestOriginator+"']").parent().text('Rejected');
                            }
                            else
                                $(".requestOriginator[value='"+requestOriginator+"']").parent().html('\
                                <input class="requestOriginator" type="hidden" value="' + notificationItem.custId + '" />\
                                <a href="javascript:void(0);" onclick="TN.baseHeader.answerFriendshipNotifs(\'Y\', this);" class="notifsReqAccept">accept</a>\
                                <a href="javascript:void(0);" onclick="TN.baseHeader.answerFriendshipNotifs(\'N\', this);" class="notifsReqReject">reject</a>\
                                ');
                        });
                        return "";
                    }
					var dataHtml = '\
	                    <li class="bottom-border">\
	                    	<input class="notificationId" type="hidden" value="' + notificationItem.messageId + '" />\
	                    	<div class="notifications-text">\
	                    		<div class="authorAndContent"> \
		                    		<a class="author-link" href="myPage.html?view=' + notificationItem.custId + '"><figure class="notifications-profile-img"><img class="avatar" width="36" height="36" src="' + notificationItem.thumbImageUrl + '" onload="TN.utils.normalizeImage(this, 36, 36);"/></figure></a>\
		                    		<a class="notification_content" href="'+ contentTypeTemplate(notificationItem.messageType) +'">'+ notificationItem.notificationMessage + '</a>\
									<span class="confirmControl">\
										'+( (notificationItem.messageType=="AcceptOrReject") ? "<input class=\"requestOriginator\" type=\"hidden\" value=\""+notificationItem.custId+"\" />":"" )+'\
				                        '+( (notificationItem.messageType=="AcceptOrReject") ? friendshipControls(notificationItem.custId):"" )+'\
				                    </span>\
				                </div> \
		                        <p class="story-time">'+ notificationItem.elapsedTime +'</p>\
	                    	</div>\
	                    </li>';
//					var dataHtml = '\
//						<li class="notification">\
//							<input class="notificationId" type="hidden" value="' + notificationItem.messageId + '" />\
//							<a href="myPage.html?view=' + notificationItem.email + '"><figure class="notifications-profile-img"><img class="avatar" width="36" height="36" src="' + notificationItem.thumbImageUrl + '" onload="TN.utils.normalizeImage(this, 36, 36);"/></figure></a>\
//							<a class="author-link" href="myPage.html?view=' + notificationItem.email + '">'+ notificationItem.firstname +'</a>\
//							<span class="notification_content"><a href="'+ contentTypeTemplate(notificationItem.messageType) +'">'+ notificationItem.notificationMessage + '</a></span>\
//							<span class="confirmControl">\
 //   							'+( (notificationItem.messageType=="AcceptOrReject") ? "<input class=\"requestOriginator\" type=\"hidden\" value=\""+notificationItem.email+"\" />":"" )+'\
  //  	                        '+( (notificationItem.messageType=="AcceptOrReject") ? friendshipControls(notificationItem.email):"" )+'\
//	                        </span>\
//	                        <p class="story-time">'+ notificationItem.elapsedTime +'</p>\
//						</li>';
					return dataHtml;
					
				}
				
				if( !!response && !!response[0] && !prependOnly ){
				    currNPage = pageNum;
					totalNPages = parseFloat(response[0].noOfPages);
                    notificationsNum = parseFloat(response[0].totalRecords); 
					if( !!response[0].notificationTrayList && response[0].notificationTrayList.length > 0 ){
					    var notifsReadCount = response[0].notificationTrayList.length;
						var notificationsHtml = "";
						$('#notifsShowMore').remove();
						for( var i = 0; i < notifsReadCount; i++ ) {
							notificationsHtml += getNotificationItemHtml(response[0].notificationTrayList[i]);
						}
						$('#notificationsList').append(notificationsHtml);
					}
				}
                else if ( !!response && !!response[0] && prependOnly ){
                    totalNPages = parseFloat(response[0].noOfPages);
                    notificationsNum = parseFloat(response[0].totalRecords); 
                    if( !!response[0].notificationTrayList && response[0].notificationTrayList.length > 0 ){
                        var notifsReadCount = response[0].notificationTrayList.length;
                        var notificationsHtml = "";
                        for( var i = 0; i < notifsReadCount; i++ ) {
                            notificationsHtml += getNotificationItemHtml(response[0].notificationTrayList[i]);
                        }
                        $('#notificationsList').prepend(notificationsHtml);
                    }
                }

			}
			
            if ( !prependOnly ){
                TN.services.getNotificationTrayDetails(5, pageNum).done(function(json){
                    populateNotificationsHtml(json);
                    if (currNPage != totalNPages) {
                        $('#notificationsList').append('<li id="notifsShowMore"><a href="#" class="notifications full-width" onclick="TN.loadMoreNotifications();"><span class="text-center">Show more</span></a></li>');
                    }
//                    oScrollbar.tinyscrollbar_update('relative');
                    notificationsLoaded = true;
                }).fail(function(){
                    $('#noNotifications').show();
                });
            }
            else {
                TN.services.getNotificationTrayDetails(prependNum, 1).done(function(json){
                    populateNotificationsHtml(json);
//                    oScrollbar.tinyscrollbar_update('relative');
                });
            }

		}
	    
		TN.loadMoreNotifications = function(){
			if( !!custId ){
				loadNotifications(currNPage+1);
			}
		};
	    
		// Popup menus and notifications' behavior:
//	    window.oScrollbar = $('#scrollbar1');
//	    oScrollbar.tinyscrollbar();
	    
//	    $('#headerNav ul li.add').hover(
//	        function(){
//	            $('#addstory').addClass('hoveredA');
 //               $('#addstory').parent().addClass('hovered');
//	        }
//	    );
	    
//	    $('#addstory, #addClipThis, #addfriend').parent().mouseenter(function(){
//	        $('#addstory').removeClass('hoveredA');
 //           $('#addstory').parent().removeClass('hovered');
//	    });
	    
//	    $('#headerNav ul li.user').hover(
//	        function(){
//	            $('#findFriendsLink').addClass('hoveredA');
 //               $('#findFriendsLink').parent().addClass('hovered');
//	        }
//	    );
	    
//	    $('#findFriendsLink, #workspaceLink, #profileLink, #settingsLink').parent().mouseenter(function(){
//            $('#findFriendsLink').removeClass('hoveredA');
//            $('#findFriendsLink').parent().removeClass('hovered');
//        });
	    
//	    $('#headerNav ul li.notifications').hover(
//	        function(){
 //               oScrollbar.tinyscrollbar_update('relative');
//                $('#id_newNotifiactionsNum').html('&nbsp');
//                uncheckedNotifs = 0;
//	        }
//	    );
        
        $('#signOut').click(function(){
           document.cookie = 'TNUser=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
           window.TN.userInfo = {};
           parent.location.href='./fw';
        });
        
	    $('#addstory').click(function(){ TN.createStory.show(); });

        $('.btn_findfriends, #findFriendsLink, #addfriend').click(function(){
            TN.baseHeader.findFriends();
        });

	    $('#addClipThis').click(function(){ 
		 	$("#clipThisLightbox-bg, #clipThisLightbox-panel").fadeIn(400); 
		 	$("#clipThisClose-panel").click(function(){
		 	     $("#clipThisLightbox-bg, #clipThisLightbox-panel").fadeOut(400);
		 	});
		 	$('#clipThisAnchor').attr('href', "javascript:void((function(){var s=document.createElement('script');s.type='text/javascript';s.src='http://" + TNServerAddress + "/php/clipthis.php?r='+Math.random()*99999999;document.body.appendChild(s);})())");
	    });
	    
	    function getclipThisInstHtml(){
	    	return ('\
	    			<div id="clipThisLightbox-bg"></div>\
	    			<div id="clipThisLightbox-panel"> \
	    		    <div id="clipThisHowTo"> \
	    		    <div id="clipThisHeader"> \
	    		        <div id="clipThisTitle"> \
	    		            <h1>Clip This How To</h1> \
	    		        </div> \
	    		        <div id="clipThisClose"> \
	    		            <a id="clipThisClose-panel" href="#"><img src="images/icons/close-button.png"/></a> \
	    		        </div> \
	    		    </div> \
	    		    <div id="clipThisAction"> \
	    		        <div id="clipThisButton"></div> \
	    		        <div id="clipThisCallToAction"> \
	    		            <a id="clipThisAnchor" href="#" onclick="return false;" title="Clip this">Clip this<img src="images/icons/clip-hover.png"/></a> \
	    		            <p>Add this link to your bookmark bar</p> \
	    		        </div> \
	    		    </div> \
	    		    <div id="clipThisInstructions" > \
	    		        <h3>For Chrome, Firefox, and Safari</h3> \
	    		            <ul> \
	    		            <li><h4>1.  Drag the "clip this" button to your browser \
	    		                Toolbar</h4></li> \
	    		            <li> <h4>2. When you are browsing the web, click the "Clip This" button to clip an \
	    		                    image</h4></li> \
	    		            </ul> \
	    		        <h3> For IE</h3> \
	    		            <ul> \
	    		                <li><h4>1. Display your Bookmarks Bar by clicking on<span> View > Toolbars > Bookmarks \
	    		                        Toolbar</span></h4></li> \
	    		            <li> <h4>2. Drag the "clip this" button to your browser \
	    		                Toolbar</h4></li> \
	    		            <li> <h4>3. When you are browsing the web, click the "Clip This" button to clip an \
	    		                    image</h4></li> \
	    		            </ul> \
	    		    </div> \
	    		</div> \
	    		</div>'
	    	);
	    }
	    
    	$('body').append(getclipThisInstHtml());
    	
        if (typeof custId === "undefined") {
            TN.utils.setHeader(false);
            TN.userInfo = {};
        }

        // Check to see if we are logged-in on server side:
        TN.services.pingServer().done(function(jqXHR){
            if (!!custId) {
                // Everything ok, considered logged in at this point:
                TN.services.loadUserInfo(custId, custId).done(function( msg ) {
                  TN.userInfo = msg[0];
                  TN.utils.setHeader(true);
				  $.getScript("js/socketClient.js");
                  $.getScript("js/lightbox-tool.js");
                });
                TN.services.keepThisSessionAlive();
                loadNotifications(1);
            }
            else {
                parent.location.href = './fw';
                TN.utils.setHeader(false);
                window.TN.userInfo = {};
            }
        }).fail(function(jqXHR, textStatus){
            if (jqXHR.status == 401) {
                document.cookie = 'TNUser=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                TN.utils.setHeader(false);
                TN.userInfo = {};
                parent.location.href = './fw';
            }
        });
        
	    
	};
}(TN.baseHeader));
