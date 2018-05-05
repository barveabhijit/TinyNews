if (!TN) var TN= {};
if (!TN.sharingHandler) TN.sharingHandler= {};

(function($sharingHandler){
	
	var newspaperShareInProgress = false;

	function extractShareAddresses(){
		var input = $('.TN-AF_searchBox').val();
		var output = '[';
		var emailArray = input.split(/[\s,;]+/);
		var first = true;
		jQuery.each(emailArray, function(index, val){
			if (first) output += '"'+val+'"';
			else output += ',"'+val+'"';
			first = false;
		})
		return output+']';
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
                shareBoxCont.find('.TN-addFriend_Cont_searchBox').append('<input type="button" value="SHARE" class="darkBlue-button" id="shareNewspaperButton">');
				shareBoxCont.find('.TN-addFriend_Cont_list').find('li a').click(function(event){
                	event.preventDefault();
                	alert("Coming soon.");
                });
                shareBoxCont.find('form').submit(function(event){
                	event.preventDefault();
                });
                shareBoxCont.find('.TN-addFriend_Cont_searchBox').keyup(function(event){
                	if( event.which === 13 ) {
                		$('#shareNewspaperButton').click();
                	}
                });
                shareBoxCont.find('#shareNewspaperButton').click(function(){
                	if (!newspaperShareInProgress) {
                		newspaperShareInProgress = true;
                		$('#shareNewspaperButton').val('SHARING..');
                		TN.services.shareNPTemplateInfoViaEmail(npid, newspaperHeadline, extractShareAddresses()).done(function(msg){
                			if (!!msg && !!msg[0]) {
                				if ( !( (msg[0] == "false") || (msg[0] == false) ) ) alert("Newspapers successfully shared.");
                				else alert("There was a problem with sharing of newspapers.");
                			};
                		}).always(function(){
                			newspaperShareInProgress = false;
                			$('#shareNewspaperButton').val('SHARE');
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

}(TN.sharingHandler));