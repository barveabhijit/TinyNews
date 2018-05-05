if(!TN) var TN = {};
if (!TN.myPage) TN.myPage = {};

(function($myPage){
	
	function populateOpEdBar() {
		function getOpEdHtml(json){
			var returnHtml = '';
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
		function getTopNewspapersHtml(){
			return ( '\
	                <li class="col"> \
	                  <a href=""> \
	                    <img src="images/demo/img1.jpg" width="146" height="109" alt="Politics Pic" /> \
	                    <h3>POLITICS</h3> \
	                  </a> \
	                </li class="col"> \
	                <li class="col"> \
	                  <a href=""> \
	                    <img src="images/demo/img2.jpg" width="146" height="108" alt="Beauty Pic" /> \
	                    <h3>BEAUTY</h3> \
	                  </a> \
	                </li> \
	                <li class="col"> \
	                  <a href=""> \
	                    <img src="images/demo/img3.jpg" width="146" height="108" alt="Holidays Pic" /> \
	                    <h3>HOLIDAYS</h3> \
	                  </a> \
	                </li> \
	                <li class="lastcol last"> \
	                  <a href=""> \
	                    <img src="images/demo/img4.jpg" width="146" height="108" alt="World News Pic" /> \
	                    <h3>WORLD NEWS</h3> \
	                  </a> \
	                </li>'
					);
		}
		$('#top-newspapers ul').append(getTopNewspapersHtml());		
		$('#top-newspapers .more-arrow-mypage').click(function(){
			location.href = 'myPageNewspaper.html';
		});
	}
	
	function populateMyTopStoriesBar() {
		// initial probing of 4 id's to display:
		TN.services.getMyPageRecentPhotos(viewId, 4, custId).done(function(json){
			if( !!json ){
				var maxItems = json.length > 4 ? 4 : json.length;
				var myLatestStoryIds = [];
				for (var i = 0; i < maxItems; i++) {
					if (json[i].wsMessage.messageType != "Q") myLatestStoryIds.push(json[i].wsMessage.id);
				}

				function getTopStoriesHtml(json, j){
					var returnHtml = '';
					((j+1) % 4) ? li_class = "col" : li_class = "col lastcol";
					returnHtml += '\
		                <li class="' + li_class + '"> \
							<input class="messageId" type="hidden" value="' + json[0].wsMessage.id + '"/> \
							<div><img width="146" height="109" src="'+json[0].wsBuzz.thumbImageUrl+'"/></div> \
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
    						$('#top-stories .more-arrow-mypage').click(function(){
    							location.href = 'myPageOped.html';
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
	
	function addClipThisButton(){
		switch( $TN.browserDetect.browser ){
		case 'Firefox':
		case 'Safari':
		case 'Chrome':
			var clipThisDrag = $('#clipThisDrag');
			clipThisDrag.find('a').attr('href', "javascript:void((function(){var s=document.createElement('script');s.type='text/javascript';s.src='http://204.27.59.53/newTN/js/clipthis.js?r='+Math.random()*99999999)';document.body.appendChild(s);})())");
			clipThisDrag.show();

			break;
		case 'Explorer':
			var clipThisFav = $('#clipThisFav');
			clipThisFav.find('a').attr('href', "javascript:void((function(){var s=document.createElement('script');s.type='text/javascript';s.src='http://204.27.59.53/newTN/js/clipthis.js?r='+Math.random()*99999999)';document.body.appendChild(s);})())");
			clipThisFav.show();
			break;
		default:
			break;
		}
	}
		
	$myPage.initialize = function(){
//		loadDependencies().done(function(){
//			setupMockjax();		
			
			$('#content').show();
			
			var imageSrc = unescape(TN.utils.getQueryStringParam('imageSrc'));
			var storyUrl = unescape(TN.utils.getQueryStringParam('storyUrl'));
			if( !!imageSrc ){
				TN.createStory.show(imageSrc, storyUrl);
			}
			
			TN.baseHeader.initialize();
            
			if( !!custId ){
				populateMyTopStoriesBar();
				// populateOpEdBar();
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
