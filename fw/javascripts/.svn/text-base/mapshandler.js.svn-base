
(function($TN){
	
	var catType = 'BuyItOrNot';
	var mapDissolved = false;
	var mapsHandler = {};
	(function($mapsHandler){
		var apiKey = 'AIzaSyC3JpD-ZB_NgciJjjPDaz5u9G11vs37Czc';
		var mapCanvas = $('#map_canvas');
		var mapInset = $('#mapInset');
		var mapCanvasLeftOffset = mapCanvas.offset().left;
		var mapCanvasTopOffset = mapCanvas.offset().top;
		var mapCanvasObject = null;
		var canvasZoomLevel = 2;
		var insetZoomLevel = 12;
		var mapInsetObject = null;
		var latLongArray = {};
                var prevwindow = null;
                var showHeadlines = false;
                var all=document.getElementById("all");
                var fr=document.getElementById("friends");
                var foll=document.getElementById("following");
                var me=document.getElementById("me");
                var pop=document.getElementById("popular");
                var vid=document.getElementById("videos");
                             
                var currentfilter=all;
                $(currentfilter).css('background','#2284a1').css('color','white');     
//		var custId = 388;
		var custId=TN.utils.getCookie('TNUser');
		var currentOpenDetailBox = null;
		
		var loadingInProgress = false;
		var interruptSignal = false;
			
		var insetBorderLeftWidth = parseFloat(mapInset.css('border-left-width'));
		var insetBorderTopWidth = parseFloat(mapInset.css('border-top-width'));
						
		var latLng = null;
		var canvasOptions = null;
		var insetOptions = null;
                
		
		var markersArray = [];
		var markerCluster = null;
		var localCats = [];
		var globalCats = [];
		var catBarElem = $('#categoriesBar');
		
		var mapFilter = 'all';
		var boundchange = 0;
                var state=mapFilter;
                var prevId=-1;
                var count=0;
                var refreshslide = 0;
                var countcurr=-1;
                var current_slider=$("#slider");
                var sliderarray=[];
                
            function addMarker( lat, long, messageId, markerTitle, thumbImageUrl, content,update){
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
				</div>'
				detailedBox.style.cssText = 'width:506px; height:280px;';
				return detailedBox;
			}
			
			
			var latLong = new google.maps.LatLng(lat, long);
                        
			var markersObject = createMarker(latLong, markerTitle);
			
			var infoBoxOptions = {
				maxWidth:0,
				alignBottom:false,
				pixelOffset:new google.maps.Size(5, -50),
				boxStyle:{ background: "url('../images/icons/infobox_arrow.png') no-repeat left bottom"},
				content: getInfoBoxHtml(),
				disableAutoPan:true,
                                closeBoxURL:"none",
                                closeBoxMargin:"2px 10px 0px 2px",
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
			
                        
                        google.maps.event.addListener(mapCanvasObject,"bounds_changed",function() {
                            if (countcurr===-1){
                            boundchange=1;
                            mapsHandler.interruptOrReload();
                            }
                            else{
                            refreshslide = 1;           
                            }
                            
                        });
                       google.maps.event.addListener(mapCanvasObject,'mouseup',function (){
                            if(refreshslide===1){
                             refreshslide=-1;
                             SliderReload();
                        }
                       });
                       google.maps.event.addListener(mapCanvasObject,'zoom_changed',function (){
                           
                       if(refreshslide===1||refreshslide===-1){
                             refreshslide=0;
                             SliderReload();
                        }
                       });
               
			google.maps.event.addListener(infoWindowDetailed, 'closeclick', function(){
				currentOpenDetailBox = null;
			});
			
                      
			google.maps.event.addListener(markersObject.globalMarker, 'mouseover', function(){
				if( !showHeadlines && currentOpenDetailBox === null){
				
                                infoWindow.open(mapCanvasObject, markersObject.globalMarker);
                                        if (prevwindow !==null){
                                                prevwindow.close();
                                                prevwindow=null;
                                           }
				}
			});
			
			google.maps.event.addListener(markersObject.globalMarker, 'mouseout', function(){
				if(!showHeadlines ){
					infoWindow.close();
				}
				markersObject.globalMarker.setAnimation(null);
			});
			
			google.maps.event.addListener(markersObject.globalMarker, 'click', function(){
				if(currentOpenDetailBox !== infoWindowDetailed){
					if(currentOpenDetailBox !== null){
						currentOpenDetailBox.close(); //Close the currently open detail box
					}
					
					infoWindow.close(); //Close the info window
					infoWindowDetailed.open(mapCanvasObject,markersObject.globalMarker);
					
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
					
					currentOpenDetailBox = infoWindowDetailed;
				}
				else {
					//Detail window already open, check if it's "this" one. If it is then close it	
					if(currentOpenDetailBox === infoWindowDetailed){
						currentOpenDetailBox.close();
						currentOpenDetailBox = null;
					}
				}
			});
			
			latLongArray[lat] = {};
			latLongArray[lat][long] = {};
			latLongArray[lat][long].globalMarker = markersObject.globalMarker;
			if( !!markersObject.insetMarker ){
				latLongArray[lat][long].insetMarker = markersObject.insetMarker;
                 	}
			
		    latLongArray[lat][long].headline = infoWindow;
                  
                    if (prevwindow !==null){
                      prevwindow.close();
                    }
                   
                    var currwindow = latLongArray[lat][long];
                    currwindow.headline.open(mapCanvasObject, currwindow.globalMarker);
                    prevwindow=currwindow.headline;    
                    }
		
                
        function TooltipOpen(lat,long,markerTitle, thumbImageUrl){
            		
			function getInfoBoxHtml(){
				return( '<div class="infoBoxContent">\
                                                         <img class="thumbImage" src="' + thumbImageUrl + '"></img> \
							<div class="headlineContainer">\
							<div class="headline">' + markerTitle + '</div>\
							</div>\
						</div>' );
			}
		        var latLong = new google.maps.LatLng(lat, long);
                        
			var infoBoxOptions = {
				maxWidth:0,
				alignBottom:false,
				pixelOffset:new google.maps.Size(5, -50),
				boxStyle:{ background: "url('../images/icons/infobox_arrow.png') no-repeat left bottom"},
				content: getInfoBoxHtml(),
				disableAutoPan:true,
                                closeBoxURL:"none",
                                closeBoxMargin:"2px 10px 0px 2px",
			        position:latLong,
				enableEventPropagation:true
			};
			
                   var infoWindow = new InfoBox(infoBoxOptions);
	             
                   return infoWindow;
                   
            
        }        
        function SliderReload(){
                      
                       current_slider.remove();
                       $('#slideme').append('\<div id="slider" class="slider-horizontal"></div>');
                       current_slider=$('#slider');
                       prevId=-1;
       current_slider.FlowSlider();
	        for(var i=0;i<countcurr;i++){
                var MapItem=sliderarray[i];
                var latLong = new google.maps.LatLng(MapItem.latitude,MapItem.longitude);			
		if( mapCanvasObject.getBounds().contains(latLong)){
				                
                        
                    var SliderItem= '\<div class="item"><div class="itemcontainer" id='+i+'><img src="'+MapItem.senderThumbImageUrl+'" />\
                                      <div class="text">'+(!!MapItem.headline ? MapItem.headline : 'Test Headline') +'</div>\
                                      </div></div>';
                                      current_slider.FlowSlider().content().append(SliderItem);
                                      current_slider.FlowSlider().setupDOM();
                  $('#'+i+'').hover( function() {
                                      var ID = $(this).attr("id");
                                      if (prevId!==ID){
                                         var selecteditem=sliderarray[ID];
                                                if (prevwindow !==null){
                                                    prevwindow.close();
                                                  }
                                          var currtip=TooltipOpen(selecteditem.latitude,selecteditem.longitude,(!!selecteditem.headline ? selecteditem.headline : 'Test Headline'),
                                          selecteditem.senderThumbImageUrl);
                                          //alert(latLongArray[selecteditem.latitude][selecteditem.longitude].toSource);
                                          // if(latLongArray[selecteditem.latitude][selecteditem.longitude]!=={}){
                                          var currwindow = latLongArray[selecteditem.latitude][selecteditem.longitude];
                                          currtip.open(mapCanvasObject, currwindow.globalMarker);
                                          prevwindow=currtip; 
                                                                                                              
                                 }
                                prevId=ID;
                                });  
                    
                  }
                }
                }
                
		function createMarker( latLng, markerTitle ){
			var markersObject = {};
  			var markerImage = new google.maps.MarkerImage('images/mappin.png',
                                          new google.maps.Size(29,29),
                                          new google.maps.Point(0,0),
                                          new google.maps.Point(15,29));
                                        
                        var shadow = new google.maps.MarkerImage('images/mappinshadow.png',
                                     new google.maps.Size(47,29),
                                     new google.maps.Point(0,0),
                                     new google.maps.Point(15,29));   
                        var shape = {
                                coord: [28,0,28,1,28,2,28,3,28,4,28,5,28,6,28,7,28,8,28,9,28,10,28,11,28,12,28,13,28,14,28,15,28,16,28,17,28,18,28,19,28,20,28,21,28,22,28,23,28,24,28,25,28,26,28,27,28,28,0,28,0,27,0,26,0,25,0,24,0,23,0,22,0,21,0,20,0,19,0,18,0,17,0,16,0,15,0,14,0,13,0,12,0,11,0,10,0,9,0,8,0,7,0,6,0,5,0,4,0,3,0,2,0,1,0,0,28,0],
                                type: 'poly'
                                };             
			// Create inset map marker if inset map exists
			if( !!mapInsetObject ){
				markersObject.insetMarker = new google.maps.Marker({     
					  position: latLng,   
					  title: markerTitle,
					//  animation: google.maps.Animation.DROP,
					  icon: markerImage,
                                          shadow: shadow,
                                          shape: shape,
					  map: mapInsetObject  });
		                 //markerCluster.addMarkers(markersObject.insetMarker);		
				 //markersArray.push(markersObject.insetMarker);
			}
			
			markersObject.globalMarker = new google.maps.Marker({     
				position: latLng,   
				//animation: google.maps.Animation.DROP,
				icon: markerImage,
                                shadow: shadow,
                                shape: shape,
				map: mapCanvasObject  });
			
			markersArray.push(markersObject.globalMarker);

                             
			  // create and return global map marker so additional processing can be done for it.
			return( markersObject );
		}
		
		function getRequestSummaries(custId, numItems, pageNum, type){
	                if(state!==mapFilter||boundchange === 1){
                         current_slider.remove();
                         $('#slideme').append('\<div id="slider" class="slider-horizontal"></div>');
                         current_slider=$('#slider');
                         boundchange=0;
                        }
                    countcurr=-1;
                    state=mapFilter;
                    current_slider.FlowSlider();
	
                   
                    if( mapFilter === 'all' ){
                       
                        return(TN.services.getAllRequestSummaries(custId, numItems, pageNum, type));
			}
			
			if( mapFilter ==='me' ){
                        return(TN.services.getMyRequestSummaries(custId, numItems, pageNum, type));
			}
			
			if( mapFilter ==='friends' ){
                        return(TN.services.getFriendsRequestSummaries(custId, numItems, pageNum, type));
			}
						
			if( mapFilter ==='following' ){
                        return(TN.services.getFollowingRequestSummaries(custId, numItems, pageNum, type));
			}
                       
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
                        boundchange=1;
                        mapsHandler.interruptOrReload();	
                	google.maps.event.addListenerOnce(mapInsetObject, 'click', moveGlobalToMain);
			
			populateCatBar(localCats);
		}
		
		function moveGlobalToMain(){
			mapCanvasObject.setZoom(canvasZoomLevel);
			mapCanvasObject.setCenter(latLng);
			
			mapInsetObject.setZoom(insetZoomLevel);
			boundchange=1;
                        mapsHandler.interruptOrReload();			
			
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
			markerCluster.clearMarkers();
			setMarkers();
		}
            
 function crop(crop_id, x, y, width, height) {
                       
                        var scale_x = (crop_id).attr('width') / width;
                        var scale_y = (crop_id).attr('height') / height;

                         (crop_id).css({
                            position: 'relative',
                            overflow: 'hidden' 
                          });

                        (crop_id).css({
                                     position: 'absolute',
                                     display: 'block',
                                     left: (-x * scale_x) + 'px',
                                     top: (-y * scale_y) + 'px',
                                     width: (crop_id.attr('width') * scale_x) + 'px',
                                     height: (crop_id.attr('height') * scale_y) + 'px'
                       });
}
		
		function setMarkers(){
			var pageNum = 1;
			var maxPages = 1;
			
			loadingInProgress = true;
			function loadMarkers( json ){
				if( !interruptSignal ){
					if( json && json[0] ){
						maxPages = parseFloat( json[0].noOfPages );
						if( json[0].fittingRoomSummaryList ){
							var numItems = json[0].fittingRoomSummaryList.length;
							 var currItem=null;
                                                          for( var i = 0; i<numItems; i++ ){
								currItem = json[0].fittingRoomSummaryList[i];
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
						                  var latLong = new google.maps.LatLng(currItem.latitude,currItem.longitude);			
							         if( mapCanvasObject.getBounds().contains(latLong)){
				                                      
                                                                      addMarker(currItem.latitude,currItem.longitude, currItem.messageId, 
											(!!currItem.headline ? currItem.headline : 'Test Headline'),
											currItem.senderThumbImageUrl, markerContent,0);								
					                              //add here
                                                                      var SliderItem= '\<div class="item"><div class="itemcontainer" id='+count+'><img src="'+currItem.senderThumbImageUrl+'" />\
                                                                                        <div class="text">'+(!!currItem.headline ? currItem.headline : 'Test Headline') +'</div>\
                                                                                        </div></div>';
                                                                      current_slider.FlowSlider().content().append(SliderItem);
                                                                      current_slider.FlowSlider().setupDOM();
                                                                      sliderarray[count]=currItem;                    
                                                
                                                                       $('#'+count+'').hover( function() {
                                                                          
                                                                          var ID = $(this).attr("id");
                                                                          if (prevId!==ID){
                                                                          var selecteditem=sliderarray[ID];
                                                                           if (prevwindow !==null){
                                                                                prevwindow.close();
                                                                             }
                                                                         var currtip=TooltipOpen(selecteditem.latitude,selecteditem.longitude,(!!selecteditem.headline ? selecteditem.headline : 'Test Headline'),
                                                                                                 selecteditem.senderThumbImageUrl);
                                                                         //alert(latLongArray[selecteditem.latitude][selecteditem.longitude].toSource);
                                                                         // if(latLongArray[selecteditem.latitude][selecteditem.longitude]!=={}){
                                                                         var currwindow = latLongArray[selecteditem.latitude][selecteditem.longitude];
                                                                         currtip.open(mapCanvasObject, currwindow.globalMarker);
                                                                         prevwindow=currtip; 
                                                                          
                                                                          //}                                 
                                                                        }
                                                                       prevId=ID;
                                                                       });
                                                                   
                                                                   //crop($('#'+count+''), 0, 0, 223, 150);
                                                                      
                                                                   /*   $('#'+count+'').hover( function() {
                                                                          Todo   
                                                                         });
                                                                     */count=count+1;
                                                        
                                                                     }
                                                                       }
							        
                                                               			    

                                                          }
                                                                 
                                        
                                                          if( pageNum < maxPages ){
							
                                                               pageNum++;
								getRequestSummaries(custId, 25, pageNum, catType).
									done(loadMarkers).
									error(function(){
                                                      //                         alert('huga');
										loadingInProgress = false;
										if( interruptSignal ){
											resetAndReload();
										}
									});
                                                      //  markerCluster.addMarkers(markersArray);
                                                                        //    alert('mugga');
							}
							else {  countcurr=count;
                                                            
                                                                count=0;
                                                               
                                                                markerCluster.addMarkers(markersArray);
                                                                 // markerCluster = new MarkerClusterer(mapCanvasObject,[], markersArray);				       
								loadingInProgress = false;
							}
						       
                                	                   
                                                   }
					}				
				}
				else {  count=0;
					loadingInProgress = false;
					resetAndReload();
				}
			
                               
                     }
						
			getRequestSummaries(custId, 25, pageNum, catType).
				done(loadMarkers).error(function(){
					loadingInProgress = false;
					if( interruptSignal ){
						resetAndReload();
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
		
		$mapsHandler.interruptOrReload = function(){
			if( loadingInProgress ){
				interruptSignal = true;
			}
			else {
				resetAndReload();
			}
		};
		
		$mapsHandler.show = function(){
			function loadScript() {  
				var script = document.createElement('script');  
				script.type = 'text/javascript';  
				script.src = 'http://maps.googleapis.com/maps/api/js?key=' + apiKey + '&sensor=true&callback=TN.showMap';  
				document.body.appendChild(script);
			}
			
			function noGeoLocationSupport(){
				alert("Unable to determine your current location.  Your browser does not support geolocation.");
			}
			
			function noPositionError(){
				alert("Your browser is unable to determine your current location.");
			}
			
			function showGlobalMap(){
				latLng =  new google.maps.LatLng(37.441, 0);
				canvasOptions = {    
						zoom: canvasZoomLevel,    
						center: latLng,    
						mapTypeId: google.maps.MapTypeId.HYBRID};

				mapCanvas.empty();
				mapCanvasObject = new google.maps.Map(document.getElementById("map_canvas"), canvasOptions);
     /*                            var styles=[{
      url: 'images/mappin.png',
        height: 35,
        width: 35,
        opt_anchor: [16, 0],
        opt_textColor: '#FF00FF'
      },
      {
        url: 'images/mappin.png',
        height: 45,
        width: 45,
        opt_anchor: [24, 0],
        opt_textColor: '#FF0000'
      },
      {
        url: 'images/mappin.png',
        height: 55,
        width: 55,
        opt_anchor: [32, 0]
      }];*/
                                         
                               var mcOptions = {gridSize: 5, maxZoom: 60};
                               markerCluster = new MarkerClusterer(mapCanvasObject,mcOptions);				       
				$("#map_canvas").show();
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
			
			function showInsetMap(position) {  
				if( !!position && !!position.coords && !!position.coords.latitude && !!position.coords.longitude ){
					delete latLng;
					
					latLng =  new google.maps.LatLng(position.coords.latitude, 
							position.coords.longitude);
					
					insetOptions = {
							zoom:insetZoomLevel,
							center:latLng,
							mapTypeControl:false,
							panControl:false,
							rotateControl:false,
							scrollwheel:false,
							streetViewControl:false,
							zoomControl:false,
							draggable:false,
							tilt:45,
							mapTypeId:google.maps.MapTypeId.ROADMAP};

					var insetLeftOffset = mapCanvas.offset().left + mapCanvas.width()-mapInset.width()-insetBorderLeftWidth;
					//var insetTopOffset = mapCanvas.offset().top + mapCanvas.height()-mapInset.height()-insetBorderTopWidth;
					var insetTopOffset = -mapInset.height()-insetBorderTopWidth;
					
                                        $('#mapFilterBar').css('position', 'relative').css('top',-183).css('float','right').show();
                                        
                                        mapInset.css('top', insetTopOffset-25).css('position', 'relative').css('float','right').show();
				        $('#slideme').css('position','relative').css('top',-200).show();
                                        $('#foot').css('position','relative').css('top',-60).css('padding',0).show();
  
				       // $('#slideme').css('position', 'relative').css('top', -171).show();
                                //	$('#features').css('position', 'relative').css('top', insetTopOffset).css('margin-bottom', insetTopOffset).show();
					
					mapInset.empty();
					mapInsetObject = new google.maps.Map(document.getElementById("mapInset"), insetOptions);
								
//					google.maps.event.addListenerOnce(mapInsetObject, 'click', moveLocalToMain);
					
					// reset center of global map the new latlang
					mapCanvasObject.setCenter(latLng);
					
					moveLocalToMain();
					
					// update inset map with markers added so far in the global map
					for( var curLat in latLongArray ){
						for( var curLong in latLongArray[curLat] ){
							latLongArray[curLat][curLong].insetMarker = new google.maps.Marker({     
								  position: latLongArray[curLat][curLong].marker.getPosition(),   
								  title: latLongArray[curLat][curLong].headline.getContent(),
								//  animation: google.maps.Animation.DROP,
								  map: mapInsetObject  });
							
							markersArray.push(latLongArray[curLat][curLong].insetMarker);
						}
					}
				}
			}
			
			$TN.showMap = function(){
				$.getScript('js/libs/infobox_packed.js').done(function(){
					showGlobalMap();
					populateCatBar(globalCats);
					
					if( !!navigator.geolocation ){
						navigator.geolocation.getCurrentPosition(showInsetMap, noPositionError);
					}
					else {
						noGeoLocationSupport();
					}
					var insetTopOffset = -mapInset.height()-insetBorderTopWidth;
					$('#mapFilterBar').css('position', 'relative').css('top',-40).show();
                                        //$('#slideme').css('position','relative').css('top',-60).show();
  
					$('#mapShowHeadlines').click(function(){
						showHeadlines = $(this).is(':checked');
						
                                                var curLatLong=null;
						for( var curLat in latLongArray ){
							for( var curLong in latLongArray[curLat] ){
								curLatLong = latLongArray[curLat][curLong];
								if( showHeadlines ){
									curLatLong.headline.open(mapCanvasObject, curLatLong.globalMarker);
								}
								else {
									curLatLong.headline.close();
								        
                                                                   }
                                                            
                                                               
							}
						}

					});
				
                                        
                               $(all).click(function(){
                                             if(prevwindow!==null){
                                                            prevwindow.close();
                                                        }
                                                        $(currentfilter).css('background','transparent').css('color','black');
                                                        currentfilter=all;
                                                        $(currentfilter).css('background','#2284a1').css('color','white');
                                                        mapFilter = 'all';
							mapsHandler.interruptOrReload();
                                        });
                                    
                               $(fr).click(function(){
                                             if(prevwindow!==null){
                                                            prevwindow.close();
                                                        }	
                                                        $(currentfilter).css('background','transparent').css('color','black');
                                                        currentfilter=fr;
                                                        $(currentfilter).css('background','#2284a1').css('color','white');                                                        
                                                        mapFilter = 'friends';
							mapsHandler.interruptOrReload();
                                        });
				
                               $(foll).click(function(){
                                             if(prevwindow!==null){
                                                            prevwindow.close();
                                                        }	
                                                        $(currentfilter).css('background','transparent').css('color','black');
                                                        currentfilter=foll;
                                                        $(currentfilter).css('background','#2284a1').css('color','white');                                                        
                                                        mapFilter = 'following';
							mapsHandler.interruptOrReload();
                                        });
				$(me).click(function(){
                                             if(prevwindow!==null){
                                                            prevwindow.close();
                                                        }	
                                                        
                                                        $(currentfilter).css('background','transparent').css('color','black');
                                                                                                               
                                                        currentfilter=me;
                                                        $(currentfilter).css('background','#2284a1').css('color','white');                                                        
                                                        mapFilter = 'me';
							mapsHandler.interruptOrReload();
                                        });
				
				$(pop).click(function(){
                                             if(prevwindow!==null){
                                                            prevwindow.close();
                                                        }	
                                                        $(currentfilter).css('background','transparent').css('color','black');
                                                        currentfilter=pop;
                                                        $(currentfilter).css('background','#2284a1').css('color','white');                                                        
                                                    //    mapFilter = 'popular';
						//	mapsHandler.interruptOrReload();
                                        });                               

				$(vid).click(function(){
                                             if(prevwindow!==null){
                                                            prevwindow.close();
                                                        }	
                                                        $(currentfilter).css('background','transparent').css('color','black');
                                                        currentfilter=vid;
                                                        $(currentfilter).css('background','#2284a1').css('color','white');
                                                        
                                                  //      mapFilter = 'video';
						//	mapsHandler.interruptOrReload();
                                        });                                
                           
					
					mapDissolved = true;
				});
			};	
			
			loadCategories().done(loadScript);
		};
				
	}(mapsHandler));

	$TN.dissolveArtMap = function(){
		mapsHandler.show();
	};
	
	$TN.loadCategoryOnMap = function(categoryType){
		catType = escape(categoryType);
		if( !mapDissolved ){
			$TN.dissolveArtMap();
		}
		else {
			mapsHandler.interruptOrReload();
		}
	};
	
}(TN));
