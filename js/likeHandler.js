if (!TN) var TN= {};
if (!TN.likeHandler) TN.likeHandler= {};

(function($likeHandler){
	function callAjax( custId, msgId, type, isFavour, successCallback ){
		var postData = 'action=addFittingRoomResponse&custid='+custId+'&msgresponse=\
		{"type":"' + (!!type ? type : 'BuyItOrNot') + '",\
		 "responseWords":"",\
		 "messageId":"'+ msgId + '",\
		 "isFavour":"' + isFavour + '"}';
		return(
			$.ajax({
				type:'POST',
				cache:false,
				data:postData,
				url:'/salebynow/json.htm',
				success:successCallback,
				error : function( jqXhr, textStatus, errorThrown ){
					alert(errorThrown);
				}
			})
		);
	}
	
	function processLikedIt( custId, msgId, type, successCallback ){
		return (callAjax(custId, msgId, type, 'Y', successCallback));
	};
	
	function retractLikedIt(custId, msgId, type, successCallback){
		return(callAjax(custId, msgId, type, 'Z', successCallback));
	};
	
	function processDislike( custId, msgId, type, successCallback ){
		return(callAjax(custId, msgId, type, 'U', successCallback));
	};
	
	function retractDislike( custId, msgId, type, successCallback ){
		return(callAjax(custId, msgId, type, 'V', successCallback));
	};
	
	$likeHandler.updateLikeCount = function(custId, parentCont, catType, jqElem){			
		var messageId = parentCont.find('.messageId').val();
		return ( 		
			processLikedIt(custId, messageId, catType, function(){
				var likeCountElem = parentCont.find('.likesCount span');
				likeCountElem.html(parseFloat(likeCountElem.html())+1);
				parentCont.data('like', true);				
				jqElem.removeClass('likeClicked');
				jqElem.addClass('likeSelected');
				
				if( !!parentCont.data('dislike') ){
					retractDislike(custId, messageId, catType, function(){
						var dislikeCountElem = parentCont.find('.dislikesCount span');
						dislikeCountElem.html(parseFloat(dislikeCountElem.html())-1);
						parentCont.data('dislike', false);
						
						var dislikeElem = parentCont.find('.dislike');
						dislikeElem.removeClass('dislikeSelected');
						dislikeElem.addClass('dislikeNormal');
					});
				}
			})
		);
	};
	
	$likeHandler.reverseLikeCount = function( custId, parentCont, catType, jqElem ){
		var messageId = parentCont.find('.messageId').val();
		return (
			retractLikedIt(custId, messageId, catType, function(){
				var likeCountElem = parentCont.find('.likesCount span');
				likeCountElem.html(parseFloat(likeCountElem.html())-1);
				parentCont.data('like', false);
				jqElem.removeClass('likeClicked');
				jqElem.addClass('likeNormal');
			})
		);
	};
	
	$likeHandler.updateDislikeCount = function(custId, parentCont, catType, jqElem){			
		var messageId = parentCont.find('.messageId').val();
		return (
			processDislike(custId, messageId, catType, function(){
				var dislikeCountElem = parentCont.find('.dislikesCount span');
				dislikeCountElem.html(parseFloat(dislikeCountElem.html())+1);
				parentCont.data('dislike', true);
				jqElem.removeClass('dislikeClicked');
				jqElem.addClass('dislikeSelected');
				
				if( !!parentCont.data('like' ) ){
					retractLikedIt(custId, messageId, catType, function(){
						var likeCountElem = parentCont.find('.likesCount span');
						likeCountElem.html(parseFloat(likeCountElem.html())-1);
						parentCont.data('like', false);
						
						var likeElem = parentCont.find('.like');
						likeElem.removeClass('likeSelected');
						likeElem.addClass('likeNormal');
					});
				}
			})
		);
	};
	
	$likeHandler.reverseDislikeCount = function( custId, parentCont, catType, jqElem ){
		var messageId = parentCont.find('.messageId').val();
		return (
			retractDislike(custId, messageId, catType, function(){
				var dislikeCountElem = parentCont.find('.dislikesCount span');
				dislikeCountElem.html(parseFloat(dislikeCountElem.html())-1);
				parentCont.data('dislike', false);
				jqElem.removeClass('dislikeClicked');
				jqElem.addClass('dislikeNormal');
			})
		);
	};
	
}(TN.likeHandler));