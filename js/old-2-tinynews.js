function TN(){
}

(function($TN){
		
	var imageContainer = null;
	var loadingBar = null;
	var imageLoadPending = false;
	var custId = 388;
	
	function processLikedIt(custId, msgId, successCallback){
		var postData = 'action=addFittingRoomResponse&custid='+custId+'&msgresponse=\
		{"type":"HowDoesThisLook",\
		 "responseWords":"",\
		 "messageId":"'+ msgId + '",\
		 "isFavour":"Y"}';
		$.ajax({
			type:'POST',
			cache:false,
			data:postData,
			url:'/salebynow/json.htm',
			success:successCallback,
			error : function( jqXhr, textStatus, errorThrown ){
				alert(errorThrown);
			}
		});
	}
	
	function likedIt(containerElem){
		function updateLikedCount(){
			var favCountElem = containerElem.find('.favCount');
			favCountElem.html(parseFloat((favCountElem.html()))+1);
		}
		
		processLikedIt(custId, containerElem.find('.messageId').val(), updateLikedCount);
	}
	
	function addComment(custId, msgId, commentText, successCallback){
		var postData = 'action=addFittingRoomResponse&custid='+custId+'&msgresponse=\
		{"type":"HowDoesThisLook",\
		 "responseWords":"' + commentText + '",\
		 "messageId":"'+ msgId + '",\
		 "isFavour":""}';
		$.ajax({
			type:'POST',
			cache:false,
			data:postData,
			url:'/salebynow/json.htm',
			success:successCallback,
			error : function( jqXhr, textStatus, errorThrown ){
				alert(errorThrown);
			}
		});
	}
	
	function getCommentBoxHtml(){
		return('<div class="commentsDetail">\
					<input class="commentsInputBox" type="search" placeholder="Write a comment..."/>\
				</div>');						
	}
	
	function getCommentItemsHtml(commentsArray){
		var commentItemsHtml = '<div class="commentItems">';
		var commCount = 0;
		
		if( !!commentsArray ){
			var commArrayCount = commentsArray.length;
			for( var i = 0; i < commArrayCount; i++ ){
				var currComment = commentsArray[i];
				if( !!currComment.responseMessageBody ){
					commCount++;
					commentItemsHtml += '\
						<br>\
						<span class="commentItem">\
							<img src="'+currComment.thumbCustomerUrl+'"/>\
							<span class="author">'+currComment.responseCustomerName+'</span>\
							<br>\
							<span class="comment">'+currComment.responseMessageBody+'</span>\
							<br>\
							<br>\
							<span class="elapsedTime">'+currComment.elapsedTime+'</span>\
						</span>';
				}
			}
		}
		
		commentItemsHtml += '</div>';
		
		return ({ html : commentItemsHtml, count : commCount });
	}
	
	
	function addCommentBoxFunctions(parentElem){
		var msgId = parentElem.find('.messageId').val();
		var commentBoxElem = parentElem.find('.commentsInputBox');
				
		commentBoxElem.keyup(function(event){
				var jqElem = $(this);
				if( event.which === 13 ){
					addComment(custId, msgId, jqElem.val(), 
						function(){
							if( parentElem.hasClass('popupImageItem')){
								//reload the comments
								popup.reloadComments();
								jqElem.val('');
							}
							else {
								var commCountElem = parentElem.find('.commCount');
								commCountElem.html(parseFloat(commCountElem.html())+1);
								parentElem.find('.commentsDetail').remove();
								imageContainer.masonry();					
							}
						}
					);
				}
			});
	}
	
	function placeHolderSetup(elem){
		var placeholderVal = elem.attr('placeholder');
		elem.addClass('placeholder').val(placeholderVal);
		
		elem.focus(function(){
				if( elem.hasClass('placeholder') ){
					elem.removeClass('placeholder').val('');
				}
			}).blur( function(){
				if( elem.val().length === 0 ){
					elem.addClass('placeholder').val(placeholderVal);
				}
			} );			
	}
	
	var createStoryPopup = {};
	(function($createStoryPopup){
		var csPopupElem = $('#createStoryPopup');
		var refElem = $(window);

		$createStoryPopup.show = function(){
			$('#createStoryPopupCanvas').show();
			
			csPopupElem.css('top', refElem.height()>=csPopupElem.height() ? (refElem.height()-csPopupElem.height())/2 : 0)
			.css('left', (refElem.width()-csPopupElem.width())/2)
			.show();
		};
		
		$createStoryPopup.close = function(){
			$('#createStoryPopup').hide();
			$('#createStoryPopupCanvas').hide();
		};		
	}(createStoryPopup));
	
	var popup = {};
	(function($popup){
		
		var popupElem = null;
		var msgId = null;
				
		function popupClose() {
			var backgroundElem = $('.popupCanvas');
			backgroundElem.find('.popupImageItem').empty();
			backgroundElem.hide();
			$('body').css({overflow:'auto'});
		};
		
		function  popupClicked(){
			return false;
		}
		
		function getItemDetails(custId, successCallback){
			$.ajax({
				type: 'GET',
				cache: false,
				data: 'action=getFittingRoomRequest&custid=' + custId + '&msgid=' + msgId,
				url : '/salebynow/json.htm',
				dataType : 'json',
				success : successCallback,
				error : function( jqXhr, textStatus, errorThrown ){
					alert(errorThrown);
				}
			});						
		}
		
		function getPopupHtml(json, containerClass){
			var jsonElem = json[0];
			var popupHtml = "";
			
			if( !!jsonElem ){
				var productImageUrl = jsonElem.productImageUrl;
				var favCount = jsonElem.favourCount;
				var dateStr = ( !!jsonElem.wsMessage && !!jsonElem.wsMessage.dateStr ? jsonElem.wsMessage.dateStr : '3/23' );
				var itemDetails = jsonElem.wsBuzz;
				var who = (!!itemDetails && !!itemDetails.who ? itemDetails.who : 'Who' );
				var when = (!!itemDetails && !!itemDetails.when ? itemDetails.when : 'When' );
				var where = (!!itemDetails && !!itemDetails.where ? itemDetails.where : 'Where' );
				var what = (!!itemDetails && !!itemDetails.what ? 'What? ' + itemDetails.what : 'What' );
				var how = (!!itemDetails && !!itemDetails.how ? 'How? ' + itemDetails.how : 'How' );
				var why = (!!itemDetails && !!itemDetails.why ? 'Why? ' + itemDetails.why : 'Why' );
				
				var commentItems = getCommentItemsHtml(jsonElem.messageResponseList);
				var commentsDetailHtml = getCommentBoxHtml() + commentItems.html;		
				
				popupHtml = '\
		    		<input class="messageId" type="hidden" value="' + msgId + '"/> \
		    		<div class="header"> \
		    			<span class="imageTitle">Test Title</span> \
		    			<span class="clockText"><img src="images/clock_icon.png"/><span class="dateStr">' + dateStr + '</span></span> \
		    		</div> \
		    		<div class="popupImage"><img src="' + productImageUrl + '" alt="' + productImageUrl.substr(productImageUrl.search('picid')) + '"/></div> \
					<div class="itemDetails">\
						<span class="who">' + who + '</span><span class="whenWhere"><span class="when">' + when + ', </span><span class="where">' + where + '</span></span>\
						<br>\
						<div class="what">' + what + '</div>\
						<br>\
						<div class="how">' + how + '</div>\
						<br>\
						<div class="why">' + why + '</div>\
						<br>\
					</div>\
					<br>\
		    		<div class="footer"> \
		    			<span class="likeAndCommentBtn"><img src="images/like_btn.png" onclick="TN.likeBtnClick(this, \'' + containerClass + '\')"/></span> \
				    	<span class="favAndComm"><img src="images/favorite_icon.png"/><span class="favCount"> ' + favCount + ' </span><img src="images/comments_icon.png"/><span class="commCount"> ' + commentItems.count + ' </span></span> \
		    		</div>' + commentsDetailHtml;
			}
			return popupHtml;
		}
		
		function populateDetails(json){
			var itemDetailsHtml = getPopupHtml(json, 'popupImageItem');
			
			if( !!itemDetailsHtml ){
				imageLoadPending = true;
				var refElem = $(window);
				
				var popupCanvas = $('.popupCanvas');
				popupElem = popupCanvas.find('.popupImageItem');
				
				popupElem.empty();
				
				popupElem.append(itemDetailsHtml);
				
				addCommentBoxFunctions(popupElem);
				
				$(document).keyup(function(event){
					if( event.which === 27 ){
						popupClose();
					}
				});
													
				popupCanvas.click( popupClose );
				
				popupElem.imagesLoaded(function(){
					popupCanvas.show();
					popupElem.css('top', refElem.height()>=popupElem.height() ? (refElem.height()-popupElem.height())/2 : 0)
					.css('left', (refElem.width()-popupElem.width())/2)
					.click(popupClicked)
					.show();
					$('body').css({overflow:'hidden'});
					imageLoadPending = false;
					$TN.hideLoadingBar();
				});
			}
		}			
		
		$popup.show = function(messageId){								
			msgId = messageId;
						
			getItemDetails(custId,  populateDetails);			
		};
		
		$popup.showAsBalloon = function( messageId, baseMap, baseMarker ){
			function populateBalloon( json ){
				var balloonContainer = $('<div></div>');
				var balloonDetailsElem = $('<div class="mapMarkerBalloon"></div>');
				balloonDetailsElem.append(getPopupHtml(json, "mapMarkerBalloon"));
				
				if( !!balloonDetailsElem ){
					
					addCommentBoxFunctions(balloonDetailsElem);
					
					balloonDetailsElem.imagesLoaded(function(){
						balloonContainer.append(balloonDetailsElem);
						var balloonHtml = balloonContainer.html();
						var infoWindow = new google.maps.InfoWindow({ content: balloonHtml});
						infoWindow.open(baseMap, baseMarker);
					});
				}
			}
			
			msgId = messageId;
			
			getItemDetails(custId,  populateBalloon);			
			
		};
		
		$popup.reloadComments = function(){
			var commentItemsContainer = $('.commentItems');
			getItemDetails(custId, function(json){
				var jsonElem = json[0];
				if( !!jsonElem ){
					var commentItems =  getCommentItemsHtml(jsonElem.messageResponseList);
					commentItemsContainer.empty();
					commentItemsContainer.append(commentItems.html);					
					popupElem.find('.commCount').html(commentItems.count);					
				}				
			});
		};
		
	}(popup));

	var mapsHandler = {};
	(function($mapsHandler){
		var apiKey = 'AIzaSyC3JpD-ZB_NgciJjjPDaz5u9G11vs37Czc';
		var scriptLoaded = false;
		var mapCanvas = $('#map_canvas');
		var mapObject = null;
		var latLongArray = null;
		
		function addMarkerToMap( latLng ){
			  return( new google.maps.Marker({     
				  position: latLng,     
				  map: mapObject  }) );
		}
		
		function setMarkers(){
			var pageNum = 1;
			var maxPages = 1;
			
			function loadMarkers( json ){
				if( json && json[0] ){
					maxPages = parseFloat( json[0].noOfPages );
					if( json[0].fittingRoomSummaryList ){
						var numItems = json[0].fittingRoomSummaryList.length;
						for( var i = 0; i<numItems; i++ ){
							var currItem = json[0].fittingRoomSummaryList[i];
							if( !!currItem.latitude && !!currItem.longitude && !!currItem.messageId){
								if( !latLongArray ){
									latLongArray = [];
								}
								latLongArray[currItem.latitude] = [];
								latLongArray[currItem.latitude][currItem.longitude] = {};
								latLongArray[currItem.latitude][currItem.longitude].messageId = currItem.messageId;
								
								var marker = addMarkerToMap(new google.maps.LatLng(currItem.latitude,currItem.longitude));
								
								google.maps.events.addListener(marker, 'click', function(){
									popup.showAsBalloon(currItem.messageId, mapObject, marker);
								});
							}
						}
						if( pageNum < maxPages ){
							pageNum++;
							getAllRequestSummaries(pageNum, loadMarkers);
						}
					}
				}				
			}
			
			function getAllRequestSummaries( currPageNum, successCallback ){
				$.ajax({
					type: 'GET',
					cache: false,
					data: 'action=getAllRequestSummaries&custid=99&type=buyitornot&num=25&pagenum=' + currPageNum,
					url : '/salebynow/json.htm',
					dataType : 'json',
					success : successCallback,
					error : function( jqXhr, textStatus, errorThrown ){
						var status = textStatus;
					}
				});						
			}
			
			getAllRequestSummaries( pageNum, loadMarkers );			
		}
		
		$mapsHandler.getApiKey = function(){
			return apiKey;
		};
		
		$mapsHandler.show = function(){
			function showMap() {  
				var latLng =  new google.maps.LatLng(37.4419, -122.1419);
				var myOptions = {    
					zoom: 6,    
					center: latLng,    
					mapTypeId: google.maps.MapTypeId.ROADMAP};
				
				mapCanvas.show();
				mapObject = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
//				setMarkers();
				var tempMarker = addMarkerToMap(latLng);
				
				google.maps.event.addListener(tempMarker, 'click', function(){
//					popup.showAsBalloon(3476, mapObject, tempMarker);
					popup.show(3476);
				});
			}
			
			$TN.showMap = function(){
				scriptLoaded = true;
				showMap();
			};			
			
			function loadScript() {  
				var script = document.createElement('script');  
				script.type = 'text/javascript';  
				script.src = 'http://maps.googleapis.com/maps/api/js?key=' + apiKey + '&sensor=true&callback=TN.showMap';  
				document.body.appendChild(script);
			}
			
			if( !scriptLoaded ){
				loadScript();
			} else {
				showMap();
			}
		};
		
		$mapsHandler.hide = function(){
			mapCanvas.hide();
			delete mapObject;
		};
		
	}(mapsHandler));
	
	var topStories = {};
	(function($topStories){
		var pageNum = 1;
		var maxPages = 1;
		
		function loadImageContainer( json ){
									
			function getImageItemHtml(imageSource, author, favourCount, commentsCount, messageId){
				//Temp hard coding
				if( !favourCount ){
					favourCount = 100;
				}
				
				if( !commentsCount ){
					commentsCount = 100;
				}
				
			    var imageItemHtml = '\
			    	<div class="imageItem imageItemBoxShadow"> \
			    		<input class="messageId" type="hidden" value="' + messageId + '"/> \
			    		<div class="header"> \
			    			<span class="imageTitle">Test Title</span> \
			    			<span class="clockText"><img src="images/clock_icon.png"/><span class="dateStr">03/23</span></span> \
			    		</div> \
			    		<div class="authorInfo">By <strong>' + author + '</strong></div> \
			    		<div class="image"><img src="' + imageSource + '" alt="' + imageSource.substr(imageSource.search('picid')) + '"/></div> \
			    		<div class="footer"> \
			    			<span class="likeAndCommentBtn"><img class="likeBtn" src="images/like_btn.png"/><img class="commentBtn" src="images/comment_btn.png"" /></span> \
					    	<span class="favAndComm"><img src="images/favorite_icon.png"/><span class="favCount"> ' + favourCount + ' </span><img src="images/comments_icon.png"/><span class="commCount"> ' + commentsCount + ' </span></span> \
			    		</div> \
			    	</div>';
			    return imageItemHtml;
			}
						
			if( json && json[0] ){
				
				maxPages = parseFloat(json[0].noOfPages);
				
				if( json[0].fittingRoomSummaryList  ){
					
					function removeCommentBox(imageItemElem){
						imageItemElem.find('.commentsDetail').remove();
						imageItemElem.data('commentBoxOpen', false);					
						imageContainer.masonry();									
					}

					var numItems = json[0].fittingRoomSummaryList.length;
					var imagesHtml = "";
					for( var i = 0; i<numItems; i++ ){
						var currItem = json[0].fittingRoomSummaryList[i];
						if(!!currItem.senderThumbImageUrl ){
							imagesHtml += getImageItemHtml(currItem.senderThumbImageUrl, currItem.senderName, currItem.favourCount, currItem.commentsCount, currItem.messageId);
						}
					}			
					
					if( pageNum === 1 ){
						imageContainer.append($(imagesHtml)).imagesLoaded( function() {
							imageContainer.masonry({
								itemSelector : '.imageItem',
								columnWidth : 225
							});
							imageLoadPending = false;
							$TN.hideLoadingBar();
						});					
						
						$('.image').livequery('click', function(){
							var imageItemElem = $(this).parents('.imageItem');
							if( !!imageItemElem.data('commentBoxOpen') ){
								removeCommentBox(imageItemElem);
							}
							popup.show(imageItemElem.find('.messageId').val());
						});
						
						$('.likeBtn').livequery('click', function(){
							likedIt($(this).parents('.imageItem'));
						});
						
						$('.commentBtn').livequery('click', function(){
							var imageItemElem = $(this).parents('.imageItem');

							var commentBoxOpen = imageItemElem.data('commentBoxOpen');
							
							if( !!(commentBoxOpen) ){
								removeCommentBox(imageItemElem);
							} else {
								imageItemElem.append(getCommentBoxHtml());
								addCommentBoxFunctions(imageItemElem);					
								imageItemElem.data('commentBoxOpen', true);					
								imageContainer.masonry();					
							}				
						});
						
					}
					else{
						var imagesHtmlElem = $(imagesHtml);
						imageContainer.append(imagesHtmlElem).imagesLoaded( function() {
							imageContainer.masonry('appended', imagesHtmlElem);
							imageLoadPending = false;
							$TN.hideLoadingBar();
						});					
					}
				}
			}
		}
		
		function loadItems(){
			$.ajax({
				type: 'GET',
				cache: false,
				data: 'action=getAllRequestSummaries&custid=99&type=buyitornot&num=25&pagenum=' + pageNum,
				url : '/salebynow/json.htm',
				dataType : 'json',
				success : function(json) {
					imageLoadPending = true;
					loadImageContainer(json);
				},
				error : function( jqXhr, textStatus, errorThrown ){
					var status = textStatus;
				}
			});						
		};
		
		$topStories.show = function(){
			imageContainer.show();
			loadItems();
			
		};
		
		$topStories.hide = function(){
			imageContainer.masonry('destroy').empty().hide();
			pageNum = 1;
			maxPages = 1;
		};
		
		$(window).scroll( function() {
			if (( $(window).scrollTop() >= $(document).height() - $(window).height() - 10 ) && imageContainer && imageContainer.is(':visible')) { 
				if( pageNum < maxPages ){
					pageNum++;
					loadItems();
				}
			}
		});
		
	}(topStories));
	
	var featuredStories = {};
	
	(function($featuredStories){
		
		function loadFeaturedContainer(json){
			if( json && json[0] ){				
				if( json[0].fittingRoomSummaryList  ){

					var numItems = json[0].fittingRoomSummaryList.length;
					for( var i = 0; i<numItems; i++ ){
						var currItem = json[0].fittingRoomSummaryList[i];
						var imageSource = currItem.senderThumbImageUrl;
						if(!!imageSource ){
							var featuredImage = $('#featuredImage' + (i+1).toString());
							featuredImage.attr('src', imageSource).attr('alt', imageSource.substr(imageSource.search('picid')));
							featuredImage.data('messageId', currItem.messageId);
							featuredImage.click(
									function(){
										popup.show($(this).data('messageId'));
									});
//							$('#featuredImage' + (i+1).toString()).attr('src', imageSource).attr('alt', imageSource.substr(imageSource.search('picid')));
						}
					}
				}
			}			
		}
		
		function loadFeaturedStories() {
			$.ajax({
				type: 'GET',
				cache: false,
				data: 'action=getAllRequestSummaries&custid=99&type=buyitornot&num=6&pagenum=1',
				url : '/salebynow/json.htm',
				dataType : 'json',
				success : function(json) {
					imageLoadPending = true;
					loadFeaturedContainer(json);
				},
				error : function( jqXhr, textStatus, errorThrown ){
					var status = textStatus;
				}
			});						
		}
		
		$featuredStories.show = function(){
			loadFeaturedStories();
		};
	}(featuredStories));
	
	var browserDetect = {};
	
	(function(){
		browserDetect = {
			init: function () {
				this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
				this.version = this.searchVersion(navigator.userAgent)
					|| this.searchVersion(navigator.appVersion)
					|| "an unknown version";
				this.OS = this.searchString(this.dataOS) || "an unknown OS";
			},
			searchString: function (data) {
				for (var i=0;i<data.length;i++)	{
					var dataString = data[i].string;
					var dataProp = data[i].prop;
					this.versionSearchString = data[i].versionSearch || data[i].identity;
					if (dataString) {
						if (dataString.indexOf(data[i].subString) != -1)
							return data[i].identity;
					}
					else if (dataProp)
						return data[i].identity;
				}
			},
			searchVersion: function (dataString) {
				var index = dataString.indexOf(this.versionSearchString);
				if (index == -1) return;
				return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
			},
			dataBrowser: [
				{
					string: navigator.userAgent,
					subString: "Chrome",
					identity: "Chrome"
				},
				{ 	string: navigator.userAgent,
					subString: "OmniWeb",
					versionSearch: "OmniWeb/",
					identity: "OmniWeb"
				},
				{
					string: navigator.vendor,
					subString: "Apple",
					identity: "Safari",
					versionSearch: "Version"
				},
				{
					prop: window.opera,
					identity: "Opera",
					versionSearch: "Version"
				},
				{
					string: navigator.vendor,
					subString: "iCab",
					identity: "iCab"
				},
				{
					string: navigator.vendor,
					subString: "KDE",
					identity: "Konqueror"
				},
				{
					string: navigator.userAgent,
					subString: "Firefox",
					identity: "Firefox"
				},
				{
					string: navigator.vendor,
					subString: "Camino",
					identity: "Camino"
				},
				{		// for newer Netscapes (6+)
					string: navigator.userAgent,
					subString: "Netscape",
					identity: "Netscape"
				},
				{
					string: navigator.userAgent,
					subString: "MSIE",
					identity: "Explorer",
					versionSearch: "MSIE"
				},
				{
					string: navigator.userAgent,
					subString: "Gecko",
					identity: "Mozilla",
					versionSearch: "rv"
				},
				{ 		// for older Netscapes (4-)
					string: navigator.userAgent,
					subString: "Mozilla",
					identity: "Netscape",
					versionSearch: "Mozilla"
				}
			],
			dataOS : [
				{
					string: navigator.platform,
					subString: "Win",
					identity: "Windows"
				},
				{
					string: navigator.platform,
					subString: "Mac",
					identity: "Mac"
				},
				{
					   string: navigator.userAgent,
					   subString: "iPhone",
					   identity: "iPhone/iPod"
			    },
				{
					string: navigator.platform,
					subString: "Linux",
					identity: "Linux"
				}
			]
		};		
	}());
	
	browserDetect.init();
	
	//New Entry section
	var newEntry = {};
	(function($newEntry){
		var newEntryContainer = $('#newEntry');
		$newEntry.show = function(imageSrc){
			newEntryContainer.find('img').attr('src', imageSrc);
			$('.topStories').hide();
			newEntryContainer.find('input:text').val('');
			newEntryContainer.show();
		};		
		
		$newEntry.hide = function(){
			newEntryContainer.find('input:text').val('');
			newEntryContainer.hide();
			$('.topStories').show();
		};
	}(newEntry));
	
	// Utility functions
	var utils = {};
	(function($utils){	
		
		$utils.getQueryStringParam = function(paramName){
			var query = window.location.search.substring(1);
			var parms = query.split('&');
			for (var i=0; i<parms.length; i++) {
				var pos = parms[i].indexOf('=');
				if (pos > 0  && paramName == parms[i].substring(0,pos)) {
					return parms[i].substring(pos+1);;
				}
			}
			return "";
		};
		
	}(utils));
	
	$TN.likeBtnClick = function(btn, containerClass){
		var containerElem = $(btn).parents('".' + containerClass + '"');
		likedIt(containerElem);
	};
	
	$TN.commentEntered = function( btn, containerClass ){
		//To do
	};
	
	$TN.addClipThisButton = function(){
		switch( browserDetect.browser ){
		case 'Firefox':
		case 'Safari':
		case 'Chrome':
			$('#clipThisDrag').show();
			break;
		case 'Explorer':
			$('#clipThisFav').show();
			break;
		default:
			break;
		}		
	};
	
	$TN.createStoryClose = function(){
		createStoryPopup.close();
	};
	
	$TN.createStoryShow = function(){
		createStoryPopup.show();
	};
	
	$TN.hotZone = function(){		
		topStories.hide();
		mapsHandler.show();
	};
	
	$TN.topStories = function(){
		mapsHandler.hide();
		topStories.show();
	};
	
	$TN.newEntrySubmit = function(){
		newEntry.hide();
		topStories.show();
	};
	
	$TN.newEntryCancel = function(){
		newEntry.hide();
		topStories.show();
	};
	
	$TN.showLoadingBar = function(){
		if( !loadingBar.is(':visible') ){
			loadingBar.show(); 
			$('body').css({overflow:'hidden'});		
		}
	};
	
	$TN.hideLoadingBar = function(){
		if( !imageLoadPending && loadingBar.is(':visible')){
			loadingBar.hide(); 
			
			if( !$('.popupCanvas').is(':visible') ){
				$('body').css({overflow:'auto'});
			}
		}
	};
	
	$TN.initAndLoadHomePage = function(){
		
 		if( !Modernizr.input.placeholder ){
 			$('input[placeholder]').livequery(function(){
 				var jqElem = $(this);
 				jqElem.addClass('placeholder').val(jqElem.attr('placeholder'));
 				
 				jqElem.focus(function(){
 					jqElem.removeClass('placeholder').val('');
 				}).blur(function(){
 					if( jqElem.val().length === 0 ){
 						jqElem.addClass('placeholder').val(jqElem.attr('placeholder'));
 					}
 				});
 			});
 		}
 		
 		//set selected tabs navigation
 		$('#rightMainTabs').find('a').click(function(){
 			var jqElem = $(this);
 			
 			if( !jqElem.hasClass('selectedHeaderTab') ){
 				$('.selectedHeaderTab').removeClass('selectedHeaderTab');
 				jqElem.addClass('selectedHeaderTab');
 			}
 		});
 		
 		$('#featuredTabs').find('a').click(function(){
 			var jqElem = $(this);
 			
 			if( !jqElem.hasClass('selectedFeaturedTab') ){
 				$('.selectedFeaturedTab').removeClass('selectedFeaturedTab');
 				jqElem.addClass('selectedFeaturedTab');
 			}
 		});
 		
 				
		$('.clipThis').find('a').attr('href', "javascript:void((function(){var s=document.createElement('script');s.type='text/javascript';s.src='http://23.21.87.97/TinyNews/js/clipthis.js';document.body.appendChild(s);})())");
//		$('.clipThis').find('a').attr('href', "javascript:void((function(){var s=document.createElement('script');s.type='text/javascript';s.src='http://barve-pc.gateway.2wire.net/tinynews/js/clipthis.js';document.body.appendChild(s);})())");
		
		window.name='TinyNews';
		
		loadingBar = $('#loadingBar');
		
		//setup session
		$.ajax({
			type: 'GET',
			cache: false,
			data: 'action=loginCustomer&email=test@test.com&pass=test1234',
			url : '/salebynow/customer.htm',
			dataType : 'json',
			success : function(json) {
				if( !!json[0] ){
					// check if this is for a new entry
					var imageSrc = utils.getQueryStringParam('imageSrc');
					if( !!imageSrc ){
						newEntry.show(imageSrc);
					}
					else{
						featuredStories.show();
					}
				}
			},
			error : function( jqXhr, textStatus, errorThrown ){
				var status = textStatus;
			}
		});					
	};
}(TN));
