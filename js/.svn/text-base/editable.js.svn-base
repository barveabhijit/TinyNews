/**
 * A class to turn a static text element into an editable element. 
 * 
 * When initEditiables is called it searches for all 'editable' elements in the document and applies
 * the necessary events and creates a hidden text field. 
 * 
 * Editable will also carry across font styling to the input field
 */
var Editable = {
		
	initEditiables: function(){
		var editableElems =  $('.editable');
		
		for(var i = 0; i < editableElems.length; i++){
			
			var editableTxt = $('<input type="text" class="editable-txt"/>');
			
			//Copy the styles from editable
			$(editableTxt).css('height', $(editableElems[i]).height() + 'px');
			$(editableTxt).css('width', $(editableElems[i]).width() + 'px');
			$(editableTxt).css('font-size', $(editableElems[i]).css('font-size'));
			$(editableTxt).css('font-family', $(editableElems[i]).css('font-family'));
			$(editableElems[i]).parent().append(editableTxt);
			
			$(editableElems[i]).mouseover(function(){
				$(this).addClass('inactive-over');
			});
			
			$(editableElems[i]).mouseout(function(){
				$(this).removeClass('inactive-over');
			});
			
			$(editableElems[i]).click(function(){
				$(this).addClass('active');
				var txtElem = $($(this).parent()).children('.editable-txt');
				$(txtElem).val($(this).text());
				$(txtElem).removeClass('editable-txt');
				$(txtElem).addClass('editable-txt-active');
				$(txtElem).focus();
			});
			
			$(editableTxt).blur(function(){
				$(this).removeClass('editable-txt-active');
				$(this).addClass('editable-txt');
				
				//Update the text
				var editableElem = ($(this).parent()).children('.editable');
				$(editableElem).text($(this).val());
				$(editableElem).removeClass('active');
			})
		}
	}
};

