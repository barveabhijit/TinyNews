if(!TN) var TN = {};

(function($TN){
	
	demoImageUrl = 'images/demo/photo36x26.jpg';
	demoHeadline = 'Censorship and the media whose side are you on?';
	demoFirstName = 'Candi';
	demoLastName = 'Stryper';
	var trendingBlockLoading = false;
	
	function setupMockjax(){
		

		// mockjax for friends read list
		$.mockjax({
			url: '/salebynow/json.htm',
			data: 'action=findRecentStoriesFriendsRead&custid=388&num=4&pagenum=1',
			responseTime: 750,
			responseText: [
				{
				buzzList : [
				                   {
				                	   thumbImageUrl: demoImageUrl,
				                	   headline: demoHeadline,
				                	   firstName:demoFirstName,
				                	   lastName:demoLastName
				                   },
				                   {
				                	   thumbImageUrl: demoImageUrl,
				                	   headline: demoHeadline,
				                	   firstName:demoFirstName,
				                	   lastName:demoLastName
				                   },
				                   {
				                	   thumbImageUrl: demoImageUrl,
				                	   headline: demoHeadline,
				                	   firstName:demoFirstName,
				                	   lastName:demoLastName
				                   },
				                   {
				                	   thumbImageUrl: demoImageUrl,
				                	   headline: demoHeadline,
				                	   firstName:demoFirstName,
				                	   lastName:demoLastName
				                   }
				                   ]
				}
			]
		});

		// mockjax for friends posted list
		$.mockjax({
			url: '/salebynow/json.htm',
			data: 'action=findFriendsStoriesPublished&custid=388&num=4&pagenum=1',
			responseTime: 750,
			responseText: [{
				buzzList : [
				                   {
				                	   thumbImageUrl: demoImageUrl,
				                	   headline: demoHeadline,
				                	   firstName:demoFirstName,
				                	   lastName:demoLastName
				                   },
				                   {
				                	   thumbImageUrl: demoImageUrl,
				                	   headline: demoHeadline,
				                	   firstName:demoFirstName,
				                	   lastName:demoLastName
				                   },
				                   {
				                	   thumbImageUrl: demoImageUrl,
				                	   headline: demoHeadline,
				                	   firstName:demoFirstName,
				                	   lastName:demoLastName
				                   },
				                   {
				                	   thumbImageUrl: demoImageUrl,
				                	   headline: demoHeadline,
				                	   firstName:demoFirstName,
				                	   lastName:demoLastName
				                   }
				                   ]
			}]	
		});
	}

//	var custId=388;
	var custId = null;
	var totalFRPages = 0;
	var currFRPage = 0;
	var totalFPPages = 0;
	var currFPPage = 0;
	
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
	
	function loadFollowingRead(pageNum) {
		
		function populateFollowingRead( response ){
			function getReadItemHtml(readItem) {
				var dataHtml = '\
					<li class="friendRead">\
						<input class="messageId" type="hidden" value="' + readItem.messageId + '"/> \
						<div class="imageCont"><img style="display:none" src="' + readItem.thumbImageUrl + '" onload="TN.utils.normalizeImage(this, 56, 56);"/></div>\
						<p>' + (!!readItem.headline ? readItem.headline  : "Test headline") + '</p>\
						<div class="credit">'+ readItem.firstName + ' ' + readItem.lastName + '</div>\
					</li>';
				return dataHtml;
			}
			
			if( !!response && !!response[0] ){
				currFRPage = pageNum;
				totalFRPages = parseFloat(response[0].noOfPages);
				if( !!response[0].buzzList && response[0].buzzList.length > 0  ){
					var followingReadCount = response[0].buzzList.length;
					var followingReadItemsHtml = "";
					
					for( var i = 0; i < followingReadCount; i++ ){
						followingReadItemsHtml += getReadItemHtml(response[0].buzzList[i]);
					}
					
					$('#friendsReadList').empty();
					$('#friendsReadList').append(followingReadItemsHtml);
					$('#friendsReadLabel').text('What\'s happening now').show();
				}
			}
		}
		
		TN.services.findRecentStoriesFollowingRead(custId, 6, pageNum ).
			done(populateFollowingRead).
			done(function(){
				if( currFRPage === totalFRPages ){
					//remove More link
					$('#moreFriendsRead').hide();
				}
				else {
					$('#moreFriendsRead').show();
				}
			});
	}
	
	function loadFriendsRead(pageNum) {
		
		function populateFriendsReadHtml( response ){
			function getReadItemHtml(readItem){
				var dataHtml = '\
					<li class="friendRead">\
						<input class="messageId" type="hidden" value="' + readItem.messageId + '"/> \
						<div class="imageCont"><img style="display:none" src="' + readItem.thumbImageUrl + '" onload="TN.utils.normalizeImage(this, 56, 56);"/></div>\
						<p>' + (!!readItem.headline ? readItem.headline  : "Test headline") + '</p>\
						<div class="credit">'+ readItem.firstName + ' ' + readItem.lastName + '</div>\
					</li>';
				return dataHtml;
			}
			
			
			if( !!response && !!response[0] ){
				currFRPage = pageNum;
				totalFRPages = parseFloat(response[0].noOfPages);
				if( !!response[0].buzzList && response[0].buzzList.length > 0  ){
					var friendsReadCount = response[0].buzzList.length;
					var friendsReadItemsHtml = "";
					
					for( var i = 0; i < friendsReadCount; i++ ){
						friendsReadItemsHtml += getReadItemHtml(response[0].buzzList[i]);
					}
					
					$('#friendsReadList').append(friendsReadItemsHtml);					
					$('#friendsReadLabel').show();
				}
			}
		}
		
		$.ajax({
			type: 'GET',
			cache: false,
			url: '/salebynow/json.htm',
			data: 'action=findRecentStoriesFriendsRead&custid='+ custId +'&num=6&pagenum='+ pageNum,
			dataType : 'json',
			success: populateFriendsReadHtml
		}).done(function(){
			if( currFRPage === totalFRPages ){
				//remove More link
				$('#moreFriendsRead').hide();
			}
			else {
				$('#moreFriendsRead').show();
			}
		}).fail(function(jqXHR, textStatus, errorThrown){
			if( $.trim(jqXHR.responseText) === 'No stories available' ){
				loadFollowingRead(1);
			}
		});
	}
	
	function loadFollowingPosted(pageNum) {
		
		function populateFollowingPosted( response ){
			function getPostedItemHtml(postedItem){
				var dataHtml = '\
					<li class="friendPosted">\
						<input class="messageId" type="hidden" value="' + postedItem.messageId + '"/> \
						<div class="imageCont"><img style="display:none" src="' + postedItem.customerThumbImageUrl + '" onload="TN.utils.normalizeImage(this, 56, 56);"/></div>\
						<p>' + (!!postedItem.headline ? postedItem.headline : "Test headline") + '</p>\
						<div class="credit">'+ postedItem.firstName + ' ' + postedItem.lastName + '</div>\
					</li>';
				return dataHtml;
			}
			
			if( !!response && !!response[0] ){
				currFPPage = pageNum;
				totalFPPages = parseFloat(response[0].noOfPages);
				if( !!response[0].buzzList && response[0].buzzList.length > 0 ){
					var followingPostedCount = response[0].buzzList.length;
					var followingPostedItemsHtml = "";
					
					for( var i = 0; i < followingPostedCount; i++ ){
						followingPostedItemsHtml += getPostedItemHtml(response[0].buzzList[i]);
					}
					
					$('#friendsPostedList').append(followingPostedItemsHtml);
					$('#friendsPostedLabel').text('People You Follow Posted').show();
				}
			}
		}
		
		TN.services.findFollowingStoriesPublished(custId, 4, pageNum ).
		done(populateFollowingPosted).
		done(function(){
			if( currFPPage === totalFPPages ){
				//remove More link
				$('#moreFriendsPosted').hide();
			}				
			else {
				$('#moreFriendsPosted').show();
			}
		});
	}
	
	function loadFriendsPosted(pageNum) {
		
		function popupateFriendsPostedHtml( response ){
			function getPostedItemHtml(postedItem){
				var dataHtml = '\
					<li class="friendPosted">\
						<input class="messageId" type="hidden" value="' + postedItem.messageId + '"/> \
						<div class="imageCont"><img style="display:none" src="' + postedItem.customerThumbImageUrl + '" onload="TN.utils.normalizeImage(this, 56, 56);"/></div>\
						<p>' + (!!postedItem.headline ? postedItem.headline : "Test headline") + '</p>\
						<span class="credit">'+ postedItem.firstName + ' ' + postedItem.lastName + '</span>\
					</li>';
				return dataHtml;
			}
			
			if( !!response && !!response[0] ){
				currFPPage = pageNum;
				totalFPPages = parseFloat(response[0].noOfPages);
				if( !!response[0].buzzList && response[0].buzzList.length > 0 ){
					var friendsPostedCount = response[0].buzzList.length;
					var friendsPostedItemsHtml = "";
					
					for( var i = 0; i < friendsPostedCount; i++ ){
						friendsPostedItemsHtml += getPostedItemHtml(response[0].buzzList[i]);
					}
					
					$('#friendsPostedList').append(friendsPostedItemsHtml);
					$('#friendsPostedLabel').show();
				}				
			}
		}
		
		$.ajax({
			type: 'GET',
			cache: false,
			url: '/salebynow/json.htm',
			data: 'action=findFriendsStoriesPublished&custid='+ custId +'&num=4&pagenum='+pageNum,
			dataType : 'json',		
			success: popupateFriendsPostedHtml
		}).done(function(){
			if( currFPPage === totalFPPages ){
				//remove More link
				$('#moreFriendsPosted').hide();
			}
			else {
				$('#moreFriendsPosted').show();
			}
		}).fail(function(jqXHR, textStatus, errorThrown){
			if( $.trim(jqXHR.responseText) === 'No stories available' ){
				loadFollowingPosted(1);
			}
		});
	}

	function loadDependencies (){
		return( 
			$.getScript('js/mapshandler.js' )
		);
	}
	
        
        
	function populateOpEdBar() {
	    trendingBlockLoading = true; $('#trendingLoader').css("top", "-80px").show();
        //$('#see-allLink').click(function(){ location.href = 'stories.html?type=topoped'; });
        //$('#see-allLink a').text("See All Op-ed");
		function getOpEdHtml(json){
			var returnHtml = '';
			if( !!json ){
				var maxItems = json.length > 5 ? 5 : json.length;
				for( var i = 0; i < maxItems; i++){
					returnHtml += '\
                    <div class="imageContainerBig"> \
                        <ul> \
    		               <li class="opedItem"> \
                                <input class="messageId" type="hidden" value="' + json[i].messageId + '"/> \
    				<div class="trendingWindowCont"><img style="display:none" src="'+json[i].thumbImageUrl+'" onload="TN.utils.normalizeImage(this, 124, 104);" />\
                                   <div class="text">'+json[i].headline+'</div>\
                                   <!--div class="container">'+json[i].headline+'</div-->\
                                </div> \
                             </li> \
                        </ul> \
                    </div>';
				}
			}
			return (returnHtml);
		}
	
        
		TN.services.getTopOPED().done(function(json){
		    $('#trendingTitle').text("top op-ed");
            $('#trendingBlock .imageContainerBig').remove();
			$('#trendingBlock').append(getOpEdHtml(json));
			$('.opedItem div, .opedItem p').click(function(){
				var parentCont = $(this).parents('li');
				var messageId = parentCont.find('.messageId').val();
				TN.lightbox.show(custId, messageId);
			});
			// $('#op-edLink').click(function(){ location.href = 'stories.html?type=topoped'; });
			$('.trendingCateList ul li').removeClass("selected");
            $('#op-edLink').addClass("selected");
            trendingBlockLoading = false; $('#trendingLoader').hide();
		});
	}

	function populateTopCategoriesBar() {
		function getTopCategoriesHtml(json){
			var returnHtml = '';
			if( !!json ){
				var maxItems = json.length > 5 ? 5 : json.length;
				for( var i = 0; i < maxItems; i++){
					returnHtml += '\
		                <li class="topCategory"> \
		                  	<a href="stories.html?type=topcats&name=' + json[i].name + '"> \
					<div class="trendingWindowCont"><img style="display:none" src="images/category/'+json[i].name+'.jpg" onload="TN.utils.normalizeImage(this, 124, 104);"/>\
                                           <div class="text">\
                                            Angry Jessie Jackson on the rampage\
                                           </div>\
                                       </div> \
	                    		<h3>' + json[i].name + '</h3> \
							</a> \
						</li>';
				}
			}
			return (returnHtml);
		}
		
		TN.services.getTopCategories().done(function(json){
			$('#top-categories ul').append(getTopCategoriesHtml(json));
			$('#top-categoriesLink').click(function(){
				location.href = 'stories.html?type=topcats';
			});
		});		
	}
	
	function populateTopNewspapersBar(){
	trendingBlockLoading = true; $('#trendingLoader').css("top", "-53px").show();
        $('.trendingCateList ul li').removeClass("selected");
        $('#top-newspapersLink').addClass("selected");	    
        //$('#see-allLink').click(function(){ location.href = 'stories.html?type=topnewspapers'; });
        //$('#see-allLink a').text("See All Newspapers");
		function getTopNewspapersHtml(){
			return ( '\
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="newspapersItem"> \
                                <div class="trendingWindowCont"><img style="display:none" src="images/demo/img1.jpg" onload="TN.utils.normalizeImage(this, 124, 104);" alt="Politics Pic" />\
                                 <div class="text">Politics</div>\
                                  <!--div class="container">Politics</div-->\
                                </div>\
                            </li> \
                        </ul> \
                    </div> \
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="newspapersItem"> \
                                <div class="trendingWindowCont"><img style="display:none" src="images/demo/img2.jpg" onload="TN.utils.normalizeImage(this, 124, 104);" alt="Beauty Pic" />\
                                 <div class="text">Beauty</div>\
                                  <!--div class="container">Beauty</div-->\
                                </div>\
                            </li> \
                        </ul> \
                    </div> \
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="newspapersItem"> \
                                <div class="trendingWindowCont"><img style="display:none" src="images/demo/img3.jpg" onload="TN.utils.normalizeImage(this, 124, 104);" alt="Holidays Pic" />\
                                <div class="text">Holidays</div>\
                                  <!--div class="container">Holidays</div-->\
                                </div>\
                             </li> \
                        </ul> \
                    </div> \
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="newspapersItem"> \
                                <div class="trendingWindowCont"><img style="display:none" src="images/demo/img4.jpg" onload="TN.utils.normalizeImage(this, 124, 104);" alt="World News Pic" /> \
                                <div class="text">World News</div>\
                                  <!--div class="container">World News</div-->\
                                </div>\
                            </li> \
                        </ul> \
                    </div> \
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="newspapersItem"> \
                                <div class="trendingWindowCont"><img style="display:none" src="images/demo/img5.jpg" onload="TN.utils.normalizeImage(this, 124, 104);" alt="Weather Pic" />\
                                <div class="text">Weather</div>\
                                  <!--div class="container">Weather</div-->\
                                </div>\
                            </li> \
                        </ul> \
                    </div>'
                    );
		}
        $('#trendingTitle').text("top newspapers");
        $('#trendingBlock .imageContainerBig').remove();
	$('#trendingBlock').append(getTopNewspapersHtml());		
		// $('#top-newspapersLink').click(function(){ location.href = 'stories.html?type=topnewspapers'; });
        trendingBlockLoading = false; $('#trendingLoader').hide();
	}
	
	function populateTopStoriesBar() {
	    trendingBlockLoading = true; $('#trendingLoader').css("top", "-53px").show();
        $('.trendingCateList ul li').removeClass("selected");
        $('#top-storiesLink').addClass("selected");	    
	    $('#see-allLink').click(function(){ location.href = 'stories.html?type=topstories'; });
	    $('#see-allLink a').text("See All Stories");
		function getTopStoriesHtml(json){
			var returnHtml = '';
			if( !!json ){
				var maxItems = json.length > 5 ? 5 : json.length;
				for( var i = 0; i < maxItems; i++){
					returnHtml += '\
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="topStories"> \
                                <input class="messageId" type="hidden" value="' + json[i].messageId + '"/> \
                                <div class="trendingWindowCont"><img style="display:none" src="'+json[i].thumbImageUrl+'" onload="TN.utils.normalizeImage(this, 124, 104);"/>\
                                <div class="text">'+json[i].headline+'</div>\
                                <!--div class="container">'+json[i].headline+'</div-->\
                                </div> \
                            </li> \
                        </ul> \
                    </div>';
				}
			}
			return (returnHtml);
		}
		
		TN.services.getTopStories().done(function(json){
		    $('#trendingTitle').text("trending stories");
		    $('#trendingBlock .imageContainerBig').remove();
			$('#trendingBlock').append(getTopStoriesHtml(json));
			$('.trendingWindowCont').click(function(){
				var parentCont = $(this).parents('li');
				var messageId = parentCont.find('.messageId').val();
				TN.lightbox.show(custId, messageId);
			});
			// $('#top-storiesLink').click(function(){ location.href = 'stories.html?type=topstories'; });
			trendingBlockLoading = false; $('#trendingLoader').hide();
		});
	}
		
	$TN.loadMoreFriendsRead = function(){
		if( !!custId ){
			loadFriendsRead(currFRPage+1);
		}
	};
	
	$TN.loadMoreFriendsPosted = function(){
		if( !!custId ){
			loadFriendsPosted(currFPPage+1);
		}
	};

	$TN.initialize = function(){
//		loadDependencies().done(function(){
//			setupMockjax();		
						
			$('#content').show();
			
			var imageSrc = unescape(TN.utils.getQueryStringParam('imageSrc'));
			var storyUrl = unescape(TN.utils.getQueryStringParam('storyUrl'));
			if( !!imageSrc ){
				TN.createStory.show(imageSrc, storyUrl, true);
			}
			
			TN.baseHeader.initialize();
//			TN.homepage = true;
			
			custId=TN.utils.getCookie('TNUser');
			
			if( !!custId ){
				//populateOpEdBar();
				populateTopStoriesBar();
				//populateTopNewspapersBar();
				loadFriendsRead(1);
				//loadFriendsPosted(1);
				$('#footer').show();
				
				$('.friendRead p, .friendRead img, .friendPosted p, .friendPosted img').livequery('click', function(){
					var parentCont = $(this).parents('li');
					var messageId = parentCont.find('.messageId').val();
					TN.lightbox.show(custId, messageId);
				});
				
				$('#trendingTitle').text("trending stories");
				
				$('#top-storiesLink').click(function(){
				    if (!trendingBlockLoading) populateTopStoriesBar();
                });
    			$('#top-newspapersLink').click(function(){
                    populateTopNewspapersBar();
                });
                $('#op-edLink').click(function(){
                    if (!trendingBlockLoading) populateOpEdBar();
                });
                
				// For now hide art map
				//$('#mapCanvas img').click(function(){
				TN.dissolveArtMap();
				//});
			}
			else if ( (!!viewId) && (viewId == 'register') ){
					$("#login").show();
					TN.utils.setCaretPosition('formText', 0);
			}
			else if ( (!!viewId) && (viewId == 'signin') ){
					$('#loginDropDownWrapper').show();
					TN.utils.setCaretPosition('usernameLogin', 0);
			}
			else {
				parent.location.href='./fw';
			}
//		});		
	};
	
}(TN));
