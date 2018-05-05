if(!TN) var TN = {};
if(!TN.allNewspapers) TN.allNewspapers = {};

(function ($allNewspapers){
	var imageContainer = null;
	var currAjaxCallId = null;
	
	function getNewspaperHtml(currNewspaper){
		var npHtml;
		npHtml = '<div class="myPageNewspaperBox item">\
         	<div class="mainimageContainer">\
             </div><!--/mainimageContainer-->\
             <ul class="myPageNewspaperBox_List">\
             </ul>\
             <h2>' + currNewspaper.headline + '</h2>\
         </div>';
		return npHtml;
	}
	
	function loadNewspaper(ourAjaxCallId, npId, targetHtmlElem){
		
		TN.services.getNewspaper(npId).done(function(json){
			function getImageHtml(url, width, height){
				var imageHtml = '<img src="' + url + '"' +
					' onload="TN.utils.normalizeImage(this, ' + width + ',' + height + ');"/>';
				
				return imageHtml;
			}
			
			if( ourAjaxCallId === currAjaxCallId ){
				if( !!json && !!json[0] ){
					var newspaperJson = json[0];
					
					if( 'stories' in newspaperJson ){
						var storiesArray = newspaperJson.stories;
						var numStories = storiesArray.length;
						
						var firstImageCont = targetHtmlElem.find('.mainimageContainer');
						firstImageCont.empty();
						if( numStories > 0 ){
							var firstStory = storiesArray[0];
							firstImageCont.append(getImageHtml(firstStory.buzzThumbImageURL , 230, 230));
													
							if( numStories > 1 ){
								var remainingImagesCont = targetHtmlElem.find('.myPageNewspaperBox_List');
								for( var i = 1; i < 5; i++ ){
									if( i < numStories ){
										var currStory = storiesArray[i];
										remainingImagesCont.append('<li>' + getImageHtml(currStory.buzzThumbImageURL, 54, 62) + '</li>');									
									}
									else {
										remainingImagesCont.append('<li></li>');									
									}
								}
								
								imageContainer.masonry();						
							}
						}
						else {
							firstImageCont.append('This newspaper does not contain any images');
						}
					}
					targetHtmlElem.click(function(){
						TN.newspaperViewLB.init(npId);
					});
				}
			}
		}).fail(function(){
			if( ourAjaxCallId === currAjaxCallId ){
				targetHtmlElem.empty().remove();
				imageContainer.masonry();
			}
		});
	}
	
	function loadNewspapers(){
		currAjaxCallId = new Date().getTime();
		
		(function(){
			var ourAjaxCallId = currAjaxCallId;
			TN.services.getNewspapers().done(function(json){
				if( ourAjaxCallId === currAjaxCallId ){
					if( !!json && json.length ){
						imageContainer.empty();
						var numNewspapers = json.length;
						for( var i = 0; i < numNewspapers; i++ ){
							var currNewspaper = json[i];
							var currNewspaperHtmlElem = $(getNewspaperHtml(currNewspaper));
							imageContainer.append(currNewspaperHtmlElem);
							if(i === 0){
								imageContainer.masonry({
									itemSelector : '.item',
									isFitWidth: true,
									columnWidth : 0
								});
							}
							else{
								imageContainer.masonry('appended', currNewspaperHtmlElem);
							}
							loadNewspaper(ourAjaxCallId, currNewspaper.id, currNewspaperHtmlElem);
						}					
					}					
				}
			}).fail(function(jqXHR){
				if( ourAjaxCallId === currAjaxCallId ){
					if( jqXHR.status === 404 ){
						imageContainer.append('No newspapers available.');
					}
				}				
			});
		}());
	}
	
	$allNewspapers.initialize = function(){
		TN.services.keepThisSessionAlive();
		imageContainer= $('#container');
		loadNewspapers();
	};
})(TN.allNewspapers);