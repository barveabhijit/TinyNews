if (!TN) var TN= {};
if(!TN.NewspaperHandler) TN.NewspaperHandler = {};

(function($NewspaperHandler){
	
	//http://gridster.net/
	var gridster;
	
	// override the add_widget and resize_widget functions of gridster due to a bug in gridster code that causes inconsistent overlapping of items
    function TN_add_widget(html, size_x, size_y, col, row) {
        var pos;
        size_x || (size_x = 1);
        size_y || (size_y = 1);

        if (!col & !row) {
            pos = this.next_position(size_x, size_y);
        }else{
            pos = {
                col: col,
                row: row
            };

            this.empty_cells(col, row, size_x, size_y);
        }

        if( pos.row + size_y > this.rows ){
            this.add_faux_rows( pos.row + size_y - this.rows );
        }
        
        if( pos.col + size_x > this.cols ){
            this.add_faux_cols( pos.col + size_x - this.cols );
        }

        this.set_dom_grid_height();

        var $w = $(html).attr({
            'data-col': pos.col,
            'data-row': pos.row,
            'data-sizex' : size_x,
            'data-sizey' : size_y
        }).addClass('gs_w').appendTo(this.$el).hide();

	    this.$widgets = this.$widgets.add($w);
	
	    this.register_widget($w);

        return $w.fadeIn();
    };
	
    function TN_resize_widget($widget, size_x, size_y) {
        var wgd = $widget.coords().grid;
        size_x || (size_x = wgd.size_x);
        size_y || (size_y = wgd.size_y);

        if (size_x > this.cols) {
            size_x = this.cols;
        }

        var old_cells_occupied = this.get_cells_occupied(wgd);
        var old_size_x = wgd.size_x;
        var old_size_y = wgd.size_y;
        var old_col = wgd.col;
        var new_col = old_col;
        var wider = size_x > old_size_x;
        var taller = size_y > old_size_y;

        if (old_col + size_x - 1 > this.cols) {
            var diff = old_col + (size_x - 1) - this.cols;
            var c = old_col - diff;
            new_col = Math.max(1, c);
        }

        var new_grid_data = {
            col: new_col,
            row: wgd.row,
            size_x: size_x,
            size_y: size_y
        };

        var new_cells_occupied = this.get_cells_occupied(new_grid_data);

        var empty_cols = [];
        $.each(old_cells_occupied.cols, function(i, col) {
            if ($.inArray(col, new_cells_occupied.cols) === -1) {
                empty_cols.push(col);
            }
        });

        var occupied_cols = [];
        $.each(new_cells_occupied.cols, function(i, col) {
            if ($.inArray(col, old_cells_occupied.cols) === -1) {
                occupied_cols.push(col);
            }
        });

        var empty_rows = [];
        $.each(old_cells_occupied.rows, function(i, row) {
            if ($.inArray(row, new_cells_occupied.rows) === -1) {
                empty_rows.push(row);
            }
        });

        var occupied_rows = [];
        $.each(new_cells_occupied.rows, function(i, row) {
            if ($.inArray(row, old_cells_occupied.rows) === -1) {
                occupied_rows.push(row);
            }
        });

        this.remove_from_gridmap(wgd);

        if (occupied_cols.length) {
            var cols_to_empty = [
                new_col, wgd.row, size_x, Math.min(old_size_y, size_y), $widget
            ];
            this.empty_cells.apply(this, cols_to_empty);
        }

        if (occupied_rows.length) {
            var rows_to_empty = [new_col, wgd.row, size_x, size_y, $widget];
            this.empty_cells.apply(this, rows_to_empty);
        }

        wgd.col = new_col;
        wgd.size_x = size_x;
        wgd.size_y = size_y;
        this.add_to_gridmap(new_grid_data, $widget);

        //update coords instance attributes
        $widget.data('coords').update({
            width: (size_x * this.options.widget_base_dimensions[0] +
                ((size_x - 1) * this.options.widget_margins[0]) * 2),
            height: (size_y * this.options.widget_base_dimensions[1] +
                ((size_y - 1) * this.options.widget_margins[1]) * 2)
        });

        if (size_y > this.rows ) {
            this.add_faux_rows(size_y - this.rows );
        }

        if (size_x > this.cols ) {
            this.add_faux_cols(size_x - this.cols );
        }

        $widget.attr({
            'data-col': new_col,
            'data-sizex': size_x,
            'data-sizey': size_y
        });

        if (empty_cols.length) {
            var cols_to_remove_holes = [
                empty_cols[0], wgd.row,
                empty_cols.length,
                Math.min(old_size_y, size_y),
                $widget
            ];

            this.remove_empty_cells.apply(this, cols_to_remove_holes);
        }

        if (empty_rows.length) {
            var rows_to_remove_holes = [
                new_col, wgd.row, size_x, size_y, $widget
            ];
            this.remove_empty_cells.apply(this, rows_to_remove_holes);
        }

        this.init();
        return $widget;
    };
    
	var custId = TN.utils.getCookie('TNUser');
//	var maxCols = 37;
	var maxCols = 6;
	var maxResizeCols = 5;
	var fakeDiv = null;
	var showingFake = false;
	var widthResizeFactor = 144;
	var heightResizeFactor = 144;
	var singleTileWidth = 150;
	var tileBeingResized;
	var gadgets = [];
	var masonryCont;
    var masonryInitialized = false;
    var currNewspaperId = 0;
    
    var defNpTitle = 'Your Brilliant Newspaper Title';
    var defNpEdition = 'VOL 1 ISSUE 1';
    var defNpLocation = 'Philadelphia, PA';
    
    function attachResizerEvents(resizerElem) {
		resizerElem.mouseenter(function(){
			var imgElem = $(this).find('img');
			$(imgElem).attr('src', 'images/newsPaper/expand-icon-hover.png');
		});
		
		resizerElem.mouseleave(function(){
			var imgElem = $(this).find('img');
			$(imgElem).attr('src', 'images/newsPaper/expand-icon.png');
		});
		
		resizerElem.click(function(event){
			$NewspaperHandler.showFakeDiv(this.parentNode, event);
			event.stopPropagation(); //Prevent propagation to the body element
		});
    }
    
    function getNewHeight(widget){
		var currentHeight = widget.find('.storyCont').height();
		var newWidgetHeight = 0;
		
		if( !!currentHeight){
			newWidgetHeight = Math.ceil(currentHeight/19);
		}
		else{
			currentHeight = widget.find('.dividerHeading > p').height();
			newWidgetHeight = Math.ceil(currentHeight/19) + 1;
		}

		return newWidgetHeight;
    }
    
	function recalcHeight(widget, width ){
				
		gridster.resize_widget(widget, width, getNewHeight(widget));
	}
	
	function showEditPopupDivider( jqElem, currentWidget, currentWidth ){
		
		function saveChanges(){
			var headerElem = dividerHeaderElem.find('p');
			headerElem.text(newHeaderInputElem.val());
			
			headerElem.css('font-size', fontSizeInputElem.val() + 'px');
			
			var selectedFontStyle = fontStyleSelectElem.val();
			headerElem.css('font-family', selectedFontStyle);
			
			recalcHeight(currentWidget, currentWidth);
			
			editPopupElem.hide();				
		}
		
		var parentCont = jqElem.parents('.widget-closer').parent();
		
		var editPopupElem = $('#editPopupBox');
		
		if( editPopupElem.is(':visible')){
			editPopupElem.hide();
		}
		
		var gridsterWidth = $('#gridsterList').width();
		var editPopupElemWidth = editPopupElem.width();
		var parentOffset = parentCont.position();
		var offsetLeft = parentOffset.left;
		var offsetTop = parentOffset.top;
		
		if( offsetLeft + editPopupElemWidth > gridsterWidth ){
			offsetLeft = gridsterWidth - editPopupElemWidth;
		}
		
		editPopupElem.css('top', offsetTop).css('left', offsetLeft).show();
		editPopupElem.find('.headerUpdateBox').show();
		
		var dividerHeaderElem = parentCont.find('.dividerHeading');	
		var newHeaderInputElem = editPopupElem.find('#headerInput');
		var fontSizeInputElem = editPopupElem.find('#fontSize');
		var fontStyleSelectElem = editPopupElem.find('#fontStyle');
					
		newHeaderInputElem.unbind('keyup').keyup(function(event){
			if( event.which === 13 ){
				saveChanges();
			}
		});
		
		fontSizeInputElem.unbind('keyup').keyup(function(event){
			if( event.which === 13 ){
				saveChanges();
			}
		});
		
		editPopupElem.find('#cancelEditForm').unbind('click').click(function(){
			editPopupElem.hide();
		});
		
		editPopupElem.find('#deleteEditForm').unbind('click').click(function(){
			editPopupElem.hide();
			removeWidget(parentCont, false);
		});
		
		editPopupElem.find('#saveEditForm').unbind('click').click(function(){
			saveChanges();
		});
		
		newHeaderInputElem.val(dividerHeaderElem.find('p').text());
		fontSizeInputElem .val(parseFloat(dividerHeaderElem.find('p').css('font-size')));
		fontStyleSelectElem.val(dividerHeaderElem.find('p').css('font-family'));
	}
	
	function showEditPopupWidget( jqElem, currentWidget, currentWidth ){
		
		function saveChanges(){
			
			storyHeaderElem.css('font-size', fontSizeInputElem.val() + 'px');					
			
			var selectedFontStyle = fontStyleSelectElem.val();
			storyHeaderElem.css('font-family', selectedFontStyle);
			
			parentCont.find('.story-content p').each(function(){
				var currTagElem = $(this);
				
				var selectedBodyFontStyle = bodyFontStyleSelectElem.val();
				currTagElem.css('font-size', bodyFontSizeInputElem.val() + 'px');					
				currTagElem.css('font-family', bodyFontStyleSelectElem.val());					
			});
			
			recalcHeight(currentWidget, currentWidth);
			
			editPopupElem.hide();				
		}
					
		var parentCont = jqElem.parents('.widget-closer').parent();
		
		var editPopupElem = $('#editPopupBox');
		
		if( editPopupElem.is(':visible')){
			editPopupElem.hide();
		}
		
		var gridsterWidth = $('#gridsterList').width();
		var editPopupElemWidth = editPopupElem.width();
		var parentOffset = parentCont.position();
		var offsetLeft = parentOffset.left;
		var offsetTop = parentOffset.top;
		
		if( offsetLeft + editPopupElemWidth > gridsterWidth ){
			offsetLeft = gridsterWidth - editPopupElemWidth;
		}
		
		editPopupElem.css('top', offsetTop).css('left', offsetLeft).show();
		editPopupElem.find('.headerUpdateBox').hide();
		
		var storyHeaderElem = parentCont.find('.storyHeading');	
		var fontSizeInputElem = editPopupElem.find('#fontSize');
		var fontStyleSelectElem = editPopupElem.find('#fontStyle');
		var bodyFontSizeInputElem = editPopupElem.find('#bodyFontSize');
		var bodyFontStyleSelectElem = editPopupElem.find('#bodyFontStyle');
		
		fontSizeInputElem.unbind('keyup').keyup(function(event){
			if( event.which === 13 ){
				saveChanges();
			}
		});
		
		editPopupElem.find('#cancelEditForm').unbind('click').click(function(){
			editPopupElem.hide();
		});
		
		editPopupElem.find('#deleteEditForm').unbind('click').click(function(){
			editPopupElem.hide();
			removeWidget(parentCont, true);
		});
		
		editPopupElem.find('#saveEditForm').unbind('click').click(function(){
			saveChanges();
		});
		
		fontSizeInputElem.val(parseFloat(storyHeaderElem.css('font-size')));			
		fontStyleSelectElem.val(storyHeaderElem.css('font-family'));
		
		var bodyFontSize = parseFloat(parentCont.find('.story-content p').css('font-size'));
		bodyFontSizeInputElem.val((isNaN(bodyFontSize) ? 0 : bodyFontSize));
		var currBodyFontStyle = parentCont.find('.story-content p').css('font-family');
		bodyFontStyleSelectElem.val(currBodyFontStyle);
	}
	
	/*
	 * Returns a fake div which acts as an overlay for the draggable tiles.
	 * This div is used for the resizing because we cannot use resizeable() for the gridster tiles.
	 * This is because the mousedown and mouseup events appear to be attaching themselves to every item 
	 * in a gridtser element. This means the mouse events for resiazable() get list. The fake div places itself
	 * directly above a gridster tile and once the resize is complete we work out by how much we need to resize
	 * the underlying gridtser tile.
	 */
	$NewspaperHandler.getFakeDiv = function(){
		
		if(fakeDiv === null){
			fakeDiv = $('<div id="fake-div"></div>');

			$(fakeDiv).bind('resizestart', function(event, ui){
			});
			
			$(fakeDiv).bind('resizestop', function(event, ui){
				
				function getWidthForLevel(newWidth){
					//Beginner level - only 5 rows
//					var incrementFactor = 7;
					var incrementFactor = 1;
					
					var numIncrements = Math.round(newWidth/incrementFactor);
					
					return ( numIncrements * incrementFactor );
				}
				
				
				/*
				 * When the floating fake div is resized, this method looks at the new dimensions
				 * of the fake div and uses its new height and width to calculate the amount by 
				 * which we need to resize the underlying gridster tiles.
				 */
				
				var originalHeight = ui.originalSize.height;
				var originalWidth = ui.originalSize.width;
				
				var newHeight = ui.size.height;
				var newWidth = ui.size.width;
				
				//Is it within the resize factor
//				var resizeDeviation = resizeFactor / 2;
				var newWidthFound = false;
				
				var tilesToSerialize = [];
				tilesToSerialize.push(tileBeingResized);
				var serializedTiles = gridster.serialize($(tilesToSerialize));
				
				var currentHeight = 0;
				var currentWidth = 0;
				var newHeightFound = false;
				var nextHeight = originalHeight;
				
				var storyType = !!$(tilesToSerialize).find('.in-page-story').length;
								
				if(serializedTiles && serializedTiles[0]){
					currentWidth = serializedTiles[0].size_x;
					currentHeight = serializedTiles[0].size_y;
				}
					
				var sizeToAdjustWidthBy = 0;
				var sizeToAdjustHeightBy = 0;
				var nextWidth = originalWidth;
				
				if(newWidth <= (originalWidth - ((widthResizeFactor/2) + 1)) || newWidth >= (originalWidth + ((widthResizeFactor/2) + 1))){
					if(newWidth > originalWidth){
						
						while(!newWidthFound){
							
							//Now create a new potential range
							var rangeLower = nextWidth;
							var rangeUpper = nextWidth + widthResizeFactor;
							
							//Take the original with and add the full resize factor
							nextWidth += widthResizeFactor;
							
							if( newWidth > (rangeLower + (widthResizeFactor/2))){
								++sizeToAdjustWidthBy;
							}
							
							//If the new width is between this range, then that's the edge of the tiles new resting place
							if(newWidth >= rangeLower && newWidth <= rangeUpper){
								break;
							}
						}
					}
					else {
						while(!newWidthFound){
							
							var rangeLower = nextWidth - widthResizeFactor;
							var rangeUpper = nextWidth;
							
							nextWidth -= widthResizeFactor;
							
							if( newWidth < (rangeUpper - (widthResizeFactor/2))){
								--sizeToAdjustWidthBy;
							}
							
							if(newWidth >= rangeLower && newWidth <= rangeUpper){
								break;
							}
						}
					}
										
					if(sizeToAdjustWidthBy >= 1  || sizeToAdjustWidthBy <= -1){
						// Also change height with same proportion if the story is being resized
						//nextHeight += resizeFactor;
						if( storyType ){
							sizeToAdjustHeightBy = sizeToAdjustWidthBy*7;
							newHeightFound = true;
						}
					}
				}
				
				if( !newHeightFound ){
					if(newHeight <= (originalHeight - ((heightResizeFactor/2) + 1)) || newHeight >= (originalHeight + ((heightResizeFactor/2) + 1))){
						if(newHeight > originalHeight){
//							while(!newHeightFound){
								
								var rangeLower = nextHeight;
								var rangeUpper = nextHeight + heightResizeFactor;
								
								nextHeight += heightResizeFactor;
								
								if( newHeight > (rangeLower + (heightResizeFactor/2))){
									++sizeToAdjustHeightBy;
								}
								
//								if(newHeight >= rangeLower && newHeight <= rangeUpper){
//									break;
//								}
//							}
						}
						else {
//							while(!newHeightFound){
								
								var rangeLower = nextHeight - heightResizeFactor;
								var rangeUpper = nextHeight;
								
								nextHeight -= heightResizeFactor;
								
								if( newHeight < (rangeUpper - (heightResizeFactor/2))){
									--sizeToAdjustHeightBy;
								}
								
//								if(newHeight >= rangeLower && newHeight <= rangeUpper){
//									break;
//								}
//							}
						}
						
						// Also change width with same proportion if the story is being resized
						if( storyType ){
							sizeToAdjustWidthBy = sizeToAdjustHeightBy;
							sizeToAdjustHeightBy = sizeToAdjustHeightBy*7;
						}
					}					
				}
				
				var oldWidth = currentWidth;
				
//				if(sizeToAdjustWidthBy !== 1){
//					var adjustedWidthMinusPadding = sizeToAdjustWidthBy / 2;
//					currentWidth += parseInt(adjustedWidthMinusPadding);
//				}
//				else {
					currentWidth += sizeToAdjustWidthBy;
//				}
								
				var oldHeight = currentHeight;
//				if(sizeToAdjustHeightBy !== 1){
//					var adjustedHeightMinusPadding = sizeToAdjustHeightBy / 2;
//					currentHeight += parseInt(adjustedHeightMinusPadding);
//				}
//				else {
					currentHeight += sizeToAdjustHeightBy;
//				}
				
				if( currentWidth > maxResizeCols ){
					if( storyType ){
						var excessWidth = currentWidth - maxResizeCols;
						var excessHeight = excessWidth * 7;
						currentWidth -= excessWidth;
						currentHeight -= excessHeight;
					}
					else {
						currentWidth = maxResizeCols;						
					}
				}
				
				// For story types make sure both width and height are changing
				// If width has not changed then do not change height
				if( storyType ){
					if( currentWidth === oldWidth && currentHeight !== oldHeight ){
						currentHeight = oldHeight;
					}
					if( currentHeight === oldHeight && currentWidth !== oldWidth ){
						currentWidth = oldWidth;
					}
				}
				
				
				// Check width to see if it matches the requirements of the current level
//				var levelWidth = getWidthForLevel(currentWidth);
//				currentWidth = levelWidth;
//				var delta = currentWidth - oldWidth;
//				currentHeight = oldHeight + (delta*7);
				
				tileBeingResized = gridster.resize_widget($(tileBeingResized), currentWidth, currentHeight);
				
				$NewspaperHandler.hideFakeDiv(null);
						
				if( storyType ){
					tileBeingResized.imagesLoaded(function(){
						
						var newImageWidth = (tileBeingResized.width() - 10) + 'px';

						tileBeingResized.find('.story-img').css('width', newImageWidth);
						recalcHeight(tileBeingResized, currentWidth);			
						
					});	
				}
				
				//If needed perform an image resize
//				var imageToResize = $($(tileBeingResized).find('img.story-img'))[0];
				
				//Calculate the new max heighty of the image based on the height of the tile
				//and the height of the text segment of the story.
				
//				if( !!imageToResize ){
					
//					var storyText = $($(tileBeingResized).find('div.story-content-wrapper'))[0];
//					var imgNewMaxHeight = $(tileBeingResized).height() - $(storyText).height();
					
//					$(imageToResize).css('max-height', (imgNewMaxHeight - 30) + 'px');
//					$(imageToResize).css('width', ($(tileBeingResized).width() - 10) + 'px');
//					recalcHeight(tileBeingResized, currentWidth);
//				}
				
				//If Devider resize it
				var dividerHeading = $($(tileBeingResized).find('.dividerHeading'))[0];
				
				if( !!dividerHeading ){
					$(dividerHeading).css('height',  $(tileBeingResized).height() );
				}
				
			});
		}
		return fakeDiv;
	}
	
	function removeWidget(widgetToRemove, reAdd, fnCallback){
		gridster.remove_widget(widgetToRemove, function(){
			if( reAdd ){
				//Show the original story again
				var originalStoryId = widgetToRemove.attr('story-id');
				var originalStory = $('#story_' + originalStoryId);
				
				if(originalStory){
					$(originalStory).css('display', 'block');
				}
			}
			
			if( !!fnCallback ){
				fnCallback();				
			}
		});
	};
	
	function alreadyInNewspaper(storyId){
		var gridsterList = $('#gridsterList');
				
		return( !!(gridsterList.has('div[story-id=' + storyId + ']').length) );
	}
	
	function calculateAddPosition(startingWidth){
		
		//Calculate the next place to add the new story. 
		//var serializedGrid = $NewspaperHandler.serializeGrid();
		
		var colCount = 1;
		var rowCount = 1;
		var newY = 1;
		var newX = 1;
		
		//Find the first available x, then check there is enough room in y
		var posFound = false;
		while(!posFound){
			
//			if(gridster.is_empty(colCount, rowCount) && (colCount + startingWidth <= maxCols)){
			if(!gridster.is_occupied(colCount, rowCount) && (colCount + startingWidth <= maxCols)){
				
				var enoughRoomInX = true;
				var runningColCount = colCount;
				
				for(var i = 1; i < startingWidth; i++){
					runningColCount++;
//					if(!gridster.is_empty(runningColCount, rowCount) || runningColCount > maxCols){
					if(gridster.is_occupied(runningColCount, rowCount) || runningColCount > maxCols){
						enoughRoomInX = false;
						
						//We didn't find a new position but advance the colCount forward
						colCount = runningColCount;
						break;
					}
				}
				
				if(enoughRoomInX){
					newX = colCount;
					newY = rowCount;
					posFound = true;
				}
			}
			else {
				colCount++;
				if(colCount > maxCols){
					colCount = 1;
					rowCount++;
				}
			}
		}
		return {row: newY, col: newX};
	}
	
	function getNextAvailableRow(baseWidth, colNumber ){
		var newX = 1 + (baseWidth * (colNumber-1));
		var newY = 1;
		
		//get Next available row
		var posFound = false;
		while (!posFound ){
			if( gridster.is_occupied(newX, newY) ){
				newY += 2;
			}
			else {
				posFound = true;
			}
		}
		return {row: newY, col: newX};
	}
	
	function addDivider(colNum){
		var defaultText = 'Type text, click Enter...';
		function getDividerHeadingHtml(){
			return(' \
				<div class="dividerHeading"> \
					<input class="dividerHeadingInput" type="text" value="' + defaultText + '"/> \
				</div> \
			');
		}
				
//		var startingWidth = 7;
		var startingWidth = 1;
		var dividerHeadingHtml = getDividerHeadingHtml();
		var newPosition = getNextAvailableRow(startingWidth, colNum);
		var newWidget = $('<div></div>').append(dividerHeadingHtml);
		newWidget.append($('<div class="widget-closer"><img class="editImage" src="images/newsPaper/editPopupEditBtn-bg.png" width="15" height="15" alt="edit" title="Edit"></div>'));

		//Add the resizer
		var resizerElem = $('<div class="widget-resizer"><img class="resizeImage" height="15" width="15" alt:"resize" title="Resize" src="images/newsPaper/expand-icon.png"/></div>');

		attachResizerEvents(resizerElem);
		
		//Append the resizer
		newWidget.append(resizerElem);
		
//		var resizerElem = $(newWidget).find('.widget-resizer');
		
		var addedWidget = gridster.add_widget(newWidget, startingWidth, 2, newPosition.col, newPosition.row);
		newWidget.css('position', 'absolute');
		addedWidget.find('.dividerHeadingInput').click(function(){
			var jqElem = $(this);
			if( jqElem.val() === defaultText ){
				jqElem.val('');
			}
		}).blur(function(){
			var jqElem = $(this);
			if($.trim(jqElem.val()) === '') {
				jqElem.val(defaultText);
			}
		}).keyup(function(event){
			var jqElem = $(this);
			if( event.which === 13 ){
				var headingText = jqElem.val();
				var headingElem = jqElem.parents('.dividerHeading');
				headingElem.append('<p>' + headingText + '</p>');
				jqElem.remove();
				
				headingElem.parent().find('.resizeImage').show();
												
				recalcHeight(addedWidget, startingWidth);
				
				headingElem.hover(function(){
					$(this).parent().find(".editImage").show().mouseenter(function(){$(this).show();}).click(
							function(event){
								showEditPopupDivider($(this), addedWidget, parseFloat(addedWidget.attr('data-sizex'))  );
								event.stopImmediatePropagation();
							});
				}, function(){
					$(this).parent().find(".editImage").hide();
				});
			}
		});
	}
	
	function getDividerHtml(dividerObj){
		var dividerHtml = '<div class="dividerHeading">\
								<p>' + dividerObj.headline + '</p> \
						   </div>';
		return dividerHtml;
	}
	
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
		
		var storyHtml = '<div id="story_' + storyObj.buzzId + '" class="storyBlock item" onclick="TN.NewspaperHandler.addWidget(this);" story-id="' + storyObj.buzzId +'">\
				<div class="story-img-wrapper">\
					<img class="story-img" style="width:116px;margin-left:5px;margin-right:5px;margin-top:5px;" src="' + storyObj.storyThumbImg + '" title="Story Image" >\
				</div>\
				<h1 class="storyHeading">' + storyObj.headline + '</h1>\
				<div class="story-content-wrapper">\
	    			<div class="story-content block">\
						<input class="storyOriginalImage" type="hidden" value="' + storyObj.storyOriginalImg + '"/>\
						<input class="storyThumbImage" type="hidden" value="' + storyObj.storyThumbImg + '"/>\
						<input class="buzzId" type="hidden" value="' + storyObj.buzzId + '"/> \
						<input class="imageId" type="hidden" value="' + storyObj.imageId + '"/> \
						<input class="elementId" type="hidden" value="' + storyObj.elementId + '"/>' +
						getOpedHtml() +
	    			'</div>\
	    			<div class="originator-content block">\
	    				<img  src="' + storyObj.originatorImageUrl + '">\
	    				<h1>' + storyObj.originatorName + '</h1>\
	    				<p>' + storyObj.elapsedTime + '</p>\
	    			</div>\
    			</div>\
    		</div>';
		
		
		return storyHtml;
	}
	
	function clearLayout(postClearCallback){
    	var widgetArray = $('.gs_w');
    	var numWidgets = widgetArray.length;
		var i = 0;
		
    	function removeItemFromGrid( element ){
    		function fnCallback(){
				i++;
				
				if( i < numWidgets ){
					removeItemFromGrid($(widgetArray[i]));
				}
				else{
		    		$('#npHeadline').text(defNpTitle);
		    		$('#npEdition').text(defNpEdition);
		    		$('#npLocation').text(defNpLocation);
					if( !!postClearCallback ){
						postClearCallback();						
					}
				}    			
    		}
    		
			removeWidget(element, element.data('reAdd'), fnCallback);    		
    	}
    	
    	if( numWidgets > 0 ){
    		removeItemFromGrid($(widgetArray[i]));
    	}
    	else {    		
    		$('#npHeadline').text(defNpTitle);
    		$('#npEdition').text(defNpEdition);
    		$('#npLocation').text(defNpLocation);
    		if( !!postClearCallback ){
				postClearCallback();						
			}
    	}
	}
	
	function loadNewspaper(npId){
		function showNewspaper(json){
			
			if( !!json && !!json[0] ){
				var newspaperJson = json[0];
				// Clear grid
				clearLayout(function(){
					$('#npHeadline').text((!!newspaperJson.headline ? newspaperJson.headline : ''));
					$('#npEdition').text((!!newspaperJson.edition ? newspaperJson.edition : ''));
					$('#npLocation').text((!!newspaperJson.location ? newspaperJson.location : ''));
					currNewspaperId = ( !!newspaperJson.id ? newspaperJson.id : 0 );
					
					if( 'dividers' in newspaperJson ){
						var dividersArray = newspaperJson.dividers;
						var numDividers = dividersArray.length;
						for( var i = 0; i < numDividers; i++ ){
							var currDivider = dividersArray[i];
							var dividerHtml = getDividerHtml(currDivider);
							var dividerHtmlElem = $(dividerHtml);
							
							var newWidget = $('<div></div>').append(dividerHtmlElem);
							newWidget.append($('<div class="widget-closer"><img class="editImage" src="images/newsPaper/editPopupEditBtn-bg.png" width="15" height="15" alt="edit" title="Edit"></div>'));

							//Add the resizer
							var resizerElem = $('<div class="widget-resizer"><img class="resizeImage" height="15" width="15" alt="resize" title="Resize" src="images/newsPaper/expand-icon.png" style="display:inline;"/></div>');

							attachResizerEvents(resizerElem);
							
							//Append the resizer
							newWidget.append(resizerElem);
							
							var headingElem = newWidget.find('.dividerHeading > p');
							headingElem.css('color', currDivider.fontcolor);
							headingElem.css('font-size', currDivider.fontsize);
							headingElem.css('font-family', currDivider.fontstyle);
							
                			var addedWidget = gridster.add_widget(newWidget, currDivider.jwidth, currDivider.jheight, 
                					currDivider.jcolumn, currDivider.jrow);
                			
                			addedWidget.css('position', 'absolute');
                			
                			addedWidget.find('.dividerHeading').hover(function(){
            					$(this).parent().find(".editImage").show().mouseenter(function(){$(this).show();}).click(
            							function(event){
            								showEditPopupDivider($(this), addedWidget, parseFloat(addedWidget.attr('data-sizex'))  );
            								event.stopImmediatePropagation();
            							});
            				}, function(){
            					$(this).parent().find(".editImage").hide();
            				});
                			            				
            				addedWidget.find('.dividerHeading').css('height',  addedWidget.height() );            				
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
							
							var dimension = {
								row: currStory.jrow,
								col: currStory.jcolumn,
								width: currStory.jwidth,
								height: currStory.jheight
							};
							
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
							
							$NewspaperHandler.addWidget(storyHtmlElem, dimension);
						}
					}
					
				});
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
			$NewspaperHandler.cancelNewspaper();
		}
	}

    function loadNewspapersList(){
    	function populateNewspapersListDropDown(json){
    		if( !!json && json.length ){
    			var numNewspapers = json.length;
    			var newspaperListElem = $('#newspaperSelection');
    			newspaperListElem.empty();
				var newspaperListItemHtml = '';
				newspaperListItemHtml += '<option value="-1">---Select---</option>';
    			for( var i = 0; i < numNewspapers; i++ ){
    				var currNewspaper = json[i];
    				newspaperListItemHtml += '<option value="' + currNewspaper.id + '">' + currNewspaper.headline + '</option>';
    			}
				newspaperListElem.append(newspaperListItemHtml);
    			$('#newspaperSelectCont').show();
    			
    			newspaperListElem.unbind('change').change(function(){
    				loadNewspaper($(this).val());
    			});
    		}
    	}
    	
    	TN.services.getNewspapers(custId).
    		done(populateNewspapersListDropDown).
    		fail(function(jqXHR){
    			if( jqXHR.status === 404 ){
        			$('#newspaperSelection').empty();
        			$('#newspaperSelectCont').hide();
    			}
    		});
    }
    
	$NewspaperHandler.init = function(){

        var storiesHtml = '';
        var searchStoriesHtml = '';
		var storiesNumPages = 0;
        var pageNum = 1;
        masonryCont = $('#masonryEffect');
        var currentCatSelected = $('#storyCatsDropDown').find('option:selected').attr('value');
        var currentTypeSelected = 'mine';
        var currentSearchString = '';
        var searchInProgress = false;
        var searchView = false;

        var loadInterrupted = false;
        var interruptCompleteCallback;
        var loadingInProgress = false;
        
		function addStory(storyObj, fromSearch){
			
			var newStory = getStoryHtml(storyObj);
			
			if (fromSearch) searchStoriesHtml += newStory;
			else storiesHtml += newStory;
		}

		function populateGrid(data){
			
			if(data && data[0] && !searchInProgress){
				
				if(data[0].stories){
					var numOfItems = data[0].stories.length;

//                    if ((currentTypeSelected == 'popular') && (data[0].numPages > 10)) storiesNumPages = 10;
 //                   else storiesNumPages = data[0].numPages;
					
					storiesNumPages = data[0].numPages;

					for( var i = 0; i < numOfItems; i++ ){
						var storyItem = data[0].stories[i];
						if(storyItem && !searchInProgress){
                            if (storyItem.headline == "Message Board") continue;
							var storyToAdd = {
									headline: storyItem.headline,
									buzzId: storyItem.id,
									imageId:storyItem.imageId,
									elementId:0,
									storyThumbImg: storyItem.imageThumbUrl,
									storyOriginalImg: storyItem.imageOriginalUrl,
									buzzWhat:storyItem.pwhat,
									buzzWhen:storyItem.pwhen,
									buzzWhere:storyItem.pwhere,
									buzzWhy:storyItem.pwhy,
									buzzWho:storyItem.pwho,
									buzzHow:storyItem.pHow,
									buzzOped:storyItem.oped,
                                    originatorImageUrl: storyItem.custImageOriginalUrl,
									originatorName: storyItem.author,
									elapsedTime: !!storyItem.date ? storyItem.date : ''
								};
							addStory(storyToAdd, false);							
						}
					}
				}
			}
		}
		
		function populateGridFromGARS(data){
			if(data && data[0] && !searchInProgress){
				
				if(data[0].fittingRoomSummaryList){
					var numOfItems = data[0].fittingRoomSummaryList.length;

					storiesNumPages = data[0].noOfPages;

					for( var i = 0; i < numOfItems; i++ ){
						var storyItem = data[0].fittingRoomSummaryList[i];
						if(storyItem && !searchInProgress){
                            if (storyItem.headline == "Message Board") continue;
                            var buzz = storyItem.wsBuzz;
							var storyToAdd = {
									headline: storyItem.headline,
									buzzId: buzz.buzzId,
									imageId:buzz.imageId,
									elementId:0,
									storyThumbImg: buzz.thumbImageUrl,
									storyOriginalImg: buzz.imageUrl,
									buzzWhat:buzz.what,
									buzzWhen:buzz.when,
									buzzWhere:buzz.where,
									buzzWhy:buzz.why,
									buzzWho:buzz.who,
									buzzHow:buzz.How,
									buzzOped:buzz.oped,
                                    originatorImageUrl: storyItem.originatorThumbImageUrl,
									originatorName: storyItem.originatorName,
									elapsedTime: !!storyItem.storyDate ? storyItem.storyDate : ''
								};
							addStory(storyToAdd, false);							
						}
					}
				}
			}
		}
		
		function populateGridFromTopStories(data){
			if(data && data[0] && !searchInProgress){
				
				if(data[0].stories){
					var numOfItems = data[0].stories.length;

					storiesNumPages = data[0].numPages;

					for( var i = 0; i < numOfItems; i++ ){
						var storyItem = data[0].stories[i];
						if(storyItem && !searchInProgress){
                            if (storyItem.headline == "Message Board") continue;
							var storyToAdd = {
									headline: storyItem.headline,
									buzzId: storyItem.storyId,
									imageId:0,
									elementId:0,
									storyThumbImg: storyItem.imageThumbUrl,
									storyOriginalImg: storyItem.imageThumbUrl,
									buzzWhat:storyItem.what,
									buzzWhen:storyItem.when,
									buzzWhere:storyItem.where,
									buzzWhy:storyItem.why,
									buzzWho:storyItem.who,
									buzzHow:storyItem.How,
									buzzOped:storyItem.oped,
                                    originatorImageUrl: storyItem.authorThumbUrl,
									originatorName: storyItem.authorName,
									elapsedTime: !!storyItem.storyDate ? storyItem.storyDate : ''
								};
							addStory(storyToAdd, false);							
						}
					}
				}
			}
		}

        function populateGridSearch(data){
            if(data && data[0]){
                    var numOfItems = data.length;
                    for( var i = 0; i < numOfItems; i++ ){
                        var storyItem = data[i];

                            var storyToAdd = {
                                headline: storyItem.headline,
                                buzzId: storyItem.buzzId,
                                imageId:storyItem.imageId,
								elementId:0,
                                storyThumbImg: storyItem.thumbImageUrl,
                                storyOriginalImg: storyItem.imageUrl,
                                buzzWhat:storyItem.what,
                                buzzWhen:storyItem.when,
                                buzzWhere:storyItem.where,
                                buzzWhy:storyItem.why,
                                buzzWho:storyItem.who,
                                buzzHow:storyItem.how,
                                buzzOped:storyItem.oped,
                                originatorImageUrl: storyItem.customerImageUrl,
                                originatorName: storyItem.firstName,
                                elapsedTime: !!storyItem.date ? storyItem.date : ''
                            };
                            addStory(storyToAdd, true);
                    }
            }
        }

        function catChangeCallback(){
            currentCatSelected = $('#storyCatsDropDown').find('option:selected').attr('value');
            masonryCont.empty();
            if (masonryInitialized) {
                masonryCont.masonry( 'destroy' );
                masonryInitialized = false;
            }
            pageNum = 1;
            masonryCont.empty();
            $('#storiesSearch').val('');
            // Restore mine/popular button active state to point out that we are actually switching from
            // search view back to regular type/category view since searchStories WS does not currently
            // have functionality to filter it's output by type/category
            if (searchView) {
                (currentTypeSelected == 'popular') ? $('#popularStories').addClass("tangerineTango-button") : $('#mineStories').addClass("tangerineTango-button");
				$('#popularStories, #mineStories').css("top", "-7px");
            }
            
            if( currentTypeSelected === 'popular' ){
            	if( currentCatSelected === "" ){
                    getTopStoriesFull(custId, 25, 1, currentCatSelected);
            		
            	}
            	else {
            		getAllRequestSummaries(custId, 25, 1, currentCatSelected);
            	}
            }
            else {
                getStoriesAndWishListFiltered(custId, 25, 1, currentCatSelected);
            }
        }
        
        function loadCategories(){
            TN.services.getAllMessageTypeActiveCategories().done(function(json){
                if( !!json ){
                    var csCatDropdown = $('#storyCatsDropDown');
                    var maxItems = json.length;
                    
                    for( var i = 0; i < maxItems; i++ ){
                        if (json[i].id == "Q") continue;
                        if( json[i].global === 1 || json[i].global === 0 ){
                        	var currCatType = json[i].id;
                        	if( currCatType === 'Breaking News' ){
                                csCatDropdown.append('<option value="'+ currCatType + '">' + 'Trending News' + '</option>');
                        	}
                        	else {
                                csCatDropdown.append('<option value="'+ currCatType + '">' + currCatType + '</option>');
                        	}
                        }
                    }
                    
                    csCatDropdown.change(function(){
                    	
                    	if( loadingInProgress ){
                    		loadInterrupted = true;
                    		interruptCompleteCallback = catChangeCallback;
                    	}
                    	else {
                    		catChangeCallback();
                    	}                    	
                    });
                }
            });
        }
        
        function getTopStoriesFull( cusdId, topCount, page, category ){
        	searchView = false;
        	
        	TN.services.getTopStoriesFull( custId, topCount, page ).
        		done(function(json){
        			
        			if( loadingInProgress ){
            			if( loadInterrupted ){
            				loadingInProgress = false;
            				loadInterrupted = false;
            				if( !!interruptCompleteCallback ){
            					interruptCompleteCallback();
            				}
            				return;
            			}        				
            			
        			}
        			else {
        				loadingInProgress = true;
        			}

        			populateGridFromTopStories(json);
                    if( !!storiesHtml && !searchInProgress){
                        var storiesHtmlElem = $(storiesHtml);
                        masonryCont.append(storiesHtmlElem);
                        storiesHtmlElem.hide();
                        masonryCont.imagesLoaded(function(){
                            if((category == currentCatSelected) && !searchInProgress) {
                                if(!masonryInitialized){
                                    masonryCont.masonry({
                                        // options
                                        itemSelector : '.item',
                                        isFitWidth: true,
                                        columnWidth : 170
                                    });
                                    masonryInitialized = true;
                                } else {
                                    masonryCont.masonry('appended', storiesHtmlElem);
                                }
                                storiesHtmlElem.show();

                                storiesHtml = '';

                                pageNum++;

                                if( pageNum <= storiesNumPages ){
                                    if((category == currentCatSelected) && !searchInProgress) {
                                    	getTopStoriesFull(custId, topCount, pageNum, category );
                                    }
                                }
                                
                                else pageNum = 1;
                            }
                        });
                    }
        		}).
                always(function(){
        			
        			if( page >= storiesNumPages ){
        				loadingInProgress = false;
        			}
        			
                    if (storiesNumPages === 0) masonryCont.append("No stories available.");
                });
        }

        function getAllRequestSummaries( custId, topCount, page, category ){
            searchView = false;
            
            TN.services.getAllRequestSummaries(custId, topCount, page, category).
                done(function(json){
                	
        			if( loadingInProgress ){
            			if( loadInterrupted ){
            				loadInterrupted = false;
            				loadingInProgress = false;
            				if( !!interruptCompleteCallback ){
            					interruptCompleteCallback();
            				}
            				return;
            			}
            			
        			}
        			else {
        				loadingInProgress = true;
        			}
        			
                    populateGridFromGARS(json);
                    if( !!storiesHtml && !searchInProgress){
                        var storiesHtmlElem = $(storiesHtml);
                        masonryCont.append(storiesHtmlElem);
                        storiesHtmlElem.hide();
                        masonryCont.imagesLoaded(function(){
                            if((category == currentCatSelected) && !searchInProgress) {
                                if(!masonryInitialized){
                                    masonryCont.masonry({
                                        // options
                                        itemSelector : '.item',
                                        isFitWidth: true,
                                        columnWidth : 170
                                    });
                                    masonryInitialized = true;
                                } else {
                                    masonryCont.masonry('appended', storiesHtmlElem);
                                }
                                storiesHtmlElem.show();

                                storiesHtml = '';

                                pageNum++;

                                if( pageNum <= storiesNumPages ){
                                    if((category == currentCatSelected) && !searchInProgress) {
                                    	getAllRequestSummaries(custId, topCount, pageNum, category);
                                    }
                                }
                                
                                else pageNum = 1;
                            }
                        });
                    }
                }).
                always(function(){
        			if( page >= storiesNumPages ){
        				loadingInProgress = false;
        			}        			
                    if (storiesNumPages === 0) masonryCont.append("No stories available.");
                });
        }
        
        function getStoriesAndWishListFiltered( custId, topCount, page, category ){
            searchView = false;
            
            TN.services.getStoriesAndWishListFiltered(custId, topCount, page, 'mine', category).
                done(function(json){
                	
        			if( loadingInProgress ){
            			if( loadInterrupted ){
            				loadInterrupted = false;
            				loadingInProgress = false;
            				if( !!interruptCompleteCallback ){
            					interruptCompleteCallback();
            				}
            				return;
            			}
            			
        			}
        			else {
        				loadingInProgress = true;
        			}
        			
                    populateGrid(json);
                    if( !!storiesHtml && !searchInProgress){
                        var storiesHtmlElem = $(storiesHtml);
                        masonryCont.append(storiesHtmlElem);
                        storiesHtmlElem.hide();
                        masonryCont.imagesLoaded(function(){
                            if((category == currentCatSelected) && !searchInProgress) {
                                if(!masonryInitialized){
                                    masonryCont.masonry({
                                        // options
                                        itemSelector : '.item',
                                        isFitWidth: true,
                                        columnWidth : 170
                                    });
                                    masonryInitialized = true;
                                } else {
                                    masonryCont.masonry('appended', storiesHtmlElem);
                                }
                                storiesHtmlElem.show();

                                storiesHtml = '';

                                pageNum++;

                                if( pageNum <= storiesNumPages ){
                                    if((category == currentCatSelected) && !searchInProgress) {
                                        getStoriesAndWishListFiltered(custId, topCount, pageNum, category);
                                    }
                                }
                                
                                else pageNum = 1;
                            }
                        });
                    }
                }).
                always(function(){
        			if( page >= storiesNumPages ){
        				loadingInProgress = false;
        			}        			
                    if (storiesNumPages === 0) masonryCont.append("No stories available.");
                });
        }

        function getSearchStories( searchTxt ){
        	searchInProgress = true;
            searchView = true;
        	
            masonryCont.append("<span id='progressIndicator'>...</span>");
            TN.services.searchStories( searchTxt, 1, 20 ).
                done(function(json){
                	
        			if( loadingInProgress ){
            			if( loadInterrupted ){
            				loadInterrupted = false;
            				loadingInProgress = false;
            				if( !!interruptCompleteCallback ){
            					interruptCompleteCallback();
            				}
            				return;
            			}        				            			
        			}
        			else {
        				loadingInProgress = true;
        			}

                	populateGridSearch(json);
                }).
                always(function(){
        			loadingInProgress = false;
                	if( !!searchStoriesHtml ){
                        var storiesHtmlElem = $(searchStoriesHtml);
                        masonryCont.append(storiesHtmlElem);
                        storiesHtmlElem.hide();
                        masonryCont.imagesLoaded(function(){
                            if(!masonryInitialized){
                                masonryCont.masonry({
                                    // options
                                    itemSelector : '.item',
                                    isFitWidth: true,
                                    columnWidth : 170
                                });
                                masonryInitialized = true;
                            } else {
                                masonryCont.masonry('appended', storiesHtmlElem);
                            }
                            storiesHtmlElem.show();

                            searchStoriesHtml = '';
                        	searchInProgress = false;
                        	masonryCont.find('#progressIndicator').remove();
                        });
                    }
                }).fail(function(){
                    masonryCont.append("No stories available.");
                    searchInProgress = false;
                    masonryCont.find('#progressIndicator').remove();
                });
        };

        function searchDispatch(){
            var nextSearchTxt = $('#storiesSearch').val();
            if ( !searchInProgress && !TN.utils.isBlank(nextSearchTxt) && ((nextSearchTxt!=currentSearchString) || !searchView) ) {
                $('#mineStories, #popularStories').removeClass("tangerineTango-button").css("top", "3px");
                $('#allCatsOption').show();
               $('#storyCatsDropDown').val("");
                masonryCont.empty();
                if (masonryInitialized) {
                    masonryCont.masonry( 'destroy' );
                    masonryInitialized = false;
                }
                getSearchStories(nextSearchTxt);
                currentSearchString = nextSearchTxt;
            }
        };

        function switchToMineStories()
        {
            $('#popularStories').removeClass("tangerineTango-button").css("top", "-7px");
            $('#mineStories').addClass("tangerineTango-button").css("top", "-7px");
            masonryCont.empty();
            if (masonryInitialized) {
                masonryCont.masonry( 'destroy' );
                masonryInitialized = false;
            }
            $('#allCatsOption').show();
            pageNum = 1;
            currentCatSelected = $('#storyCatsDropDown').find('option:selected').attr('value');
            currentTypeSelected = 'mine';
            masonryCont.empty();
            getStoriesAndWishListFiltered(custId, 25, 1, currentCatSelected);
        };
        
        $('#mineStories').click(function(){
        	 $('#storiesSearch').val('');
        	if( loadingInProgress ){
        		loadInterrupted = true;
        		interruptCompleteCallback = switchToMineStories;
        	}
        	else {
        		switchToMineStories();
        	}
        });

        function switchToPopularStories(){
            $('#mineStories').removeClass("tangerineTango-button").css("top", "-7px");
            $('#popularStories').addClass("tangerineTango-button").css("top", "-7px");
            masonryCont.empty();
            if (masonryInitialized) {
                masonryCont.masonry( 'destroy' );
                masonryInitialized = false;
            }
            pageNum = 1;
            currentTypeSelected = 'popular';
            masonryCont.empty();
            $('#allCatsOption').hide();
            
            currentCatSelected = $('#storyCatsDropDown').find('option:selected').attr('value');
            
            if( currentCatSelected === "" ){
            	$('#storyCatsDropDown').val('Breaking News');
            	currentCatSelected = 'Breaking News';
            }
//        	if( currentCatSelected === "" ){
//                getTopStoriesFull(custId, 25, 1, currentCatSelected);
//        		
//        	}
//        	else {            
        		getAllRequestSummaries(custId, 25, 1, currentCatSelected);
//        	}
        }
        
        $('#popularStories').click(function(){
       	 	$('#storiesSearch').val('');
        	if( loadingInProgress ){
        		loadInterrupted = true;
        		interruptCompleteCallback = switchToPopularStories;
        	}
        	else {
        		switchToPopularStories();
        	}
        });

        $('#storiesSearch').keyup(function(event){
            if( event.which === 13 ){
            	
            	if( loadingInProgress ){
            		loadInterrupted = true;
            		interruptCompleteCallback = searchDispatch;
            	}
            	else {
                    searchDispatch();
            	}
            }
        });

        $('#storiesSearchIcon').click(function(event){
        	if( loadingInProgress ){
        		loadInterrupted = true;
        		interruptCompleteCallback = searchDispatch;
        	}
        	else {
                searchDispatch();
        	}
        });

        $('#shareNewspaperIcon').click(function() {
            if (currNewspaperId != 0) {
            	var newspaperHeadline = $('#npHeadline').text();
            	TN.sharingHandler.initNPShare(currNewspaperId, newspaperHeadline);
            }
            else alert('Please load a newspaper to share first.');
        });

        //Attach a click event to the body so we can kill the fake div when the user clicks away from it.
		$('#bodyElem').click(function(){
			if(showingFake){
				$NewspaperHandler.hideFakeDiv(null);
			}
		});
		
		var serializerFunction = function gridSerializer(jQHtmlElem, gridCoords){
			//Add the id of the story so we can get it when we serialize
			gridCoords.storyId = jQHtmlElem.attr('story-id');
			return gridCoords;
		};
		
//		$(".gridster > ul").gridster({
//		    widget_margins: [5, 5],
//		    widget_base_dimensions: [12, 10],
//		    min_cols: 36,
//		    max_size_x: 36,
//		    serialize_params: serializerFunction,
//		    avoid_overlapped_widgets: true
//		}).data('gridster');
		
		$(".gridster > ul").gridster({
		    widget_margins: [5, 5],
		    widget_base_dimensions: [144, 10],
		    min_cols: 5,
		    max_size_x: 5,
		    serialize_params: serializerFunction,
		    avoid_overlapped_widgets: true
		}).data('gridster');
		
		gridster = $(".gridster ul").gridster().data('gridster');
		
		// override gridster's add_widget function to get around the inconsistent overlapping bug
		gridster.add_widget = TN_add_widget;
		gridster.resize_widget = TN_resize_widget;
		
		$('#dividersList li#divider1').click(function(){
			addDivider(1);
		});
		$('#dividersList li#divider2').click(function(){
			addDivider(2);
		});
		$('#dividersList li#divider3').click(function(){
			addDivider(3);
		});
		$('#dividersList li#divider4').click(function(){
			addDivider(4);
		});
		$('#dividersList li#divider5').click(function(){
			addDivider(5);
		});

/*        var oldFontSize = parseFloat($('.contentRight p').css('font-size'));
        $('#bodyFontSize').val(oldFontSize);
        $('#bodyFontSize').change(function(){
        	var newFontSize = $(this).val();
        	
        	var i = 0;
        	var widgetArray = $('.gs_w');
        	var numWidgets = widgetArray.length;
        	
        	var backupArray = [];
      	        	
        	function clearGrid(element){
            	gridster.remove_widget(element, function(){
            		
            		backupArray.push(element);
            		
        			i++;
        			
            		if(i < numWidgets){
            			clearGrid(widgetArray[i]);
            		}
            		else {
            			for (var j = 0; j < backupArray.length; j++ ){
                    		var addedWidget, newPosition, height;
                    		
                    		var jqElem = $(backupArray[j]);
                    		var width = parseFloat(jqElem.attr('data-sizex'));
                        	jqElem.css('opacity', '1.0');
                        	jqElem.css('display', 'block');
                    		
                    		if( jqElem.hasClass('selectedCont') ){
                    			newPosition = calculateAddPosition(width);
                            	jqElem.find('.story-content p').css('font-size', newFontSize + 'px');
                        		height = 15;
                    			addedWidget = gridster.add_widget(jqElem, width, height, newPosition.col, newPosition.row);
                    			recalcHeight(addedWidget, width);
                    			
                    			addedWidget.find('.in-page-story').hover(function(){
                    				$(this).parent().find(".editImage").show().mouseenter(function(){$(this).show();}).click(
                    						function(event){
                    							showEditPopupWidget($(this), addedWidget, parseFloat(addedWidget.attr('data-sizex'))  );
                    							event.stopImmediatePropagation();
                    						});
                    			}, function(){
                    				$(this).parent().find(".editImage").hide();
                    			});

                    		}
                    		else {
                    			newPosition = calculateAddPosition(width);
                    			//divider - just re-add it based on original height.
                    			height = parseFloat(jqElem.attr('data-sizey'));
                    			addedWidget = gridster.add_widget(jqElem, width, height, newPosition.col, newPosition.row);
                    			
                    			addedWidget.find('.dividerHeading').hover(function(){
                					$(this).parent().find(".editImage").show().mouseenter(function(){$(this).show();}).click(
                							function(event){
                								showEditPopupDivider($(this), addedWidget, parseFloat(addedWidget.attr('data-sizex'))  );
                								event.stopImmediatePropagation();
                							});
                				}, function(){
                					$(this).parent().find(".editImage").hide();
                				});

                    		}
                    		
                    		attachResizerEvents(addedWidget.find('.widget-resizer'));
            			}
            		}
            	});
        	}
        	
        	clearGrid(widgetArray[i]);
        	
        });
*/        
        loadCategories();
        getStoriesAndWishListFiltered(custId, 25, 1, '');
        loadNewspapersList();
	};
	
	$NewspaperHandler.showFakeDiv = function(originalDiv, evt){
		
		var fakeDiv = $NewspaperHandler.getFakeDiv();
		$(fakeDiv).css('height', ($(originalDiv).height()) + 'px');
		$(fakeDiv).css('width', ($(originalDiv).width()) + 'px');
		$(fakeDiv).css('position', 'absolute');
		$(fakeDiv).css('left', ($(originalDiv).position().left + 1)  + 'px');
		$(fakeDiv).css('top', ($(originalDiv).position().top + 1) + 'px');
		$(fakeDiv).css('zIndex', '20');
		$(fakeDiv).css('backgroundColor', 'blue');
		$(fakeDiv).css('display', 'block');
		$(fakeDiv).css('opacity', '0.5');
		$('.gridster').append(fakeDiv);

		$(fakeDiv).resizable({grid:18});
		tileBeingResized = originalDiv;
		
		showingFake = true;
	};
	
	$NewspaperHandler.hideFakeDiv = function(originalDiv){
		var fakeDiv = $NewspaperHandler.getFakeDiv();
		$(fakeDiv).css('display', 'none');
		showingFake = false;
	};
			
	$NewspaperHandler.addWidget = function(widgetToAdd, dimension){
		//Strip out the html and add to a new element. This will remove the onclick event and anything
		//else that shouldn't be there.
				
		if( !dimension && alreadyInNewspaper($(widgetToAdd).attr('story-id')) ){
			alert('This item already exists in the current newspaper.');
			return;
		}
		
		var newPosition, startingWidth, startingHeight;
		
		var widgetWrapper = $('<div class="in-page-story"></div>');
		
		var contentWrapper = $('<div class="storyCont"></div>');
		$(contentWrapper).append($(widgetToAdd).html());
		
		$(widgetWrapper).append(contentWrapper);
		var newWidget = $('<div class="selectedCont"></div>').append(widgetWrapper);

		//Add the remove link
		newWidget.append($('<div class="widget-closer"><img class="editImage" src="images/newsPaper/editPopupEditBtn-bg.png" width="15" height="15" alt="edit" title="Edit"></div>'));
		
		//Add the resizer
		var resizerElem = $('<div class="widget-resizer"><img height="15" width="15" alt="resize" title="Resize" src="images/newsPaper/expand-icon.png"/></div>');

		attachResizerEvents(resizerElem);
		
		//Append the resizer
		newWidget.append(resizerElem);
		
//		var resizerElem = $(newWidget).find('.widget-resizer');
		
		//Show the story 
		var widgetContent = $(newWidget).find('.story-content');
		$(widgetContent).css('display', 'block');
		$(widgetContent).css('margin-top', '5px');
		$(widgetContent).css('margin-left', '5px');
		$(widgetContent).css('margin-right', '5px');
				
		var originatorContent = $(newWidget).find('.originator-content');
		$(originatorContent).css('display', 'block');
		
		$(widgetToAdd).find('.story-content').show();
		$(widgetToAdd).find('.originator-content').show();
		
		$(widgetToAdd).find('.originator-content').hide();
		$(widgetToAdd).find('.story-content').hide();
		
		//Get the new position
//		var startingWidth = 7;
		
		if( !!dimension ){
			startingWidth = dimension.width;
			startingHeight = dimension.height;
			newPosition = {
					row: dimension.row,
					col: dimension.col
			};
		}
		else {
			startingWidth = 1;		
			startingHeight = 15;
			newPosition = calculateAddPosition(startingWidth);
		}
		
		//Add the id of the story back in
		$(newWidget).attr('story-id', $(widgetToAdd).attr('story-id'));
		
//		var fontSize = $('#bodyFontSize').val();
//		newWidget.find('.story-content p').css('font-size', fontSize + 'px');
		newWidget.find('.story-img').attr('src', newWidget.find('.storyOriginalImage').val());
		
		var addedWidget = gridster.add_widget(newWidget, startingWidth, startingHeight, newPosition.col, newPosition.row);
		
		//Now hide the story from the candidate stories
		$(widgetToAdd).hide();
		$(newWidget).css('position', 'absolute');
		
		// recalculate height after widgetis placed on the layout
		addedWidget.imagesLoaded(function(){
			
			var newImageWidth = (addedWidget.width() - 10) + 'px';

			addedWidget.find('.story-img').css('width', newImageWidth);
			recalcHeight(addedWidget, startingWidth);			
			
			widgetWrapper.hover(function(){
				$(this).parent().find(".editImage").show().mouseenter(function(){$(this).show();}).click(
						function(event){
							showEditPopupWidget($(this), addedWidget, parseFloat(addedWidget.attr('data-sizex')) );
							event.stopImmediatePropagation();
						});
			}, function(){
				$(this).parent().find(".editImage").hide();
			});
		});	
		
		// If added from layout mark it so it can be re-added back after saving
		if( !dimension ){
			addedWidget.data('reAdd', true);
		}
	};
	
	$NewspaperHandler.getNumOfWidgets = function(){
		var ulElem = $("#gridsterList > li");
		return $(ulElem).size();
	};
	
	$NewspaperHandler.serializeGrid = function(){
		/*
		 * Returns an array of objects with the following structure:
		 * {
		 * 		col: 2 //This object's column in the grid
		 * 		row: 1 //This object's row in the grid
		 * 		size_x: 2 //The size of this object on the x-axis of the grid
		 * 		size_y: 1 //The size of this object on the y-axis of the grid
		 * 		storyId: "7" //The id of this story. This is populated by us from the DB and used so we load saved stories.
		 * }
		 */
		return gridster.serialize();
	};
	
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
						'xpos' : parseFloat(currElem.css('left')),
						'ypos' : parseFloat(currElem.css('top')),
						'pixelWidth' : parseFloat(currElem.css('width')),
						'pixelHeight' : parseFloat(currElem.css('height')),
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
						'xpos' : parseFloat(currElem.css('left')),
						'ypos' : parseFloat(currElem.css('top')),
						'pixelWidth' : parseFloat(currElem.css('width')),
						'pixelHeight' : parseFloat(currElem.css('height')),
						'jcolumn' : parseFloat(currElem.attr('data-col')),
						'jheight' : parseFloat(currElem.attr('data-sizey')),
						'jrow' : parseFloat(currElem.attr('data-row')),
						'jwidth' : parseFloat(currElem.attr('data-sizex'))
				};
				dividersArray.push(divider);
			}			
		});
	}

	$NewspaperHandler.cancelNewspaper = function(){
		clearLayout();
		$('#newspaperSelection').val(-1);
		currNewspaperId = 0;
	};
	
	$NewspaperHandler.deleteNewspaper = function(){
		if( currNewspaperId > 0 ){
			TN.services.deleteNewspaper(currNewspaperId).done(function(){
				loadNewspapersList();
				clearLayout();
				currNewspaperId = 0;
				alert('Newspaper has been successfully deleted.');
			}).fail(function(jqXHR, textStatus, errorThrown){
				if( jqXHR.responseText === 'success'){
					loadNewspapersList();
					clearLayout();
					currNewspaperId = 0;
					alert('Newspaper has been successfully deleted.');
				} else {
					alert('Error deleting newspaper:' + errorThrown );
				}
			});
		}
		else {
			alert('No newspaper is currently created or loaded.');
		}
	};
	
	$NewspaperHandler.saveNewspaper = function(){
				
		var today = new Date();
		var storiesArray = [];
		var dividersArray = [];
		
		buildStoriesAndDividersArray(storiesArray, dividersArray);		
		
		var newspaper = {
					'custId' : custId,
					'custName' : $('#firstname').text(),
					'date' : today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear(),
					'edition' : $('#npEdition').text(),
					'headline' : $('#npHeadline').text(),
					'id' : currNewspaperId,
					'location' : $('#npLocation').text(),
					'stories' : storiesArray,
					'dividers' : dividersArray
		};
		
		if( currNewspaperId > 0 ){
			TN.services.updateNewspaper(newspaper).done(function(response){
				if( response[0] === true ){
					loadNewspapersList();
					loadNewspaper(currNewspaperId);
					alert('Newspaper has been successfully updated.');
				}
				else {
					alert('There was an error in making the updates');
				}
			}).fail(function(jqXHR, textStatus, errorThrown){
				alert('There was an error in making the updates: (' +  jqXHR.status + ') ' + errorThrown);				
			});
		}
		else {
			TN.services.saveNewspaper(newspaper).done(function(response){
				loadNewspapersList();
				loadNewspaper(parseFloat(response));
				alert('Newspaper has been successfully saved.');
			}).fail(function(jqXHR, textStatus, errorThrown){
				alert('There was an error in saving the newspaper: (' +  jqXHR.status + ') ' + errorThrown);
			});	
		}		
	};
	
	$NewspaperHandler.showPreview = function(){
		
		var clonedRightData = $('#contentRight').clone();
		
		//Tidy up the HTML before we add it to the lightbox
		clonedRightData.find('.previewBtn').remove();
		clonedRightData.find('.editList').remove();
		clonedRightData.find('#dividers').remove();
		clonedRightData.find('#fontSelectionCont').remove();
		clonedRightData.find('.widget-closer').remove();
		clonedRightData.find('.widget-resizer').remove();
		clonedRightData.find('.in-page-story').css('cursor', 'default').css('border', '0px');
		clonedRightData.css('left', '3px');
		clonedRightData.find('.newspaperLayout').css('overflowY', 'auto').css('height', 'auto').
			removeClass('layoutBackground').addClass('previewBackground');
		
		LightboxTool.displayLightbox(clonedRightData, {showHeader:true, width:830});
	};

}(TN.NewspaperHandler));