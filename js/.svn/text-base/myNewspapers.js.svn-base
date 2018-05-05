if(!TN) var TN = {};
if (!TN.myNewspapers) TN.myNewspapers = {};

(function($myNewspapers){

    var $container = $('#container');
    var npBoxesHtml = "";
    var currentItem = 0;
    var totalItems = 0;

    function getNewspapers( custId ){
        TN.services.getNewspapers (custId ).
            done(loadImageContainer);
    }

    function getNewspaper( npId ){
        TN.services.getNewspaper ( npId ).
            done(function(json){
            	if ( !!json && !!json[0] ) {
		    		if (!!json[0].stories[0]) npBoxesHtml += getNPItemHtml ( json[0] );
		    		currentItem++;
		    	}
		    	if (currentItem == totalItems) $container.append(npBoxesHtml).masonry('appended', $(npBoxesHtml));
            });
    }

	function getNPItemHtml( itemDetails ) {

		var npBoxHtml =  "";

		function subStories(){
			var subStoriesHtml = "";
			if (!!itemDetails.stories) {
				var numSubStories = itemDetails.stories.length > 5 ? 4 : (itemDetails.stories.length-1);
				for (var i=0; i<numSubStories; i++) {
					subStoriesHtml += '<li><a href="javascript:void(0)"> \
					 <div style="width:62px; height:62px; overflow:hidden"> \
					 <img src="' + (!!itemDetails.stories[i+1] ? itemDetails.stories[i+1].buzzThumbImageURL : "#") + '" onload="TN.utils.normalizeImage(this, 62, 62)" alt=""> \
					 </div></a></li>';
				}
			}
			return subStoriesHtml;
		}
        
        npBoxHtml = '<!--newspaperBox--> \
        <div class="newspaperBox item" style="cursor:pointer" onclick="TN.newspaperViewLB.init(' + itemDetails.id + ');" title="' + itemDetails.headline + ', ' + itemDetails.edition + '"> \
        	<div class="newspaperBox_header"> \
            	<img src="' + (!!itemDetails.stories[0] ? itemDetails.stories[0].buzzThumbImageURL : "#") + '" alt="" width="260"> \
            </div><!--/newspaperBox_header--> \
            <div class="newspaperBox_content block"> \
            	<ul class="newspaperBox_list"> \
                	' + subStories() + ' \
                </ul> \
            </div><!--/newspaperBox_content--> \
        </div><!--/newspaperBox-->';

        return npBoxHtml;

    }

    function loadImageContainer( json ){

        var itemCount = 0;

       	if(!!json && !!json[0]) {
       		totalItems = json.length;
       		for( var i = 0; i<totalItems; i++ ){
       			var currItem = json[i];
       			if (!!currItem) getNewspaper(currItem.id);
       		}
       	}
    }

    $myNewspapers.initialize = function(){

		var isFriend = false;
		var isFollowed = false;
		var pendingFriendship = false;
		var offeringFriendship = false;
		previouslyPlacedMessagesCount = 0;

		var placeMessages = function(d, listId) {
		    var placedMessagesCount = 0;
		    var delta = 0;
		    $.each(d, function(i,listItem) {
		        if (listItem.responseMessageBody == "") return;        
		        placedMessagesCount++;
		        if (placedMessagesCount > previouslyPlacedMessagesCount) {
		            var templateR = $('#messageBubbleRight').html();
		            var templateL = $('#messageBubbleLeft').html();
		            var viewParams = {
		                'message_text' : listItem.responseMessageBody,
		                'author' : listItem.responseCustomerName,
		                'elapsed_time' : listItem.elapsedTime,
		                'display_state' : ((placedMessagesCount < (numberOfComments-5)) ? "none" : "")
		            };
		            $(listId).prepend(Mustache.to_html(
		                ( (placedMessagesCount % 2) ? templateL : templateR ),
		                viewParams
		            ));
		            delta++;
		        }
		    });
		    previouslyPlacedMessagesCount += delta;
		    $('.userMsg').show();
		    if ($('.userMsg-block').filter(":hidden").size() > 0) $('#showAllMessages').show();
		    else $('#showAllMessages').hide();
		};

		var placeBubbles = function(jqXHR, s ) {
		    qTypeMessageId = jqXHR[0]['fittingRoomSummaryList'][0].messageId;
		    numberOfComments = jqXHR[0]['fittingRoomSummaryList'][0].comments;
		    //userId = jqXHR[0]['fittingRoomSummaryList'][0].wsBuzz.custid;
		    if (numberOfComments == 0) {
		        $('.userMsg').hide();
		        return;
		    }
		    else return placeMessages(jqXHR[0]['fittingRoomSummaryList'][0]['messageResponseList'], "#messageBlock");
		};

		var refreshBubbles = function () {
		    TN.services.getMyRequestSummaries(viewId, 1, 1, "Q").done(placeBubbles);
		    $('#messageTextarea').val("");
		    $('#userMsg').show();
		};

		function addComment(custId, msgId, commentText, successCallback){
		    $.ajax({
		        type:'POST',
		        cache:false,
		        data: {
		            action : "addFittingRoomResponse",
		            custid : custId,
		            msgresponse : JSON.stringify({
		                "type" : "Q", 
		                responseWords : commentText,
		                "messageId" : msgId,
		                isFavour : ""
		            })
		        },
		        url:'/salebynow/json.htm',
		        success:refreshBubbles,
		        error : function( jqXhr, textStatus, errorThrown ){
		            alert(errorThrown);
		        }
		    });
		};    	
		
		TN.baseHeader.initialize();

		jQuery.ajax({
	        url: "https://tinynews1.atlassian.net/s/en_USqwqzqv-418945332/812/101/1.2.7/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?collectorId=bc77cb6b",
	        type: "get",
	        cache: true,
	        dataType: "script"
	    });

	    TN.services.loadUserInfo(viewId, custId).done(function(msg){
	        $("#userFullName").text(msg[0].firstName+" "+msg[0].lastName);
	        $("#userFullName").text(msg[0].firstName + ( ( msg[0].lastName == "Lastname" ) ? "" : " " + msg[0].lastName ) );
	        $("#firstNameMsgs").text(msg[0].firstName+"’s messages");
	        $("#main_title").text(msg[0].firstName+"’S NEWSPAPERS");
	        $("#userImage").attr("src", msg[0].profileThumbPicUrl);
	        // If loading others' my page oped:
	        if (viewId != custId) {
	            if (msg[0].isFollowing == "Y") isFollowed = true;
	            if (msg[0].isFriend == "Y") isFriend = true;
	            if (msg[0].friendRequestType == "pending") pendingFriendship = true;
	            if (msg[0].friendRequestType == "acceptOReject") offeringFriendship = true;
	        }
	        // Initialize message board:
	        TN.services.getMyRequestSummaries(viewId, 1, 1, "Q").done(placeBubbles).fail(function() {
	            // Try to create message board:
	            $.when(servAddressFetch).then(function() {
	                var messageBoardImage = (!!msg[0].profileThumbPicUrl) ? msg[0].profileThumbPicUrl : '/images/LoginAndRegister/uploadPhoto-img.jpg';
	                TN.services.sendBuzzRequest(viewId, 'Message Board', 'Q', 'http://' + TNServerAddress + messageBoardImage)
	                    .done(function(){
	                        TN.services.getMyRequestSummaries(viewId, 1, 1, "Q").done(placeBubbles);
	                    }).fail(function(){
	                        log("Failed to create message board (Q type story)");
	                        $('.userMsg').hide();
	                    });
	            });
	        });
	    });

	    $('#sendMessageButton').click(function(event){
	        event.preventDefault();
	        message = $('#messageTextarea').val();
	        if (TN.utils.isBlank(message)) alert("Please enter a message");
	        else if (typeof qTypeMessageId === "undefined") alert("This is an old test account without messaging capabilities.");
	        else if ((viewId != custId) && !isFriend) alert("You can only leave message to friends.");
	        else addComment(custId, qTypeMessageId, message);
	    });
	    
	    $('#showAllMessages').click(function(event){
	        event.preventDefault();
	        $('.userMsg-block').show();
	        $('#showAllMessages').hide();
	    });

		$container.imagesLoaded(function(){
			$container.masonry({
				itemSelector : '.item',
				columnWidth : 0
		  	});
		});

        getNewspapers( viewId );

    };

}(TN.myNewspapers));