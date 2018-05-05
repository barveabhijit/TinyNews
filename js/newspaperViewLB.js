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
	    			<div class="originator-content block">\
	    				<img  src="' + storyObj.originatorImageUrl + '">\
	    				<h1>' + storyObj.originatorName + '</h1>\
	    				<p class="storyDate">' + storyObj.elapsedTime + '</p>\
	    			</div>\
    			</div>\
    		</div>';
		
		
		return storyHtml;
	}
	
	function getDividerHtml(dividerObj){
		var dividerHtml = '<div class="dividerHeading">\
								<p>' + dividerObj.headline + '</p> \
						   </div>';
		return dividerHtml;
	}
	
	function buildStoriesAndDividersArray(storiesArray, dividersArray){
		$('#gridsterList').children().each(function(index){
			var currElem = $(this);
			
			if( !!currElem.attr('story-id') ){
				var story = {
						'buzzImageId': currElem.find('.imageId').val(),
						'buzzImageUrl' : escape(currElem.find('.storyOriginalImage').val()),
						'buzzThumbImageUrl' : escape(currElem.find('.storyThumbImage').val()),
						'customerBuzzId' : currElem.find('.buzzId').val(),
						'elementId' : parseFloat(currElem.find('.elementId').val()),
						'bodyfontcolor' : currElem.find('.story-content p').css('color'),
						'bodyfontsize' : currElem.find('.story-content p').css('font-size'),
						'bodyfontstyle' : currElem.find('.story-content p').css('font-family'),
						'fontcolor' : currElem.find('.storyHeading').css('color'),
						'fontsize' : currElem.find('.storyHeading').css('font-size'),
						'fontstyle' : currElem.find('.storyHeading').css('font-family'),
						'index' : index,
						'jcolumn' : parseFloat(currElem.attr('data-col')),
						'jheight' : parseFloat(currElem.attr('data-sizey')),
						'jrow' : parseFloat(currElem.attr('data-row')),
						'jwidth' : parseFloat(currElem.attr('data-sizex'))
				};				
				storiesArray.push(story);
			}
			else {
				var headingElem = currElem.find('.dividerHeading > p');
				var divider = {
						'headline' : headingElem.text(),
						'fontcolor' : headingElem.css('color'),
						'fontsize' : headingElem.css('font-size'),
						'fontstyle' : headingElem.css('font-family'),
						'index' : index,
						'jcolumn' : parseFloat(currElem.attr('data-col')),
						'jheight' : parseFloat(currElem.attr('data-sizey')),
						'jrow' : parseFloat(currElem.attr('data-row')),
						'jwidth' : parseFloat(currElem.attr('data-sizex'))
				};
				dividersArray.push(divider);
			}			
		});
	}

	function loadNewspaper(npId){
		function showNewspaper(json){
			
			if( !!json && !!json[0] ){

				/*var NPTemplateHeader = '<div class="block newspaper-header">\
				    <div class="newspaper-title"><h1><span class="inactive" id="npHeadline"></span></h1></div>\
				    <p class="newspaperSection"><span class="inactive" id="npEdition"></span></p>\
				    <p class="newspaperPlace"><span class="inactive" id="npLocation"></span></p>\
			    </div>';*/

				var NPTemplate = '<div id="contentRight" class="contentRight block" style="left: 3px; width:824px; position:relative;">\
					<div style="padding:0px 15px 70px 15px; margin-bottom: 40px">\
					    <div class="block newspaper-header">\
						    <div class="newspaper-title"><h1><span class="inactive" id="npHeadline"></span></h1></div>\
						    <p class="newspaperSection"><span class="inactive" id="npEdition"></span></p>\
						    <p class="newspaperPlace"><span class="inactive" id="npLocation"></span></p>\
					    </div>\
					    <div style="float: right; position: relative; left: 18px; cursor: pointer" id="npLBPShareButton"><img width="40" src="images/newsPaper/NPLBShareButtonBlack.png"></div>\
					    <br><br><br>\
						<!-- NewsPaper Layout -->\
						<div class="newspaperLayout layoutBackground" id="newspaperLayout">\
							<div class="gridster ready">\
							<ul id="gridsterList" style="position: relative;"></ul>\
							</div>\
						</div>\
						<div id="bottomButtonSet" style="float:right">\
							<img height="35" id="NPLBReturnButton" src="images/newsPaper/NPLBReturnButton.png" onclick="location.href=\'#contentRight\'">\
							<img height="35" id="NPLBBackButton" src="images/newsPaper/NPLBBackButton.png" onclick="LightboxTool.close()">\
						</div>\
					</div>\
				</div>';
				/*var NPTemplateHeader = '<div></div>';
				var NPTemplate = '<div></div>';*/

				var jQNPTemplate = $(NPTemplate);
				//var jQNPTemplateHeader = $(NPTemplateHeader);

				var newspaperJson = json[0];

				// needed for determining pageFull div height:
				var maxYPlusHeight = 0;
				var isOldFormatNP = false;

				jQNPTemplate.find('#npHeadline').text((!!newspaperJson.headline ? newspaperJson.headline : ''));
				jQNPTemplate.find('#npEdition').text((!!newspaperJson.edition ? newspaperJson.edition : ''));
				jQNPTemplate.find('#npLocation').text((!!newspaperJson.location ? newspaperJson.location : ''));
				jQNPTemplate.find('#npLBPShareButton').click(function(){
					$('#lightboxCanvas').remove();
					$('.lighboxContainer').remove();
					TN.sharingHandler.initNPShare(npId, newspaperJson.headline);
				});

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
						//newWidget.append($('<div class="widget-closer"><img class="editImage" src="images/newsPaper/editPopupEditBtn-bg.png" width="15" height="15" alt="edit" title="Edit"></div>'));

						//Add the resizer
						//var resizerElem = $('<div class="widget-resizer"><img class="resizeImage" height="15" width="15" alt="resize" title="Resize" src="images/newsPaper/expand-icon.png" style="display:inline;"/></div>');

						//attachResizerEvents(resizerElem);
						
						//Append the resizer
						//newWidget.append(resizerElem);
						
						var headingElem = newWidget.find('.dividerHeading > p');
						headingElem.css('color', currDivider.fontcolor);
						headingElem.css('font-size', currDivider.fontsize);
						headingElem.css('font-family', currDivider.fontstyle);
						headingElem.css('left', coordinates.xpos+'px').css('top', coordinates.ypos+'px');
						headingElem.css('width', coordinates.width+'px')
						headingElem.css('height', coordinates.height+'px')

            			//var addedWidget = gridster.add_widget(newWidget, currDivider.jwidth, currDivider.jheight, 
            			//		currDivider.jcolumn, currDivider.jrow);
						var addedWidget = newWidget;
            			//addedWidget.css('position', 'absolute');           			
        				addedWidget.find('.dividerHeading').css('height',  addedWidget.height() );

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
						//storyHtmlElem.find('.story-img').css('height', coordinates.height+'px');
						storyHtmlElem.css('height', coordinates.height+'px').css('float', 'left');
						storyHtmlElem.css('position', 'absolute').css('left', coordinates.xpos+'px').css('top', coordinates.ypos+'px');

						//$newspaperViewLB.addWidget(storyHtmlElem, dimension);
						//log(storyHtmlElem); log(coordinates);

						jQNPTemplate.find('#gridsterList').append(storyHtmlElem);

					}
				}

				//$('.pageFull').append(jQNPTemplate);
				//$('.pageFull').before(jQNPTemplateHeader);
				//$('.pageFull').css('height', maxYPlusHeight+'px');
				if (isOldFormatNP) alert('For testers: this is old format newspaper and it doesn\'t have story coordinates saved in proper format.\nPlease resave it in Workspace and try viewing it again.');
				else {
					//jQNPTemplate.prepend(jQNPTemplateHeader);
					LightboxTool.displayLightbox( jQNPTemplate, {showHeader:true, width:830} );
					$('.lighboxContainer').height(maxYPlusHeight+260);
					jQNPTemplate.find('#bottomButtonSet').css('margin-top', maxYPlusHeight+20);
				}
			}
		}
		
		if( npId > 0 ){
			TN.services.getNewspaper(npId).
				done(showNewspaper).
				fail(function(jqXHR, textStatus, errorThrown){
					$('.pageFull, .newspaper-share').detach();
					$('#returnToTop').parent().detach();
					alert('There was an error in retrieving the newspaper: (' +  jqXHR.status + ') ' + errorThrown);				
				});
		}
		else {
			//$newspaperViewLB.cancelNewspaper();
			$('.pageFull, .newspaper-share').detach();
			$('#returnToTop').parent().detach();
		}
	}
    
	$newspaperViewLB.init = function(npid){
		loadNewspaper(npid);

	};
	
	/*$newspaperViewLB.showPreviewLightbox = function(){
		LightboxTool.displayLightbox(clonedRightData, {showHeader:true, width:830});
	};*/

}(TN.newspaperViewLB));