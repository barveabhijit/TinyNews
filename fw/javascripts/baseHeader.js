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
                    <li><a href="#"><img src="images/addfriend/email_img.gif" alt="email" title="Email"></a></li>\
                    <li><a href="#"><img src="images/addfriend/yahoo_img.gif" alt="yahoo" title="Yahoo"></a></li>\
                    <li><a href="#"><img src="images/addfriend/gmail_img.gif" alt="gmail" title="Gmail"></a></li>\
                    <li><a href="#"><img src="images/addfriend/fb_img.gif" alt="facebook" title="Facebook"></a></li>\
                    <li><a href="#"><img src="images/addfriend/twitter-img.gif" alt="twitter" title="Twitter"></a></li>\
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
            });
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
		//TN.homepage = false;
        var notificationsNum = 0;
        var notificationsLoaded = false;
        var uncheckedNotifs = 0;
        servAddressFetch = $.ajax({ type:'GET', dataType:'text', url:'/php/server_address.php' });
        servAddressFetch.done(function( msg ) {
            TNServerAddress = msg;
        });
        
        var imageUploaded = false;

        var pollNotifications = function() {
            if (notificationsLoaded) {
                TN.services.getNotificationTrayDetails(1, 1).done(function(json){
                    if (json[0].totalRecords > notificationsNum) {
                        var incomingNotifsN = parseFloat(json[0].totalRecords) - parseFloat(notificationsNum);
                        loadNotifications(1, true, incomingNotifsN);
                        uncheckedNotifs += incomingNotifsN;
                        $('#id_newNotifiactionsNum').text('['+uncheckedNotifs+']');
                        // console.log("incomingNotifsN: "+incomingNotifsN+" uncheckedNotifs: "+uncheckedNotifs);
                    }
                });
            }
            setTimeout(pollNotifications, 60000);
        };

        //setTimeout(pollNotifications, 60000);

		function loadNotifications(pageNum, prependOnly, prependNum) {

			function populateNotificationsHtml( response ){

				function getNotificationItemHtml(notificationItem){
				    
				    function contentTypeTemplate (messageType) {
                        if ((messageType == "FollowingRequest") || (messageType == "AcceptOrReject") || (messageType == "AcceptedFriendRequest")) {
                            return 'myPage.html?view=' + notificationItem.email;
                        }
                        else {
                            if (notificationItem.messageId == "") return 'javascript:alert(\'Missing message ID (a notification for a duplicate like?)\')';
                            else return 'javascript:TN.lightbox.show(\'' + custId + '\', ' + notificationItem.messageId + ')';
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
                                <input class="requestOriginator" type="hidden" value="' + notificationItem.email + '" />\
                                <a href="javascript:void(0);" onclick="TN.baseHeader.answerFriendshipNotifs(\'Y\', this);" class="notifsReqAccept">accept</a>\
                                <a href="javascript:void(0);" onclick="TN.baseHeader.answerFriendshipNotifs(\'N\', this);" class="notifsReqReject">reject</a>\
                                ');
                        });
                        return "";
                    }
                    
					var dataHtml = '\
						<li class="notification">\
							<input class="notificationId" type="hidden" value="' + notificationItem.messageId + '" />\
							<a href="myPage.html?view=' + notificationItem.email + '"><img class="avatar" width="36" height="36" src="' + notificationItem.thumbImageUrl + '" onload="TN.utils.normalizeImage(this, 36, 36);"/></a>\
							<a class="author-link" href="myPage.html?view=' + notificationItem.email + '">'+ notificationItem.firstname +'</a>\
							<span class="notification_content"><a href="'+ contentTypeTemplate(notificationItem.messageType) +'">'+ notificationItem.notificationMessage + '</a></span>\
							<span class="confirmControl">\
    							'+( (notificationItem.messageType=="AcceptOrReject") ? "<input class=\"requestOriginator\" type=\"hidden\" value=\""+notificationItem.email+"\" />":"" )+'\
    	                        '+( (notificationItem.messageType=="AcceptOrReject") ? friendshipControls(notificationItem.email):"" )+'\
	                        </span>\
	                        <p class="story-time">'+ notificationItem.elapsedTime +'</p>\
						</li>';
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
                        $('#notificationsList').append('<li id="notifsShowMore"><a href="#" onclick="TN.loadMoreNotifications();">Show more</a></li>');
                    }
                    oScrollbar.tinyscrollbar_update('relative');
                    notificationsLoaded = true;
                }).fail(function(){
                    $('#noNotifications').show();
                });
            }
            else {
                TN.services.getNotificationTrayDetails(prependNum, 1).done(function(json){
                    populateNotificationsHtml(json);
                    oScrollbar.tinyscrollbar_update('relative');
                });
            }

		}
	    
		TN.loadMoreNotifications = function(){
			if( !!custId ){
				loadNotifications(currNPage+1);
			}
		};
	    
		// Popup menus and notifications' behavior:
	    //window.oScrollbar = $('#scrollbar1');
	    //oScrollbar.tinyscrollbar();
	    
	    $('#headerNav ul li.add').hover(
	        function(){
	            $('#addstory').addClass('hoveredA');
                $('#addstory').parent().addClass('hovered');
	        }
	    );
	    
	    $('#addstory, #addClipThis, #addfriend').parent().mouseenter(function(){
	        $('#addstory').removeClass('hoveredA');
            $('#addstory').parent().removeClass('hovered');
	    });
	    
	    $('#headerNav ul li.user').hover(
	        function(){
	            $('#findFriendsLink').addClass('hoveredA');
                $('#findFriendsLink').parent().addClass('hovered');
	        }
	    );
	    
	    $('#findFriendsLink, #workspaceLink, #profileLink, #settingsLink').parent().mouseenter(function(){
            $('#findFriendsLink').removeClass('hoveredA');
            $('#findFriendsLink').parent().removeClass('hovered');
        });
	    
	    $('#headerNav ul li.notifications').hover(
	        function(){
                oScrollbar.tinyscrollbar_update('relative');
                $('#id_newNotifiactionsNum').html('&nbsp');
                uncheckedNotifs = 0;
	        }
	    );
        
        // This handles both sign-in and sign-out actions:
        $('#signInOutLink').click(function(){
           if (!!custId) {
               document.cookie = 'TNUser=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
               window.TN.userInfo = {};
               location.reload(); //parent.location.href='./';
               $('#signInOutLink').text('Sign In');
            }
            else $("#signInRegisterModal").reveal();
        });

        $('#username_input, #password_input').keyup(function(event){
            if( event.which === 13 ) {
                $('#signInButton').click();
            }
        });
        
        $('#signInButton').click(function(){
            var $form = $(this).parent().parent().parent();
            var $email_input = $form.find('input[name="username"]');
            var $pass_input = $form.find('input[name="password"]');
            if (!$email_input.val()) {
                $email_input.addClass('error');
                $('#usernameTicker').text('All Fields Are Required').show();
            }
            else if (!$pass_input.val()) {
                $pass_input.addClass('error');
                $('#passwordTicker').text('All Fields Are Required').show();
            }
            else {
                $email_input.removeClass('error'); 
                $pass_input.removeClass('error');
                $.ajaxSetup({ cache: false, dataType: 'json' });
                TN.services.loginCustomer('', $email_input.val(), $pass_input.val()).done(function(msg){
                    //console.log(typeof msg[0]);
                    if ( (typeof msg[0] === "number") || ((typeof msg[0] === "boolean") && (msg[0] === true)) ) {
                        TN.utils.setCookie("TNUser", $email_input.val(), null, 345600);
//                        window.location.href='./' + location.search; // 
                        location.reload();
                    }
                    else alert ("Error occured");
                }).fail(function(msg){
                    jQuery.each( msg, function(key, value){ if (key == "status") loginfail = value; });
                    if (loginfail == 401) $('#usernameTicker').text('Wrong credentials').show();
                    else if (loginfail == 500) $('#passwordTicker').text('Wrong credentials').show();
                    else alert ("Error occured");
                });
            }
        });
        
        $('#file').hide();
        
        // callback for ajaxSubmit:
        function showImageUrlResponse(responseText, statusText, xhr, $form) {
            $('#userPhoto').attr('src', responseText);
            imageUploaded = true;
        };
        
        // Store image and preview by copying given url to registration's image src attribute:
        var regPhotoSubmitOptions = {
            success: showImageUrlResponse,
            dataType:'text'
        };

        $("#file").change(function() {
            $('#photoForm').ajaxSubmit(regPhotoSubmitOptions  );
        });
        
    	$("#registerForm").submit(function(event) {
            event.preventDefault(); 
            var $form = $(this),
            	name_val = $form.find('input[name="username"]').val(),
            	email_val = $form.find('input[name="email"]').val(),
            	pass_val = $form.find('input[name="password"]').val();
            var photo_url;
            
            if ((typeof imageUploaded) !== "undefined") {
                if (imageUploaded === true) photo_url = $('#userPhoto').attr("src");
                else photo_url = "http://" + TNServerAddress + "/fw/images/no-photo.png";
            }
            else photo_url = "http://" + TNServerAddress + "/fw/images/no-photo.png";
            if ((!name_val) || (!email_val) || (!pass_val)) $('#registerTicker').text('All Fields Are Required').show();
            else {
                $('#registerTicker').html('<br>');
                TN.services.registerCustomer(email_val, pass_val, name_val, "Lastname", photo_url).done(function(msg){
                    if ((msg == null) || (msg === null)) $('#emailInUse').show();
                    else if (msg[0] == true) {
                        TN.utils.setCookie("TNUser", email_val, null, 345600);
                        TN.services.loginCustomer('', email_val, pass_val).done(function(){
                            TN.services.sendBuzzRequest(email_val, "Message Board", "Q", photo_url).done(function(){
//                                window.location.href='../' + location.search; // 
                                location.reload();
                            });
                        });
                    }
                    else alert ("Error occured during the registration process.");
                }).fail(function(msg){
                    if ((msg == null) || (msg === null)) alert ("Error occured during the registration process.");
                    else {
                        jQuery.each( msg, function(key, value){ if (key == "status") regfail = value; });
                        // log(msg);
                        if (regfail == 401) $('#emailInUse').show();
                        else if (regfail == 500) $('#registerTicker').text('All Fields Are Required');
                        else alert ("Error occured");
                    }
                });
            }
        });

        $('.btn_findfriends, #findFriendsLink, #addfriend').click(function(){
            TN.baseHeader.findFriends();
        });

	    $('#addClipThis').click(function(){ 
		 	$("#clipThisLightbox-bg, #clipThisLightbox-panel").fadeIn(400); 
		 	$("#clipThisClose-panel").click(function(){
		 	     $("#clipThisLightbox-bg, #clipThisLightbox-panel").fadeOut(400);
		 	});
		 	$('#clipThisAnchor').attr('href', "javascript:void((function(){var s=document.createElement('script');s.type='text/javascript';s.src='http://" + TNServerAddress + "/js/clipthis.js?r='+Math.random()*99999999;document.body.appendChild(s);})())");
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
            $('#signInOutLink').text('Sign In');
            TN.userInfo = {};
        }

        // Check to see if we are logged-in on server side:
        TN.services.pingServer().done(function(jqXHR){
            if (!!custId) {
                // Everything ok, considered logged in at this point:
                TN.services.loadUserInfo(custId, custId).done(function( msg ) {
                  TN.userInfo = msg[0];
                  $('#signInOutLink').text('Sign Out');
				  //$.getScript("js/socketClient.js");
                  $.getScript("javascripts/lightbox-tool.js");
                });
                TN.services.keepThisSessionAlive();
                //loadNotifications(1);
            }
            else {
                //if (!TN.homepage) parent.location.href = './';
                $('#signInOutLink').text('Sign In');
                window.TN.userInfo = {};
            }
        }).fail(function(jqXHR, textStatus){
            //if (jqXHR.status == 401) {
                document.cookie = 'TNUser=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                $('#signInOutLink').text('Sign In');
                TN.userInfo = {};
                //if (!TN.homepage) parent.location.href = './';
            //}
        });
        
	    
	};
}(TN.baseHeader));
