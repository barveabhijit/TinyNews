if (!TN) var TN= {};
if (!TN.lightBox) TN.lightBox= {};

(function($lightBox){		
	test("$lightBox variable validation", function(){
		ok(!!$lightBox, "$lightBox is a valid variable");
	} );
		
	function showLightbox(custId, messageId, infoStruct){
		var bodyElem = $('body');
		var lightboxCanvasElem = $('<div id="lightboxCanvas"></div>');
		
		test("showLightBox() - parameter validation", function(){
			ok(!!messageId, "messageId is valid");
			ok(!!custId, "custId is valid");
			ok(!!infoStruct, "infoStruct is valid");
		});
		
		function getLightboxHtml(){
			
			function getStoryCopy(){
				var opEdItemHtml = "";
				
				if( !!infoStruct.who ){
					opEdItemHtml += '<li>'+infoStruct.who+'</li>';						
				}
				if( !!infoStruct.when ){
					opEdItemHtml += '<li>'+infoStruct.when+'</li>';						
				}
				if( !!infoStruct.where ){
					opEdItemHtml += '<li>'+infoStruct.where+'</li>';						
				}
				if( !!infoStruct.what ){
					opEdItemHtml += '<li>'+infoStruct.what+'</li>';						
				}
				if( !!infoStruct.how ){
					opEdItemHtml += '<li>'+infoStruct.how+'</li>';						
				}
				if( !!infoStruct.why ){
					opEdItemHtml += '<li>'+infoStruct.why+'</li>';						
				}
				
				return ( !!opEdItemHtml ? '<ul class="storyCopy"' + opEdItemHtml + '</ul>' : '');
			}
							
			//temp
			var reclipsCount = 0;
			
		    var lightboxHtml = '\
		    	<div id="lightbox" class="lightboxShadow"> \
		    		<input class="messageId" type="hidden" value="' + messageId + '"/> \
		    		<div class="headline">'+infoStruct.wsBuzz.headline+'</div> \
		    		<div class="storyImageCont">\
		    			<img class="storyImage" src="' + infoStruct.productImageUrl + '" alt="' + infoStruct.productImageUrl.substr(infoStruct.productImageUrl.search('picid')) + '"/> \
		    		</div>\
		    		<div class="authorCont"> \
		    			<img src="' + infoStruct.originatorImageUrl + '"/> \
		    			<div class="authorInfo"> \
		    				<div class="byLinkGroup"><span class="by">by </span><span class="link">' + infoStruct.originatorName + '</span></div>\
		    				<br/> \
		    				<div class="dateTime">'+( !!infoStruct.wsMessage ? infoStruct.wsMessage.elapsedTime : '' )+'</div> \
		    			</div> \
		    		</div>' +
		    		getStoryCopy(infoStruct) +
		    		'<ul class="analytics"> \
		    			<li class="likesCount"><span>' + infoStruct.favourCount + '</span> likes</li> \
		    			<li class="commentsCount"><span>' + infoStruct.messageResponseList.length + '</span> comments</li> \
		    			<li class="reclipsCount"><span>' + reclipsCount + '</span> reclips</li> \
		    		</ul>' + 
		    		TN.commentHandler.getCommentsHtml(infoStruct.messageResponseList) + 
		    	'</div>';
		    return lightboxHtml;
		}
		
		if( !!infoStruct ){
			var refElem = $(window);
			var lightboxElem = $(getLightboxHtml());
			bodyElem.append(lightboxCanvasElem);
			bodyElem.append(lightboxElem);
			
			$('.commentItemsCont').append(TN.commentHandler.getCommentBoxHtml());
			TN.commentHandler.addCommentBoxFunctions(lightboxElem);
			lightboxElem.imagesLoaded(function(){
				test("lightbox image load check", function(){
					ok(true, "lightbox images are loaded");
				});
				
				lightboxElem.css('top', refElem.height()>=lightboxElem.height() ? (refElem.height()-lightboxElem.height())/2 : 0)
				.css('left', (refElem.width()-lightboxElem.width())/2);				
			});
			
		}

	}
	
	$lightBox.show = function( custId, messageId, infoStruct ){
		test("show() - parameter validation", function(){
			ok(!!messageId, "messageId is valid");
			ok(!!custId, "custId is valid");			
		});
		
		//if infoStruct is passed, then use it else get infoStruct
		if( !!infoStruct ){
			ok(!!infoStruct, "infoStruct is valid.  Calling showLightBox");
			showLightbox(custId, messageId, infoStruct);
		}
		else {
			test("infoStruct - parameter validation", function(){
				ok(!infoStruct, "infoStruct is not valid.  Calling getFittingRoomRequest");
			});
			
			TN.services.getFittingRoomRequest(custId, messageId).done(function(json){
				test("getFittingRoomRequest - parameter validation", function(){
	  				ok(true, 'getFittingRoomRequest success callback called');
	  				ok(!!json[0], 'json parameter is valid.  Calling showLightBox');
				});
				
				showLightbox(custId, messageId, json[0]);
			});
		}
	};
}(TN.lightBox));
