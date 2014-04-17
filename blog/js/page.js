$(document).ready(function(){
	
	// make sure custom.css is not cached
	$('link').each(function(){
		if ($(this).attr("href") == "css/custom.css") {
			var time = (new Date()).valueOf();
			$(this).attr("href","css/custom.css?"+time);	
		}
	});
	
	// call resizeStuff on resize
	var TO = false;
	$(window).resize(function(){
		if(TO !== false)
		clearTimeout(TO);
		TO = setTimeout(resizeStuff, 200);  
	});

	$(window).resize();
	
	//setTimeout(initPage, 400); 
	initPage();
	
	if (demolocked == false) {
		editInterface();
	} else {
		if ($('body').hasClass('infopanel')) {
			infoInterface();	
		}
	} 

	/* form input placeholder fix for browsers that do not support placeholder="".  see: https://gist.github.com/379601 */
	if(!Modernizr.input.placeholder){
	  $('[placeholder]').focus(function() {
		  var input = $(this);
	  	if (input.val() == input.attr('placeholder')) {
		  	input.val('');
			  input.removeClass('placeholder');
		  }
  	}).blur(function() {
		  var input = $(this);
		  if (input.val() == '' || input.val() == input.attr('placeholder')) {
			  input.addClass('placeholder');
			  input.val(input.attr('placeholder'));
		  }
  	}).blur().parents('form').submit(function() {
	  	$(this).find('[placeholder]').each(function() {
		  	var input = $(this);
		  	if (input.val() == input.attr('placeholder')) {
				  input.val('');
			  }
		  });
	  });
	}
	
});


