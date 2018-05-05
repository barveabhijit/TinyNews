if(!TN) var TN = {};
if (!TN.utils) TN.utils = {};

(function($utils){
	if(!$utils.itemDetails){
		$utils.itemDetails = {};
	}
	
	$utils.storeDetailItem = function(messageId, itemDetailStruct, countersObject){
		if(!$utils.itemDetails[messageId]){
			$utils.itemDetails[messageId] = {};
		}
		$utils.itemDetails[messageId] = itemDetailStruct;
		$utils.itemDetails[messageId].counters = countersObject;
		return itemDetailStruct;
	};
	
	$utils.getDetailItem = function(messageId){
		return $utils.itemDetails[messageId];
	};

    $utils.deleteDetailItem = function(messageId){
        delete TN.utils.itemDetails[messageId];
    };

    $utils.getBaseUrl = function(url){
		return(url.split('?')[0]);		
	};
	
	$utils.centerAndShowPopup = function(popupElem){
		var refElem = $(window);
		
		popupElem.css('top', refElem.scrollTop()).css('left', refElem.scrollLeft() + (refElem.width()-popupElem.width())/2).show();
	};
	
	// Source for getCookie and setCokie functions:
	// http://www.w3schools.com/js/js_cookies.asp
	$utils.getCookie = function(c_name) {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++) {
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if (x==c_name) {
				return unescape(y);
		    }
		}
	 };
	 
	 $utils.setCookie = function(c_name,value,exdays,duration) {
		 var exdate=new Date();
		 exdate.setDate(exdate.getDate() + exdays);
		 var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString()) + ((duration==null) ? "" : "; max-age="+duration) + "; path=/";
		 document.cookie=c_name + "=" + c_value;
	 };
	 
	 $utils.getQueryStringParam = function(paramName){
		var query = window.location.search.substring(1);
		var parms = query.split('&');
		for (var i=0; i<parms.length; i++) {
			var pos = parms[i].indexOf('=');
			if (pos > 0  && paramName == parms[i].substring(0,pos)) {
				return parms[i].substring(pos+1);;
			}
		}
		return "";
	 };
	 
	 $utils.setHeader = function(signedIn) {
	 	if( !!signedIn ){
	 		$("#headerNav").find(".register, .last").hide();
            $("#headerNav").find(".notifications, .add, .user, .last.signout, .verticalbar").show();
            $("#firstname").text(TN.userInfo.firstName);
            $("#userthumb").attr("src", TN.userInfo.profileThumbPicUrl);
			TN.utils.setCookie("TNUserName", TN.userInfo.firstName, 15);
			TN.utils.setCookie("TNUserUrl", TN.userInfo.profileThumbPicUrl, 15);
	 	}
	 	else {
	 		$("#headerNav").find(".register, .last, .verticalbar").show();
	 		$("#headerNav").find(".notifications, .add, .user, .last.signout").hide();
	 		$("#firstname").text("");
            $("#userthumb").attr("src", "#");
            $('#trendingLoader').hide();
            $('#content').addClass('showOpaque');
	 	}
	 };

    $utils.isBlank = function(str) {
        return (!str || /^\s*$/.test(str));
    };

    // Normalizes (sets) width and height of a given img element to defined target
    // window width and height according to Greg's algorithm
    $utils.normalizeImage = function(elem, windowW, windowH){
        var origWidthFactor = elem.width/elem.height;
        var windowWidthFactor = windowW/windowH;
        var jqElem = $(elem);
        if( origWidthFactor > windowWidthFactor ){
            jqElem.css('height', windowH+'px');
            var trailingWidth = jqElem.width() - windowW;
            if (trailingWidth > 1) jqElem.css('position', 'relative').css('right', trailingWidth/2);
        }
        else if( origWidthFactor < windowWidthFactor ){
            jqElem.css('width', windowW+'px');
        }
        else {
            jqElem.css('height', windowH+'px');
            jqElem.css('width', windowW+'px');
        }
        jqElem.show();
    };

    // Cross-browser setting of caret position: http://stackoverflow.com/a/12518737
    $utils.setCaretPosition = function(elemId, caretPos){
	    var el = document.getElementById(elemId);

	    el.value = el.value;
	    // ^ this is used to not only get "focus", but
	    // to make sure we don't have it everything -selected-
	    // (it causes an issue in chrome, and having it doesn't hurt any other browser)

	    if (el !== null) {

	        if (el.createTextRange) {
	            var range = el.createTextRange();
	            range.move('character', caretPos);
	            range.select();
	            return true;
	        }

	        else {
	            // (el.selectionStart === 0 added for Firefox bug)
	            if (el.selectionStart || el.selectionStart === 0) {
	                el.focus();
	                el.setSelectionRange(caretPos, caretPos);
	                return true;
	            }

	            else  { // fail city, fortunately this never happens (as far as I've tested) :)
	                el.focus();
	                return false;
	            }
	        }
	    }
	};
    	
    $utils.setDropdownValue = function(dropdownElem, value){
		dropdownElem.find('.current').text(value);
		dropdownElem.find('.selected').removeClass('selected');
		dropdownElem.find('li:contains(' + value + ')').addClass('selected');
    };

}(TN.utils));