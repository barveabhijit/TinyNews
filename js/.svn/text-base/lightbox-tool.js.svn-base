/**
 * An abstract class to create a lightbox and display exactly the content
 * passed in via the lightboxHTML argument.
 * 
 * Currently the options argument supports to parameters:
 * 
 * showHeader: If true then the header with the 'X' to close will be displayed.
 * width: An integer value representing the width of the lightbox in pixels. Defaults to 500.
 * 
 */
var LightboxTool = {
		
		displayLightbox: function(lightboxHTML, options){
			
			var bodyElem = $('body');
			
			var lightboxSplashScreen = $('<div id="lightboxCanvas"></div>');
			
			var lightboxContainer = $('<div class="lighboxContainer"></div>');
			var lightbox = $('<div class="lightbox"></div>');
			
			if(options && options.showHeader){
				$(lightbox).append('<div class="lightboxHeader block"><div id="btnClosepage"></div></div>');
				
				$(lightbox).find('#btnClosepage').click(function(){				
					LightboxTool.close();
				});
			}
			
			var lightboxContent = $('<div class="lightboxContent"></div>');
			$(lightboxContent).append(lightboxHTML);
			
			var lightboxSection = $('<section></section>');
			lightboxSection.append(lightboxContent);
			
			$(lightbox).append(lightboxSection);
			$(lightboxContainer).append(lightbox);
			
			
			var width = options.width || 500; //Default width of 500.
			
			lightboxContainer.css('top', $(window).scrollTop());
			lightboxContainer.css('left', $(window).scrollLeft() + ($(window).width() - width)/2);	
			lightboxContainer.css('width', width + 'px');

			lightboxSplashScreen.hide();
			lightboxContainer.hide();

			$(bodyElem).append(lightboxSplashScreen);
			$(bodyElem).append(lightboxContainer);
			
			lightboxSplashScreen.fadeIn('fast');
			lightboxContainer.fadeIn('fast');

			lightboxSplashScreen.click(function(){
				LightboxTool.close();
			});
		},
		close: function(){
			$('.lighboxContainer, #lightboxCanvas').fadeOut('fast', function(){
				$('#lightboxCanvas').remove();
				$('.lighboxContainer').remove();
			});
		}
}