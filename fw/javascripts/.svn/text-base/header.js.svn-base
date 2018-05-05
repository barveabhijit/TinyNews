if (!TN) var TN= {};
if (!TN.header) TN.header= {};

(function($header){
	
	var custId = TN.utils.getCookie('TNUser');
    var totalNPages = 0;
	var currNPage = 0;
    var notificationsNum = 0;
    var notificationsLoaded = false;
    var uncheckedNotifs = 0;

    function loadNotifications(pageNum, loadAll, prependOnly, prependNum) {

		function populateNotificationsHtml( response ){

			function getNotificationItemHtml(notificationItem){
			    
			    function contentTypeTemplate (messageType) {
	                if ((messageType == "FollowingRequest") || (messageType == "AcceptOrReject") || (messageType == "AcceptedFriendRequest")) {
	                    return '../myPage.html?view=' + notificationItem.custId;
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
	                        <a href="javascript:void(0);" onclick="TN.header.answerFriendshipNotifs(\'Y\', this);" class="notifsReqAccept">accept</a>\
	                        <a href="javascript:void(0);" onclick="TN.header.answerFriendshipNotifs(\'N\', this);" class="notifsReqReject">reject</a>\
	                        ');
	                });
	                return "";
	            }
	            
	            if( loadAll ){
					var dataHtml = '\
	                    <li">\
		                    <a href="../myPage.html?view=' + notificationItem.custId + '"><figure class="notifications-profile-img"><img width="36" height="36" src="' + notificationItem.thumbImageUrl + '" onload="TN.utils.normalizeImage(this, 36, 36);"/></figure></a>\
		                    <a class="author left" href="'+ contentTypeTemplate(notificationItem.messageType) +'">'+ notificationItem.notificationMessage + '</a><br/><span class="post-time">'+ notificationItem.elapsedTime +'</span>\
	                    </li>\
		                <li class="divider"></li>';
					return dataHtml;	            	
	            }
	            else {
					var dataHtml = '\
	                    <li class="bottom-border">\
		                    <a class="author" href="../myPage.html?view=' + notificationItem.custId + '"><figure class="notifications-profile-img"><img width="36" height="36" src="' + notificationItem.thumbImageUrl + '" onload="TN.utils.normalizeImage(this, 36, 36);"/></figure></a>\
		                    <span class="notifications-text"><a style="white-space:normal;" href="'+ contentTypeTemplate(notificationItem.messageType) +'">'+ notificationItem.notificationMessage + '</a></span></p>\
	                    </li>';
					return dataHtml;
	            }				
			}
			
			if( !!response && !!response[0] ){
				if( loadAll ){
				    currNPage = pageNum;
					totalNPages = parseFloat(response[0].noOfPages);
	                notificationsNum = parseFloat(response[0].totalRecords); 
					if( !!response[0].notificationTrayList && response[0].notificationTrayList.length > 0 ){
					    var notifsReadCount = response[0].notificationTrayList.length;
						var notificationsHtml = "";
						for( var i = 0; i < notifsReadCount; i++ ) {
							notificationsHtml += getNotificationItemHtml(response[0].notificationTrayList[i]);
						}
						$('#allNotificationsList').append(notificationsHtml);
						if( currNPage < totalNPages ){
							loadNotifications(currNPage+1, true );
						}
					}					
				}
				else {
					if( !prependOnly ){
					    currNPage = pageNum;
						totalNPages = parseFloat(response[0].noOfPages);
		                notificationsNum = parseFloat(response[0].totalRecords); 
						if( !!response[0].notificationTrayList && response[0].notificationTrayList.length > 0 ){
						    var notifsReadCount = response[0].notificationTrayList.length;
							var notificationsHtml = "";
//							$('#notifsShowAll').remove();
							for( var i = 0; i < notifsReadCount; i++ ) {
								notificationsHtml += getNotificationItemHtml(response[0].notificationTrayList[i]);
							}
							$('#notificationsList').append(notificationsHtml);
						}
					}
					
					if (prependOnly) {
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
			}
		}
		
        TN.services.getNotificationTrayDetails(custId, 5, pageNum).done(function(json){
            populateNotificationsHtml(json);
            if ( !prependOnly && !loadAll ){
                if (currNPage != totalNPages) {
                    $('#notificationsList').append('<li id="notifsShowAll"><a href="#" class="notifications full-width" onclick="TN.header.loadAllNotifications();"><span class="text-center">See All</span></a></li>');
                }
            }
            notificationsLoaded = true;
        }).fail(function(){
            $('#noNotifications').show();
        });
	}
	
    
    $header.answerFriendshipNotifs = function(answer, sourceElem) {
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
    
    $header.loadAllNotifications = function(){
    	$('#allNotificationsList').empty();
    	$('#NotificationsModal').reveal();
    	loadNotifications(1, true);
    };
    
    function loadHeader(){
    	var headerHtml = '<div class="top-bar contain-to-grid">\
    		<div class="row">\
    			<div class="twelve">\
    				<ul class="left">\
    					<li class="name"><a href="index.html" class="logo"></a></li>\
    				</ul>\
    				<section>\
    					<ul class="right">\
    						<li><a href="../">See What\'s Happening</a></li>\
    						<li><a href="javascript:void(0);" id="addStory">Post a Story</a></li>\
    						<li><a href="newspaper.html">Make a Newspaper</a></li>\
    						<li><a href="stories.html">Check Out Stories</a></li>\
    						<li class="has-dropdown">\
    							<a class="active" href="../myPage.html">MyPage</a>\
    							<ul class="dropdown">\
    								<li id="myNamePage"><a href="../myPage.html"></a></li>\
    								<li><a id="addClipThis" href="javascript:void(0);">Add Post It Button</a></li>\
    								<li><a href="../settings.html">Settings</a></li>\
    								<li><a href="javascript:void(0);" id="signOut">Sign out</a></li>\
    								<li class="has-dropdown">\
    									<a href="#">Notifications</a>\
    									<ul class="dropdown" id="notificationsList">\
    										<li id="noNotifications" style="display: none"><a href="#" class="notifications full-width"><span class="text-center">You have currently no notifications.</span></a></li>\
    									</ul>\
    								</li>\
    							</ul>\
    						</li>\
    					</ul>\
    				</section>\
    			</div>\
    		</div>\
    	</div>'
    	
    	$('header').append(headerHtml);
    }
    
    function loadNotificationsModal(){
    	var notifModalHtml = '<div id="NotificationsModal" class="reveal-modal notificationsSrollbar">\
    							<h2>Notifications</h2>\
    							<div class="row">\
    								<div class="twelve columns">\
    									<ul id="allNotificationsList" class="side-nav"></ul>\
    								</div>\
    							</div>\
    							<a class="close-reveal-modal"></a>\
    						</div>';
    	$('body').append(notifModalHtml);
    }
    
	$header.initialize = function(){
		loadHeader();
		loadNotificationsModal();
		
		custId = TN.utils.getCookie('TNUser');
		var TNServerAddress = null;        
		
    	TN.services.getServerAddress().done(function(msg){
    		TNServerAddress = msg;
    	});   
        
	    $('#addStory').click(function(){ TN.createStory.show(); });
	    
        $('#signOut').click(function(){
            document.cookie = 'TNUser=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.TN.userInfo = {};
            custId = null;
            window.location.href='index.html';
         });
                
	    function getclipThisInstHtml(){
	    	return ('<div id="clipThisLightbox-bg"></div>\
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

	    $('#addClipThis').click(function(){
		 	$("#clipThisLightbox-bg, #clipThisLightbox-panel").fadeIn(400); 
		 	$("#clipThisClose-panel").click(function(){
		 	     $("#clipThisLightbox-bg, #clipThisLightbox-panel").fadeOut(400);
		 	});
		 	$('#clipThisAnchor').attr('href', "javascript:void((function(){var s=document.createElement('script');s.type='text/javascript';s.src='http://" + TNServerAddress + "/php/clipthis.php?r='+Math.random()*99999999;document.body.appendChild(s);})())");
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
                TN.services.getNotificationTrayDetails(custId, 1, 1).done(function(json){
                    if (json[0].totalRecords > notificationsNum) {
                        var incomingNotifsN = parseFloat(json[0].totalRecords) - parseFloat(notificationsNum);
                        loadNotifications(1, false, true, incomingNotifsN);
                        uncheckedNotifs += incomingNotifsN;
                        $('#id_newNotifiactionsNum').text('['+uncheckedNotifs+']');
                        // log("incomingNotifsN: "+incomingNotifsN+" uncheckedNotifs: "+uncheckedNotifs);
                    }
                });
            }
            setTimeout(pollNotifications, 60000);
        }

        setTimeout(pollNotifications, 60000);
        
//        TN.services.pingServer().done(function(jqXHR){
            if (!!custId) {
                // Everything ok, considered logged in at this point:
                TN.services.loadUserInfo(custId, custId).done(function( msg ) {
                  TN.userInfo = msg[0];
      	 		$('#myNamePage').find('a').text(TN.userInfo.firstName + "'s Page");
 //                 TN.utils.setHeader(true);
//				  $.getScript("js/socketClient.js");
                });
                TN.services.keepThisSessionAlive();
                loadNotifications(1);
            }
            else {
                parent.location.href = 'index.html';
//                TN.utils.setHeader(false);
                window.TN.userInfo = {};
            }
//        }).fail(function(jqXHR, textStatus){
//            if (jqXHR.status == 401) {
//                document.cookie = 'TNUser=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//                TN.utils.setHeader(false);
//                TN.userInfo = {};
//                parent.location.href = 'index.html';
//            }
 //       });
        

	};
})(TN.header);