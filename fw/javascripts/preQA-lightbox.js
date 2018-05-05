if (!TN) var TN= {};
if (!TN.lightbox) TN.lightbox= {};

(function($lightbox){	
	
	var callback = null;
	var beingDisplayed = false;
		
	function showLightbox(custId, messageId, infoStruct, baseTopPos, baseLeftPos){
		var bodyElem = $('body');
		var lightboxCanvasElem = $('<div id="lightboxCanvas"></div>');
		
		function getLightboxHtml(){
			
			function getStoryCopy(){
				var itemDetailsBuzz = infoStruct.wsBuzz;
				var opEdItemHtml = "";
				
				if( !!itemDetailsBuzz ){
					if( !!itemDetailsBuzz.who ){
						opEdItemHtml += '<li>'+itemDetailsBuzz.who+'</li>';						
					}
					if( !!itemDetailsBuzz.when ){
						opEdItemHtml += '<li>'+itemDetailsBuzz.when+'</li>';						
					}
					if( !!itemDetailsBuzz.where ){
						opEdItemHtml += '<li>'+itemDetailsBuzz.where+'</li>';						
					}
					if( !!itemDetailsBuzz.what ){
						opEdItemHtml += '<li>'+itemDetailsBuzz.what+'</li>';						
					}
					if( !!itemDetailsBuzz.how ){
						opEdItemHtml += '<li>'+itemDetailsBuzz.how+'</li>';						
					}
					if( !!itemDetailsBuzz.why ){
						opEdItemHtml += '<li>'+itemDetailsBuzz.why+'</li>';						
					}
				}
				
				return ( !!opEdItemHtml ? '<ul class="storyCopy"' + opEdItemHtml + '</ul>' : '');
			}
							
			//temp
			var reclipsCount = 0;
						
			var lightboxHtml = '\
	    	<div id="lightbox" class="lightboxShadow"> \
	    		<input class="messageId" type="hidden" value="' + messageId + '"/> \
	    		<img id="closeButton" src="images/icons/close-button.png"/>\
	    		<div class="headline">'+(!!infoStruct.wsBuzz && !!infoStruct.wsBuzz.headline ? infoStruct.wsBuzz.headline : 'Test headline')+'</div> \
	    		<div class="storyImageCont">\
	    			<img class="storyImage" src="' + infoStruct.productImageUrl + '" alt="' + infoStruct.productImageUrl.substr(infoStruct.productImageUrl.search('picid')) + '"/> \
	    		</div> \
	    		<div class="authorCont"> \
	    			<img id="authorImage" src="' + infoStruct.originatorImageUrl + '"/> \
	    			<div class="authorInfo"> \
	    				<div class="byLinkGroup"><span class="by">by </span><span class="link">' + infoStruct.originatorName + '</span></div>\
		    			<img id="follow" src="images/icons/follow.png"/> \
	    				<br/> \
	    				<div class="dateTime">'+( !!infoStruct.wsMessage ? infoStruct.wsMessage.elapsedTime : '' )+'</div> \
	    			</div> \
		    		<ul class="analytics"> \
		    			<li class="likesCount"><span>' + infoStruct.favourCount + '</span> likes</li> \
		    			<li class="commentsCount"><span>' + infoStruct.messageResponseList.length + '</span> comments</li> \
		    			<li class="reclipsCount"><span>' + reclipsCount + '</span> reclips</li> \
	    			</ul> \
	    		</div>' +
	    		getStoryCopy(infoStruct) +
	    		TN.commentHandler.getCommentsHtml(infoStruct.messageResponseList) + 
    		'</div>';
		    return lightboxHtml;
		}
		
		if( !!infoStruct ){
			var refElem = $(window);
			var lightboxElem = $(getLightboxHtml());
			bodyElem.append(lightboxCanvasElem);
			bodyElem.append(lightboxElem);
			
			lightboxElem.find('.commentItemsCont').append(TN.commentHandler.getCommentBoxHtml());
			
			lightboxElem.find('.getAllComments').click(function(){
				var jqElem = $(this);
				TN.commentHandler.getAllComments(jqElem, lightboxElem);
			});
						
			lightboxCanvasElem.click(function(){
				$lightbox.close();
			});
			
			lightboxElem.find('#closeButton').click(function(){				
				$lightbox.close();
			});
		
			lightboxElem.find('#follow').hover(function(){
				$(this).attr('src', 'images/icons/follow-hover.png');
			}, function(){
				$(this).attr('src', 'images/icons/follow.png');
			});
			
			TN.commentHandler.addCommentBoxFunctions(lightboxElem);
			lightboxElem.imagesLoaded(function(){
				var lightboxElem = $('#lightbox');
				
				lightboxElem.css('top', baseTopPos)
				.css('left', baseLeftPos);		
								
				lightboxElem.animate({
					top:refElem.scrollTop(),
					left:refElem.scrollLeft() + (refElem.width()-lightboxElem.width()-150)/2,
					width:'+=150'
				},1000);
				
				lightboxElem.find('.storyImage,.commentItems,.commentItem,.getAllComments,.commentInputCont,.commentInputCont input').animate({
					width:'+=150'
				}, 1000, function(){
					$(this).data('fromOriginal', true);
					$('#lightbox .commentItems, #lightbox .commentItem' ).livequery(function(){
						var jqElem = $(this);
						if( !jqElem.data('fromOriginal') && !jqElem.data('widthUpdated') ){
							jqElem.css('width', jqElem.width()+150);
							jqElem.data('widthUpdated', true);
						}
					});
				});
				
				lightboxElem.find('.authorInfo').animate({
					//width:'+=20'
				}, 1000);				
				
				
				$('#clipNewsLikeCont').css('top', refElem.scrollTop() + lightboxElem.find('.storyImage').offset().top - lightboxElem.offset().top).
				//css('left', refElem.scrollLeft() + (refElem.width()-lightboxElem.width()-355)/2).
				css('z-index', parseFloat(lightboxElem.css('z-index'))+1).show();
			
				$('#tweetEmailFlagCont').css('top', refElem.scrollTop() + lightboxElem.find('.storyImage').offset().top - lightboxElem.offset().top).
				//css('left', refElem.scrollLeft() + (refElem.width()-lightboxElem.width()-150)/2 + lightboxElem.width() + 180 + 5).
				css('z-index', parseFloat(lightboxElem.css('z-index'))+1).show();
				
				$('#clipNews').unbind().hover(function(){
					$(this).attr('src', 'images/icons/clip-hover.png');
				}, function(){
					$(this).attr('src', 'images/icons/clip.png');
				});
				
				$('#like').unbind().hover(function(){
					$(this).attr('src', 'images/icons/like-hover.png');
				}, function(){
					$(this).attr('src', 'images/icons/like.png');
				}).click(function(){
					TN.likeHandler.processLikedIt(custId, messageId, function(){
						var likeCountElem = lightboxElem.find('.likesCount span');
						likeCountElem.html(parseFloat(likeCountElem.html())+1);				
						TN.utils.getDetailItem(messageId).favourCount++;
					});
				});
								
				$('#email').unbind().hover(function(){
					$(this).attr('src', 'images/icons/email-hover.png');
				}, function(){
					$(this).attr('src', 'images/icons/email.png');
				});
				
                $('#tweet').unbind().hover(function(){
					$(this).attr('src', 'images/icons/tweet-hover.png');
				}, function(){
					$(this).attr('src', 'images/icons/tweet.png');
				});


				$('#flag').unbind().hover(function(){
					$(this).attr('src', 'images/icons/flag-hover.png');
				}, function(){
					$(this).attr('src', 'images/icons/flag.png');
				});
				
			});
			
		}

	}
	
	$lightbox.show = function( custId, messageId, baseTopPos, baseLeftPos, callbackFunc ){
		
		if( beingDisplayed ){
			return;
		}
		
		beingDisplayed = true;
		
		var infoStruct = TN.utils.getDetailItem(messageId);
		
		callback = callbackFunc;
		
		//if infoStruct is passed, then use it else get infoStruct
		if( !!infoStruct ){
			showLightbox(custId, messageId, infoStruct, baseTopPos, baseLeftPos);
		}
		else {
			TN.services.getFittingRoomRequest(custId, messageId).done(function(json){
				showLightbox(custId, messageId, TN.utils.storeDetailItem(messageId, json[0]), baseTopPos, baseLeftPos);
			});
		}
	};
	
	$lightbox.close = function(){
		if( !!callback ){
			var lightboxElem = $('#lightbox');
			callback(parseFloat(lightboxElem.find('.likesCount span').html()), parseFloat(lightboxElem.find('.commentsCount span').html()));
		}
		
		$('#lightbox .commentItems, #lightbox .commentItem' ).expire();
		$('#lightbox').remove();
		$('#lightboxCanvas').remove();
		$('#clipNewsLikeCont').hide();
		$('#tweetEmailFlagCont').hide();
		
		beingDisplayed = false;
	};
	
}(TN.lightbox));

//Toggle off Animation
var toggleFx = function() {
      $.fx.off = !$.fx.off;
};
toggleFx();

