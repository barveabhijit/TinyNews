if (!TN) var TN= {};
if (!TN.sharingHandler) TN.sharingHandler= {};

(function($sharingHandler){
	
	var custId = TN.utils.getCookie('TNUser');
	var shareInProgress = false;

	function extractShareAddresses(){
		var input = $('.TN-AF_searchBox').val();
		var output = '';
		var emailArray = input.split(/[\s,;]+/);
		var first = true;
		jQuery.each(emailArray, function(index, val){
			if (first) output += '"'+val+'"';
			else output += ',"'+val+'"';
			first = false;
		})
		return output;
	};
	
	function extractShareAddressesAsArray(){
		var input = $('.TN-AF_searchBox').val();
		var emailArray = input.split(/[\s,;]+/);
		return emailArray;
	};
	
	
	$sharingHandler.initNPShare = function(npid, newspaperHeadline){
        $.ajax({
            url: 'addFriends.html',
            success: function (data) {
                var shareBoxCont = $($(data)[15]).find('.TN-addFriend_Cont');
                // Transformations to convert addFriends.html "lightbox" to newspaper sharing
                // box (check TNWDES-688 for Foundation version design guideline):
                shareBoxCont.css("padding-left", "15px").css("padding-right", "15px").css("padding-bottom", "15px");
                shareBoxCont.find('h2').text('Enter email address(es):');
                shareBoxCont.find('.TN-AF_searchBox').val('').css('width', '475px');
                shareBoxCont.find('.TN-AF_search').remove();
                shareBoxCont.find('.TN-addFriend_Cont_searchResult').remove();
                shareBoxCont.find('.TN-addFriend_Cont_searchBox').append('<input type="button" value="SHARE" class="darkBlue-button" id="shareButton">');
				shareBoxCont.find('.TN-addFriend_Cont_list').find('li a').click(function(event){
                	event.preventDefault();
                	alert("Coming soon.");
                });
                shareBoxCont.find('form').submit(function(event){
                	event.preventDefault();
                });
                shareBoxCont.find('.TN-addFriend_Cont_searchBox').keyup(function(event){
                	if( event.which === 13 ) {
                		$('#shareButton').click();
                	}
                });
                shareBoxCont.find('#shareButton').click(function(){
                	if (!shareInProgress) {
                		shareInProgress = true;
                		$('#shareButton').val('SHARING..');
                		TN.services.shareNPTemplateInfoViaEmail(custId, npid, newspaperHeadline, '[' + extractShareAddresses() + ']').done(function(msg){
                			if (!!msg && !!msg[0]) {
                				if ( !( (msg[0] == "false") || (msg[0] == false) ) ) alert("Newspapers successfully shared.");
                				else alert("There was a problem with sharing of newspapers.");
                			};
                		}).always(function(){
                			shareInProgress = false;
                			$('#shareButton').val('SHARE');
                		});
                	}
                	else return;
                });
                var specificContent = '<div class="TN-addFriend_Header block">\
                    <h1>Share with Friends</h1>\
                    <br><br><br>Select who you want to share your newspaper\'s latest issue with.\
                    </div>';
                shareBoxCont.prepend(specificContent);
                LightboxTool.displayLightbox(shareBoxCont, {showHeader:true, width:625});
            },
            error: function() { alert("Error occurred while loading newspaper sharing dialog."); },
            dataType: 'html'
        });
    };

	$sharingHandler.initStoryShare = function(infoStruct){
        $.ajax({
            url: 'addFriends.html',
            success: function (data) {
                var shareBoxCont = $($(data)[15]).find('.TN-addFriend_Cont');
                // Transformations to convert addFriends.html "lightbox" to newspaper sharing
                // box (check TNWDES-688 for Foundation version design guideline):
                shareBoxCont.css("padding-left", "15px").css("padding-right", "15px").css("padding-bottom", "15px");
                shareBoxCont.find('h2').text('Enter email address(es):');
                shareBoxCont.find('.TN-AF_searchBox').val('').css('width', '475px');
                shareBoxCont.find('.TN-AF_search').remove();
                shareBoxCont.find('.TN-addFriend_Cont_searchResult').remove();
                shareBoxCont.find('.TN-addFriend_Cont_searchBox').append('<input type="button" value="SHARE" class="darkBlue-button" id="shareButton">');
				shareBoxCont.find('.TN-addFriend_Cont_list').find('li a').click(function(event){
                	event.preventDefault();
                	alert("Coming soon.");
                });
                shareBoxCont.find('form').submit(function(event){
                	event.preventDefault();
                });
                shareBoxCont.find('.TN-addFriend_Cont_searchBox').keyup(function(event){
                	if( event.which === 13 ) {
                		$('#shareButton').click();
                	}
                });
                shareBoxCont.find('#shareButton').click(function(){
                	if (!shareInProgress) {
                		shareInProgress = true;
                		$('#shareButton').val('SHARING..');
                		                			
                		TN.services.getServerAddress().done(function(msg){
                    		var fullyQualifiedImgUrl = 'http://'+msg+ infoStruct.productImageUrl;
    						TN.services.sharePhotoInfoViaEmail(custId, extractShareAddressesAsArray(), '', infoStruct.wsMessage.messageType,
								(!!infoStruct.wsBuzz.headline) ? infoStruct.wsBuzz.headline : "Test Headline", fullyQualifiedImgUrl, '',
								infoStruct.wsBuzz.oped, infoStruct.wsBuzz.who, infoStruct.wsBuzz.what, infoStruct.wsBuzz.when, infoStruct.wsBuzz.where,
								infoStruct.wsBuzz.how, infoStruct.wsBuzz.why)
								.done(function(msg){
									//alert("Server response: "+msg);
									if (msg[0] != "false") {
										alert("Story successfully sent");
									}
									else alert("There was a problem with sharing of this story.");
									})
								.fail(function(){
									alert("There was a problem with sharing of this story.");
								}).always(function(){
									shareInProgress = false;
									$('.TN-AF_searchBox').val('');
									$('#shareButton').val('SHARE');
								});	
                		});
                	}
                	else return;
                });
                var specificContent = '<div class="TN-addFriend_Header block">\
                    <h1>Share with Friends</h1>\
                    <br><br><br>Select who you want to share this story with.\
                    </div>';
                shareBoxCont.prepend(specificContent);
                LightboxTool.displayLightbox(shareBoxCont, {showHeader:true, width:625});
            },
            error: function() { alert("Error occurred while loading story sharing dialog."); },
            dataType: 'html'
        });
    };

}(TN.sharingHandler));