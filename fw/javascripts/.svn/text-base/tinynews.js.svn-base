if(!TN) var TN = {};

(function($TN){
	
	demoImageUrl = 'images/demo/photo36x26.jpg';
	demoHeadline = 'Censorship and the media whose side are you on?';
	demoFirstName = 'Candi';
	demoLastName = 'Stryper';
	var trendingBlockLoading = false;
        var slider;
        var x=0;
	
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
						<div class="imageCont"><img src="' + readItem.thumbImageUrl + '" onload="TN.resizeLeftImage(this);"/></div>\
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
						<div class="imageCont"><img src="' + readItem.thumbImageUrl + '" onload="TN.resizeLeftImage(this);"/></div>\
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
						<div class="imageCont"><img src="' + postedItem.customerThumbImageUrl + '" onload="TN.resizeLeftImage(this);"/></div>\
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
						<div class="imageCont"><img src="' + postedItem.customerThumbImageUrl + '" onload="TN.resizeLeftImage(this);"/></div>\
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
                var globHtml='';
                var dem=0;
                //slider.unbind();
                //slider.FlowSlider=null;
                // slider1.css('display','none');
                // slider2.css('display','inherit');
               
            function getOpEdHtml(json){
			var returnHtml = '';
			if( !!json ){
				var maxItems = json.length > 5 ? 5 : json.length;
			//	returnHtml+='\<div id="slider" class="slider-horizontal">';

                                for( var i = 0; i <15; i++){
					returnHtml += '\
                              <div class="item"><img src="'+json[i].thumbImageUrl+'" /></div>';
				}
                          //  returnHtml+='</div>';
                            
			}
			return (returnHtml);
		}
	    
            TN.services.getTopOPED().done(function(json){
		  globHtml=getOpEdHtml(json);
                  dem=1;
                 // alert(globHtml);
                  //slider2.FlowSlider().content().append(globHtml);
                 // slider2.FlowSlider().setupDOM();  
		});
        /*    trendingBlockLoading = true; $('#trendingLoader').css("top", "-108px").show();
        $('#see-allLink').click(function(){ location.href = 'stories.html?type=topoped'; });
        $('#see-allLink a').text("See All Op-ed");
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
    				<div><img src="'+json[i].thumbImageUrl+'" />\
                                   <div class="text"></div>\
                                   <div class="container">'+json[i].headline+'</div>\
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
*/	}

	function populateTopCategoriesBar() {
		function getTopCategoriesHtml(json){
			var returnHtml = '';
			if( !!json ){
				var maxItems = json.length > 5 ? 5 : json.length;
				for( var i = 0; i < maxItems; i++){
					returnHtml += '\
		                <li class="topCategory"> \
		                  	<a href="stories.html?type=topcats&name=' + json[i].name + '"> \
					<div><img src="images/category/'+json[i].name+'.jpg"/>\
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
        $('#see-allLink').click(function(){ location.href = 'stories.html?type=topnewspapers'; });
        $('#see-allLink a').text("See All Newspapers");
		function getTopNewspapersHtml(){
			return ( '\
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="newspapersItem"> \
                                <div><img src="images/demo/img1.jpg" alt="Politics Pic" />\
                                 <div class="text"></div>\
                                  <div class="container">Politics</div>\
                                </div>\
                            </li> \
                        </ul> \
                    </div> \
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="newspapersItem"> \
                                <div><img src="images/demo/img2.jpg" alt="Beauty Pic" />\
                                 <div class="text"></div>\
                                  <div class="container">Beauty</div>\
                                </div>\
                            </li> \
                        </ul> \
                    </div> \
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="newspapersItem"> \
                                <div><img src="images/demo/img3.jpg" alt="Holidays Pic" />\
                                <div class="text"></div>\
                                  <div class="container">Holidays</div>\
                                </div>\
                             </li> \
                        </ul> \
                    </div> \
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="newspapersItem"> \
                                <div><img src="images/demo/img4.jpg" alt="World News Pic" /> \
                                <div class="text"></div>\
                                  <div class="container">World News</div>\
                                </div>\
                            </li> \
                        </ul> \
                    </div> \
                    <div class="imageContainerBig"> \
                        <ul> \
                            <li class="newspapersItem"> \
                                <div><img src="images/demo/img5.jpg" alt="Weather Pic" />\
                                <div class="text"></div>\
                                  <div class="container">Weather</div>\
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
                var globHtml='';
                var dem=0;
                //slider.unbind();
                //slider.FlowSlider=null;
                 //slider2.css('display','none');
                 //slider1.css('display','inherit');
                 function getTopStoriesHtml(json){
			var returnHtml = '';
			if( !!json ){
				var maxItems = json.length > 5 ? 5 : json.length;
			//	returnHtml+='\<div id="slider" class="slider-horizontal">';

                                for( var i = 0; i < json.length; i++){
					returnHtml += '\
                              <div class="item"><img src="'+json[i].thumbImageUrl+'" /></div>';
				}
                          //  returnHtml+='</div>';
                            
			}
			return (returnHtml);
		}
		
		TN.services.getTopStories().done(function(json){
		  globHtml=getTopStoriesHtml(json);
                  //slider.append(globHtml);
                  dem=1;
                 // alert(globHtml);
                //  slider.FlowSlider();
                  //slider1.FlowSlider().content().append(globHtml);
                  //slider1.FlowSlider().setupDOM();  
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
	
	$TN.resizeLeftImage = function(elem){
		var origHeight = elem.height;
		var origWidth = elem.width;
		var jqElem = $(elem);
		if( origHeight === origWidth ){
			jqElem.addClass('smallImageSquare');
		}
		if( origHeight > origWidth ){
			jqElem.addClass('smallImageTall');
		}
		if( origHeight < origWidth ){
			jqElem.addClass('smallImageWide');
		}
	};	
	
        
    
	$TN.initialize = function(){
//		loadDependencies().done(function(){
//			setupMockjax();					
//			$('#content').show();
			//slider1=$("#slider1");
                       // slider2=$("#slider2");
                       // slider1.FlowSlider();
                        //slider2.FlowSlider();
                        //$('.item www_FlowSlider_com-item').hide();
            //     FlowSlider("#slider");//.content().append('<div class="item"></div>');
                        
            
            var imageSrc = unescape(TN.utils.getQueryStringParam('imageSrc'));
			var storyUrl = unescape(TN.utils.getQueryStringParam('storyUrl'));
			if( !!imageSrc ){
				TN.createStory.show(imageSrc, storyUrl, true);
			}
			
			TN.baseHeader.initialize();
			//TN.homepage = true;
			
//			custId = TN.utils.getCookie('TNUser');
			
//			if( !!custId ){
				//populateOpEdBar();
//				populateTopStoriesBar();
                               
				//populateTopNewspapersBar();
//				loadFriendsRead(1);
				//loadFriendsPosted(1);
//				$('#footer').show();
			/*	
				$('.friendRead p, .friendRead img, .friendPosted p, .friendPosted img').livequery('click', function(){
					var parentCont = $(this).parents('li');
					var messageId = parentCont.find('.messageId').val();
					TN.lightbox.show(custId, messageId);
				});
			*/	
//				$('#trendingTitle').text("trending stories");
				
//				$('#top-storiesLink').click(function(){
                                  //  jQuery.FlowSlider("#slider");
                                  //   ("#slider").FlowSlider().setupDOM();
//				    if (!trendingBlockLoading) populateTopStoriesBar();
                                    
 //               });
//    			$('#top-newspapersLink').click(function(){
//                    populateTopNewspapersBar();
//                });
//                $('#op-edLink').click(function(){
//                    if (!trendingBlockLoading) populateOpEdBar();
 //               });
                
				// For now hide art map
				//$('#mapCanvas img').click(function(){
//				TN.dissolveArtMap();
				//});
//			}
//			else {
//				$('#loginDropDownWrapper').show();
//			}
//		});		
	};
	
}(TN));
