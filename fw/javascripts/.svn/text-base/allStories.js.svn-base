if(!TN) var TN = {};
if (!TN.allStories) TN.allStories = {};

(function($allStories){
	
	var imageContainer = null;
	var topStories = {};
	var custId = TN.utils.getCookie('TNUser');
	var likeBeingProcessed = false;
	var dislikeBeingProcessed = false;
	var reclipBeingProcessed = false;
	var catListElem = $('#storyCatsDropDown');

	(function($topStories){
		var pageNum = 0;
		var maxPages = 1;
		var catType;
		var okToLoadMore = false;
		var totalItems = 0;
		var itemCount = 0;
		var imagesHtml = "";
		var currAjaxCallId = null;
		
		function getImageItemHtml(itemSummary, itemDetails, countersObject){
			
			function getStoryCopy(itemDetails){
				var itemDetailsBuzz = itemDetails.wsBuzz;
				var opEdItemHtml = "";
				
				if( !!itemDetailsBuzz ){
					if( !!itemDetailsBuzz.who ){
						opEdItemHtml += 'Who: ' + itemDetailsBuzz.who+'<br/>';						
					}
					if( !!itemDetailsBuzz.what ){
						opEdItemHtml += 'What: ' + itemDetailsBuzz.what+'<br/>';						
					}
					if( !!itemDetailsBuzz.where ){
						opEdItemHtml += 'Where: ' + itemDetailsBuzz.where+'<br/>';						
					}
					if( !!itemDetailsBuzz.when ){
						opEdItemHtml += 'When: ' + itemDetailsBuzz.when+'<br/>';						
					}
					if( !!itemDetailsBuzz.how ){
						opEdItemHtml += 'How: ' + itemDetailsBuzz.how+'<br/>';						
					}
					if( !!itemDetailsBuzz.why ){
						opEdItemHtml += 'Why: ' + itemDetailsBuzz.why+'<br/>';						
					}
					if( !!itemDetailsBuzz.oped ){
						opEdItemHtml += itemDetailsBuzz.oped+'<br/>';						
					}
				}
				
				return ( !!opEdItemHtml ? '<p>' + opEdItemHtml + '</p>' : '');
			}
							
			
			function getOriginUrlHtml(){
				var itemDetailsBuzz = itemDetails.wsBuzz;
				var originUrlHtml = "";
				
				if( !!itemDetailsBuzz ){
					var storyUrl = itemDetailsBuzz.storyUrl;
					if( !!storyUrl ){
						originUrlHtml += ' via <a class="storyViaLink" href="' + storyUrl + '">' + TN.utils.getBaseUrl(storyUrl) + '</a>';
					}
				}
				
				return originUrlHtml;
			}

			//temp
			var reclipsCount = 0;
			
			var storyImageUrl = (!!itemSummary.senderThumbImageUrl ?  itemSummary.senderThumbImageUrl : itemSummary.thumbImageUrl );

            var storyHtmlOld = '\
			<article class="story item"> \
				<section class="storyBlcok"> \
				<input class="messageId" type="hidden" value="' + itemSummary.messageId + '"/> \
					<img class="storyImage" src="' + storyImageUrl + '" alt="' + storyImageUrl.substr(storyImageUrl.search('picid')) + '"> \
					<div class="storyHeader"><h1 class="storyHeadline">'+itemSummary.headline+'</h1></div> \
				<hr class="hRulerStory"> \
				<div class="storyInfo block">' +
                getStoryCopy(itemDetails) +
                '</div> \
            <div class="storyComment block"> \
                        <ul class="storyCommentList"> \
                            <li class="like likeNormal"></li> \
                            <li class="dislike dislikeNormal"></li> \
                            <li class="comment"></li> \
                            <li class="reclip last"></li> \
                        </ul> \
                    </div>  \
                    <div class="storyPerson block"> \
                        <div class="block"> \
                            <img height="36" width="36" src="' + itemDetails.originatorThumbImageUrl + '"> \
					            <h2>by <a>' + itemDetails.originatorName + getOriginUrlHtml() + '</a></h2> \
					            <p>'+( !!itemDetails.wsMessage ? itemDetails.wsMessage.elapsedTime : '' )+'</p> \
				            </div> \
				            <hr class="hRulerStory"> \
				            <ul class="Personinfo">' +
                ( !!countersObject ?
                    '<li class="likesCount"><span>' + countersObject.likesCounter + '</span> likes</li> \
					            <li class="dislikesCount"><span>' + countersObject.unLikesCounter + '</span> dislikes</li> \
					            <li class="commentsCount"><span>' + TN.commentHandler.trueNumOfComments(itemDetails.messageResponseList) + '</span> comments</li> \
					            <li class="reclipsCount last"><span>' + reclipsCount + '</span> reclips</li>' :
                    '<li>Counters Info Not Available</li>') +
                '</ul> \
            </div>' +
                TN.commentHandler.getCommentsHtml(itemDetails.messageResponseList) +
                '</section> \
            </article>';

            var storyHtml = '<div class="mypageStoryBox item">\
            	<div class="mypageStoryInfo">\
					<input class="messageId" type="hidden" value="' + itemSummary.messageId + '"/> \
            		<img class="storyImage" src="' + storyImageUrl + '"/>\
            		<h1 class="story-title">' + itemSummary.headline + '</h1>\
            		<hr class="divider">' +
            		getStoryCopy(itemDetails) +
            	'</div><!--/mypageStoryInfo-->\
            	<div class="mypageStoryBoxOpt block">\
            		<!-- Button Bar -->\
            		<div class="button-bar centered">\
            			<ul class="button-group radius">\
            				<li><a href="javascript:void(0);" class="button like-button"><figure class="like-icon"></figure></a></li>\
            				<li><a href="javascript:void(0);" class="button dislike-button"><figure class="dislike-icon"></figure></a></li>\
            			</ul>\
            			<ul class="button-group radius">\
            				<li><a href="javascript:void(0);" class="button reclip-button"><figure class="reclip-icon"></figure></a></li>\
            				<li><a href="javascript:void(0);" class="button share-button"><figure class="share-icon"></figure></a></li>\
            			</ul>\
            		</div>\
            	</div><!--/mypageStoryBoxOpt-->\
            		<div class="mypageStoryBoxUser block">\
            			<img height="36" width="36" src="' + itemDetails.originatorThumbImageUrl + '" alt="user image"/>\
            			<h3 class="auther-info">by<a href="#">' + itemDetails.originatorName + getOriginUrlHtml() + '</a></h3>\
            			<p class="date-closed"><span>' + ( !!itemDetails.wsMessage ? itemDetails.wsMessage.elapsedTime : '' ) + '</span></p>\
            			<hr class="divider">\
            			<ul class="no-bullet results">' +
            				(!!countersObject ? 
	            				'<li class="likesCount"><span>' + countersObject.likesCounter + '</span> likes</li>\
	            				<li class="dislikesCount"><span>' + countersObject.unLikesCounter + '</span> dislikes</li>\
	            				<li class="commentsCount"><span>' + TN.commentHandler.trueNumOfComments(itemDetails.messageResponseList) + '</span> comments</li>\
	            				<li class="reclipsCount"><span>' + reclipsCount + '</span> reclips</li>' : 
	            				'<li>Counters Info Not Available</li>' ) +
                		'</ul>\
            		</div><!--/mypageStoryBoxUser-->' + 
                    TN.commentHandler.getCommentsHtml(itemDetails.messageResponseList) +
                    TN.commentHandler.getCommentBoxHtml() +
            	'</div><!--/mypageStoryBox-->';

		    return storyHtml;
		}
		
		
		function getItemDetails(itemSummary, ourAjaxCallId){
			var messageId = itemSummary.messageId;
			TN.services.getFittingRoomRequest(custId, messageId).
				done(function(json){
					if( !!json && !!json[0] && ourAjaxCallId === currAjaxCallId ){
						
						function addItemToPage(countersObject){
							itemCount++;

							TN.utils.storeDetailItem(messageId, json[0], countersObject);
							imagesHtml += getImageItemHtml(itemSummary, json[0], countersObject);
							// Once final item details are loaded, load the DOM
							if( itemCount === totalItems ){
								var imagesHtmlElem = $(imagesHtml);
                                // Test for unreachable or corrupt images and remove stories (article element)
                                // with such images before appending anything to masonryCont since they break
                                // the "lightbox" function:
                                imagesHtmlElem.find('.storyImage').each(function(){
                                    var tempImgElem = $(this);
                                    tempImgElem.attr("src", this.src).error(function(){
                                        TN.utils.deleteDetailItem(tempImgElem.parent().find('.messageId').val());
                                        tempImgElem.parent().parent().detach();
                                    });
                                });
                                imagesHtmlElem.hide();

								imageContainer.append(imagesHtmlElem);
								
								$('.comments').unbind('click').bind('click', function(){
									var jqElem = $(this);
									TN.commentHandler.getAllComments(jqElem, jqElem.parents('.mypageStoryBox'));
								});
							
								$('.mypageStoryBox').each(function(){
									var currStoryElem = $(this);
									TN.commentHandler.addCommentBoxFunctions(currStoryElem);
								});
								
								$('.like-button').unbind('click').click(function(){
									
									if( !likeBeingProcessed ){
										likeBeingProcessed = true;
										var jqElem = $(this);
										var parentCont = jqElem.parents('.mypageStoryBox');
										
										if( !!parentCont.data('like') ){
											TN.likeHandler.reverseLikeCount( custId, parentCont, catType, jqElem).
												always(function(){
													likeBeingProcessed = false;
												});
										}
										else {
											TN.likeHandler.updateLikeCount( custId, parentCont, catType, jqElem).
												always(function(){
													likeBeingProcessed = false;
												});
										}
									}				
								});
								
								$('.dislike-button').unbind('click').click(function(){
									if( !dislikeBeingProcessed ){
										dislikeBeingProcessed = true;
										var jqElem = $(this);
										var parentCont = jqElem.parents('.mypageStoryBox');
										
										if( !!parentCont.data('dislike') ){
											TN.likeHandler.reverseDislikeCount( custId, parentCont, catType, jqElem).
												always(function(){
													dislikeBeingProcessed = false;
												});
										}
										else {
											TN.likeHandler.updateDislikeCount( custId, parentCont, catType, jqElem).
												always(function(){
													dislikeBeingProcessed = false;
												});
										}
									}									
								});
								
								$('.reclip-button').unbind('click').click(function(){
									if( !reclipBeingProcessed ){
										reclipBeingProcessed = true;
										
										var jqElem = $(this);
										var parentCont = jqElem.parents('.mypageStoryBox');
										var messageId = parentCont.find('.messageId').val();
										
										TN.services.addToWishListWithFittingRoomData(custId, messageId, 'public').
										done(function(){
											alert('This item has been successfully added to favorites');
										}).
										always(function(){
											reclipBeingProcessed = false;
										});
									}
								});
								
								$('.share-button').unbind('click').click(function(){
									var jqElem = $(this);
									var parentCont = jqElem.parents('.mypageStoryBox');
									var messageId = parentCont.find('.messageId').val();
									
									var infoStruct = TN.utils.getDetailItem(messageId);
					            	TN.sharingHandler.initStoryShare(infoStruct);
								});
								
								if( pageNum === 0 ){
									imageContainer.masonry({
										itemSelector : '.item',
										isFitWidth: true,
										columnWidth : 0
									});
								} else {
									imageContainer.masonry('appended', imagesHtmlElem);
								}
								
								pageNum++;
								imagesHtmlElem.show();

								imageContainer.imagesLoaded( function() {									
									
									if( ourAjaxCallId === currAjaxCallId ){
										$('.storyImage').unbind('click').click(function(){
											var parentCont = $(this).parents('.mypageStoryBox');
											var messageId = parentCont.find('.messageId').val();
											okToLoadMore = false;
											TN.lightbox.show(custId, messageId, function(newLikesCount, newDislikesCount, newCommentsCount){
												okToLoadMore = true;
												
												if( !!newLikesCount || newLikesCount === 0 ){
													parentCont.find('.likesCount span').html(newLikesCount);
												}
												if( !!newDislikesCount || newDislikesCount === 0 ){
													parentCont.find('.dislikesCount span').html(newDislikesCount);
												}
												if( !!newCommentsCount || newCommentsCount === 0 ){
													parentCont.find('.commentsCount span').html(newCommentsCount);
												}
												
												TN.commentHandler.reloadComments(parentCont);
											});
										});
										
										imageContainer.masonry();
										
										okToLoadMore = true;
									}
								});			
							}
						}					
						
						TN.services.getMesageStats(messageId).done(function(countersJson){
							if( !!countersJson && countersJson[0] && ourAjaxCallId === currAjaxCallId ){
								addItemToPage(countersJson[0]);
							}
						}).fail(function(){
							addItemToPage();
						});
					}
				}
			);
		}
		
		function loadImageContainer( json, ourAjaxCallId ){
															
			if( json && json[0] ){
				
				maxPages = parseFloat(json[0].noOfPages);
				
				if( json[0].fittingRoomSummaryList  ){

					totalItems = json[0].fittingRoomSummaryList.length;
					for( var i = 0; i<totalItems; i++ ){
						var currItem = json[0].fittingRoomSummaryList[i];
						if(!!currItem){
							//get details of the currentitem
							getItemDetails(currItem, ourAjaxCallId );
						}
					}									
				}
			}
		}
		
		function loadImageContainerFromSearch( json, ourAjaxCallId ){
			if( !!json ){
				maxPages = 1;
				
				totalItems = json.length;
				for( var i = 0; i < totalItems; i++ ){
					var currItem = json[i];
					if( !!currItem ){
						//get details of the currentitem
						getItemDetails(currItem, ourAjaxCallId);
					}
				}
			}
		}
		
		function loadImageContainerFromTopStories( json, ourAjaxCallId ){
			if( json ){
				maxPages = 1;

				totalItems = json.length;
				for( var i = 0; i<totalItems; i++ ){
					var currItem = json[i];
					if(!!currItem){
						//get details of the currentitem
						getItemDetails(currItem, ourAjaxCallId);
					}
				}									
			}
		}
		
		function loadItems(){
			var numItems = 25;
			
			totalItems = 0;
			itemCount = 0;
			imagesHtml = "";		
			
			if( pageNum > 0 ){
				numItems = 5;
			}
			
			currAjaxCallId = new Date().getTime();
			var searchPhrase = $('#storiesSearch').val();
			if( !!searchPhrase ){
				(function(){
					var ourAjaxCallId = currAjaxCallId;
					okToLoadMore = false;
		            TN.services.searchStories( searchPhrase, 1, 20 ).
            		done(function(data){
            			if( ourAjaxCallId === currAjaxCallId ){
            				loadImageContainerFromSearch(data, ourAjaxCallId);            				
            			}
            		});
				}());				
			}
			else {
				if( !!catType ){
					(function(){
						var ourAjaxCallId = currAjaxCallId;
						okToLoadMore = false;
			            TN.services.getAllRequestSummaries(custId, numItems, pageNum + 1, catType).
			            done(function(data){
			            	if( ourAjaxCallId === currAjaxCallId ){
				            	loadImageContainer(data, ourAjaxCallId);
			            	}
			            });
					}());
				}
				else {
					(function(){
						var ourAjaxCallId = currAjaxCallId;
						okToLoadMore = false;
						TN.services.getTopStories(custId).
						done(function(data){
							if( ourAjaxCallId === currAjaxCallId ){
								loadImageContainerFromTopStories(data, ourAjaxCallId);								
							}
						});						
					}());
				}			
			}
		};
		
		$topStories.reload = function(newType){
			catType = newType;
			if( imageContainer.html().trim() ){
				imageContainer.masonry('destroy');
			}
			$('#storiesSearch').val('');
			imageContainer.empty();
			pageNum = 0;
			loadItems();
		};
		
		$topStories.search = function(searchPhrase){
			if( !!searchPhrase ){
				if( imageContainer.html().trim() ){
					imageContainer.masonry('destroy');
				}
				imageContainer.empty();
				pageNum = 0;
				totalItems = 0;
				itemCount = 0;
				imagesHtml = "";
				catType = "";
                TN.utils.setDropdownValue(catListElem, 'All Categories');
    			loadItems();                
			}
		};
		
		$(window).scroll( function() {
			if (( $(window).scrollTop() >= $(document).height() - $(window).height() - 500  ) && imageContainer.is(':visible') && okToLoadMore) { 
				if( pageNum < maxPages ){
					loadItems();
				}
			}
		});
		
	}(topStories));
	
	function loadCategories(){
		
        var csCatDropdown = $('#storyCatsDropDown > ul');
        function addCategoryItem(itemText){
        	var categoryItemElem = null;
        	
        	if( itemText === 'All Categories' ){
            	categoryItemElem = $('<li id="allCatsOption">' + itemText + '</li>');           		
        	} else {
            	categoryItemElem = $('<li>' + itemText + '</li>');
        	}            	
        	
        	categoryItemElem.click(function(){
        		var currElem = $(this);
                TN.utils.setDropdownValue(catListElem, currElem.text()); 
                
                if( currElem.text() === 'Trending News' ){
    				topStories.reload('Breaking News');                	
                }
                else {
                    if( currElem.text() === 'All Categories' ){
        				topStories.reload('');
                    }
                    else {
        				topStories.reload(currElem.text());
                    }
                }
        		$('body').click();
        		return false;        	
        	});
        	
        	csCatDropdown.append(categoryItemElem);
        }
                
        addCategoryItem('All Categories');
        TN.utils.setDropdownValue(catListElem, 'All Categories');

		TN.services.getAllMessageTypeActiveCategories().done(function(json){
			if( !!json ){
				var maxItems = json.length;
				for( var i = 0; i < maxItems; i++ ){
					if( json[i].global === 1 || json[i].global === 0 ){
						var currCat = json[i].id;
						if( currCat === "Breaking News"){
	                    	addCategoryItem('Trending News');
						} 
						else {
	                    	addCategoryItem(currCat);
						}
					}
				}
				
                TN.utils.setDropdownValue(catListElem, 'Trending News');            		
				topStories.reload('Breaking News');
			}
		});
	};
	
	$allStories.initialize = function(){
//		TN.Header.initialize();
		TN.services.keepThisSessionAlive();
		imageContainer= $('#container');
		
//		topStories.reload("Breaking News");
		loadCategories();
		
        $('#storiesSearch').keyup(function(event){
            if( event.which === 13 ){        
                var searchTxt = $('#storiesSearch').val();
            	topStories.search(searchTxt);                
            }
        });
        
        $('#storySearchIcon').click(function(){
                var searchTxt = $('#storiesSearch').val();
            	topStories.search(searchTxt);                
        });
	};
	
}(TN.allStories));
