function TN(){
}

(function($TN){
	function setupMockjax(){
		var fr_mockjaxId = null;
		
		// mockjax for friends read list
		fr_mockjaxId = $.mockjax({
			url: '/salebynow/json.htm',
			data: 'action=findRecentStoriesFriendsRead&custid=14&type=thespecifictype&num=1&pagenum=2',
			responseTime: 750,
			responseText: {
				friendsReadList : [
				                   {
				                	   friendImageUrl:'../images/demo/photo36x26.jpg',
				                	   readComment:'Censorship and the media whose side are you on?',
				                	   friendName:'Candi Stryper'
				                   },
				                   {
				                	   friendImageUrl:'../images/demo/photo36x26.jpg',
				                	   readComment:'Censorship and the media whose side are you on?',
				                	   friendName:'Candi Stryper'
				                   },
				                   {
				                	   friendImageUrl:'../images/demo/photo36x26.jpg',
				                	   readComment:'Censorship and the media whose side are you on?',
				                	   friendName:'Candi Stryper'
				                   },
				                   {
				                	   friendImageUrl:'../images/demo/photo36x26.jpg',
				                	   readComment:'Censorship and the media whose side are you on?',
				                	   friendName:'Candi Stryper'
				                   }
				                   ]
			}
		});
		
		var fp_mockjaxId = null;
		
		// mockjax for friends posted list
		fp_mockjaxId = $.mockjax({
			url: '/salebynow/json.htm',
			data: 'action=findFriendsStoriesPublished&custid=14&type=thespecifictype&num=1&pagenum=2',
			responseTime: 750,
			responseText: {
				friendsPostedList : [
				                   {
				                	   friendImageUrl:'../images/demo/photo36x26.jpg',
				                	   postedComment:'Censorship and the media whose side are you on?',
				                	   friendName:'Candi Stryper'
				                   },
				                   {
				                	   friendImageUrl:'../images/demo/photo36x26.jpg',
				                	   postedComment:'Censorship and the media whose side are you on?',
				                	   friendName:'Candi Stryper'
				                   },
				                   {
				                	   friendImageUrl:'../images/demo/photo36x26.jpg',
				                	   postedComment:'Censorship and the media whose side are you on?',
				                	   friendName:'Candi Stryper'
				                   },
				                   {
				                	   friendImageUrl:'../images/demo/photo36x26.jpg',
				                	   postedComment:'Censorship and the media whose side are you on?',
				                	   friendName:'Candi Stryper'
				                   }
				                   ]
			}			
		});
		
		test( "Mockjax setup tests", 
				function() {
					ok( (fr_mockjaxId !== null && fr_mockjaxId >= 0), "Friends read mockjax setup." );
					ok( (fp_mockjaxId !== null && fp_mockjaxId >= 0), "Friends posted mockjax setup." );
				}
			);
		

	}
	
	function loadFriendsRead() {
		function populateFriendsReadHtml( response ){
			function getReadItemHtml(readItem){
				var dataHtml = '\
					<li>\
						<img src="' + readItem.friendImageUrl + '"/>\
						<p>' + readItem.readComment + '</p>\
						<span class="credit">'+ readItem.friendName + '</span>\
					</li>';
				return dataHtml;
			}
			
			
			test( "Friends Read Ajax call", 
					function() {
						ok( (!!response && !!response.friendsReadList && response.friendsReadList.length > 0 ), "Ajax Returned mocked or real data for Friends Read" );
					}
				);
			
			if( !!response && !!response.friendsReadList && response.friendsReadList.length > 0 ){
				var friendsReadCount = response.friendsReadList.length;
				var friendsReadItemsHtml = "";
				
				for( var i = 0; i < friendsReadCount; i++ ){
					friendsReadItemsHtml += getReadItemHtml(response.friendsReadList[i]);
				}
				
				$('#friendsReadList').append(friendsReadItemsHtml);
			}
		}
		
		$.ajax({
			type: 'GET',
			cache: false,
			url: '/salebynow/json.htm',
			data: 'action=findRecentStoriesFriendsRead&custid=14&type=thespecifictype&num=1&pagenum=2',
			dataType : 'json',
			success: populateFriendsReadHtml
		});
	}
	
	function loadFriendsPosted() {
		function popupateFriendsPostedHtml( response ){
			function getPostedItemHtml(postedItem){
				var dataHtml = '\
					<li>\
						<img src="' + postedItem.friendImageUrl + '"/>\
						<p>' + postedItem.postedComment + '</p>\
						<span class="credit">'+ postedItem.friendName + '</span>\
					</li>';
				return dataHtml;
			}
			
			
			test( "Friends Posted Ajax call", 
					function() {
						ok( (!!response && !!response.friendsPostedList && response.friendsPostedList.length > 0 ), "Ajax Returned mocked or real data for Friends Posted" );
					}
				);
			
			if( !!response && !!response.friendsPostedList && response.friendsPostedList.length > 0 ){
				var friendsPostedCount = response.friendsPostedList.length;
				var friendsPostedItemsHtml = "";
				
				for( var i = 0; i < friendsPostedCount; i++ ){
					friendsPostedItemsHtml += getPostedItemHtml(response.friendsPostedList[i]);
				}
				
				$('#friendsPostedList').append(friendsPostedItemsHtml);
			}
		}
		
		$.ajax({
			type: 'GET',
			cache: false,
			url: '/salebynow/json.htm',
			data: 'action=findFriendsStoriesPublished&custid=14&type=thespecifictype&num=1&pagenum=2',
			dataType : 'json',		
			success: popupateFriendsPostedHtml
		});
	}
	
	$TN.loadMoreFriendsRead = function(){
		loadFriendsRead();
	}
	
	$TN.loadMoreFriendsPosted = function(){
		loadFriendsPosted();
	};
	
	$TN.initialize = function(){
					
		setupMockjax();
		loadFriendsRead();
		loadFriendsPosted();
	};
	
}(TN));
