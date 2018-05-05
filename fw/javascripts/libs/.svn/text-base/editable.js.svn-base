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
//			$(editableTxt).css('height', $(editableElems[i]).height() + 'px');
			$(editableTxt).css('width', $(editableElems[i]).width() + 'px');
//			$(editableTxt).css('font-size', $(editableElems[i]).css('font-size'));
//			$(editableTxt).css('font-family', $(editableElems[i]).css('font-family'));
			$(editableElems[i]).parent().append(editableTxt);
			
			$(editableElems[i]).mouseover(function(){
				$(this).addClass('inactive-over');
			});
			
			$(editableElems[i]).bind('selectstart dragstart', function(evt)
					  { evt.preventDefault(); return false; });
			
			$(editableElems[i]).mouseout(function(){
				$(this).removeClass('inactive-over');
			});
			
			$(editableElems[i]).dblclick(function(){
				var jqElem = $(this);
				jqElem.addClass('active');
				var txtElem = $($(this).parent()).children('.editable-txt');
				$(txtElem).val($(this).text());
				$(txtElem).removeClass('editable-txt');
				$(txtElem).addClass('editable-txt-active');
			});
			
			function editComplete(editElem){
				editElem.removeClass('editable-txt-active');
				editElem.addClass('editable-txt');
				
				//Update the text
				var editableElem = (editElem.parent()).children('.editable');
				$(editableElem).text(editElem.val());
				$(editableElem).removeClass('active');
			}
			
			$(editableTxt).blur(function(){
				editComplete($(this));
			});
			
			$(editableTxt).keyup(function(event){
				if( event.which === 13 ){
					editComplete($(this));
				}
			});
		}
	}
};

