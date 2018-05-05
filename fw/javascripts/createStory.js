if (!TN) var TN= {};
if (!TN.createStory) TN.createStory= {};

(function($createStory){
	var publishInProgress = false;
	var resetAddress = false
	
	$createStory.close = function(){
		
		if( !!resetAddress ){
			location.href = TN.utils.getBaseUrl(location.href);
		}
		
		publishInProgress = false;
		$('#createStory').remove();
		$('#createStoryCanvas').remove();
	};
	
	function showCreateStory(imageUrl, storyUrl, resetAddressBar, userLoggedIn){
		resetAddress = resetAddressBar;
		var createImageUrl = '';
		var bodyElem = $('body');
		var createStoryCanvasElem = $('<div id="createStoryCanvas"></div>');
		var createStoryHtml = '<div id="createStory"> \
				<div class="csCloseButton"></div>';
		 
		// If cookie exists then user already logged in
		if( TN.utils.getCookie('TNUser') && userLoggedIn ) {
			createStoryHtml += '\
				<div id="csTitle">Create Story</div>';
		}
		// Else show Login section
		else {
			// Show login dialog
			createStoryHtml += '<div id="csTitle" class="displayNone">Create Story</div> \
				<div id="loginCanvas"></div>\
				<div id="loginCont">\
					<div class="csCloseButton"></div>\
					<div id="loginTitle">Log in to continue</div>\
					<div id="inputCont">\
						<label for="userName">Username </label><input id="userName" type="text" required="required"/>\
						<br/>\
						<label for="password">Password </label><input id="password" type="password" required="required"/>\
						<br/>\
						<div id="loginButton"></div>\
						<div id="cancelLink">Cancel</div>\
					</div>\
				</div>';
		}
		
		// if create story mode
		if( !imageUrl ){
			createStoryHtml += '<div id="csBrowseFileCont"> \
					<div id="csBrowseText">choose a photo</div>\
					<div id="csBrowseButton">Browse...</div>\
					<form id="csChoosePhotoForm" method="post" enctype="multipart/form-data"> \
						<input id="csChoosePhotoInput" name="file" type="file" accept="image/*"/> \
					</form> \
				</div>';
		}
		else {
			createImageUrl = imageUrl;
		}
		
		createStoryHtml += '<div id="csBaseOptions"> \
					<input id="csHeadlineInput" type="text" placeholder="Enter Headline Here..." name="StoryHeadline"/> \
					<span style="float: right; position: relative; right: 10px; top: -20px; color: grey; display:none" id="csStoryHeadlineCounter">50</span>\
					<div class="csDivider"></div> \
					<div id="csImageCont"> \
						<img id="csImage" src="'+ createImageUrl + '"/>';
		
		if( !imageUrl ){
			createStoryHtml += '<div id="csEditPhoto">edit photo</div> \
						<form id="csEditPhotoForm" method="post" enctype="multipart/form-data">\
							<input id="csEditPhotoInput" name="file" type="file" accept="image/*"/> \
						</form>';
		}	
		
		createStoryHtml += '<img id="csImageAccent" src="images/CreateStory/photo-accent.png"/>\
					</div> \
					<div id="csBaseDetailsCont"> \
						<div id="csCatSelectionCont"> \
							<div id="csCatSelectionBox"></div>\
							<img id="csComboBoxArrow" src="images/CreateStory/combobox-arrow.png"/>\
							<ul id="csCatDropdown"> \
							</ul> \
						</div> \
						<div id="csPublishButton"></div>\
						<ul id="csSocialMediaCont">\
							<li id="csFacebookBox" class="csCheckBoxUnSelected"></li>\
							<li>facebook</li> \
							<li id="csTwitterBox" class="csCheckBoxUnSelected"></li>\
							<li>twitter</li> \
						</ul>\
						<div id="csTellYourStory">Tell Your Story (optional)</div> \
						<div id="csTellYourStoryDetails"> \
							<ul id="csTellYourStoryTabCont">\
								<li id="writeStoryTab" class="tabSelected">Write Story</li>\
								<li id="writeOpEdTab">Write OP ED</li>\
							</ul>\
							<form id="csPublishForm" method="post" enctype="multipart/form-data"> \
								<input id="csUrlHiddenInput" name="url" type="hidden"/> \
								<input id="csWebUrlHiddenInput" name="storyUrl" type="hidden"/> \
								<input id="csHeadlineHiddenInput" name="headline" type="hidden"/> \
								<input id="csTypeHiddenInput" name="type" type="hidden"/> \
								<input id="csCustIdHiddenInput" name="custid" type="hidden"/> \
								<div id="writeStoryInputs">\
									<textarea id="csWhoInput" name="Who" type="text" placeholder="Who?"/>\
									<span id="csWhoCounter" style="float: right; position: relative; right: 25px; top:-16px; color: grey; "></span><br>\
									<textarea id="csWhatInput" name="What" type="text" placeholder="What?"/>\
									<span id="csWhatCounter" style="float: right; position: relative; right: 25px; top:-14px; color: grey; display:none"></span><br>\
									<textarea id="csWhenInput" name="When" type="text" placeholder="When?"/>\
									<span id="csWhenCounter" style="float: right; position: relative; right: 25px; top:-14px; color: grey; display:none"></span><br>\
									<span style="display:relative" class="csWhereWrapper">\
										<textarea id="csWhereInput" name="Where" type="text" placeholder="Where?" style="width:185px;"/>\
										<span id="csWherePinIcon"></span>\
									</span>\
									<br><span style="float: right; position: relative; right: 63px; top:-14px; color: grey; display:none" id="csWhereCounter"></span><br>\
									<!--ul id="csWhereEnableCont">\
										<li id="csWhereEnableBox" class="csCheckBoxUnSelected"></li>\
										<li title="Click to show and choose locations based on your input">Enable location detection</li>\
									</ul-->\
									<textarea id="csAddressInput" name="address" type="text" placeholder="Address"/>\
									<textarea id="csCityInput" name="city" type="text" placeholder="City"/>\
									<span display="relative" class="stateZipcodeWrapper">\
										<textarea placeholder="State/Country" type="text" name="stateCountry" id="csStateCountryInput" \
											style="width: 120px"></textarea>\
										<textarea placeholder="Zipcode" type="text" name="zipcode" id="csZipcodeInput" \
											style="width: 80px; position:absolute; right: 12px"></textarea>\
									</span>\
									<span id="csOfferedGeopositions"></span>\
									<textarea id="csWhyInput" name="Why" type="text" placeholder="Why?"/>\
									<span id="csWhyCounter" style="float: right; position: relative; right: 25px; top:-15px; color: grey; display:none"></span><br>\
									<textarea id="csHowInput" name="How" type="text" placeholder="How?"/>\
									<span id="csHowCounter" style="float: right; position: relative; right: 25px; top:-14px; color: grey; display:none"></span><br>\
								</div>\
								<div id="writeOpEdInput"> \
									<span style="display:relative" class="csWhereWrapper">\
										<textarea id="csOpEdWhereInput" name="OpEdWhere" type="text" placeholder="Where?" style="width:185px;"/>\
										<span id="csOpEdWherePinIcon"></span>\
									</span>\
									<br><span id="csOpEdWhereCounter" style="float: right; position: relative; right: 63px; top:-15px; color: grey; display:none"></span><br>\
									<textarea id="csOpEdAddressInput" name="address" type="text" placeholder="Address"/>\
									<textarea id="csOpEdCityInput" name="city" type="text" placeholder="City"/>\
									<span display="relative" class="opEdstateZipcodeWrapper">\
										<textarea placeholder="State/Country" type="text" name="stateCountry" id="csOpEdStateCountryInput" \
											style="width: 120px"></textarea>\
										<textarea placeholder="Zipcode" type="text" name="zipcode" id="csOpEdZipcodeInput" \
											style="width: 80px; position:absolute; right: 12px"></textarea>\
									</span>\
									<span id="csOpEdOfferedGeopositions"></span>\
									<textarea id="csOpEdInput" name="OpEd" type="text" placeholder="Write Op-Ed instead"/> \
									<span id="csOpEdCounter" style="float: right; position: relative; right: 25px; top:-14px; color: grey; display:none"></span><br>\
								</div>\
							</form> \
						</div> \
					</div> \
				</div> \
			</div>';
		
		var createStoryElem = $(createStoryHtml);

		bodyElem.append(createStoryCanvasElem);
		bodyElem.append(createStoryElem);

		$('#writeStoryInputs textarea, #csOpEdWhereInput, #csOpEdAddressInput, #csOpEdCityInput, #csOpEdStateCountryInput, #csOpEdZipcodeInput').css('height', '26px');
		$('#csAddressInput, #csCityInput, #csOpEdAddressInput, #csOpEdCityInput, .stateZipcodeWrapper, .opEdstateZipcodeWrapper').hide();
		$('#createStory #csBaseDetailsCont #csTellYourStoryDetails textarea').css('margin-bottom', '0px');

		// Code to manage character counters:
		var alerted = false;

		$('#writeStoryInputs textarea, #csOpEdWhereInput, #csOpEdAddressInput, #csOpEdCityInput, #csOpEdStateCountryInput, #csOpEdZipcodeInput, #csOpEdInput, #csHeadlineInput').keyup(function(event){
			var keyupFieldName = event.target.name;
			var counterElem, counterElemValue;

			if ( (keyupFieldName == 'OpEdWhere') || (keyupFieldName == 'Where') || (keyupFieldName == 'address') 
				|| (keyupFieldName == 'stateCountry') || (keyupFieldName == 'city') || (keyupFieldName == 'zipcode') ) {
				
				recreateWhereString();
				(opEdTabSelected) ? counterElem = $('#csOpEdWhereCounter') : counterElem = $('#csWhereCounter');
				counterElemValue = parseFloat(counterElem.text());
				counterElem.text(100 - whereFinalString.length);
				if (whereFinalString.length > 100) {
					if (!alerted) {
						alert("The total number of charaters in location related fields is 100.");
						alerted = true;
					}
					counterElem.css('color', 'red');
				}
				else counterElem.css('color', 'grey');			
			}

			else if (keyupFieldName == 'OpEd') {
				counterElem = $('#csPublishForm').find('#cs' + keyupFieldName + 'Counter');
				counterElemValue = parseFloat(counterElem.text());
				counterElem.text(500 - event.target.value.length);
				if (event.target.value.length > 500) {
					if (!alerted) {
						alert("The maximum number of charaters for this field is 500.");
						alerted = true;
					}
					counterElem.css('color', 'red');
				}
				else counterElem.css('color', 'grey');
			}

			else if (keyupFieldName == 'StoryHeadline') {
				counterElem = $('#csStoryHeadlineCounter');
				counterElemValue = parseFloat(counterElem.text());
				counterElem.text(50 - event.target.value.length);
				if (event.target.value.length > 50) {
					if (!alerted) {
						alert("The maximum number of charaters for this field is 50.");
						alerted = true;
					}
					counterElem.css('color', 'red');
				}
				else counterElem.css('color', 'grey');
			}

			else {
				counterElem = $('#csPublishForm').find('#cs' + keyupFieldName + 'Counter');
				counterElemValue = parseFloat(counterElem.text());
				counterElem.text(100 - event.target.value.length);
				if (event.target.value.length > 100) {
					if (!alerted) {
						alert("The maximum number of charaters for this field is 100.");
						alerted = true;
					}
					counterElem.css('color', 'red');
				}
				else counterElem.css('color', 'grey');
			}

			//$('#cs' + keyupFieldName + 'Counter').text(previousValue)
			//console.log('event.target.length: ' + event.target.value.length + ' counterElemValue: ' + counterElemValue + ' keyupFieldName: ' + keyupFieldName);
			counterElem.show();
		});

		$('#csWherePinIcon, #csOpEdWherePinIcon').click(function(){
			toggleExpandedWhere();
		});

		// for Clip story show the base details
		if( !!imageUrl ){
			$('#csBaseOptions').show();
		}
		
		$('input[placeholder]').placeholder();
		$('#csCatSelectionCont').click(function(){
			$('#csCatDropdown').toggle();
		});
				
		$('#csTellYourStory').click(function(){
			$('#csTellYourStoryDetails').show().find('textarea').autosize();
		});
		
		$('#csFacebookBox,#csTwitterBox').click(function(){
			var jqElem = $(this);
			
			if( jqElem.hasClass('csCheckBoxUnSelected') ){
				jqElem.removeClass('csCheckBoxUnSelected').addClass('csCheckBoxSelected');
			} else {
				jqElem.removeClass('csCheckBoxSelected').addClass('csCheckBoxUnSelected');
			}
		});
		
		$('#csFacebookBox+li,#csTwitterBox+li').click(function(){
			$(this).prev().click();
		});

        /*$('#csWhereInput, #csOpEdWhereInput').keyup(function(event){
            whereKeyups++;
            var keyupsClose = whereKeyups;
            setTimeout(function(){
                enqueueLatLongLookup(event.target.value, keyupsClose);
            }, 1500);
        });*/

        // Functions to copy expanded Where fields to the other tab if any empty equivalents 
        // are found in other tab and refresh Where counter after the copy
        $('#writeOpEdTab').click(function(){
        	opEdTabSelected = true;
        	if (TN.utils.isBlank($('#csOpEdWhereInput').val()) && !TN.utils.isBlank($('#csWhereInput').val())) 
        		$('#csOpEdWhereInput').val($('#csWhereInput').val());
        	if (TN.utils.isBlank($('#csOpEdAddressInput').val()) && !TN.utils.isBlank($('#csAddressInput').val())) 
        		$('#csOpEdAddressInput').val($('#csAddressInput').val());
        	if (TN.utils.isBlank($('#csOpEdCityInput').val()) && !TN.utils.isBlank($('#csCityInput').val())) 
        		$('#csOpEdCityInput').val($('#csCityInput').val());
        	if (TN.utils.isBlank($('#csOpEdStateCountryInput').val()) && !TN.utils.isBlank($('#csStateCountryInput').val())) 
        		$('#csOpEdStateCountryInput').val($('#csStateCountryInput').val());
        	if (TN.utils.isBlank($('#csOpEdZipcodeInput').val()) && !TN.utils.isBlank($('#csZipcodeInput').val())) 
        		$('#csOpEdZipcodeInput').val($('#csZipcodeInput').val());
        	
        	// Refresh respective where counter:
        	recreateWhereString();
			var counterElem = $('#csOpEdWhereCounter');
			var counterElemValue = parseFloat(counterElem.text());
			counterElem.text(100 - whereFinalString.length);
			if (whereFinalString.length > 100) {
				if (!alerted) {
					alert("The total number of charaters in location related fields is 100.");
					alerted = true;
				}
				counterElem.css('color', 'red');
			}
			else counterElem.css('color', 'grey');
			if (whereFinalString.length > 0) counterElem.show();
        });

        $('#writeStoryTab').click(function(){
        	opEdTabSelected = false;
        	if (TN.utils.isBlank($('#csWhereInput').val()) && !TN.utils.isBlank($('#csOpEdWhereInput').val())) 
        		$('#csWhereInput').val($('#csOpEdWhereInput').val());
        	if (TN.utils.isBlank($('#csAddressInput').val()) && !TN.utils.isBlank($('#csOpEdAddressInput').val())) 
        		$('#csAddressInput').val($('#csOpEdAddressInput').val());
        	if (TN.utils.isBlank($('#csCityInput').val()) && !TN.utils.isBlank($('#csOpEdCityInput').val())) 
        		$('#csCityInput').val($('#csOpEdCityInput').val());
        	if (TN.utils.isBlank($('#csStateCountryInput').val()) && !TN.utils.isBlank($('#csOpEdStateCountryInput').val())) 
        		$('#csStateCountryInput').val($('#csOpEdStateCountryInput').val());
        	if (TN.utils.isBlank($('#csZipcodeInput').val()) && !TN.utils.isBlank($('#csOpEdZipcodeInput').val())) 
        		$('#csZipcodeInput').val($('#csOpEdZipcodeInput').val());
        	
        	// Refresh respective where counter:
        	recreateWhereString();
			var counterElem = $('#csWhereCounter');
			var counterElemValue = parseFloat(counterElem.text());
			counterElem.text(100 - whereFinalString.length);
			if (whereFinalString.length > 100) {
				if (!alerted) {
					alert("The total number of charaters in location related fields is 100.");
					alerted = true;
				}
				counterElem.css('color', 'red');
			}
			else counterElem.css('color', 'grey');
			if (whereFinalString.length > 0) counterElem.show();
        });
        	
        var foundLocations = {}, currentLocations = {}; 
        var opEdTabSelected = false;
        var whereExpanded = false;
        var whereOpEdExpanded = false;
        var selectedLatitude = "";
        var selectedLongitude = "";
        var whereKeyups = 0;
        var whereFinalString = "";
        var tempWhereArr = [];
		var warnedBeforePublish = false;

        $createStory.flshow = function(){
        	log(foundLocations);
        };

        $createStory.clshow = function(){
        	log(currentLocations);
        };

		function recreateWhereString() {
			tempWhereArr = [];
			if (opEdTabSelected) $.each([$('#csOpEdWhereInput').val(), $('#csOpEdStateCountryInput').val(), $('#csOpEdCityInput').val(), $('#csOpEdAddressInput').val()], function(i, val) {
					if (!TN.utils.isBlank(val)) tempWhereArr.push(val);
				});
			else $.each([$('#csWhereInput').val(), $('#csStateCountryInput').val(), $('#csCityInput').val(), $('#csAddressInput').val()], function(i, val) {
				if (!TN.utils.isBlank(val)) tempWhereArr.push(val);
			});
			whereFinalString = tempWhereArr.join(', ');
			if (opEdTabSelected && (!TN.utils.isBlank($('#csOpEdZipcodeInput').val()))) whereFinalString += ' ' + $('#csOpEdZipcodeInput').val();
			if (!opEdTabSelected && (!TN.utils.isBlank($('#csZipcodeInput').val()))) whereFinalString += ' ' + $('#csZipcodeInput').val();
		}

		function toggleExpandedWhere() {
			//log('start, whereOpEdExpanded: '+whereOpEdExpanded+' whereExpanded: '+whereExpanded);
			if (opEdTabSelected) {
				if (whereOpEdExpanded) {
					$('#csOpEdAddressInput, #csOpEdCityInput, .opEdstateZipcodeWrapper').hide('fast');
					$('#csOfferedGeopositions, #csOpEdOfferedGeopositions').show();
					whereOpEdExpanded = false;
				}
				else {
					$('#csOpEdAddressInput, #csOpEdCityInput, .opEdstateZipcodeWrapper').show('fast');
					$('#csOpEdOfferedGeopositions').hide();
					whereOpEdExpanded = true;
				}
			}
			else {
				if (whereExpanded) {
					$('#csAddressInput, #csCityInput, .stateZipcodeWrapper').hide('fast');
					$('#csOfferedGeopositions, #csOpEdOfferedGeopositions').show();
					whereExpanded = false;
				}
				else {
					$('#csAddressInput, #csCityInput, .stateZipcodeWrapper').show('fast');
					$('#csOfferedGeopositions').hide();
					whereExpanded = true;
				}
			}
		}

        function loadAndAppendGeoOffer(index){
        	var lat = foundLocations[index]["latitude"];
        	var lon = foundLocations[index]["longitude"];
        	var geoUriHtml = '<a\
	        	class="autoGeoposition"\
	        	title="Click to use this auto-detected location"\
	    		onclick="if ( $(this).hasClass(\'selectedGeoPosition\') ){\
	    			selectedLatitude=\'\';\
	    			selectedLongitude=\'\';\
	    			$(this).removeClass(\'selectedGeoPosition\');\
	    		}\
	    		else {\
	    			selectedLatitude=\''+lat+'\';\
	        		selectedLongitude=\''+lon+'\';\
	        		$(\'.autoGeoposition\').removeClass(\'selectedGeoPosition\');\
	        		$(this).addClass(\'selectedGeoPosition\');\
	        	}"\
	        	href="javascript:void(0);"\
	        	name="'+index+'">\
	        	'+index+'\
	        	</a>';
	        $(geoUriHtml).appendTo('#csOfferedGeopositions, #csOpEdOfferedGeopositions');
        }

        function geoUriInCurrentLocations(lat, lon){
        	// Check if given lat lon exists in currentLocations object, return bool
        	$.each(currentLocations, function(i, val){
        		//log( (val.latitude == lat) && (val.longitude == lon) );
        		if ( (val.latitude == lat) && (val.longitude == lon) ) return true;
        	});
        	return false;
        }

        function latLongLookup(txtarr){
            for (i = 0; i<txtarr.length; i++) {

                if (!!foundLocations[txtarr[i]]) {
                	loadAndAppendGeoOffer(txtarr[i]); 
                	continue; 
                }
                
                (function(index) {
	                TN.services.getLatLong(index, "").done(function(json){
	                    if (!!json) {
	                        if ((json[0] != null) && (json[1] != null)) {
	                            foundLocations[index] = {}; currentLocations[index] = {};
	                            foundLocations[index]["latitude"] = json[0]; 
	                            currentLocations[index]["latitude"] = json[0];
	                            foundLocations[index]["longitude"] = json[1]; 
	                            currentLocations[index]["longitude"] = json[1];
	                            if (!(geoUriInCurrentLocations(json[0], json[1]))) loadAndAppendGeoOffer(index); 
	                        }
	                    }

	                });
	            })(txtarr[i]);

            }
        }

        // Returns array of all combinations of unique sequential n-tuples from a string.
        // Currently works for n: 1, 2 & 3
        function extractTextTuples(string, n){

        	function prune_duplicates(arr){
			    var uniques = [];
			    $.each(arr, function(i, val){
			        if($.inArray(val, uniques) === -1) uniques.push(val);
			    });
			    return uniques;
			}

            var testarr = string.split(" ");
            var temp = [];
            jQuery.each(testarr, function(i, val){
                testarr2 = val.split(",");
                jQuery.each(testarr2, function(i, val){
                    if (val != "") temp.push(val);
                });
            });
            if (n==1) return prune_duplicates(temp);
            var subs = [];
            if (n==2) {
                if (temp.length<2) {
                    return [];
                }
                else {
                    for (i=0; i<temp.length-1; i++) {
                        subs.push(temp[i]+" "+temp[i+1]);
                    }
                    return prune_duplicates(subs);
                }
            }
            else if (n==3) {
                if (temp.length<3) {
                    return [];
                }
                else {
                    for (i=0; i<temp.length-2; i++) {
                        subs.push(temp[i]+" "+temp[i+1]+" "+temp[i+2]);
                    }
                    return prune_duplicates(subs);
                }
            }
            else return [];
        }

        function enqueueLatLongLookup(txt, keystrokeN){

            if (keystrokeN == whereKeyups) {
            	currentLocations = {};
            	$('.autoGeoposition').remove();
                var tuples_3 = extractTextTuples(txt, 3);
                var tuples_2 = extractTextTuples(txt, 2);
                var tuples_1 = extractTextTuples(txt, 1);
                if (tuples_3.length>0) { latLongLookup(tuples_1); latLongLookup(tuples_2); latLongLookup(tuples_3) }
                else {
                    if (tuples_2.length>0) { latLongLookup(tuples_1); latLongLookup(tuples_2) }
                    else latLongLookup(tuples_1);
                }
            }
        }

        function extendedWhereFieldsFilled() {
			if (opEdTabSelected) {
				if (!TN.utils.isBlank($('#csOpEdCityInput').val()) || !TN.utils.isBlank($('#csOpEdStateCountryInput').val()) || !TN.utils.isBlank($('#csOpEdAddressInput').val())) return true;
				else return false;
			}
			else {
				if (!TN.utils.isBlank($('#csCityInput').val()) || !TN.utils.isBlank($('#csStateCountryInput').val()) || !TN.utils.isBlank($('#csAddressInput').val())) return true;
				else return false;
			}
		}

		// Publish functionality
		$('#csPublishButton').click(function(){
			if(!!publishInProgress ){
				alert('This story is already being published.  Please wait.')
				return;
			}
						
			var custId = TN.utils.getCookie('TNUser');
			var headline = $('#csHeadlineInput').val();
			var catType = $('#csCatSelectionBox').text();
			
			if( !!headline && !!catType && !!custId ){
//				$('#csUrlHiddenInput').val($('#csImage').attr('src'));
//				$('#csHeadlineHiddenInput').val(headline);
//				$('#csTypeHiddenInput').val(catType);
//				$('#csCustIdHiddenInput').val( custId );
//				
//				if( !!storyUrl ){
//					$('#csWebUrlHiddenInput').val(storyUrl);
//				}
				
//				var publishFormOptions = {
//						success: function(responseText, statusText, xhr, $form){
//							$createStory.close();
//						},
//						url: "/tn/send_buzz.php",
//						dataType:'text'
//					};
//				
//				$('#csPublishForm').ajaxSubmit(publishFormOptions);				
				//log(storyUrl);

				// Generate 'Where' string parameter for sendBuzzRequest (formatted concatenation of all location related fields in *opened* tab)
				recreateWhereString();

				// We issue only 1 warning if fields are filled beyond limit:
				if (headline.length > 50) {
					if (!warnedBeforePublish) {
						alert("Warning: some text fields are filled beyond character limit. Please shorten them before publishing.");
						warnedBeforePublish = true;
						return;
					}
				}
				else if (whereFinalString.length > 100) {
					if (!warnedBeforePublish) {
						alert("Warning: some text fields are filled beyond character limit. Please shorten them before publishing.");
						warnedBeforePublish = true;
						return;
					}
				}
				else if ( ( $('#csWhoInput').val().length > 100 ) || 
				 	 ( $('#csWhatInput').val().length > 100 ) || 
				 	 ( $('#csWhenInput').val().length > 100 ) || 
					 ( $('#csHowInput').val().length > 100 ) || 
					 ( $('#csWhyInput').val().length > 100 ) ) {
					if (!warnedBeforePublish) {
						alert("Warning: some text fields are filled beyond character limit. Please shorten them before publishing.");
						warnedBeforePublish = true;
						return;
					}
				}
				else if ($('#csOpEdInput').val().length > 500) {
					if (!warnedBeforePublish) {
						alert("Warning: some text fields are filled beyond character limit. Please shorten them before publishing.");
						warnedBeforePublish = true;
						return;
					}
				}

				// Beyond that one warning we just trim before publishing to fit the sendBuzzRequest limits
				if ( headline.length > 50 ) headline = headline.substring(0,50);
				if ( $('#csWhoInput').val().length > 100 ) $('#csWhoInput').val($('#csWhoInput').val().substring(0,100));
				if ( $('#csWhatInput').val().length > 100 ) $('#csWhatInput').val($('#csWhatInput').val().substring(0,100));
				if ( $('#csWhenInput').val().length > 100 ) $('#csWhenInput').val($('#csWhenInput').val().substring(0,100));
				if ( $('#csHowInput').val().length > 100 ) $('#csHowInput').val($('#csHowInput').val().substring(0,100));
				if ( $('#csWhyInput').val().length > 100 ) $('#csWhyInput').val($('#csWhyInput').val().substring(0,100));
				if ( $('#csOpEdInput').val().length > 500 ) $('#csOpEdInput').val($('#csOpEdInput').val().substring(0,500));
				// If our concatenation of location fields exceeds allowed length of 100 characters we trim it as well
				if (whereFinalString.length > 100) whereFinalString = whereFinalString.substring(0,100);

				// If we are defining 'Where' in 'expanded mode' we will not rely on manually selected geoURI
				// but will instead call TN.services.getLatLong just before calling 'sendBuzzRequest' with all
				// values from expanded Where fields and pipe received result to 'sendBuzzRequest'.
				// In case of error with execution or emptiness of all important expanded Where fields,
				// we will use previously defined latitude and longitude, if any
				// note: currently, geoURI automatic location offerings are disabled
				publishInProgress = true;
				if ( extendedWhereFieldsFilled() && ((opEdTabSelected && whereOpEdExpanded) || (!opEdTabSelected && whereExpanded)) ) {
					$.when(TN.services.getLatLong(	( opEdTabSelected ? $('#csOpEdCityInput').val() : $('#csCityInput').val() ), 
						( opEdTabSelected ? $('#csOpEdStateCountryInput').val() : $('#csStateCountryInput').val() ), 
					  	( opEdTabSelected ? $('#csOpEdZipcodeInput').val() : $('#csZipcodeInput').val() ), 
					  	( opEdTabSelected ? $('#csOpEdAddressInput').val() : $('#csAddressInput').val() ))).then(function(data){
						  	if(!!data) if(!!data[0]) {
								selectedLatitude = data[0];
								selectedLongitude = data[1];
							}
							//publishInProgress = true;
							TN.services.sendBuzzRequest( custId, headline, catType, $('#csImage').attr('src'), storyUrl,
								$('#csOpEdInput').val(), $('#csWhoInput').val(), $('#csWhatInput').val(), $('#csWhenInput').val(),
								whereFinalString, $('#csHowInput').val(), $('#csWhyInput').val(),
                                (!!selectedLatitude? selectedLatitude : ''), (!!selectedLongitude? selectedLongitude : '') ).
                                done ( function(msg){
                                	if ( (msg[0] == "false") || (msg[0] == false) ) alert('A problem occurred: ' + msg);
                            		else if (!!msg[0]) {
                            			alert('Story successfully added.');
                            			TN.createStory.close();
                            		}
                                }).
                                fail( function (msg){
	                    			alert('A problem occurred: ' + msg); 
	                    		}).
	                            always( function(){
	                            	publishInProgress = false;
	                            });	
							}, 
							// In case there was error with execution of TN.services.getLatLong
							function(){
								//publishInProgress = true;
								TN.services.sendBuzzRequest( custId, headline, catType, $('#csImage').attr('src'), storyUrl,
									$('#csOpEdInput').val(), $('#csWhoInput').val(), $('#csWhatInput').val(), $('#csWhenInput').val(),
									whereFinalString, $('#csHowInput').val(), $('#csWhyInput').val(),
                                    (!!selectedLatitude? selectedLatitude : ''), (!!selectedLongitude? selectedLongitude : '') ).
	                                done ( function(msg){
	                                	if ( (msg[0] == "false") || (msg[0] == false) ) alert('A problem occurred: ' + msg);
	                            		else if (!!msg[0]) {
	                            			alert('Story successfully added.');
	                            			TN.createStory.close();
	                            		}
	                                }).
	                                fail( function (msg){
		                    			alert('A problem occurred: ' + msg); 
		                    		}).
		                            always( function(){
		                            	publishInProgress = false;
		                            });	
							}
						);
	            }
	            else {
	     			//publishInProgress = true;
	             	TN.services.sendBuzzRequest( custId, headline, catType, $('#csImage').attr('src'), storyUrl,
						$('#csOpEdInput').val(), $('#csWhoInput').val(), $('#csWhatInput').val(), $('#csWhenInput').val(),
						whereFinalString, $('#csHowInput').val(), $('#csWhyInput').val(),
	                    (!!selectedLatitude? selectedLatitude : ''), (!!selectedLongitude? selectedLongitude : '') ).
                        done ( function(msg){
                        	if ( (msg[0] == "false") || (msg[0] == false) ) alert('A problem occurred: ' + msg);
                    		else if (!!msg[0]) {
                    			alert('Story successfully added.');
                    			TN.createStory.close();
                    		}
                        }).
                        fail( function (msg){
                			alert('A problem occurred: ' + msg); 
                		}).
                        always( function(){
                        	publishInProgress = false;
                        });	
	            }
			}
			else {
				if( !headline ){
					alert('Please enter a headline for this story');
				}
				
				if( !catType ){
					alert('Please select a category for this story');
				}
				
				if( !custId ){
					alert('Unable to validate your user Id.  Your session may have timed out.  Please sign in again.');
					TN.createStory.close();
				}
			}
		});
		
		// login button functionality
		$('#loginButton').click(function(){
			
			var pass = $('#inputCont #password').val();
			
			//source to check if valid email is entered
			//http://www.w3schools.com/js/js_form_validation.asp
			var userName = $('#inputCont #userName').val();
			var email='', uniqueid='';
			
			var atpos=userName.indexOf("@");
			var dotpos=userName.lastIndexOf(".");
			if (atpos<1 || dotpos<atpos+2 || dotpos+2>=userName.length){
				uniqueid = userName;
			} else{
				email = userName;
			}
			
			TN.services.loginCustomer(uniqueid, email, pass).done(function(){
				TN.utils.setCookie('TNUser', userName, 15);
				$('#loginCont').remove();
				$('#loginCanvas').remove();
				$('#csTitle').removeClass('displayNone');
			});	
		});
		
		// Choose photo functionality
		var choosePhotoFormOptions = {
			success: function(responseText, statusText, xhr, $form){
				$('#csImage').attr('src', responseText);
				$('#csBrowseFileCont').hide();
				$('#csBaseOptions').show();
			},
			url: "/php/store_image.php",
			dataType:'text'
		};
		
		$('#csBrowseButton').click(function(){
			$('#csChoosePhotoInput').click();
		});
		
		$('#csChoosePhotoInput').change(function(){
			$('#csChoosePhotoForm').ajaxSubmit(choosePhotoFormOptions);
		});
		
		// Edit photo functionality
		var editPhotoFormOptions = {
			success: function(responseText, statusText, xhr, $form){
				$('#csImage').attr('src', responseText);
			},
			url: "/php/store_image.php",
			dataType:'text'
		};
		
		$('#csEditPhoto').click(function(){
			$('#csEditPhotoInput').click();
		});
		
		$('#csEditPhotoInput').change(function(){
			$('#csEditPhotoForm').ajaxSubmit(editPhotoFormOptions);
		});
				
		$('#createStory .csCloseButton, #createStoryCanvas, #cancelLink').click($createStory.close);
		
		// Category drop down functionality
		TN.services.getAllMessageTypeCategories().done(function(json){
			if( !!json ){
				var csCatDropdown = $('#csCatDropdown');
				var maxItems = json.length;
				for( var i = 0; i < maxItems; i++ ){
					if( json[i].global === 1 || json[i].global === 0 ){
						csCatDropdown.append('<li>' + json[i].id + '</li>');
					}
				}
				csCatDropdown.find('li').click(function(){
					var jqElem = $(this);
					jqElem.parents('#csCatSelectionCont').find('#csCatSelectionBox').text(jqElem.text());
				});

			}
		}).fail(function(){
			alert('Unable to load the available categories due to a system error.  Please try again later.');
		});
		
		//Write Story tabs functionality
		$('#writeOpEdInput').hide();
		
		$('#writeStoryTab').click(function(){
			var jqElem = $(this);
			jqElem.addClass('tabSelected');
			$('#writeStoryInputs').show();
			$('#writeOpEdTab').removeClass('tabSelected');
			$('#writeOpEdInput').hide();			
		});
		
		$('#writeOpEdTab').click(function(){
			var jqElem = $(this);
			jqElem.addClass('tabSelected');
			$('#writeOpEdInput').show();
			$('#writeStoryTab').removeClass('tabSelected');
			$('#writeStoryInputs').hide();			
		});
		
		TN.utils.centerAndShowPopup(createStoryElem);
	}
	
	$createStory.show = function(imageUrl, storyUrl, resetAddressBar){
		
//		TN.services.pingServer().done(function(){
			showCreateStory(imageUrl, storyUrl, resetAddressBar, true);
//		}).fail(function(){
//			showCreateStory(imageUrl, storyUrl, resetAddressBar, false);
//		});
		
		
	};
}(TN.createStory));
