if(!TN) var TN = {};
if (!TN.myPage) TN.myPage = {};

(function($myPage){
	
	function populateOpEdBar() {
		function getOpEdHtml(json){
			var returnHtml = '';
			var li_class = '';
			if( !!json ){
				var maxItems = json.length > 4 ? 4 : json.length;
				for( var i = 0; i < maxItems; i++){
					((i+1) % 4) ? li_class = "col" : li_class = "col lastcol"; 
					returnHtml += '\
		                <li class="' + li_class + '"> \
							<input class="messageId" type="hidden" value="' + json[i].messageId + '"/> \
							<div><img width="146" height="109" src="'+json[i].thumbImageUrl+'"/></div> \
                    		<p>' + json[i].headline + '</p> \
						</li>';
				}
			}
			return (returnHtml);
		}
		
		TN.services.getTopOPED().done(function(json){
			$('#op-ed ul').append(getOpEdHtml(json));
			$('#op-ed ul li.col div, #op-ed ul li.col p').click(function(){
				var parentCont = $(this).parents('li');
				var messageId = parentCont.find('.messageId').val();
				TN.lightbox.show(custId, messageId);
			});
			$('#op-ed .more-arrow-mypage').click(function(){
				location.href = 'myPageOped.html';
			});
		});
	}

	function populateTopNewspapersBar(){

		var maxItems = 0;
		function getTopNewspaperHtml(json, j){
			var returnHtml = '';
			var li_class = '';
			( !!( (j+1) % 4 ) && ( (j+1) != maxItems) ) ? li_class = "col" : li_class = "lastcol last";
			returnHtml = '\
                <li class="' + li_class + '"> \
                  <a href="javascript:void(0);" onclick="TN.newspaperViewLB.init(' + json[0].id + ');"> \
                    <div style="width:146px; height:109px; overflow: hidden" title="' + json[0].headline + ', ' + json[0].edition + '"> \
                    <img src="' + (!!json[0].stories[0] ? json[0].stories[0].buzzThumbImageURL : "#") + '" onload="TN.utils.normalizeImage(this, 146, 109)" /></div> \
                    <h3>' + json[0].headline + '</h3> \
                  </a> \
                </li>';
            return returnHtml;
		}

		TN.services.getNewspapers(viewId).done(function(json){
			if( !!json ){
				maxItems = json.length > 4 ? 4 : json.length;
				var j = 0;
				if (maxItems > 0) {
					for( var i = 0; i < maxItems; i++){
						TN.services.getNewspaper(json[i].id).done(function(json){
							if (!!json[0].stories[0]) {
								$('#top-newspapers ul').append(getTopNewspaperHtml(json, j));
								j++;
							}
						});
					};
				};
			};
		});
		
	}
	
	$myPage.populateTopStoriesBar = function(){
		// Initial probing of 5 id's to display. We need to take 5 id's in case one of them 
		// turns out to be Q-type story. That way we can just skip it and display the other 4.
		TN.services.getMyPageRecentPhotos(viewId, 5, custId).done(function(json){
			if( !!json ){

				var idsToDisplay = 0;
				var myLatestStoryIds = [];
				var maxItems = json.length > 5 ? 5 : json.length;

				for (var i = 0; i < maxItems; i++) {
					if ( json[i].wsMessage.messageType != "Q" )  {
						myLatestStoryIds.push(json[i].wsMessage.id);
						idsToDisplay++;
					}
				}

				if (myLatestStoryIds.length > 4) myLatestStoryIds.pop();

				function getTopStoriesHtml(json, j){
					var returnHtml = '';
					var li_class = '';
					( !!( (j+1) % 4 ) && ( (j+1) != maxItems) ) ? li_class = "col" : li_class = "col lastcol";
					returnHtml += '\
		                <li class="' + li_class + '"> \
							<input class="messageId" type="hidden" value="' + json[0].wsMessage.id + '"/> \
							<div style="width:146px; height:109px; overflow: hidden"> \
							<img style="display:none" onload="TN.utils.normalizeImage(this, 146, 109)" src="'+json[0].wsBuzz.thumbImageUrl+'"/></div> \
	                		<p>' + json[0].wsBuzz.headline + '</p> \
						</li>';
					return (returnHtml);
				}
				
				var j = 0;
				maxItems = myLatestStoryIds.length;

				if (maxItems > 0) {
    				for( var i = 0; i < maxItems; i++){
    					TN.services.getFittingRoomRequest(viewId, myLatestStoryIds[i]).done(function(json){
    						$('#top-stories ul').append(getTopStoriesHtml(json, j));
    						j++;
    						$('#top-stories ul li.col p, #top-stories ul li.col div').click(function(){
    							var parentCont = $(this).parents('li');
    							var messageId = parentCont.find('.messageId').val();
    							TN.lightbox.show(custId, messageId);
    						});
    					});
    				}
				}
				else $('#top-stories ul').append("<li>No stories published</li>");

			}
		}).fail(function(){
				$('#top-stories ul').append("<li>No stories available</li>");
		});
	}

	$myPage.initialize = function(){
//		loadDependencies().done(function(){
//			setupMockjax();		
			
			$('#content').show();

			$('#top-stories .more-arrow-mypage').click(function(){
                if (viewId != custId) location.href = 'myPageOped.html?view=' + viewId;
                else location.href = 'myPageOped.html';
            });
			
			$('#top-newspapers .more-arrow-mypage').click(function(){
				if (viewId != custId) location.href = 'myPageNewspaper.html?view=' + viewId;
				else location.href = 'myPageNewspaper.html';
			});

			var imageSrc = unescape(TN.utils.getQueryStringParam('imageSrc'));
			var storyUrl = unescape(TN.utils.getQueryStringParam('storyUrl'));
			if( !!imageSrc ){
				TN.createStory.show(imageSrc, storyUrl);
			}
			
			TN.baseHeader.initialize();
            
			if( !!custId ){
				//populateMyTopStoriesBar();
				//populateOpEdBar();
				populateTopNewspapersBar();
				//loadNotifications(1);
				$('#footer').show();
			}
			
//			$('#mapCanvas > img').click(function() {
				$myPage.dissolveArtMap();		
//			});
//		});		
	};
	
}(TN.myPage));
