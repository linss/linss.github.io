/* equal heights on column regions */
function equalColumns(container) {
	
	$(container).children('.region').css("height","auto");
	if ($(container).find('.column-2').length < 1) {
		return false;	
	}
	
	if ( window.innerWidth >= 740 || $('html').hasClass('lte8') ) {
		if ( $('html').hasClass('small') ) {
			return false; // for faked responsive view	
		}
		if ($('body').hasClass('exported')) {
		  var wait = 0;
		} else {
		  var wait = 400;	
		}
		setTimeout(function(){
		  var col1 = "0";
		  var col2 = "0";
		  var col3 = "0";
		  var col4 = "0";
		  var col5 = "0";
		  $(container).children('.region').each(function(){
			  if ($(this).hasClass('column-1')) {
				  col1 = $(this).height();	
			  }
			  if ($(this).hasClass('column-2')) {
				  col2 = $(this).height();	
			  } 
			  if ($(this).hasClass('column-3')) {
				  col3 = $(this).height();	
			  }
			  if ($(this).hasClass('column-4')) {
				  col4 = $(this).height();	
			  }
			  if ($(this).hasClass('column-5')) {
				  col5 = $(this).height();	
			  }
		  });
		  var tallest = Math.max(col1,col2,col3,col4,col5);
		  if (tallest > 0) {	
			  $(container).children('.region').height(tallest);			
		  }
		}, wait);
	}
}

function checkRegionHide(location) {
	if ($(location).is('.region')) {
		location = $(location).parent();
	}  

  $(location).find('.region').each(function(){
	  var grandparent = $(this);
	  grandparent.removeClass('hide-smartphone hide-tablet hide-desktop');
	  var count = grandparent.find('.thing').not('.empty').length;
	  var smartphonecount = grandparent.find('.thing.hide-smartphone').length;
	  var tabletcount = grandparent.find('.thing.hide-tablet').length;
	  var desktopcount = grandparent.find('.thing.hide-desktop').length;
	  if (!(count > smartphonecount)) {
	  	grandparent.addClass('hide-smartphone');
	  }
    if (!(count > tabletcount)) {
	  	grandparent.addClass('hide-tablet');
	  }
    if (!(count > desktopcount)) {
	  	grandparent.addClass('hide-desktop');
	  }
	});
}

/* notes on things */
function initNotes() {
	$('.thing').each(function(){
		$(this).removeClass('has-note');
	});
	
	if ($('body').hasClass('disabled')) {
		i = 1;
		$('.thing').each(function(){
			var notetext = $(this).find('note').eq(0).text();
			notetext = notetext.replace(/^\s+/,""); // strip leading spaces
		    notetext = notetext.replace(/\s+$/,""); // strip trailing spaces
			if (notetext != "") {
			  $(this).addClass('has-note');	
			  $(this).find('note').eq(0).before('<button class="note"><span class="number">'+i+'</span></button>');
			  i++;
			}
		});
	} else {
		$('.thing').each(function(){
			$(this).find('note').removeClass('has-note');
			$(this).find('button.note').remove();
		});
	}
	$('button.note').click(function(){
		$(this).siblings('note').eq(0).slideToggle();
		$(this).toggleClass('open');
		$(this).blur();
	});
}

/* */
function initPage() {

		if (demolocked == true) {
			$('body').addClass('disabled');	
		}
		
		if (!($('body').hasClass('exported'))) {

		  $('#section-header').inc("headers/"+headerfilename,null,function(){
			  reInitThings('#section-header');	
			  if (demolocked == false) {
				  initThings($('#section-header'));	
			  }
		  });
		  
		  $('#section-menu').inc("menus/"+menufilename,null,function(){
			  reInitThings('#section-menu');
			  if (demolocked == false) {
				  initThings($('#section-menu'));	
			  }
		  });
		  
		  $('#section-footer').inc("footers/"+footerfilename,null,function(){
			  reInitThings('#section-footer');
			  if (demolocked == false) {
				  initThings($('#section-footer'));	
			  }
		  });
		  
		  reInitColumnThings($('#zone-content'));
		
		} else {
			checkRegionHide('#section-header');
			checkRegionHide('#section-menu');
			checkRegionHide('#section-footer');
      checkRegionHide('#zone-content');
		}
				
		if (demolocked == false) {
			initColumnThings($('#zone-content'));
		} 
		
		$('ul li:first-child').addClass('first');
		$('ul li:last-child').addClass('last');
    
    if ($('body').hasClass('exported')) {
			delayScripts();
		}

		// add metatitle as page <title>
		$('title').text(metatitle);

		setTimeout(initNotes,2000);
    
}
	
/* */
function resizeStuff() {
		
	if (window.innerWidth < 740) {
		$('html').removeClass('small medium large');
		$('html').addClass('small');
	} 
	
	if (Modernizr.mq('all and (min-width: 740px) and (min-device-width: 740px), (max-device-width: 800px) and (min-width: 740px) and (orientation:landscape)')) {
		$('html').removeClass('small medium large');
		$('html').addClass('medium');
	}
	
	if (Modernizr.mq('all and (min-width: 980px) and (min-device-width: 980px)')) {
		$('html').removeClass('small medium large');
		$('html').addClass('large');
	}
	
	if ( $('html').hasClass('lte8') ) {
		$('html').removeClass('small medium large');
		$('html').addClass('large');	
	}
	
	$('.column-thing-container').each(function(){
		equalColumns(this);
	});	
 
}
 
function delayScripts(){

  $('script').each(function(){
    var dtype = $(this).attr("type");
    if (dtype == "text/delayscript") {
    	var contents = $(this).html();
    	$(this).before("<script type='text/javascript'>"+contents+"</script>").end().remove();
    }
  });
 
}


/* create info box if page locked */
function infoInterface() {
	if (!($('body #editTray').length > 0)) {
		$('body').prepend('<div id="infoTray" class="editor active"><div class="notes-toggle-label">Page Notes</div><button id="notes-toggle" title="enable/disable component notes"><span class="on">On</span><span class="off active">Off</span></button><div class="size-toggle-label">Responsive Size</div><div id="size-toggle" title="change responsive size display"><a class="small">Small</a><a class="medium">Med</a><a class="large">Large</a></div><div id="templatemeta"><h2>'+metatitle+'</h2><p>'+metadescription+'</p></div></div><button id="info" class="active"><span>`</span></button>').addClass('notes-disabled');
		$('#infoTray').append('<div class="credit"><div class="proty">Built with:<a href="http://protytype.com" class="proty-icon"><img src="media/images/logo_proty.png" alt="Proty" /></a></div><div>A fine product from:</div><a href="http://forumone.com"><img src="media/images/logo_forumone.png" alt="Forum One Communications" /></a></div>');
	}
	
	$('#info').click(function(){
		$('#editTray').removeClass('open');
		$('#cog').removeClass('open')
		$('#infoTray').toggleClass('open');
		$(this).toggleClass('open');
		$(this).blur();
	});
	
	$('#notes-toggle').click(function(){
		if ($('#notes-toggle span.on').hasClass('active')) {
			$('#notes-toggle span.on').removeClass('active');
			$('#notes-toggle span.off').addClass('active')
			$('body').addClass('notes-disabled');	
		} else {
			$('#notes-toggle span.off').removeClass('active');
			$('#notes-toggle span.on').addClass('active')
			$('body').removeClass('notes-disabled');	
		}
		$(this).blur();
	});
	
	$('#size-toggle a').click(function(){
		
		if ($(this).hasClass('small')) {
			if ($('html').hasClass('ie9')) {
				var height = $(window).height()+100;
				window.resizeTo(600,height);	
			} else {
				$('html').removeClass('small medium large').addClass('small');
				$('style#style-medium').text('');
 				$('style#style-large').text('');
				$('#page').css("max-width","350px").css("margin","0 auto");
				$('.column-thing-container').each(function(){
					equalColumns(this);
				});
			}
		}
		if ($(this).hasClass('medium')) {
			if ($('html').hasClass('ie9')) {
				var height = $(window).height()+100;
				window.resizeTo(800,height);	
			} else {
				$('html').removeClass('small medium large').addClass('medium');
				$('style#style-medium').text('@import url("css/proty/proty-medium.css");');
				$('style#style-large').text('');
				$('#page').removeAttr('style');
				$('.column-thing-container').each(function(){
					equalColumns(this);
				});
			}
		}
		if ($(this).hasClass('large')) {
			if ($('html').hasClass('ie9')) {
				var height = $(window).height()+100;
				window.resizeTo(1024,height);	
			} else {
				$('html').removeClass('small medium large').addClass('large');
				$('style#style-medium').text('@import url("css/proty/proty-medium.css");');
				$('style#style-large').text('@import url("css/proty/proty-medium.css");@import url("css/proty/proty-large.css");');
				$('#page').removeAttr('style');
				$('.column-thing-container').each(function(){
					equalColumns(this);
				});
			}
		}
		
	});
}



