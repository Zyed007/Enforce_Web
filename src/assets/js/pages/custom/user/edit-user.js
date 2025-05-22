// "use strict";

// // Class definition
// var KTUserEdit = function () {
// 	// Base elements
// 	var avatar;
	 
// 	var initUserForm = function() {
// 		avatar = new KTAvatar('kt_user_edit_avatar');
// 	}	

// 	return {
// 		// public functions
// 		init: function() {
// 			initUserForm(); 
// 		}
// 	};
// }();

// jQuery(document).ready(function() {	
// 	KTUserEdit.init();
// });
// $('.btnNext').click(function(){
// 		$('.nav-tabs > .active').next('li').find('a').trigger('click');
// 	  });
	  
// 		$('.btnPrevious').click(function(){
// 		$('.nav-tabs > .active').prev('li').find('a').trigger('click');
// 	  });
$(document).ready(function(){

	// $(".nav-tabs li a[data-toggle=tab]").on("click",function(e){
	
	// 	  e.preventDefault();
		  
	// 	  if($(this).parent('li').is(':last-child'))
	// 	  {
	// 		$('.tab-button').hide();
	// 	  }
	// 	  else
	// 	  {
	// 		$('.tab-button').show();
	// 	  }
		
	// 		$('.nav-tabs li:eq(1) a').tab('show');
	
	// 		$("[class='btn btn-large btn-block btn-success disabled']").removeClass("btn btn-large btn-block btn-success disabled");
	// 		$(this).addClass("btn btn-large btn-block btn-success disabled");
	
	// });
	$('.prevtab-button').click(function(){
	
		$("[class='nav-link active']").parent('li').prev().find('a').trigger('click');
	   
	   });
	
	$('.tab-button').click(function(e){
		console.log('tab')
		e.preventDefault()
	  $("[class='nav-link active']").parent('li').next().find('a').trigger('click');
	// $('[href="#kt_user_edit_tab_2"]').tab('show');
	});
	});// 	});
