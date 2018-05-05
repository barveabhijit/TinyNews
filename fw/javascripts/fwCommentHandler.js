if (!TN) var TN= {};
if (!TN.commentHandler) TN.commentHandler= {};

(function($commentHandler){
	
	var imageContainer = null;
	
	function getUserImageUrl(){
		return(TN.utils.getCookie('TNUserUrl'));
	}
	
	function getUserName(){
		return(TN.utils.getCookie('TNUserName'));
	}
	
	function getUserId(){
		return(TN.utils.getCookie('TNUser'));
	}
	
	function getCommentItemHtml(commenterUrl, commenterName, comment){
//		return( '\
//			<div class="CommentBlock block">\
//			<div class="block">\
//				<img height="36" width="36" src="'+commenterUrl+'"/>\
//	            <h3>'+commenterName+'</h3> \
//	            <p>'+comment+'</p> \
//				</div>\
//	            <hr class="hRulerStory"> \
//			</div>' );
		
		return( '<div class="commentBlock">\
			<img height="36" width="36" src="' + commenterUrl + '" alt="comment user image"/>\
			<a href="#">'+commenterName+'</a>\
			<p>'+comment+'</p>\
			<hr class="divider">\
		</div><!--/commentBlock-->' );
		
	}
	
	function getLBCommentItemHtml(commenterUrl, comment){
		
		return( '<div class="row">\
				<div class="user-small-pic left ">\
					<img src="' + commenterUrl + '" width="36" height="36" alt="User Image">\
				</div>\
				<div class="user-comment">\
					<p class="CommentText">' + comment + '</p>\
				</div>\
			</div>\
			<hr class="divider">' );

//        return( '\
//        	<div class="lightboxCommentsBlock"> \
//        		<div class="block"> \
//        			<a href="#"><img src="' + commenterUrl + '" width="36" height="36" alt="user-image" title="User Image"></a> \
//        			<p>' + comment + '</p> \
//        		</div><!--/block--> \
//        		<hr class="lightboxhRuler"> \
//	        </div><!--/lightbocCommentsBlock-->' );
        
	}
	
	function getImageContainer(){
		if( !imageContainer ){
			imageContainer = $('#container');
		}
		return imageContainer;
	}
	
	function reloadComments(newCommentsHtml, parentCont){
		parentCont.find('.commentBlock').remove();
		parentCont.find('.comments').remove();
		
		var commentInputElem = parentCont.find('.commentText');
		
		if( commentInputElem.length > 0 ){
			commentInputElem.before(newCommentsHtml);
		} else {
			parentCont.find('.mypageStoryBoxComment').append(newCommentsHtml);
		}		
		
		if( parentCont.hasClass('mypageStoryBox') ){
			getImageContainer().masonry();
		}
	}

	function reloadLBComments(newCommentsHtml, parentCont){
		parentCont.find('.user-details').empty().append(newCommentsHtml );
		addLBCommentBoxFunctions(parentCont, parentCont.find('.commentTextbox'));		
	}
	
	$commentHandler.getAllComments = function(allCommentsLabelElem, parentCont){
		var messageId = parentCont.find('.messageId').val();
		//var storyId = parentCont.find('.storyId').val();
		//var commentsArray = (!!storyId) ? TN.utils.getDetailItem(storyId).comments : TN.utils.getDetailItem(messageId).messageResponseList;
		var commentsArray = TN.utils.getDetailItem(messageId).messageResponseList;
		var totalComments = commentsArray.length;
		var commentsHtml = '';

		for( var i = 0; i < totalComments; i++ ){
			var currComment = commentsArray[i];
			if ( !TN.utils.isBlank(currComment.responseMessageBody) ) {
				commentsHtml += getCommentItemHtml(currComment.thumbCustomerUrl, currComment.responseCustomerName, currComment.responseMessageBody);
			}
		}
		
		reloadComments(commentsHtml, parentCont );
		
	};
	
	$commentHandler.getLBAllComments = function(allCommentsLabelElem, parentCont){
		var messageId = parentCont.find('.messageId').val();
		var commentsArray = TN.utils.getDetailItem(messageId).messageResponseList;
		var totalComments = commentsArray.length;
		var commentsHtml = '';

		for( var i = 0; i < totalComments; i++ ){
			var currComment = commentsArray[i];
			if ( !TN.utils.isBlank(currComment.responseMessageBody) ) {
				commentsHtml += getLBCommentItemHtml(currComment.thumbCustomerUrl, currComment.responseMessageBody);
			}
		}
		
		commentsHtml += $commentHandler.getLBCommentBoxHtml();
		reloadLBComments(commentsHtml, parentCont );
	};
	
	$commentHandler.reloadComments = function(parentCont) {
		var messageId = parentCont.find('.messageId').val();
		var commentsArray = TN.utils.getDetailItem(messageId).messageResponseList;
		var commentsHtml = "";
		if( !!commentsArray ){
			var addedCommentCount = 0;
			jQuery.each(commentsArray, function(index, val) {
				var currComment = val;
				if ( addedCommentCount < 5  && !TN.utils.isBlank(currComment.responseMessageBody) ) {
					commentsHtml += getCommentItemHtml(currComment.thumbCustomerUrl, currComment.responseCustomerName, currComment.responseMessageBody);
					addedCommentCount++;
				}
			});
			
			var numTrueComments = $commentHandler.trueNumOfComments(commentsArray);
			if( numTrueComments > 5){
				commentsHtml += '<a href="javascript:void(0);" class="comments">All <span>' + numTrueComments + '</span> Comments...</a>';
			}
			
			reloadComments(commentsHtml, parentCont);
			
			if( numTrueComments > 5){
				parentCont.find('.comments').unbind().bind('click', function(){
					var jqElem = $(this);
					TN.commentHandler.getAllComments(jqElem, parentCont);
				});
			}
		}
		
	};
	
	$commentHandler.getCommentBoxHtml = function(){
		return('<div class="commentText block">\
			<div class="two left" style="margin-right:10px">\
				<img width="35px" height="35px" src="' + getUserImageUrl() + '" alt="user image" class="auther-pic">\
			</div><!--/two-->\
			<div class="nine left">\
				<div class="commentTextwrapper twelve">\
					<input type="text" name="textbox" placeholder="Add A Comment" class="comment-box">\
				</div><!--/commentTextwrapper-->\
			</div><!--/nine-->\
		</div><!--/commentText-->');
	};
	
	$commentHandler.getLBCommentBoxHtml = function(){
		return( '<div class="commentTextLightbox block">\
			<div class="left" style="margin-right:10px">\
				<img src="' + getUserImageUrl() + '" width="36" height="36" alt="user image" class="auther-pic"/>\
			</div>\
			<div class="commentTextwrapper">\
				<input type="text" name="textbox" placeholder="Add A Comment" class="commentTextbox">\
			</div><!--/commentTextwrapper-->\
		</div>' );

//		return('\
//			<table class="comment_tbl"> \
//				<tr> \
//					<td><img src="' + getUserImageUrl() + '" width="36" height="36" alt="user-image" title="User Image"></td> \
//					<td style="width:100%"><input type="text" name="comment" class="formTextbox" placeholder="Add a Comment..."></td> \
//				</tr> \
//			</table>');
	};
	
	$commentHandler.getCommentsHtml = function(commentsArray){
		
		var commentItemsHtml = '';
		if( !!commentsArray ){
			var numTrueComments = commentsArray.length;
			var i = 0;
			jQuery.each(commentsArray, function(index, val) {
				if ( TN.utils.isBlank(val.responseMessageBody) ) numTrueComments--;
				else if ( i<5 ) {
					var currComment = val;
					commentItemsHtml += getCommentItemHtml(currComment.thumbCustomerUrl, currComment.responseCustomerName, currComment.responseMessageBody);
					i++;
				}
			});

			if( numTrueComments > 5 ){
				commentItemsHtml += '<a href="javascript:void(0);" class="comments">All <span>' + numTrueComments + '</span> Comments...</a>';
			}
		}
		
		return ('<div class="mypageStoryBoxComment">' + commentItemsHtml + '</div>');
	};
	
	$commentHandler.getLBCommentsHtml = function(commentsArray){
		
		var commentItemsHtml = '';
		if( !!commentsArray ){
			var numTrueComments = commentsArray.length;
			var i = 0;
			jQuery.each(commentsArray, function(index, val) {
				if ( TN.utils.isBlank(val.responseMessageBody) ) numTrueComments--;
				else if ( i<5 ) {
					var currComment = val;
					commentItemsHtml += getLBCommentItemHtml(currComment.thumbCustomerUrl, currComment.responseMessageBody);
					i++;
				}
			});
			
			if( numTrueComments > 5 ){
				commentItemsHtml += '<div class="row linkAllComments">\
						<div class="three columns centered"><a href="javascript:void(0);" class="text-center">View All <span>' + numTrueComments + '</span> Comments</a></div>\
					</div>\
					<hr class="divider">';

//				commentItemsHtml += '\
//					<div class="lightbocCommentsBlock block"> \
//						<div class="lightbocCommentsBlockLast linkAllComments"> \
//							View All <span>' + numTrueComments + '</span> Comments \
//						</div><!--lightbocCommentsBlockLast--> \
//						<hr class="lightboxhRuler"> \
//					</div> <!--/lightbocCommentsBlock-->';
			}
		}
		
		return (commentItemsHtml);
		
	};
	
	function addComment(custId, msgId, commentText, successCallback){
		var postData = 'action=addFittingRoomResponse&custid='+custId+'&msgresponse=\
		{"type":"HowDoesThisLook",\
		 "responseWords":"' + commentText + '",\
		 "messageId":"'+ msgId + '",\
		 "isFavour":""}';
		$.ajax({
			type:'POST',
			cache:false,
			data:postData,
			url:'/salebynow/json.htm',
			success:successCallback,
			error : function( jqXhr, textStatus, errorThrown ){
				alert(errorThrown);
			}
		});
	};
	
	function addLBCommentBoxFunctions(parentCont, commentBoxElem ){
		var messageId = parentCont.find('.messageId').val();
		
		commentBoxElem.keyup(function(event){
			var jqElem = $(this);
			if( event.which === 13 ){
				var commentText = $(this).val();
				if( !!commentText ){
					addComment(getUserId(), messageId, commentText, function(){
						var commCountElem = parentCont.find('#commentsCount span');
						var newCommentCount = parseFloat(commCountElem.html())+1;
						commCountElem.html(newCommentCount);
						
						var getAllCommentsElem = parentCont.find('.linkAllComments');

						if( getAllCommentsElem.length > 0 ){
							getAllCommentsElem.before(getLBCommentItemHtml(getUserImageUrl(), commentText));
							getAllCommentsElem.find('span').html(newCommentCount);
						} else {
							parentCont.find('.user-details .commentTextLightbox').before(getLBCommentItemHtml(getUserImageUrl(), commentText));
						}						
						
						TN.utils.getDetailItem(messageId).messageResponseList.push(
								{
									responseCustomerName:getUserName(),
									thumbCustomerUrl:getUserImageUrl(),
									responseMessageBody:commentText
									}
							);
						
						jqElem.val("");
					});
				}
			}
		});
	}
	
	function addCommentBoxFunctions(parentCont, commentBoxElem ){
		
		var messageId = parentCont.find('.messageId').val();
		commentBoxElem.unbind('keyup').keyup(function(event){
			var jqElem = $(this);
			if( event.which === 13 ){
				var commentText = $(this).val();
				if( !!commentText ){
					addComment(getUserId(), messageId, commentText, function(){
						var commCountElem = parentCont.find('.commentsCount span');
						var newCommentCount = parseFloat(commCountElem.html())+1;
						commCountElem.html(newCommentCount);
						
						var getAllCommentsElem = parentCont.find('.comments');

						if( getAllCommentsElem.length > 0 ){
							getAllCommentsElem.before(getCommentItemHtml(getUserImageUrl(), getUserName(), commentText));
							getAllCommentsElem.find('span').html(newCommentCount);
						} else {
							jqElem.parents('.commentText').before(getCommentItemHtml(getUserImageUrl(), getUserName(), commentText));
						}						

						TN.utils.getDetailItem(messageId).messageResponseList.push(
							{
								responseCustomerName:getUserName(),
								thumbCustomerUrl:getUserImageUrl(),
								responseMessageBody:commentText
								}
							);

						if( parentCont.hasClass('mypageStoryBox')){
//							jqElem.parents('.commentText').remove();
							getImageContainer().masonry();
						}
//						else{
							jqElem.val("");
//						}
					});
				}
			}
		});
	}
	
	$commentHandler.addCommentBoxFunctions = function(parentCont){
		addCommentBoxFunctions(parentCont, parentCont.find('.comment-box'));
	};
	
	$commentHandler.addLBCommentBoxFunctions = function(parentCont){		
		addLBCommentBoxFunctions(parentCont, parentCont.find('.commentTextbox'));
	};
	
	$commentHandler.addCommentBox = function(parentCont){

		var commentInputCont = $($commentHandler.getCommentBoxHtml());
		var commentItemsCont = parentCont.find('.mypageStoryBoxComment');
		
		if(commentItemsCont.find('.commentText').length === 0) {
			commentItemsCont.append(commentInputCont);
			addCommentBoxFunctions(parentCont, commentInputCont.find('.comment-box'));							
			getImageContainer().masonry();
			$(window).scrollTop( commentInputCont.position().top );
			commentInputCont.find('.comment-box').focus();
		}
		
	};

	$commentHandler.trueNumOfComments = function(messageResponseList){
		var num = messageResponseList.length;
		jQuery.each(messageResponseList, function(index, val){
			if ( TN.utils.isBlank(val.responseMessageBody) ) num--;
		});
		return num;
	};
	
}(TN.commentHandler));
