if (!TN) var TN= {};
if(!TN.newspaperViewLB) TN.newspaperViewLB = {};

(function($newspaperViewLB){
	
	var custId = TN.utils.getCookie('TNUser');
    var currNewspaperId = 0;
        
    function getStoryHtml(storyObj){
		
		function getOpedHtml(){
			var opedHtml = "";
			
			if( !!storyObj.buzzWho ){
				opedHtml += "<p>Who:"+ storyObj.buzzWho + "</p>";
			}
			if( !!storyObj.buzzWhat ){
				opedHtml += "<p>What:"+ storyObj.buzzWhat + "</p>";
			}
			if( !!storyObj.buzzWhere ){
				opedHtml += "<p>Where:"+ storyObj.buzzWhere + "</p>";
			}
			if( !!storyObj.buzzWhen ){
				opedHtml += "<p>When:"+ storyObj.buzzWhen + "</p>";
			}
			if( !!storyObj.buzzHow ){
				opedHtml += "<p>How:"+ storyObj.buzzHow + "</p>";
			}
			if( !!storyObj.buzzWhy ){
				opedHtml += "<p>Why:"+ storyObj.buzzWhy + "</p>";
			}
			if( !!storyObj.buzzOped ){
				opedHtml += "<p>"+ storyObj.buzzOped + "</p>";
			}
			
			return opedHtml;
		}
		
		var storyHtml = '<div id="story_' + storyObj.buzzId + '" class="storyNPBlock" onclick="TN.newspaperViewLB.addWidget(this);" story-id="' + storyObj.buzzId +'">\
				<div class="story-img-wrapper">\
					<img class="story-img" style="width:116px;margin-left:5px;margin-right:5px;margin-top:5px;" src="' + storyObj.storyOriginalImg + '" title="Story Image" >\
				</div>\
				<h1 class="storyHeading">' + storyObj.headline + '</h1>\
				<div class="story-content-wrapper">\
	    			<div class="story-content block">\
						<!--input class="storyOriginalImage" type="hidden" value="' + storyObj.storyOriginalImg + '"/>\
						<input class="storyThumbImage" type="hidden" value="' + storyObj.storyThumbImg + '"/>\
						<input class="buzzId" type="hidden" value="' + storyObj.buzzId + '"/> \
						<input class="imageId" type="hidden" value="' + storyObj.imageId + '"/> \
						<input class="elementId" type="hidden" value="' + storyObj.elementId + '"/-->' +
						getOpedHtml() +
	    			'</div>\
	    			<div class="NPLBoriginator-content block">\
	    				<img  src="' + storyObj.originatorImageUrl + '">\
	    				<h1>' + storyObj.originatorName + '</h1>\
	    				<p class="storyDate">' + storyObj.elapsedTime + '</p>\
	    			</div>\
    			</div>\
    		</div>';
		
		
		return storyHtml;
	}
	
	function getDividerHtml(dividerObj){
		var dividerHtml = '<div class="NPLBdividerHeading">\
								<p>' + dividerObj.headline + '</p> \
						   </div>';
		return dividerHtml;
	}
	
	function loadNewspaper(npId){
		function showNewspaper(json){
			
			if( !!json && !!json[0] ){

				/*var NPTemplateHeader = '<div class="block newspaper-header">\
				    <div class="newspaper-title"><h1><span class="inactive" id="npHeadline"></span></h1></div>\
				    <p class="newspaperSection"><span class="inactive" id="npEdition"></span></p>\
				    <p class="newspaperPlace"><span class="inactive" id="npLocation"></span></p>\
			    </div>';*/

				var NPTemplate = '<div id="NPLBcontentRight" class="NPLBcontentRight block reveal-modal">\
					<a class="close-reveal-modal"></a>\
					<div style="padding:0px 15px 70px 5px; margin-bottom: 40px">\
					    <div class="block NPLBnewspaper-header">\
						    <div class="NPLBnewspaper-title"><h1><span class="inactive" id="npHeadline"></span></h1></div>\
						    <p class="NPLBnewspaperSection"><span class="inactive" id="npEdition"></span></p>\
						    <p class="NPLBnewspaperPlace"><span class="inactive" id="npLocation"></span></p>\
					    </div>\
					    <div id="NPRevealShareButtons"></div>\
					    <div id="NPRevealLikeButtons"></div>\
					    <div id="NPRevealDislikeButtons"></div>\
					    <!--div id="NPRevealCommentButtons"></div-->\
					    <br><br><br>\
						<!-- NewsPaper Layout -->\
						<div class="NPLBnewspaperLayout NPLBlayoutBackground" id="newspaperLayout">\
							<div class="gridster ready">\
							<ul id="gridsterList" style="position: relative;"></ul>\
							</div>\
						</div>\
						<div id="bottomButtonSet" style="float:right">\
							<img style="height:38px" id="NPLBReturnButton" src="images/newspaper/NPLBReturnButton.png" onclick="location.href=\'#NPLBcontentRight\'">\
							<img style="height:38px" id="NPLBBackButton" src="images/newspaper/NPLBBackButton.png" onclick="$(\'a.close-reveal-modal\').trigger(\'click\');">\
						</div>\
					</div>\
				</div>';
				//var NPTemplateHeader = '<div></div>';
				//var NPTemplate = '<div></div>';

				var jQNPTemplate = $(NPTemplate);
				//var jQNPTemplateHeader = $(NPTemplateHeader);

				var newspaperJson = json[0];

				// needed for determining pageFull div height:
				var maxYPlusHeight = 0;
				var isOldFormatNP = false;

				var npHeadlineElem = jQNPTemplate.find('#npHeadline');
				var npEditionElem = jQNPTemplate.find('#npEdition');
				var npLocationElem = jQNPTemplate.find('#npLocation');
				
				npHeadlineElem.text((!!newspaperJson.headline ? newspaperJson.headline : ''));
				npEditionElem.text((!!newspaperJson.edition ? newspaperJson.edition : ''));
				npLocationElem.text((!!newspaperJson.location ? newspaperJson.location : ''));
				
				jQNPTemplate.find('#NPRevealShareButtons').click(function(){
					TN.sharingHandler.initNPShare(npId, newspaperJson.headline);
				});
				
				currNewspaperId = ( !!newspaperJson.id ? newspaperJson.id : 0 );
				
				npHeadlineElem.css('color', newspaperJson.titleFontColor);
				npHeadlineElem.css('font-family', newspaperJson.titleFontStyle);				
				npHeadlineElem.css('font-size', newspaperJson.titleFontSize);
			
				npLocationElem.css('color', newspaperJson.locEdFontColor);
				npEditionElem.css('color', newspaperJson.locEdFontColor);
			
				npLocationElem.css('font-family', newspaperJson.locEdFontStyle);
				npEditionElem.css('font-family', newspaperJson.locEdFontStyle);
			
				npLocationElem.css('font-size', newspaperJson.locEdFontSize);
				npEditionElem.css('font-size', newspaperJson.locEdFontSize);			

				currNewspaperId = ( !!newspaperJson.id ? newspaperJson.id : 0 );
				
				if( 'dividers' in newspaperJson ){
					var dividersArray = newspaperJson.dividers;
					var numDividers = dividersArray.length;
					for( var i = 0; i < numDividers; i++ ){
						var currDivider = dividersArray[i];
						var dividerHtml = getDividerHtml(currDivider);
						var dividerHtmlElem = $(dividerHtml);
						
						var coordinates = {
							ypos: currDivider.ypos,
							xpos: currDivider.xpos,
							width: currDivider.pixelWidth,
							height: currDivider.pixelHeight
						};

						if ( !coordinates.ypos && !coordinates.xpos && !coordinates.width && !coordinates.height ) isOldFormatNP = true;

						var newWidget = $('<div></div>').append(dividerHtmlElem);
						
						var headingElem = newWidget.find('.NPLBdividerHeading > p');
						headingElem.css('color', currDivider.fontcolor);
						headingElem.css('font-size', currDivider.fontsize);
						headingElem.css('font-family', currDivider.fontstyle);
						headingElem.css('left', coordinates.xpos+'px').css('top', coordinates.ypos+'px');
						headingElem.css('width', coordinates.width+'px')
						headingElem.css('height', coordinates.height+'px')

						var addedWidget = newWidget;
            			//addedWidget.css('position', 'absolute');           			
        				addedWidget.find('.NPLBdividerHeading').css('height',  addedWidget.height() );

        				jQNPTemplate.find('#gridsterList').append(addedWidget);
					}
				}
				
				if( 'stories' in newspaperJson ){
					var storiesArray = newspaperJson.stories;
					var numStories = storiesArray.length;
					for( var i = 0; i < numStories; i++ ){
						var currStory = storiesArray[i];
						var storyHtml = getStoryHtml({
                            headline: currStory.headline,
                            buzzId: currStory.customerBuzzId,
                            imageId:-1,
							elementId:currStory.elementId,
                            storyThumbImg: currStory.buzzThumbImageURL,
                            storyOriginalImg: currStory.buzzImageURL,
                            buzzWhat:currStory.what,
                            buzzWhen:currStory.when,
                            buzzWhere:currStory.where,
                            buzzWhy:currStory.why,
                            buzzWho:currStory.who,
                            buzzHow:currStory.how,
                            buzzOped:currStory.oped,
                            originatorImageUrl: currStory.authorImageUrl,
                            originatorName: currStory.authorName,
                            elapsedTime: !!currStory.date ? currStory.date : ''									
						});
						
						var coordinates = {
							ypos: currStory.ypos,
							xpos: currStory.xpos,
							width: currStory.pixelWidth,
							height: currStory.pixelHeight
						};
						
						if ( !coordinates.ypos && !coordinates.xpos && !coordinates.width && !coordinates.height ) isOldFormatNP = true;

						var currHeightTest = coordinates.ypos + coordinates.height;
						if (currHeightTest > maxYPlusHeight) maxYPlusHeight = currHeightTest;

						var storyHtmlElem = $(storyHtml);
						storyHtmlElem.css('opacity', '1.0');
						storyHtmlElem.css('display', 'block');

						var headingElem = storyHtmlElem.find('.storyHeading');
						headingElem.css('color', currStory.fontcolor);
						headingElem.css('font-size', currStory.fontsize);
						headingElem.css('font-family', currStory.fontstyle);
						
						storyHtmlElem.find('.story-content p').each(function(){
							var currOpedElem = $(this);
							currOpedElem.css('color', currStory.bodyfontcolor);
							currOpedElem.css('font-size', currStory.bodyfontsize);
							currOpedElem.css('font-family', currStory.bodyfontstyle);								
						});
						
						storyHtmlElem.find('.story-img').css('width', (coordinates.width-10)+'px');
						storyHtmlElem.css('width', coordinates.width+'px');
						storyHtmlElem.css('height', coordinates.height+'px').css('float', 'left');
						storyHtmlElem.css('position', 'absolute').css('left', coordinates.xpos+'px').css('top', coordinates.ypos+'px');

						jQNPTemplate.find('#gridsterList').append(storyHtmlElem);

					}
				}

				if (isOldFormatNP) alert('For testers: this is old format newspaper and it doesn\'t have story coordinates saved in proper format.\nPlease resave it in Workspace and try viewing it again.');
				else {
					// Remove previous "reval buffer" before appending new one:
					$('#NPLBcontentRight').remove();
					jQNPTemplate.height(maxYPlusHeight+260);
					jQNPTemplate.find('#bottomButtonSet').css('margin-top', maxYPlusHeight+65);
					jQNPTemplate.find('#NPRevealShareButtons, #NPRevealLikeButtons, #NPRevealDislikeButtons, #NPRevealCommentButtons').hover(
						function(){
						    $(this).css('background-position', 'left center');
						},
						function(){
						    if (! $(this).hasClass('npRevealActiveButton') ) $(this).css('background-position', 'right center');
						}
					);
					jQNPTemplate.find('#NPRevealLikeButtons').click(function(event){
						TN.services.npLike(custId, currNewspaperId).done(function(msg){
							if (msg[0] == true) {
								$('#'+event.currentTarget.id).addClass('npRevealActiveButton');
								$('#NPRevealDislikeButtons').removeClass('npRevealActiveButton');
							}
						});
					});
					jQNPTemplate.find('#NPRevealDislikeButtons').click(function(event){
						TN.services.npUnlike(custId, currNewspaperId).done(function(msg){
							if (msg[0] == true) {
								$('#'+event.currentTarget.id).addClass('npRevealActiveButton');
								$('#NPRevealLikeButtons').removeClass('npRevealActiveButton');
							}
						});
					});
					jQNPTemplate.find('#NPRevealCommentButtons').click(function(){
						jQuery.noop();
					});
					$('body').append(jQNPTemplate);
					$('#NPLBcontentRight').reveal();
					TN.services.npRead(custId, currNewspaperId);

				}
			}
		}
		
		if( npId > 0 ){
			TN.services.getNewspaper(npId).
				done(showNewspaper).
				fail(function(jqXHR, textStatus, errorThrown){
					alert('There was an error in retrieving the newspaper: (' +  jqXHR.status + ') ' + errorThrown);
				});
		}
		else {
			alert('Invalid newspaper id');
		}
	}
    
	$newspaperViewLB.init = function(npid){
		loadNewspaper(npid);

	};


}(TN.newspaperViewLB));