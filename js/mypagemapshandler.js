if(!TN) var TN = {};
if (!TN.myPage) TN.myPage = {};

(function($TN){
	
	//var catType = 'BuyItOrNot';
	var catType = '';
	var mapsHandler = {};
	(function($mapsHandler){
		var apiKey = 'AIzaSyC3JpD-ZB_NgciJjjPDaz5u9G11vs37Czc';
		var mapCanvas = $('#mapCanvas');
		var mapCanvasObject = null;
		var canvasZoomLevel = 2;
		var insetZoomLevel = 12;
		var mapInsetObject = null;
		var latLongArray = {};
		var showHeadlines = false;
//		var custId = 388;
		var custId=TN.utils.getCookie('TNUser');
		var currentOpenDetailBox = null;
		
						
		var latLng = null;
		var canvasOptions = null;
		
		var markersArray = [];
		
		var localCats = [];
		var globalCats = [];
		var catBarElem = $('#categoriesBar');
		
		function addMarker( lat, long, messageId, markerTitle, thumbImageUrl, content){
			// Ref code for InfoBox: http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/examples.html
			
			function getInfoBoxHtml(){
				return( '<div class="infoBoxContent">\
							<img class="thumbImage" src="' + thumbImageUrl + '"></img> \
							<div class="headlineContainer">\
							<div class="headline">' + markerTitle + '</div>\
							</div>\
						</div>' );
			}
			
			function getInfoBoxDetailed(){
				
				var detailedBox = document.createElement('div');
				detailedBox.innerHTML = '<div class="inlineBox block">\
					<a href="#" class="inlineBox-btnClose"></a>\
					<div class="inlineBoxContainer block">\
						<div class="inlineBox-imageBlock">\
							<div class="block" >\
								<div class="inlineBox-imageWrapper">\
									<img src="' + thumbImageUrl + '" title="Story Image" >\
								</div>\
							</div>\
							<div class="inlineBox-User block">\
								<img src="' + content.originatorImageUrl + '" title="' + content.originatorName + '">\
								<h2>by <a href="#">' + content.originatorName + '</a></h2>\
								<p>' + content.elapsedTime + '</p>\
							</div>\
						</div>\
						<div class="inlineBox-textBlock block">\
							<h1>' + markerTitle + '</h1>\
							<p>Who: ' + content.who + '</p>\
							<p>When: ' + content.when + '</p>\
							<p>What: ' + content.what + '</p>\
						</div>\
						<div style="clear:both"></div>\
						<div class="inlineBox-viewMore" onclick="TN.lightbox.show(\'' + custId + '\',' + messageId + ')">\
							<a href="#">More</a>\
						</div>\
					</div>\
				</div>';
				detailedBox.style.cssText = 'width:506px; height:280px;';
				return detailedBox;
			}
			
			
			var latLong = new google.maps.LatLng(lat, long);
			var markersObject = createMarker(latLong, markerTitle);
			
			var infoBoxOptions = {
				maxWidth:0,
				alignBottom:false,
				pixelOffset:new google.maps.Size(-5, 0),
				boxStyle:{ background: "url('images/icons/infobox_arrow.png') no-repeat"},
				content: getInfoBoxHtml(),
				closeBoxURL:"images/icons/close-button.png",
				closeBoxMargin:"20px 10px 2px 2px",
				disableAutoPan:true,
				position:latLong,
				enableEventPropagation:true
			};
			
			var infoWindowOptions = {
					boxClass:"infoWindowDetailed",
					maxWidth:0,
					alignBottom:false,
					pixelOffset:new google.maps.Size(5, -110),
					boxStyle:{ background: "url(images/index-inMapBox/body-bg.png) no-repeat"},
					content: getInfoBoxDetailed(),
					closeBoxURL:"images/icons/close-button.png",
					closeBoxMargin:"15px 15px 2px 2px",
					disableAutoPan:true,
					position:latLong,
					enableEventPropagation:true
				};
			
			var infoWindow = new InfoBox(infoBoxOptions);
			var infoWindowDetailed = new InfoBox(infoWindowOptions);
			
			google.maps.event.addListener(infoWindowDetailed, 'closeclick', function(){
				currentOpenDetailBox = null;
			});
			
			google.maps.event.addListener(markersObject.globalMarker, 'mouseover', function(){
				if( !showHeadlines && currentOpenDetailBox === null){
					infoWindow.open(mapCanvasObject, markersObject.globalMarker);
				}
			});
			
			google.maps.event.addListener(markersObject.globalMarker, 'mouseout', function(){
				if(!showHeadlines ){
					infoWindow.close();
				}
				markersObject.globalMarker.setAnimation(null);
			});
			
			google.maps.event.addListener(markersObject.globalMarker, 'click', function(){
				
				TN.lightbox.show(custId, messageId);
				
				
//				if(currentOpenDetailBox !== infoWindowDetailed){
//					if(currentOpenDetailBox !== null){
//						currentOpenDetailBox.close(); //Close the currently open detail box
//					}
//					
//					infoWindow.close(); //Close the info window
//					infoWindowDetailed.open(mapCanvasObject,markersObject.globalMarker);
					
					/*

					The below code is used to detect the position of the marker relative to the edge of the map canvas. 
					If the window is too far outside of view within the canvas then the window will be flipped horizontally
					to the other side of the marker. The calculations are working correctly but the flip of the window seems to
					screw with the css and things no longer line up correctly.	
					
					var scale = Math.pow(2, mapCanvasObject.getZoom());
					var nw = new google.maps.LatLng(
							mapCanvasObject.getBounds().getNorthEast().lat(),
							mapCanvasObject.getBounds().getSouthWest().lng()
					); 
					
					var worldCoordinateNW = mapCanvasObject.getProjection().fromLatLngToPoint(nw);
					var worldCoordinate = mapCanvasObject.getProjection().fromLatLngToPoint(infoWindowDetailed.getPosition());
					var pixelOffset = new google.maps.Point(
					    Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
					    Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
					);
					
					var bgImageWidth = 506;
					var mapCanvasWidth = 956;
					
					pixelOffset.x = relative left position
					pixelOffset.y = relative top position
					mapCanvas.height:430px;
  					mapCanvas.width: 956px;
  					bgimage.width: 506
  					bgimage.height: 280
					
					var offsetX;
					if(pixelOffset.x < 0){
						offsetX = pixelOffset.x * -1;
						offsetX = mapCanvasWidth - offsetX;
					}
					else {
						offsetX = pixelOffset.x;
					}
					
					console.log(offsetX + bgImageWidth);
					
					if(offsetX + bgImageWidth > (mapCanvasWidth + 40)){
						infoWindowDetailed.setOptions({
								boxStyle: {background: "url(images/index-inMapBox/body-bg-rev.png) no-repeat"},
								pixelOffset:new google.maps.Size(-510, -110)
						}); 
						console.log('outside');
					}
					else {
						console.log('inside');
						
						infoWindowDetailed.setOptions({
								boxStyle: {background: "url(images/index-inMapBox/body-bg.png) no-repeat"},
								pixelOffset:new google.maps.Size(5, -110),
						}); 
					}
					*/
					
//					currentOpenDetailBox = infoWindowDetailed;
//				}
//				else {
//					//Detail window already open, check if it's "this" one. If it is then close it	
//					if(currentOpenDetailBox === infoWindowDetailed){
//						currentOpenDetailBox.close();
//						currentOpenDetailBox = null;
//					}
//				}
			});
			
			latLongArray[lat] = {};
			latLongArray[lat][long] = {};
			latLongArray[lat][long].globalMarker = markersObject.globalMarker;
			
//			if( !!markersObject.insetMarker ){
//				latLongArray[lat][long].insetMarker = markersObject.insetMarker;
//			}
			
			latLongArray[lat][long].headline = infoWindow;
		}
		
		function createMarker( latLng, markerTitle ){
			var markersObject = {};
			var markerImage = new google.maps.MarkerImage('images/general/map-pin-small.png', 
							new google.maps.Size(18, 19),
							new google.maps.Point(0, 0),
							new google.maps.Point(0, 19));
			// Create inset map marker if inset map exists
			if( !!mapInsetObject ){
				markersObject.insetMarker = new google.maps.Marker({     
					  position: latLng,   
					  title: markerTitle,
					  animation: google.maps.Animation.DROP,
					  icon: markerImage,
					  map: mapInsetObject  });
				
				markersArray.push(markersObject.insetMarker);
			}
			
			markersObject.globalMarker = new google.maps.Marker({     
				position: latLng,   
				animation: google.maps.Animation.DROP,
				icon: markerImage,
				map: mapCanvasObject  });
			
			markersArray.push(markersObject.globalMarker);
			
			  // create and return global map marker so additional processing can be done for it.
			return( markersObject );
		}
		
		function getRequestSummaries(custId, numItems, pageNum, type){
//			if( mapFilter === 'all' ){
//				return(TN.services.getAllRequestSummaries(custId, numItems, pageNum, type));
//			}
			
//			if( mapFilter ==='me' ){
				return(TN.services.getMyRequestSummaries(custId, numItems, pageNum, type));
//			}
			
//			if( mapFilter ==='friends' ){
//				return(TN.services.getFriendsRequestSummaries(custId, numItems, pageNum, type));
//			}
						
//			if( mapFilter ==='following' ){
//				return(TN.services.getFollowingRequestSummaries(custId, numItems, pageNum, type));
//			}			
		}
		
		function loadCategories() {
			return(TN.services.getAllMessageTypeCategories().done(function(json){
				if( !!json ){
					var maxItems = json.length;
					for( var i = 0; i < maxItems; i++ ){
						if( json[i].global === 1 ){
							globalCats.push(json[i].id);
//							globalCatCont.append('<li><a href="#globalCat" onclick="TN.loadCategoryOnMap(\'' + json[i].id + '\')" >' + json[i].id + '</a></li>');
						} else {
							if( json[i].global === 0 ){
								localCats.push(json[i].id);
//								localCatCont.append('<li><a href="#localCat" onclick="TN.loadCategoryOnMap(\'' + json[i].id + '\')" >' + json[i].id + '</a></li>');
							}
						}
					}
				}
				
			}));
		}
		
		function moveLocalToMain(){
			mapCanvasObject.setZoom(insetZoomLevel);
			mapCanvasObject.setCenter(latLng);
			
			mapInsetObject.setZoom(canvasZoomLevel);

			google.maps.event.addListenerOnce(mapInsetObject, 'click', moveGlobalToMain);
			
			populateCatBar(localCats);
		}
		
		function moveGlobalToMain(){
			mapCanvasObject.setZoom(canvasZoomLevel);
			mapCanvasObject.setCenter(latLng);
			
			mapInsetObject.setZoom(insetZoomLevel);
						
			google.maps.event.addListenerOnce(mapInsetObject, 'click', moveLocalToMain);
			
			populateCatBar(globalCats);
		}
		
		function populateCatBar(catArray){
			var numCats = catArray.length;
			
			if( numCats >  0){
				catBarElem.empty();
				for (var i = 0; i < numCats; i++){
					catBarElem.append('<li><a href="#catOnBar" onclick="TN.loadCategoryOnMap(\'' + catArray[i] + '\')" >' + catArray[i] + '</a></li>');

				}
			}
		}
		
		function resetAndReload(){
			interruptSignal = false;			
			if (markersArray) {
				for (i in markersArray) {
					markersArray[i].setMap(null);    
				}    
				markersArray.length = 0;  
			}
			latLongArray = {};
			
			setMarkers();
		}
		
		function setMarkers(){
			var pageNum = 1;
			var maxPages = 1;
			var catTypesPageNums = {};
			var catTypesMaxPages = {};
			
			loadingInProgress = true; // $('#mapLoadingAnimation').show();
			function loadMarkers( json ){
				if( json && json[0] ){
					maxPages = parseFloat( json[0].noOfPages );
					if( json[0].fittingRoomSummaryList ){
					    var currentCatType = json[0].fittingRoomSummaryList[0].type;
					    catTypesMaxPages[currentCatType] = maxPages;
						var numItems = json[0].fittingRoomSummaryList.length;
						for( var i = 0; i<numItems; i++ ){
							var currItem = json[0].fittingRoomSummaryList[i];
							if( !!currItem.latitude && !!currItem.longitude && !!currItem.messageId){
								if( !latLongArray ){
									latLongArray = {};
								}
								latLongArray[currItem.latitude] = {};
								latLongArray[currItem.latitude][currItem.longitude] = {};
								latLongArray[currItem.latitude][currItem.longitude].messageId = currItem.messageId;
								
								var markerContent = {
										what: currItem.wsBuzz.what,
										when: currItem.wsBuzz.when,
										where: currItem.wsBuzz.where,
										who: currItem.wsBuzz.who,
										why: currItem.wsBuzz.why,
										originatorImageUrl: currItem.originatorImageUrl,
										originatorName: currItem.originatorName,
										elapsedTime: !!currItem.wsMessage ? currItem.wsMessage.elapsedTime : '' 
								};
								
								addMarker(currItem.latitude,currItem.longitude, currItem.messageId, 
										(!!currItem.headline ? currItem.headline : 'Test Headline'),
										currItem.senderThumbImageUrl, markerContent);								
							}
						}
						if( catTypesPageNums[currentCatType] < catTypesMaxPages[currentCatType] ){
							catTypesPageNums[currentCatType]++;
							// log("catTypesPageNums[currentCatType]: "+catTypesPageNums[currentCatType]+" catTypesMaxPages[currentCatType]: "+catTypesMaxPages[currentCatType]+" currentCatType: "+currentCatType);
						    TN.services.getMyRequestSummaries( (viewId) ? viewId : custId, 25, catTypesPageNums[currentCatType], currentCatType).
                                done(loadMarkers).error(function(){
                                    loadingInProgress = false;
                                });
						}
						else {
							loadingInProgress = false;
						}
					}
				}
			}
			
			TN.services.getAllMessageTypeActiveCategories().done(function(json){
                if( !!json ){
                    var maxItems = json.length;
                    for( var i = 0; i < maxItems; i++ ){
                        if( json[i].global === 1 || json[i].global === 0 ){
                            if ( (json[i].id == "Q") || (json[i].id == "IBoughtIt") ) continue;
                            catTypesPageNums[json[i].id] = 1;
                            TN.services.getMyRequestSummaries( (viewId) ? viewId : custId, 25, 1, json[i].id).
                                done(loadMarkers).error(function(){
                                    loadingInProgress = false;
                                });
                        }
                    }
                }
            });
		}
		
		$mapsHandler.getApiKey = function(){
			return apiKey;
		};
				
		$mapsHandler.hide = function(){
			mapCanvas.hide();
			delete mapCanvasObject;
		};
		
		$mapsHandler.show = function(){
			function loadScript() {  
				var script = document.createElement('script');  
				script.type = 'text/javascript';  
				script.src = 'http://maps.googleapis.com/maps/api/js?key=' + apiKey + '&sensor=true&callback=TN.myPage.showMap';  
				document.body.appendChild(script);
			}
			
			function showGlobalMap(){
				latLng =  new google.maps.LatLng(37.4419, -122.1419);
				canvasOptions = {    
						zoom: canvasZoomLevel,    
						center: latLng,    
						mapTypeId: google.maps.MapTypeId.ROADMAP};

				mapCanvas.empty();
				mapCanvasObject = new google.maps.Map(document.getElementById("mapCanvas"), canvasOptions);
				
				// Add a listener to close an open current detail box if we click outside it on the map
				// Currently disabled because it's not playing well with our drag map through infoWindowDetailed functionality
				/*google.maps.event.addListener(mapCanvasObject, 'click', function(){
					if(currentOpenDetailBox !== null){
						currentOpenDetailBox.close();
						currentOpenDetailBox = null;
					}
				});*/
				
				setMarkers();
			}

			$TN.showMap = function(){
				$.getScript('js/libs/infobox_packed.js').done(function(){
					showGlobalMap();
					
					$('#mapFilterBar').show();
					
					$('#mapShowHeadlines').click(function(){
						showHeadlines = $(this).is(':checked');
						
						for( var curLat in latLongArray ){
							for( var curLong in latLongArray[curLat] ){
								var curLatLong = latLongArray[curLat][curLong];
								if( showHeadlines ){
									curLatLong.headline.open(mapCanvasObject, curLatLong.globalMarker);
								}
								else {
									curLatLong.headline.close();
								}
							}
						}
					});
					
					mapDissolved = true;
				});
			};	
			
			loadScript();
		};
				
	}(mapsHandler));

	$TN.dissolveArtMap = function(){
		mapsHandler.show();
	};
}(TN.myPage));
