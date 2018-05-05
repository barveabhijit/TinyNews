(function(){
	
	var bodyElem = document.getElementsByTagName('body')[0];
	
	if( !!document.getElementById('clippedTNContainer') ){
		return;
	}
	
	var imageSources = [];
	var allImages = document.getElementsByTagName("img");
	
	if( !allImages ){
		return;
	}
	
	var imageCount = allImages.length;
	 
	function alreadyAdded( newSrc ){
		var alreadyAdded = false;
		var arrayLen = imageSources.length;
		
		for( var j = 0; j < arrayLen; j++ ){
			if( imageSources[j] === newSrc ){
				alreadyAdded = true;
				break;
			}
		}
		
		return alreadyAdded;
	}
	
	function isVisible( elem ){
		var isVisible = true;
		var currElem = elem;
		
		while ( isVisible && currElem.nodeName !== 'BODY' ){
			if( currElem.style['display'] === 'none' || currElem.style['visibility'] === 'hidden' ){
				isVisible = false;
			}
			if( isVisible ){
				currElem = currElem.parentElement;
			}
		}
		
		return isVisible;
	}
	
	function setStyle(obj,css){
		for(a in css){
			obj.style[a]=css[a];
		}
	}
	
	for( var i = 0; i < imageCount; i++ ){
		var currImage = allImages[i];
		if( isVisible(currImage) ){
			var imageSrc = currImage.src;
			if( !alreadyAdded(imageSrc) ){
				imageSources.push(imageSrc);
			}
		}
	}
	 
	if( imageSources.length > 0 ){
		var newDiv = document.createElement('div');
		var newCss = {'backgroundColor':'white', 'position':'fixed', 'top':'0', 'left':'0', 'height':'100%', 'width':'100%', 'minHeight':'100%', 'minWidth':'100%', 'filter':'alpha(opacity=98)', 'opacity':0.98, 'mozOpacity':0.98, 'zIndex':2147483647, 'overflow':'auto'};
		
		setStyle(newDiv, newCss);
		
		newDiv.id = 'clippedTNContainer';
		
		var headerDivHtml = '\
			<div style="width:100%; float:left; background-color:#059cd4;">\
				<img src="http://23.23.145.71/TinyNews/images/tn-logo.png" style="float:left"/>\
				<button onclick="document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'clippedTNContainer\')); document.getElementsByTagName(\'body\')[0].style[\'overflow\']=\'auto\';" style="float:right;">Cancel</button>\
			</div>';
		
		var numImages = imageSources.length;
		var allImagesHtml = '';
		
		for( var image = 0; image < numImages; image++ ){
			var tinyNewsUrl = 'http://204.27.59.53/newTN?imageSrc=' + escape(imageSources[image]) + '&storyUrl=' + escape(location.href);
			var currImageHtml = '<img src="' + imageSources[image] + '"' + ' onclick="var winRef = window.open(\''+ tinyNewsUrl + '\', \'TinyNews\');winRef.focus();document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'clippedTNContainer\')); document.getElementsByTagName(\'body\')[0].style[\'overflow\']=\'auto\';"' + ' style="float:left; width:156px; height:156px; margin:5px; border:solid 1px; cursor:pointer;"/>';
			allImagesHtml += currImageHtml;
		}
		
		newDiv.innerHTML = headerDivHtml + '<div>' + allImagesHtml + '</div>';
		
		bodyElem.appendChild(newDiv);
		bodyElem.style['overflow'] = 'hidden';
	}
	
//	alert(imageSources);
}());
