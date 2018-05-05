if (!TN) var TN= {};
if(!TN.services) TN.services = {};


(function($services){	
	$.ajaxSetup({
		cache: false,
		dataType: 'json'
	});
	
	$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError){
		if( $.trim(jqXHR.responseText) === 'No stories available' || 
				ajaxSettings.data === 'action=keepThisSessionAlive' ||
				jqXHR.status === 404 || 
				jqXHR.status === 200 ||
				jqXHR.status === 0 ||
				jqXHR.responseText === 'success' ){
			return;
		}
		else {
			// For DEV purposes un-comment following line to get more details of error
//			alert('Error (' + jqXHR.status + '): ' + jqXHR.responseText +  'from ' +  ajaxSettings.url + thrownError );
			alert('Error (' + jqXHR.status + '): ' + thrownError );
		}
	});
	
	$services.addToWishListWithFittingRoomData = function(custId, messageId, visibility){
		return($.ajax({
			type:'POST',
			data: {
				action : "addToWishListWithFittingRoomData",
				wishlist : JSON.stringify({
	                'custid' : custId, 
					'msgid' : messageId,
					'visibility' : visibility
				})
			},
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.findFollowingStoriesPublished = function( custId, num, pageNum ){
		return($.ajax({
			type: 'GET',
			data: 'action=findFollowingStoriesPublished&custid=' + custId + '&num=' + num + '&pagenum=' + pageNum,
			url: '/salebynow/json.htm'
		}));
	};
	
	$services.findRecentStoriesFollowingRead = function( custId, num, pageNum ){
		return($.ajax({
			type: 'GET',
			data: 'action=findRecentStoriesFollowingRead&custid=' + custId + '&num=' + num + '&pagenum=' + pageNum,
			url: '/salebynow/json.htm'
		}));
	};
	
	$services.getAllMessageTypeCategories = function(){
		return($.ajax({
			type: 'GET',
			data: 'action=getAllMessageTypeCategories',
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.getAllMessageTypeActiveCategories = function(){
		return($.ajax({
			type: 'GET',
			data: 'action=getAllMessageTypeActiveCategories',
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.getAllRequestSummaries = function(custId, numItems, pageNum, type ){
		return($.ajax({
			type: 'GET',
			data: 'action=getAllRequestSummaries&custid=' + custId + '&type=' + type + '&num=' + numItems + '&pagenum=' + pageNum,
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.getFittingRoomRequest = function(custId, messageId){		
		return($.ajax({
			type: 'GET',
			data: 'action=getFittingRoomRequest&custid=' + custId + '&msgid=' + messageId,
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.getFollowersList = function(custid) {
		return ($.ajax({
			type:'GET',
			data:  {
				action : 'getFollowers',
				custid : custid
			},
			url:'/salebynow/json.htm'
		}));
	};

	$services.getFollowingList = function(custid, loginid) {
		return ($.ajax({
			type:'GET',
			data:  {
				action : 'getFollowing',
				custid : custid,
				loginid : loginid
			},
			url:'/salebynow/json.htm'
		}));
	};
	
	$services.getFriendsList = function(custid, loginid) {
		return ($.ajax({
			type:'GET',
			data:  {
				action : 'getFriendsList',
				custid : custid,
                loginid : loginid	
			},
			url:'/salebynow/json.htm'
		}));
	};

	$services.getFollowingRequestSummaries = function(custId, numItems, pageNum, type ){
		return($.ajax({
			type: 'GET',
			data: 'action=getFollowingRequestSummaries&custid=' + custId + '&type=' + type + '&num=' + numItems + '&pagenum=' + pageNum,
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.getFriendsRequestSummaries = function(custId, numItems, pageNum, type ){
		return($.ajax({
			type: 'GET',
			data: 'action=getFriendsRequestSummaries&custid=' + custId + '&type=' + type + '&num=' + numItems + '&pagenum=' + pageNum,
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.getMesageStats = function(messageId){
		return($.ajax({
			type: 'GET',
			data: 'action=getMesageStats&msgid=' + messageId,
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.getMyRequestSummaries = function(custId, numItems, pageNum, type ){
		return($.ajax({
			type: 'GET',
			data: 'action=getMyRequestSummaries&custid=' + custId + '&type=' + type + '&num=' + numItems + '&pagenum=' + pageNum,
			url : '/salebynow/json.htm'
		}));
	};
	
	// Get latest 4 stories by custId:
	$services.getMyPageRecentPhotos = function(custId, numItems, loginid ){
		return($.ajax({
			type: 'GET',
			data: 'action=getMyPageRecentPhotos&custid=' + custId + '&num=' + numItems + '&loginid=' + loginid,
			url : '/salebynow/json.htm'
		}));
	};
	
	
	$services.getNewspaper = function(npId){
		return($.ajax({
			type: 'GET',
			data: 'action=getNewspaper&npid=' + npId,
			url: '/salebynow/np.htm'
		}));		
	};
	
	$services.getNewspapers = function(custId){
		return($.ajax({
			type: 'GET',
			data: 'action=getNewspapers' + (!!custId ? '&custId=' + custId : ''),
			url: '/salebynow/np.htm'
		}));
	};
	
//	$services.getMyRequestSummaries = function() {
//		return ($.ajax({
//			type:'POST',
//			data: {
//				action : 'getMyRequestSummaries',
//				custid : 'eva@test.com',
//				type : 'IBoughtIt',
//				num : 24, 
//				pagenum : 1
//			}, 			
//			url:'/salebynow/json.htm'
//		}));
//	};
	
	$services.getServerAddress = function(){
		return($.ajax({
			type: 'GET',
			dataType:'text',
			url:'/php/server_address.php'
		}));
	};
	
	$services.getStoriesAndWishListFiltered = function(custId, num, page, type, category ){
		return($.ajax({
			type: 'GET',
			data: 'action=getStoriesAndWishListFiltered&custId=' + custId 
				+ '&num=' + num 
				+ '&pagenum=' + page
                + (!!type ? '&type=' + type : '')
				+ (!!category ? '&category=' + category : ''),
			url: '/salebynow/top.htm'
		}));
	};
	
	$services.deleteNewspaper = function( npId ){
		return($.ajax({
			type: 'POST',
			data: 'action=deleteNewspaper&npid=' + npId,
			url: '/salebynow/np.htm'
		}));
	};
	
	$services.saveNewspaper = function( newspaper ){
		return($.ajax({
			type: 'POST',
			data: {
				action: 'saveNewspaper',
				np: JSON.stringify(newspaper)
			},
			url: '/salebynow/np.htm'
		}));
	};
	
	$services.updateNewspaper = function( newspaper ){
		return($.ajax({
			type: 'POST',
			data: {
				action: 'updateNewspaper',
				np: JSON.stringify(newspaper)
			},
			url: '/salebynow/np.htm'
		}));		
	};
	
	$services.sendBuzzRequest = function(custId, headline, type, url, storyUrl, oped, who, what, when, where, how, why, lat, lon){
		return($.ajax({
			type: 'POST',
			data: {
				action : "sendBuzzRequest",
            	buzz : JSON.stringify({
	                'custid' : custId, 
					'headline' : headline,
					'type' : type,
					'url' : url,
					'storyUrl' : (!!storyUrl ? storyUrl : ''),
					'oped' : oped,
					'who' : who,
					'what' : what,
					'when' : when,
					'where' : where,
					'how' : how,
					'why' : why,
                    'latitude' : (!!lat ? lat : ''),
                    'longitude' : (!!lon ? lon : '')
            	})
			},
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.getTopCategories = function(){
		return($.ajax({
			type: 'GET',
			data: 'action=getTopCategories',
			url : '/salebynow/json.htm'			
		}));
	};
	
	$services.getTopOPED = function(){
		return($.ajax({
			type: 'GET',
			data: 'action=getTopOPED',
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.getTopStories = function( custId, num, page ){		
		return($.ajax({
			type: 'GET',
			data: 'action=getTopStories' + 
				(!!custId ? '&custId=' + custId : '') +
				(!!num ? '&num=' + num : '') +
				(!!page ? '&page=' + page : ''),
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.getTopStoriesFull = function( custId, num, page ){		
		return($.ajax({
			type: 'GET',
			data: 'action=getTopStoriesFull' + 
				(!!custId ? '&custId=' + custId : '') +
				(!!num ? '&num=' + num : '') +
				(!!page ? '&page=' + page : ''),
			url : '/salebynow/top.htm'
		}));
	};
	
	$services.loadUserInfo = function(custId, loginid){
		// loginid = 'test@test.com';
		return $.ajax({
		type:'POST',
		data:'action=getUserInfo'+ 
			(!!custId ?'&custid=' +custId:'') + 
			(!!loginid ? '&loginid='+loginid:''),
		url:'/salebynow/json.htm'
		});
	};

	$services.loginCustomer = function(uniqueid, email, pass){
		return($.ajax({
			type:'POST',
			data:'action=loginCustomer'+ 
				(!!uniqueid ? '&uniqueid='+uniqueid:'') + 
				(!!email ?'&email=' +email:'') +
				'&pass='+pass,
			url:'/salebynow/json.htm'
		}));
	};

	$services.registerCustomer = function(email, pass, firstname, lastname, photo_url, longitude, latitude){
		if (!!photo_url) {
			return ($.ajax({
			type:'POST',
			data:	{
				emaill : email,
				passs : pass,
				firstnamee : firstname,
				lastnamee : lastname, 
				photo_urll : photo_url 
			},
			url:'/php/register.php'
			}));
		}
		else {
			return ($.ajax({
			type:'POST',
			data:'action=registerCustomer&customer={'+ 
				(!!email ? '"email"="'+email+'"' : '"email"=""') +
				(!!pass ? ',"password"="'+pass+'"' : ',"password"=""') +
				(!!firstname ? ',"firstname"="'+firstname+'"' : ',"firstname"=""') + 
				(!!lastname ? ',"lastname"="'+lastname+'"' : ',"lastname"=""') + 
				(!!longitude ? ',"longitude"="'+longitude+'"' : '') + 
				(!!latitude ? ',"latitude"="'+latitude+'"' : '') + 
				'}',
			url:'/salebynow/json.htm'
			}));
		}
	};
	
	$services.userFlagRequest = function(messageId, type, custId){
		return($.ajax({
			type:'POST',
			data:'action=userFlagRequest&msgid=' + messageId + '&type=' + type + '&custid=' + custId,
			url:'/salebynow/json.htm'
		}));
	};
	
	$services.pingServer = function(){
		return($.ajax({
			type: 'POST',
			data: 'action=keepThisSessionAlive',
			url : '/salebynow/json.htm'
		}));
	};
	
	// Pings server and deletes a TNUser cookie and reloads a page if it detects ended session on server  
	$services.keepThisSessionAlive = function(){
		function sessionWatchAndKeepAlive() {
		    setTimeout(function() {
                    TN.services.keepThisSessionAlive().fail(function(jqXHR, textStatus){
		            if (jqXHR.status == 401) {
		                document.cookie = 'TNUser=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		                window.TN.userInfo = {};
		                location.href="index.html";
		            }
		        });
		    }, 150000);
		};
		
		return($.ajax({
			type: 'POST',
			data: 'action=keepThisSessionAlive',
			url : '/salebynow/json.htm'			
		}).done(sessionWatchAndKeepAlive));
	};
	
	$services.unFollow = function(custId, following){
		return($.ajax({
			type: 'POST',
			data: 'action=unFollow&custid=' + custId + '&following=' + following,
			url : '/salebynow/json.htm'
		}));
	};
	
	$services.unFriend = function(friendid){
        return($.ajax({
            type: 'POST',
            data: 'action=unFriend&custid=' + custId + '&friendid=' + friendid,
            url : '/salebynow/json.htm'
        }));
    };
    
    $services.addFollowing = function(custId, following){
        return($.ajax({
            type: 'POST',
            data: 'action=addFollowing&custid=' + custId + '&following=["' + following + '"]',
            url : '/salebynow/json.htm'
        }));
    };
    
    $services.addShopBeeFriends = function(friendids){
        return($.ajax({
            type: 'POST',
            data: 'action=addShopBeeFriends&custid=' + custId + '&friendids=["' + friendids + '"]',
            url : '/salebynow/json.htm'
        }));
    };
    
    $services.answerFriendRequest = function(friendid, accept){
        return($.ajax({
            type: 'POST',
            data: 'action=answerFriendRequest&custid=' + custId + '&friendid=' + friendid +'&accept=' +accept,
            url : '/salebynow/json.htm'
        }));
    };

    $services.undoFriendRequest = function(viewid){
        return($.ajax({
            type: 'POST',
            data: 'action=answerFriendRequest&custid=' + viewid + '&friendid=' + custId +'&accept=N',
            url : '/salebynow/json.htm'
        }));
    };

    $services.updateUserInfo = function(photo_url){
        return($.ajax({
            type: 'POST',
            data: 'action=updateUserInfo&userinfo={"userId":"' + custId + '","photo_url":"' +photo_url+ '"}', 
            url : '/salebynow/json.htm'
        }));
    };

    $services.sharePhotoInfoViaEmail = function(custId, emails, comments, type, headline, photo_url, name, oped, who, what, when, where, how, why){
        var tempData = {
            action : "sharePhotoInfoViaEmail",
            emailinfo : JSON.stringify({
                'custid' : custId,
                'comments' : comments,
                'type' : type,
                'headline' : headline,
                'photo_url' : photo_url,
                'emails' : emails,
                'name' : (!!name ? name : ''),
                'oped' : (!!oped ? oped : ''),
                'who' : (!!who ? who : ''),
                'what' : (!!what ? what : ''),
                'when' : (!!when ? when : ''),
                'where' : (!!where ? where : ''),
                'how' : (!!how ? how : ''),
                'why' : (!!why ? why : '')
            })
        };
        return($.ajax({
            type: 'POST',
            data: tempData,
            url : '/salebynow/json.htm'
        }));
    };

    $services.shareNPTemplateInfoViaEmail = function(custId, npid, headline, emails){
        return($.ajax({
            type: 'POST',
            data: 'action=shareNPTemplateInfoViaEmail&emailinfo={"npid":"' + npid + '","emails":' + emails + ',custid="' + custId + '","headline"="' + headline + '"}',
            url : '/salebynow/np.htm'
        }));
    };

    $services.searchStories = function(searchTxt, startIndex, endIndex){
        return($.ajax({
            type: 'GET',
            data: 'action=searchStories&searchtxt=' + searchTxt + '&startindex=' + startIndex + '&endindex=' + endIndex,
            url : '/salebynow/json.htm'
        }));
    };

    $services.shopbeeUsersSearch = function(searchTxt, startIndex, endIndex){
        return($.ajax({
            type: 'GET',
            data: 'action=shopbeeUsersSearch&custid=' + custId + '&searchtxt=' + searchTxt + '&startindex=' + startIndex + '&endindex=' + endIndex,
            url : '/salebynow/json.htm'
        }));
    };

    $services.getLatLong = function(city, state, zipcode, addline1, addline2){
        return($.ajax({
            type: 'GET',
            data: 'action=getLatLong' +
                (!!city ? '&city=' +city : '') +
                (!!state ? '&state=' +state : '') +
                (!!zipcode ? '&zipcode=' +zipcode : '') +
                (!!addline1 ? '&addline1=' +addline1 : '') +
                (!!addline2 ? '&addline2=' +addline2 : ''),
            url : '/salebynow/json.htm'
        }));
    };

    $services.getNotificationTrayDetails = function(custId, num, pageNum){
        return($.ajax({
            type: 'GET',
            data: 'action=getNotificationTrayDetails&custid=' + custId + '&num=' + num + '&pagenum=' + pageNum,
            url : '/salebynow/json.htm',
            dataType : 'json'
        }));
    };

    $services.getStory = function(storyId){
		return($.ajax({
			type: 'GET',
			data: 'action=getStory&storyId=' + storyId,
			url : '/salebynow/top.htm'
		}));
	};

	$services.getNewsfeed = function(page, custId) {
		return($.ajax({
	 		type: 'GET',
	 		data: 'action=getNewsfeed&custId=' + custId + '&first=' + ( (page-1)*10 ) + '&max=10',
	 		url : '/salebynow/nf.htm'
	 	}));
	};

	$services.getMyNewsfeed = function(page, custId) {
		return($.ajax({
	 		type: 'GET',
	 		data: 'action=getMyNewsfeed&custId=' + custId + '&first=' + ( (page-1)*10 ) + '&max=10',
	 		url : '/salebynow/nf.htm'
	 	}));
	};

	$services.getAllNewsfeed = function(page, custId) {
		return($.ajax({
	 		type: 'GET',
	 		data: 'action=getAllNewsfeed&custId=' + custId + '&first=' + ( (page-1)*10 ) + '&max=10',
	 		url : '/salebynow/nf.htm'
	 	}));
	};

	$services.getMyFriendNewsfeed = function(page, custId) {
		return($.ajax({
	 		type: 'GET',
	 		data: 'action=getMyFriendNewsfeed&custId=' + custId + '&first=' + ( (page-1)*10 ) + '&max=10',
	 		url : '/salebynow/nf.htm'
	 	}));
	};

	$services.getMyFollowingNewsfeed = function(page, custId) {
		return($.ajax({
	 		type: 'GET',
	 		data: 'action=getMyFollowingNewsfeed&custId=' + custId + '&first=' + ( (page-1)*10 ) + '&max=10',
	 		url : '/salebynow/nf.htm'
	 	}));
	};

	$services.getUsersLikedStories = function(custId) {
		return($.ajax({
	 		type: 'GET',
	 		data: 'action=getUsersLikedStories&custid=' + custId,
	 		url : '/salebynow/top.htm'
	 	}));
	};

	$services.getAuthorsReadStories = function(custId) {
		return($.ajax({
	 		type: 'GET',
	 		data: 'action=getAuthorsReadStories&custId=' + custId,
	 		url : '/salebynow/top.htm'
	 	}));
	};

	$services.getMostLikedStory = function(custId) {
		return($.ajax({
	 		type: 'GET',
	 		data: 'action=getMostLikedStory&custid=' + custId,
	 		url : '/salebynow/json.htm'
	 	}));
	};

	$services.npRead = function(custId, npid){
		return($.ajax({
			type: 'POST',
			data: 'action=read&npid=' + npid + '&custId=' + custId,
			url: '/salebynow/np.htm'
		}));		
	};

	$services.npLike = function(custId, npid){
		return($.ajax({
			type: 'POST',
			data: 'action=like&npid=' + npid + '&custId=' + custId,
			url: '/salebynow/np.htm'
		}));		
	};

	$services.npUnlike = function(custId, npid){
		return($.ajax({
			type: 'POST',
			data: 'action=unlike&npid=' + npid + '&custId=' + custId,
			url: '/salebynow/np.htm'
		}));		
	};

}(TN.services));
