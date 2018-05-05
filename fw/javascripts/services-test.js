if (!TN) var TN= {};
if(!TN.services) TN.services = {};

(function($services){
	$.ajaxSetup({
		cache: false,
		dataType : 'json',
		error : function( jqXhr, textStatus, errorThrown ){
			alert(errorThrown);
		},
	});
	
	$services.getFittingRoomRequest = function(custId, messageId){
		test('getFittingRoomRequest - parameter validation', function(){
			ok(!!custId, 'custId is valid');
			ok(!!messageId, 'messageId is valid');
		});
		
		return($.ajax({
			type: 'GET',
			data: 'action=getFittingRoomRequest&custid=' + custId + '&msgid=' + messageId,
			url : '/salebynow/json.htm'
		}));
	};
}(TN.services));