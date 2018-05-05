if(!TN) var TN = {};
if (!TN.viewAll) TN.viewAll = {};

(function($viewAll){
	
	var imageContainer = null;
	var topStories = {};
	var custId = TN.utils.getCookie('TNUser');
	var likeBeingProcessed = false;
	var dislikeBeingProcessed = false;
	var reclipBeingprocessed = false;
	
	(function($topStories){
		var pageNum = 0;
		var maxPages = 1;
		var catType;
		var okToLoadMore = false;
		var totalItems = 0;
		var itemCount = 0;
		var imagesHtml = "";		
		
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

            var storyHtml = '\
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

		    return storyHtml;
		}
		
		
		function getItemDetails(itemSummary){
			var messageId = itemSummary.messageId;
			TN.services.getFittingRoomRequest(custId, messageId).
				done(function(json){
					if( !!json && !!json[0] ){
						
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

								imageContainer.append(imagesHtmlElem).imagesLoaded( function() {
									
									$('.allStoryBlocks').unbind().bind('click', function(){
										var jqElem = $(this);
										TN.commentHandler.getAllComments(jqElem, jqElem.parents('.storyBlcok'));
									});
								
									if( pageNum === 0 ){
										imageContainer.masonry({
											itemSelector : '.story',
											isFitWidth: true,
											columnWidth : 227,
											gutterWidth:25
										});
									} else {
										imageContainer.masonry('appended', imagesHtmlElem);
									}
									
									pageNum++;
									imagesHtmlElem.show();
									
									$('#catSelector').attr('disabled', false);
									okToLoadMore = true;
								});			
							}
						}
						
						
						TN.services.getMesageStats(messageId).done(function(countersJson){
							if( !!countersJson && countersJson[0] ){
								addItemToPage(countersJson[0]);
							}
						}).fail(function(){
							addItemToPage();
						});
					}
				}
			);
		}
		
		function loadImageContainer( json ){
															
			if( json && json[0] ){
				
				maxPages = parseFloat(json[0].noOfPages);
				
				if( json[0].fittingRoomSummaryList  ){

					totalItems = json[0].fittingRoomSummaryList.length;
					for( var i = 0; i<totalItems; i++ ){
						var currItem = json[0].fittingRoomSummaryList[i];
						if(!!currItem){
							//get details of the currentitem
							getItemDetails(currItem);
						}
					}									
				}
			}
		}
		
		function loadImageContainerFromTopStories( json ){
			if( json ){
				maxPages = 1;

				totalItems = json.length;
				for( var i = 0; i<totalItems; i++ ){
					var currItem = json[i];
					if(!!currItem){
						//get details of the currentitem
						getItemDetails(currItem);
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

			if( !!catType ){
	            TN.services.getAllRequestSummaries(custId, numItems, pageNum + 1, catType).
		            done(loadImageContainer).
		            fail(function(){
		                $('#catSelector').attr('disabled', false);
		            });
			}
			else {
				TN.services.getTopStories(custId).
					done(loadImageContainerFromTopStories).
					fail(function(){
						$('#catSelector').attr('disabled', false);
					});
			}			

		};
		
		$topStories.reload = function(newType){
			catType = newType;
			if( imageContainer.html().trim() ){
				imageContainer.masonry('destroy');
			}
			imageContainer.empty();
			pageNum = 0;
			$topStories.show();
		};
		
		$topStories.show = function(){
			// disable the category select dropdown
			$('#catSelector').attr('disabled', true);
			
			loadItems();
			
			$('.storyBlcok .storyComment .comment').livequery('click', function(){
				TN.commentHandler.addCommentBox($(this).parents('.storyBlcok'));
			});
				
			$('.storyBlcok .storyComment .like').livequery('click', function(){
				if( !likeBeingProcessed ){
					likeBeingProcessed = true;
					var jqElem = $(this);
					var parentCont = jqElem.parents('.storyBlcok');
					
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
			
			$('.storyBlcok .storyComment .like').livequery('mousedown', function(){
				var jqElem = $(this);
				jqElem.removeClass('likeNormal');
				jqElem.removeClass('likeSelected');
				jqElem.addClass('likeClicked');
			});
			
			$('.storyBlcok .storyComment .like').livequery('mouseleave', function(){
				var jqElem = $(this);
				
				if( jqElem.hasClass('likeClicked') ){
					var parentCont = jqElem.parents('.storyBlcok');
					
					jqElem.removeClass('likeClicked');
					if( !!parentCont.data('like') ){
						jqElem.addClass('likeSelected');
					}
					else {
						jqElem.addClass('likeNormal');
					}
				}
			});
			
			$('.storyBlcok .storyComment .dislike').livequery('click', function(){
				if( !dislikeBeingProcessed ){
					dislikeBeingProcessed = true;
					var jqElem = $(this);
					var parentCont = jqElem.parents('.storyBlcok');
					
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
			
			$('.storyBlcok .storyComment .dislike').livequery('mousedown', function(){
				var jqElem = $(this);
				jqElem.removeClass('dislikeNormal');
				jqElem.removeClass('dislikeSelected');
				jqElem.addClass('dislikeClicked');
			});
			
			$('.storyBlcok .storyComment .dislike').livequery('mouseleave', function(){
				var jqElem = $(this);
				
				if( jqElem.hasClass('dislikeClicked') ){
					var parentCont = jqElem.parents('.storyBlcok');
					
					jqElem.removeClass('dislikeClicked');
					if( !!parentCont.data('dislike') ){
						jqElem.addClass('dislikeSelected');
					}
					else {
						jqElem.addClass('dislikeNormal');
					}
				}
			});
			
			$('.storyBlcok .storyComment .reclip').livequery('click', function(){
				if( !reclipBeingprocessed ){
					reclipBeingprocessed = true;
					
					var jqElem = $(this);
					var parentCont = jqElem.parents('.storyBlcok');
					var messageId = parentCont.find('.messageId').val();
					
					TN.services.addToWishListWithFittingRoomData(custId, messageId, 'public').
					done(function(){
						alert('This item has been successfully added to favorites');
					}).
					fail(function(jqXHR, textStatus, errorThrown){
						alert('There was an error in processing your request:' + errorThrown);
					}).
					always(function(){
						reclipBeingprocessed = false;
					});
				}
			});
			
			$('.storyBlcok').livequery('mouseleave', function(){
				$(this).find('.imageHoverBox').hide();
			});
			
			$('.storyBlcok .storyImage, .storyBlcok .storyInfo, .storyBlcok .storyHeadline').livequery('click', function(){
				var parentCont = $(this).parents('.storyBlcok');
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
				
		};
				
		$(window).scroll( function() {
			if (( $(window).scrollTop() >= $(document).height() - $(window).height() - 500 ) && imageContainer.is(':visible') && okToLoadMore) { 
				if( pageNum < maxPages ){
					loadItems();
				}
			}
		});
		
	}(topStories));
	
	function loadCategories(){
		TN.services.getAllMessageTypeActiveCategories().done(function(json){
			if( !!json ){
				var csCatDropdown = $('#catSelector');
				var maxItems = json.length;
				for( var i = 0; i < maxItems; i++ ){
					if( json[i].global === 1 || json[i].global === 0 ){
						var currCat = json[i].id;
						if( currCat === "Breaking News"){
							csCatDropdown.append('<option value="'+ currCat + '">' + 'Trending News' + '</option>');							
						} 
						else {
							csCatDropdown.append('<option value="'+ currCat + '">' + currCat + '</option>');
						}
					}
				}
				csCatDropdown.change(function(){
					topStories.reload($(this).find('option:selected').attr('value'));
				});
				
				csCatDropdown.val('Breaking News').change();
			}
		});
	};
	
	$viewAll.initialize = function(){
		TN.baseHeader.initialize();
		TN.services.keepThisSessionAlive();
		imageContainer= $('#imageContainer');
		loadCategories();
	};
	
}(TN.viewAll));
