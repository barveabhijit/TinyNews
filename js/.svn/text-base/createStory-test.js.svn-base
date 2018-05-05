if (!TN) var TN= {};
if (!TN.createStory) TN.createStory= {};

(function($createStory){
	
	test("$createStory variable validation", function(){
		ok(!!$createStory, "$createStory is a valid variable");
	} );

	$createStory.close = function(){
		$('#createStory').remove();
		$('#createStoryCanvas').remove();
	};
	
	$createStory.show = function(imageUrl){
		var createImageUrl = '';
		var bodyElem = $('body');
		var createStoryCanvasElem = $('<div id="createStoryCanvas"></div>');
		var createStoryHtml = '\
			<div id="createStory"> \
				<div class="csCloseButton"></div>';
		 
		// If clip story mode
		if( !!imageUrl ){
			// If cookie exists then user already logged in
			if( TN.utils.getCookie('TNUser') ) {
				createStoryHtml += '\
					<div id="csTitle">Create Story</div>';
			}
			// Else show Login section
			else {
				// Show login dialog
				createStoryHtml += '\
					<div id="csTitle" class="displayNone">Create Story</div> \
					<div id="loginCanvas"></div>\
					<div id="loginCont">\
						<div class="csCloseButton"></div>\
						<div id="loginTitle">Log in to continue</div>\
						<div id="inputCont">\
							<form id="signInForm">\
								<label for="userName">Username </label><input id="userName" type="text" required="required"/>\
								<br/>\
								<label for="password">Password </label><input id="password" type="password" required="required"/>\
								<br/>\
							</form>\
							<div id="loginButton"></div>\
							<div id="cancelLink">Cancel</div>\
						</div>\
					</div>';
			}
		} else {
			createStoryHtml += '\
				<div id="csTitle">Create Story</div>';			
		}
		
		if( !imageUrl ){
			createStoryHtml += '\
				<div id="csBrowseFileCont"> \
					<div id="csBrowseText">choose a photo</div>\
					<div id="csBrowseButton">Browse...</div>\
					<input id="csFileInput" type="file" accept"image/*"/> \
				</div>';
			createImageUrl = 'images/demo/img1.jpg';
		}
		else {
			createImageUrl = imageUrl;
		}
		
		createStoryHtml += '\
				<div id="csBaseOptions"> \
					<input id="csHeadlineInput" type="text" placeholder="Enter Headline Here..."/> \
					<div class="csDivider"></div> \
					<div id="csImageCont"> \
						<img id="csImage" src="'+ createImageUrl + '"/>';
		
		if( !imageUrl ){
			createStoryHtml += '\
						<div id="csEditPhoto">edit photo</div> \
						<form id="csEditPhotoForm" method="post">\
							<input id="csEditPhotoInput" type="file" accept"image/*"/> \
						</form>';
		}	
		
		createStoryHtml += '\
						<img id="csImageAccent" src="images/general/photo-accent.png"/>\
					</div> \
					<div id="csBaseDetailsCont"> \
						<div id="csCatSelectionCont"> \
							<div id="csCatSelectionBox"></div>\
							<img id="csComboBoxArrow" src="images/general/combobox-arrow.png"/>\
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
							<input id="csWhoInput" type="text" placeholder="Who?"/>\
							<input id="csWhatInput" type="text" placeholder="What?"/>\
							<input id="csWhenInput" type="text" placeholder="When?"/>\
							<input id="csWhereInput" type="text" placeholder="Where?"/>\
							<input id="csWhyInput" type="text" placeholder="Why?"/>\
							<input id="csHowInput" type="text" placeholder="How?"/>\
							<div id="csOr">Or</div> \
							<div class="csDivider"></div> \
							<input id="csOpEdInput" type="text" placeholder="Write Op-Ed instead"/>\
						</div>\
					</div> \
				</div> \
			</div>';
		
		var createStoryElem = $(createStoryHtml);
		
		bodyElem.append(createStoryCanvasElem);
		bodyElem.append(createStoryElem);
		
		$('input[placeholder]').placeholder();
		$('#csCatSelectionCont').click(function(){
			$('#csCatDropdown').toggle();
		});
				
		$('#csTellYourStory').click(function(){
			$('#csTellYourStoryDetails').show();
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
		
		$('#loginButton').click(function(){
			
//			$('#signInForm').validate({
//				submitHandler:function(){
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
						$('#loginCont').remove();
						$('#loginCanvas').remove();
						$('#csTitle').removeClass('displayNone');
					});	
//				}
//			});			
		});
		
		var editPhotoFormOptions = {
			success: function(responseText, statusText, xhr, $form){
				alert('status: ' + statusText + '\n\nresponseText: \n' + responseText);
				$('#csImage').attr('src', '/tn/'+responseText);
			},
			url: "/tn/store_image.php"
		};
		
		$('#csEditPhotoForm').submit(function(){
			$(this).ajaxSubmit(editPhotoFormOptions);
			return false;
		});
		
		$('#csEditPhotoInput').change(function(){
			$('#csEditPhotoForm').ajaxSubmit(editPhotoFormOptions);
		});
				
		$('#createStory .csCloseButton, #createStoryCanvas, #cancelLink').click($createStory.close);
		
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
		});
		
		TN.utils.centerAndShowPopup(createStoryElem);
	};
}(TN.createStory));
