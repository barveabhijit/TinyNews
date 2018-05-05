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
	var widthResizeFactor = 126;
	var heightResizeFactor = 126;
	var singleTileWidth = 150;
	var tileBeingResized;
	var gadgets = [];
	var masonryCont;
    var masonryInitialized = false;
    var currNewspaperId = 0;
    
    var defNpTitle = 'Your Brilliant Newspaper Title';
    var defNpEdition = 'VOL 1 ISSUE 1';
    var defNpLocation = 'Philadelphia, PA';
    
	var fontSectionElem = $('.TNStories_FontBox');
	var fontStyleElem = $('#fontStyle');
	var fontSizeElem = $('#fontSize');
	var fontColorElem = $('#fontColor');
	var catListElem = $('#storyCatsDropDown');
	
	var fontStyleBaseLabel = '- Font -';
	var fontSizeBaseLabel = '- Font Size -';
	var fontColorBaseLabel = '- Font Color -';
	
    var fontStyleChangeCB = null,
    	fontSizeChangeCB = null,
    	fontColorChangeCB = null;
        
    function getNewHeight(widget){
		var currentHeight = widget.find('.storyCont').height();
		var newWidgetHeight = 0;
		
		if( !!currentHeight){
			newWidgetHeight = Math.ceil(currentHeight/19);
		}
		else{
			currentHeight = widget.find('.dividerCont > p').height();
			newWidgetHeight = Math.ceil(currentHeight/19) + 1;
		}

		return newWidgetHeight;
    }
    
	function recalcHeight(widget, width ){
		gridster.resize_widget(widget, width, getNewHeight(widget));
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
				
				var storyType = (tileBeingResized.find('.in-page-story').length>0);
								
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
						if( storyType ){
							sizeToAdjustHeightBy = sizeToAdjustWidthBy*7;
							newHeightFound = true;
						}
					}
				}
				
				if( !newHeightFound ){
					if(newHeight <= (originalHeight - ((heightResizeFactor/2) + 1)) || newHeight >= (originalHeight + ((heightResizeFactor/2) + 1))){
						if(newHeight > originalHeight){
								
							var rangeLower = nextHeight;
							var rangeUpper = nextHeight + heightResizeFactor;
							
							nextHeight += heightResizeFactor;
							
							if( newHeight > (rangeLower + (heightResizeFactor/2))){
								++sizeToAdjustHeightBy;
							}
								
						}
						else {
								
							var rangeLower = nextHeight - heightResizeFactor;
							var rangeUpper = nextHeight;
							
							nextHeight -= heightResizeFactor;
							
							if( newHeight < (rangeUpper - (heightResizeFactor/2))){
								--sizeToAdjustHeightBy;
							}
								
						}
						
						// Also change width with same proportion if the story is being resized
						if( storyType ){
							sizeToAdjustWidthBy = sizeToAdjustHeightBy;
							sizeToAdjustHeightBy = sizeToAdjustHeightBy*7;
						}
					}					
				}
				
				var oldWidth = currentWidth;
				
				currentWidth += sizeToAdjustWidthBy;
								
				var oldHeight = currentHeight;
				currentHeight += sizeToAdjustHeightBy;
				
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
				
							
				tileBeingResized = gridster.resize_widget($(tileBeingResized), currentWidth, currentHeight);
				
				$NewspaperHandler.hideFakeDiv(null);
						
				if( storyType ){
					tileBeingResized.imagesLoaded(function(){
						
						var newImageWidth = (tileBeingResized.width() - 10) + 'px';

						tileBeingResized.find('.story-img').css('width', newImageWidth);
						recalcHeight(tileBeingResized, currentWidth);
						
					});	
				}
								
				//If Devider resize it
				var dividerHeading = $($(tileBeingResized).find('.dividerCont'))[0];
				
				if( !!dividerHeading ){
					$(dividerHeading).css('height',  $(tileBeingResized).height() );
				}
				
			});
		}
		return fakeDiv;
	}
	
	function removeWidget(widgetToRemove, reAdd, fnCallback){
		if( widgetToRemove.find('.highlighted').length > 0 ){
			clearFontSelectionLayout();
		}
		
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
	
	var highlightedElem = null;
	
	function updateFonts(updateElem, gridsterElem ){
				
		if(updateElem.parent().hasClass('story-content')){
			var bodyParent = updateElem.parent();
			updateElem = bodyParent.find('p');
		}
		
		// if another element already highlighted, unhighlight it
		if( !!highlightedElem ){
			highlightedElem.elem.removeClass('highlighted');
//			highlightedElem.elem.css('background-color', highlightedElem.oldBackgroundColor );
		}
		
		// highlight current element and store it	
		highlightedElem = {};
		highlightedElem.elem = updateElem;
		highlightedElem.oldBackgroundColor = updateElem.css('background-color');
		updateElem.addClass('highlighted');
						
		$(window).scrollTop(fontSectionElem.position().top);
			
		var currFontFamily = updateElem.css('font-family');
		var currFontStyle = TN.fonts.getFontValue(currFontFamily);
		
		TN.utils.setDropdownValue(fontStyleElem, currFontStyle);
		
		fontStyleChangeCB = function(clickedElem){
			var selectedFontStyle = clickedElem.text();
			if( selectedFontStyle !== fontStyleBaseLabel){
				updateElem.css('font-family', TN.fonts.getFontFamily(selectedFontStyle) );
				
				if( updateElem.attr('id') === 'npLocation' ){
					$('#npEdition').css('font-family', TN.fonts.getFontFamily(selectedFontStyle));
				}
				
				if( updateElem.attr('id') === 'npEdition' ){
					$('#npLocation').css('font-family', TN.fonts.getFontFamily(selectedFontStyle));
				}
				
				if( !!gridsterElem ){
					recalcHeight(gridsterElem,  parseFloat(gridsterElem.attr('data-sizex')));					
				}
			}
		};
		
		var currFontSize = parseFloat(updateElem.css('font-size'));
		
		TN.utils.setDropdownValue(fontSizeElem, currFontSize);
		
		fontSizeChangeCB = function(clickedElem){
			var selectedFontSize = clickedElem.text();
			if( selectedFontSize !== fontSizeBaseLabel ){
				updateElem.css('font-size', selectedFontSize + 'px');
				if( updateElem.attr('id') === 'npLocation' ){
					$('#npEdition').css('font-size', selectedFontSize + 'px');
				}
				
				if( updateElem.attr('id') === 'npEdition' ){
					$('#npLocation').css('font-size', selectedFontSize + 'px');
				}
				
				if( !!gridsterElem ){
					recalcHeight(gridsterElem,  parseFloat(gridsterElem.attr('data-sizex')));
				}
			}
		};
		
		var currFontColor = updateElem.data('color');
		
		if( !!currFontColor === false ){
			currFontColor = fontColorBaseLabel;
		}
		
		TN.utils.setDropdownValue(fontColorElem, currFontColor);
		
		fontColorChangeCB = function(clickedElem){
			var selectedFontColor = clickedElem.text();
			if( selectedFontColor !== fontColorBaseLabel ){
				updateElem.css('color', selectedFontColor );
				
				if( updateElem.attr('id') === 'npLocation' ){
					$('#npEdition').css('color', selectedFontColor);
					$('#npEdition').data('color', selectedFontColor);
				}
				
				if( updateElem.attr('id') === 'npEdition' ){
					$('#npLocation').css('color', selectedFontColor);
					$('#npLocation').data('color', selectedFontColor);
				}
				
				updateElem.data('color', selectedFontColor);
			}
		};
	}
	
	function addDivider(startingWidth){
		var defaultText = 'Type text, click Enter...';
		function getDividerHeadingHtml(){
			return(' \
				<div class="dividerCont"> \
					<a href="#newsClose" class="newsClose"></a>\
					<input class="dividerHeadingInput" type="text" value="' + defaultText + '"/> \
				</div> \
			');
		}
				
//		var startingWidth = 7;
		var dividerHeadingHtml = getDividerHeadingHtml();
//		var newPosition = getNextAvailableRow(startingWidth, 1);
		var newPosition = calculateAddPosition(startingWidth);
		var newWidget = $('<div></div>').append(dividerHeadingHtml);
		
		var addedWidget = gridster.add_widget(newWidget, startingWidth, 2, newPosition.col, newPosition.row);
		newWidget.css('position', 'absolute');
		
		$(window).scrollTop( newWidget.position().top );
		
		addedWidget.find('.newsClose').click(function(){
			removeWidget(addedWidget, false);				
		});
				
		addedWidget.find('.dividerHeadingInput').focus().click(function(){
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
				var headingElem = jqElem.parents('.dividerCont');
				headingElem.append('<p>' + headingText + '</p>');
				jqElem.remove();
				
				recalcHeight(addedWidget, startingWidth);
				
				headingElem.find('p').unbind('dblclick').dblclick(function(){
					updateFonts($(this), addedWidget);
				});								
			}
		});
	}
	
	function getDividerHtml(dividerObj){
		var dividerHtml = '<div class="dividerCont">\
								<a href="#newsClose" class="newsClose"></a>\
								<p>' + dividerObj.headline + '</p> \
								<a href="#newsExpand" class="newsExpand"></a>\
						   </div>';
		return dividerHtml;
	}
	
	function getStoryHtml(storyObj){
		function getOpedHtml(){
			var opedHtml = "";
			
			if( !!storyObj.buzzWho ){
				opedHtml += "<p>Who: "+ storyObj.buzzWho + "</p>";
			}
			if( !!storyObj.buzzWhat ){
				opedHtml += "<p>What: "+ storyObj.buzzWhat + "</p>";
			}
			if( !!storyObj.buzzWhere ){
				opedHtml += "<p>Where: "+ storyObj.buzzWhere + "</p>";
			}
			if( !!storyObj.buzzWhen ){
				opedHtml += "<p>When: "+ storyObj.buzzWhen + "</p>";
			}
			if( !!storyObj.buzzHow ){
				opedHtml += "<p>How: "+ storyObj.buzzHow + "</p>";
			}
			if( !!storyObj.buzzWhy ){
				opedHtml += "<p>Why: "+ storyObj.buzzWhy + "</p>";
			}
			if( !!storyObj.buzzOped ){
				opedHtml += "<p>"+ storyObj.buzzOped + "</p>";
			}
			
			return opedHtml;
		}
		
		var storyHtml = '<div class="StoriesBox" onclick="TN.NewspaperHandler.addWidget(this);" id="story_' + storyObj.buzzId + '" story-id="' + storyObj.buzzId +'">\
				<img class="story-img" src="' + storyObj.storyThumbImg + '" alt="' + storyObj.headline + '">\
				<h3 class="storyHeading">' + storyObj.headline + '</h3>\
				<a href="#" class="StoriesBoxEffct"></a>\
				<div class="story-content">\
					<input class="storyOriginalImage" type="hidden" value="' + storyObj.storyOriginalImg + '"/>\
					<input class="storyThumbImage" type="hidden" value="' + storyObj.storyThumbImg + '"/>\
					<input class="buzzId" type="hidden" value="' + storyObj.buzzId + '"/> \
					<input class="imageId" type="hidden" value="' + storyObj.imageId + '"/> \
					<input class="elementId" type="hidden" value="' + storyObj.elementId + '"/>' +
					getOpedHtml() +
					'<a href="#newsClose" class="newsClose"></a>\
				</div>\
				<div class="originator-content modulNews">\
                    <div class="modulNewsImage left">\
						<img src="' + storyObj.originatorImageUrl + '" width="37" alt="user image">\
					</div>\
					<h2>' + storyObj.originatorName + '</h2>\
					<p>' + storyObj.elapsedTime + '</p>\
					<a href="#newsExpand" class="newsExpand"></a>\
				</div>\
			</div>';
		
		var storyHtmlOld = '\
		<div id="story_' + storyObj.buzzId + '" class="storyBlock item" onclick="TN.NewspaperHandler.addWidget(this);" story-id="' + storyObj.buzzId +'">\
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
			
	function clearFontSelectionLayout(){
		TN.utils.setDropdownValue(fontStyleElem, fontStyleBaseLabel);
		TN.utils.setDropdownValue(fontSizeElem, fontSizeBaseLabel);
		TN.utils.setDropdownValue(fontColorElem, fontColorBaseLabel);
		highlightedElem = null;
		
		fontStyleChangeCB = null;
		fontSizeChangeCB = null;
		fontColorChangeCB = null;
		
		var highlightedElem = $('.highlighted');
		highlightedElem.removeClass('highlighted');
		
		var editTextElem = highlightedElem.siblings('.editable-txt-active');
		if( editTextElem.length > 0 ){
			editTextElem.blur();
		}
	}
	
	function clearLayout(postClearCallback){
    	var widgetArray = $('.gs_w');
    	var numWidgets = widgetArray.length;
		var i = 0;
		
		clearFontSelectionLayout();
		
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
					var npHeadlineElem = $('#npHeadline');
					var npEditionElem = $('#npEdition');
					var npLocationElem = $('#npLocation');
					
					npHeadlineElem.text((!!newspaperJson.headline ? newspaperJson.headline : ''));
					npEditionElem.text((!!newspaperJson.edition ? newspaperJson.edition : ''));
					npLocationElem.text((!!newspaperJson.location ? newspaperJson.location : ''));
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
					
					if( 'dividers' in newspaperJson ){
						var dividersArray = newspaperJson.dividers;
						var numDividers = dividersArray.length;
						for( var i = 0; i < numDividers; i++ ){
							var currDivider = dividersArray[i];
							var dividerHtml = getDividerHtml(currDivider);
							var dividerHtmlElem = $(dividerHtml);
							
							var newWidget = $('<div></div>').append(dividerHtmlElem);
							
							newWidget.append();
							
							var headingElem = newWidget.find('.dividerCont > p');
							headingElem.css('color', currDivider.fontcolor);
							headingElem.css('font-size', currDivider.fontsize);
							headingElem.css('font-family', currDivider.fontstyle);
							
                			var addedWidget = gridster.add_widget(newWidget, currDivider.jwidth, currDivider.jheight, 
                					currDivider.jcolumn, currDivider.jrow);
                			
                			addedWidget.css('position', 'absolute');
                			                			
                			addedWidget.find('.newsClose').click(function(){
                				removeWidget(addedWidget, false);				
                			});
                			
                			addedWidget.find('.newsExpand').click(function(event){
                				$NewspaperHandler.showFakeDiv(addedWidget, event);
                				event.stopImmediatePropagation();
                			});
                			
            				headingElem.unbind('dblclick').dblclick(function(){
            					updateFonts($(this), addedWidget);
            				});
                			            				
            				addedWidget.find('.dividerCont').css('height',  addedWidget.height() );            				
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
    			var newspaperListElem = $('#newspapersList');
    			newspaperListElem.empty();
    			for( var i = 0; i < numNewspapers; i++ ){
    				var currNewspaper = json[i];
    				var currNewspaperElem = $('<li id="' + currNewspaper.id + '"><a href="#">' + currNewspaper.headline + '</a></li>');
    				currNewspaperElem.click(function(){
    					var jqElem = $(this);
    					var currId = parseFloat(jqElem.attr('id'));
    					loadNewspaper(currId);
    				});
    				newspaperListElem.append(currNewspaperElem)
    			}
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
    
    function getSelectedCat(){
    	var selectedCat = $('#storyCatsDropDown').find('.current').text();
    	return (selectedCat === 'All Categories' ? '' : selectedCat);
    }
    
	$NewspaperHandler.init = function(){

        var storiesHtml = '';
        var searchStoriesHtml = '';
		var storiesNumPages = 0;
        var pageNum = 1;
        masonryCont = $('#masonryEffect');
        var currentCatSelected = getSelectedCat();
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
									buzzHow:storyItem.phow,
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
									buzzId: (!!buzz ? buzz.buzzId : 0),
									imageId:(!!buzz ? buzz.imageId : 0),
									elementId:0,
									storyThumbImg: (!!buzz ? buzz.thumbImageUrl : ''),
									storyOriginalImg: (!!buzz ? buzz.imageUrl : ''),
									buzzWhat:(!!buzz ? buzz.what : ''),
									buzzWhen:(!!buzz ? buzz.when : ''),
									buzzWhere:(!!buzz ? buzz.where : ''),
									buzzWhy:(!!buzz ? buzz.why : ''),
									buzzWho:(!!buzz ? buzz.who : ''),
									buzzHow:(!!buzz ? buzz.how : ''),
									buzzOped:(!!buzz ? buzz.oped : ''),
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
            currentCatSelected = getSelectedCat();
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
                (currentTypeSelected == 'popular') ? $('#popularStories').addClass("active") : $('#mineStories').addClass("active");
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
                	if( loadingInProgress ){
                		loadInterrupted = true;
                		interruptCompleteCallback = catChangeCallback;
                	}
                	else {
                		catChangeCallback();
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
                        if (json[i].id == "Q") continue;
                        if( json[i].global === 1 || json[i].global === 0 ){
                        	addCategoryItem(json[i].id);
                        }
                    }                  
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
                                        itemSelector : '.StoriesBox',
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
                                        itemSelector : '.StoriesBox',
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
                                        itemSelector : '.StoriesBox',
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
                                    itemSelector : '.StoriesBox',
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
                $('#mineStories, #popularStories').removeClass("active");
                $('#allCatsOption').show();
                TN.utils.setDropdownValue(catListElem, 'All Categories');
//               $('#storyCatsDropDown .current').text("");
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
            $('#popularStories').removeClass("active");
            $('#mineStories').addClass("active");
            masonryCont.empty();
            if (masonryInitialized) {
                masonryCont.masonry( 'destroy' );
                masonryInitialized = false;
            }
            $('#allCatsOption').show();
            pageNum = 1;
            currentCatSelected = getSelectedCat();
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
            $('#mineStories').removeClass("active");
            $('#popularStories').addClass("active");
            masonryCont.empty();
            if (masonryInitialized) {
                masonryCont.masonry( 'destroy' );
                masonryInitialized = false;
            }
            pageNum = 1;
            currentTypeSelected = 'popular';
            masonryCont.empty();
            $('#allCatsOption').hide();
            
            currentCatSelected = getSelectedCat();
            
            if( currentCatSelected === "" ){
            	TN.utils.setDropdownValue(catListElem, 'Breaking News');
//            	$('#storyCatsDropDown .current').text('Breaking News');
            	currentCatSelected = 'Breaking News';
            }
        	getAllRequestSummaries(custId, 25, 1, currentCatSelected);
        }
        
        //Load the font style dropdown
        var fontStyleDropDown = $('#fontStyle > ul');
        function addFontStyleItem(itemText){
        	var fontStyleItemElem = $('<li>' + itemText + '</li>');
        	
        	fontStyleItemElem.click(function(){
        		var currElem = $(this);
        		if( !!fontStyleChangeCB ){
        			fontStyleChangeCB($(this));
            		TN.utils.setDropdownValue(fontStyleElem, currElem.text());        			
        		}
        		else {
            		TN.utils.setDropdownValue(fontStyleElem, fontStyleBaseLabel);   			
        		}
        		fontSectionElem.click();
        		return false;
        	});
        	
        	fontStyleDropDown.append(fontStyleItemElem);        	
        }
        
        addFontStyleItem(fontStyleBaseLabel);
        var fontsArray = TN.fonts.getFontsArray();
        for( var fontValue in fontsArray ){        	
        	addFontStyleItem(fontValue);        	
        }
       
        TN.utils.setDropdownValue(fontStyleElem, fontStyleBaseLabel);
        
        // Load the font size dropdown
        var fontSizeDropDown = $('#fontSize > ul');
        function addFontSizeItem(itemText){
        	var fontSizeItemElem = $('<li>' + itemText + '</li>');
        	
        	fontSizeItemElem.click(function(){
        		var currElem = $(this);
        		if( !!fontSizeChangeCB ){
        			fontSizeChangeCB($(this));
            		TN.utils.setDropdownValue(fontSizeElem, currElem.text());        			
        		}
        		else {
            		TN.utils.setDropdownValue(fontSizeElem, fontSizeBaseLabel);   			
        		}
        		fontSectionElem.click();
        		return false;        	
        	});
        	
        	fontSizeDropDown.append(fontSizeItemElem);
        }
                
        addFontSizeItem(fontSizeBaseLabel);
        for( var i = 8; i <= 72; i++ ){
        	addFontSizeItem(i);
        }
        
        TN.utils.setDropdownValue(fontSizeElem, fontSizeBaseLabel);
                        
        // Load the font color dropdown
        var fontColorDropDown = $('#fontColor > ul');
        function addFontColorItem(itemText){
        	var fontColorItemElem = $('<li>' + itemText + '</li>');
        	
        	fontColorItemElem.click(function(){
        		var currElem = $(this);
        		if( !!fontColorChangeCB ){
        			fontColorChangeCB(currElem);
            		TN.utils.setDropdownValue(fontColorElem, currElem.text());        			
        		}
        		else {
            		TN.utils.setDropdownValue(fontColorElem, fontColorBaseLabel);   			
        		}
        		fontSectionElem.click();
        		return false;
        	});
        	
        	fontColorDropDown.append(fontColorItemElem);
        }
                
    	addFontColorItem(fontColorBaseLabel);
        var colorArray = ['Black','Blue','Red'];
        for( var color in colorArray ){
        	addFontColorItem(colorArray[color]);
        }
        
        TN.utils.setDropdownValue(fontColorElem, fontColorBaseLabel);
        
        function switchToEditMode(currElem, inputElem){
        	inputElem.val(currElem.text()).show().keyup(function(event){
                if( event.which === 13 ){
                	currElem.text(inputElem.val()).show();
                	inputElem.hide();
                }
        	});
        	currElem.hide();        	
        }        
        
        // Newspaper title field events
        $('#npHeadline').dblclick(function(){        	
        	updateFonts($(this));        	
        });
        
        $('#npEdition').dblclick(function(){        	
        	updateFonts($(this));        	
        });
       
        $('#npLocation').dblclick(function(){        	
        	updateFonts($(this));        	
        });
        
        $('.gadgetList').click(function(){
        	alert('Coming soon.');
        });
        
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

        $('#publishButton').click(function() {
            if (currNewspaperId != 0) {
            	var newspaperHeadline = $('#npHeadline').text();
            	TN.sharingHandler.initNPShare(currNewspaperId, newspaperHeadline);
            }
            else alert('Please load a newspaper to share first.');
        });

        //Attach a click event to the body so we can kill the fake div when the user clicks away from it.
		$('body').click(function(event){
			if(showingFake){
				$NewspaperHandler.hideFakeDiv(null);
			}
			
			var currElem = $(event.target);
			var isFontBox = currElem.hasClass('TNStories_FontBox');
			var isWithinFontBox = currElem.parents('.TNStories_FontBox').length>0;
			var isInEditBox = currElem.hasClass('editable-txt-active') && currElem.siblings('.editable').hasClass('active');
			var isHighlightedElem = currElem.hasClass('highlighted');
			
			if( !isFontBox && !isWithinFontBox && !isInEditBox && !isHighlightedElem ){
				clearFontSelectionLayout();
			}
		});
			
		var serializerFunction = function gridSerializer(jQHtmlElem, gridCoords){
			//Add the id of the story so we can get it when we serialize
			gridCoords.storyId = jQHtmlElem.attr('story-id');
			return gridCoords;
		};
		
		$(".gridster > ul").gridster({
		    widget_margins: [5, 5],
		    widget_base_dimensions: [126, 10],
		    min_cols: 5,
		    max_size_x: 5,
		    serialize_params: serializerFunction,
		    avoid_overlapped_widgets: true
		}).data('gridster');
		
		gridster = $(".gridster ul").gridster().data('gridster');
		
		// override gridster's add_widget function to get around the inconsistent overlapping bug
		gridster.add_widget = TN_add_widget;
		gridster.resize_widget = TN_resize_widget;
		
		$('#divider1').click(function(){
			addDivider(1);
		});
		$('#divider2').click(function(){
			addDivider(2);
		});
		$('#divider3').click(function(){
			addDivider(3);
		});
		$('#divider4').click(function(){
			addDivider(4);
		});
		$('#divider5').click(function(){
			addDivider(5);
		});

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
		var newWidget = $('<div class="newsCont"></div>').append(widgetWrapper);
		
		newWidget.find('.StoriesBoxEffct').remove();
		
		newWidget.find('.story-img').css('margin-left', '5px');
		
		//Show the story 
		var widgetContent = newWidget.find('.story-content');
		$(widgetContent).css('display', 'block');
		$(widgetContent).css('margin-top', '5px');
		$(widgetContent).css('margin-left', '5px');
		$(widgetContent).css('margin-right', '5px');
				
		var originatorContent = newWidget.find('.originator-content');
		$(originatorContent).css('display', 'block');
		
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
		
		newWidget.find('.story-img').attr('src', newWidget.find('.storyOriginalImage').val());
		
		var addedWidget = gridster.add_widget(newWidget, startingWidth, startingHeight, newPosition.col, newPosition.row);
		
		//Now hide the story from the candidate stories
		$(widgetToAdd).hide();
		$(newWidget).css('position', 'absolute');
		
		// recalculate height after widgetis placed on the layout
		addedWidget.imagesLoaded(function(){
			
			addedWidget.find('.storyHeading').unbind('dblclick').dblclick(function(){
				updateFonts($(this), addedWidget);
			});
			
			addedWidget.find('.story-content > p').unbind('dblclick').dblclick(function(){
				updateFonts($(this), addedWidget);
			});
			
			var newImageWidth = (addedWidget.width() - 10) + 'px';

			addedWidget.find('.story-img').css('width', newImageWidth);
			recalcHeight(addedWidget, startingWidth);
			
			addedWidget.find('.newsClose').click(function(){
				removeWidget(addedWidget, true);				
			});
			
			addedWidget.find('.newsExpand').click(function(event){
				$NewspaperHandler.showFakeDiv(addedWidget, event);
				event.stopImmediatePropagation();
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
				if( currElem.find('.dividerHeadingInput').length === 0 ){
					var headingElem = currElem.find('.dividerCont > p');
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
		
		var npHeadlineElem = $('#npHeadline');
		var npLocationElem = $('#npLocation');
		var npEditionElem = $('#npEdition');
		
		var newspaper = {
					'custId' : custId,
					'custName' : $('#firstname').text(),
					'date' : today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear(),
					'edition' : npEditionElem.text(),
					'headline' : npHeadlineElem.text(),
					'titleFontColor' : npHeadlineElem.css('color'),
					'titleFontStyle' : npHeadlineElem.css('font-family'),
					'titleFontSize' : npHeadlineElem.css('font-size'),
					'locEdFontColor' : npLocationElem.css('color'),
					'locEdFontStyle' : npLocationElem.css('font-family'),
					'locEdFontSize' : npLocationElem.css('font-size'),
					'id' : currNewspaperId,
					'location' : npLocationElem.text(),
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
		
		var clonedRightData = $('#newspaperSection').clone();
		
		clonedRightData.find('.highlighted').removeClass('highlighted');
		
		clonedRightData.find('.newsContWrapper').css('overflowY', 'auto').
			removeClass('TNnewspaperBox_Cont').addClass('TNnewspaperPreviewBackground');
	
		LightboxTool.displayLightbox(clonedRightData, {showHeader:true, width:830});
	};

}(TN.NewspaperHandler));