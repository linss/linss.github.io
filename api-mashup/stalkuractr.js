// Tiffany Huang
// Stephanie Lin
// Ursula Hardy
// Final-Project: Mashup App
// December 10, 2012
// This file codes an API Mashup by retrieving movie data from the Rotten Tomatoes API and 
// using that information to retrieve data from the Tumblr API to populate images onto 
// stalkuractr.html.

var IMAGES;
var TIMESTAMP;
var COUNTER;
var ACTORNAMEARRAY;
var TUMBLRSEARCH; 
var MOVIEDATA;
var MOVIECOUNTER;

$(document).ready(function() {
	$('.selectionButton').hide();
	$('#centerMessages').hide();
	$('#notRightResult').hide();
	$('#nextActorButton').click(nextClick); // Move to next actor handler
	$('#nextActorButton').click(fetchTumblr1); // Fetches next actor's pictures handler
	$('#nextMovie').click(nextMovie);
	$('#prevMovie').click(previousMovie);
	IMAGES = [];
	COUNTER = 0;
	MOVIECOUNTER = 0;
	
	// This restricts the user from entering the website if they do not enter in a query
	$('#fetchRT').click(function() {
		$('#notRightResult').hide();
		$('#resultMessage').empty();
		var search = $('#query').val();
		search = search.split(' ').join('');
		if (search != "") {
			fetchRT(); //Rotten Tomatoes click handler 
			$('#pic img').hide();
		}
	});
	
	// This allows the search query to work using the "enter" key
	$('#query').keydown(function(e) {
		if(e.which == 13) {
			$('#fetchRT').click();
		}
	});
	
	// This makes the images in the gallery pop up 
	$('#popOutPic').click(function(event) {
		hide(event);
	});
	
	// This makes the button display the images for the first actor
	$('#displayActorButton').click(function() {
		$('#displayActorButton').hide();
		displayActorImg(); // handler to display first actor's images   
		fetchTumblr1(); // handler to display images   
	});
});

// Grabs movie data from Rotten Tomatoes
function fetchRT() {
	$.ajax('http://api.rottentomatoes.com/api/public/v1.0/movies.json?', {
		data: {
			q: $('#query').val(),
			apikey: 'dzskamxu2qdrsttsjp2bgfjz',
			page_limit: '5'
		},
		dataType: 'jsonp',
		success: injectRT,
		error: ajaxError
	});
}

// Injects movie data from Rotten Tomatoes
function injectRT(data) {
	console.log(data);
	MOVIECOUNTER = 0;
	$('#nextActorButton').hide();
	$('#actorsList ul').empty();
	$('#actorsCharactersList ul').empty();
	$('#movieOutput img').remove();
	if (data.total > 0) {
		if (data.movies.length > 1) {
			$('#nextMovie').show();
			$('#notRightResult').show();
		}
		MOVIEDATA = data; 
		selectMovie(data);
		$('#resultMessage').empty();
	} else {
		$('.selectionButton').hide();
		$('#gallery').empty();
		var message = "Sorry, no results found for &quot;" + $('#query').val() + "&quot;";
		$('#resultMessage').append('<p>' + message + '</p>');
		$('#nameOfActor').html("");
		
	}
}

function selectMovie(data) {
	COUNTER = 0;
	$('#nextActorButton').hide();
	$('#actorsList ul').empty();
	$('#actorsCharactersList ul').empty();
	$('#movieOutput img').remove();
	
	var list = $('<ul>');	
	var list2 = $('<ul>').text("*Characters*");
	var actorNameList = "";
		for (var i = 0; i < data.movies[MOVIECOUNTER].abridged_cast.length; i++) {
			var actorCharacter = data.movies[MOVIECOUNTER].abridged_cast[i].characters;
			var actorSearch = data.movies[MOVIECOUNTER].abridged_cast[i].name; 
		
			//Adds each actor to the actor navigation list 
			var listpiece = $('<li>');
			listpiece.text(actorSearch); 
			actorNameList += actorSearch + ",";
			listpiece.appendTo(list);
			list.appendTo('#actorsList');
			
			//Adds each actor & their character to the movie character list
			var list2piece = $('<li>');
			list2piece.text("★ " + actorSearch + " plays " + actorCharacter); 
			list2piece.appendTo(list2);
			list2.appendTo('#actorsCharactersList');
		}
		
	if (data.movies[MOVIECOUNTER].abridged_cast.length > 0) {
		$('#displayActorButton').show();
	} else {
		$('#displayActorButton').hide();
		var listpiece = $('<li>');
		listpiece.text("No Actors Listed"); 
		listpiece.appendTo(list);
		list.appendTo('#actorsList');
	}
	
	//Inputs movie poster
	$poster = $('<img>', {'src' : data.movies[MOVIECOUNTER].posters.original});
	$poster.appendTo('#movieOutput');
	
	ACTORNAMEARRAY = actorNameList.split(',');
	
	// Adds the movie name to get the images for the movies too	
	//TUMBLRSEARCH = $('#query').val();
	TUMBLRSEARCH = data.movies[MOVIECOUNTER].title;
	$('#nameOfActor').html(TUMBLRSEARCH.toLowerCase());
	fetchTumblr1(); // Grabs movie images from Tumblr 
}

function nextMovie() {
	$('#notRightResult').hide();
	$('#prevMovie').show();
	MOVIECOUNTER++;
	if (MOVIECOUNTER >= MOVIEDATA.movies.length) {
		MOVIECOUNTER = 0;
	}
	selectMovie(MOVIEDATA);
}


function previousMovie() {
	MOVIECOUNTER--;
	if (MOVIECOUNTER < 0) {
		MOVIECOUNTER = MOVIEDATA.movies.length - 1;
	}
	selectMovie(MOVIEDATA);
}

// Displays first actor's images
function displayActorImg() {
	TUMBLRSEARCH = ACTORNAMEARRAY[0];
	$('#nameOfActor').html(TUMBLRSEARCH.toLowerCase());
	$('#actorsList ul li').eq(COUNTER).addClass('selected');
	$('#gallery').empty();
	$('#nextActorButton').show(); 
}

// Moves to next actor
function nextClick() {
	$('#actorsList ul li').eq(COUNTER).removeClass('selected');
	COUNTER++;
	if (COUNTER > ACTORNAMEARRAY.length - 2) {
		COUNTER = 0;
	}
	$('#actorsList ul li').eq(COUNTER).addClass('selected');
	changeTumblrImgs();
}

// Changes the images for the actor you want to view after you click the "Next Actor" button 
function changeTumblrImgs() {
	TUMBLRSEARCH = ACTORNAMEARRAY[COUNTER];
	// Places the actor's name on the Tumblr side 
	$('#nameOfActor').html(TUMBLRSEARCH.toLowerCase());
 	$('#actorNames ul li').eq(COUNTER).addClass('selected');
}

// Grabs Tumblr images
function fetchTumblr1() {
	TIMESTAMP = Date.now();
	$('#gallery').empty();
	setTimeout(function() {fetchTumblr(0)}, 1000);
}

// Grabs three sets of photos from Tumblr 
function fetchTumblr(count) {
	$.ajax('http://api.tumblr.com/v2/tagged?', {
		data: {
			tag: TUMBLRSEARCH, //must change to actor name
			before: TIMESTAMP,
			api_key: 'y3xqOAEXGyJelRWSlmr9YDFUwSU63THlFr1udGWTTV7elCWTYd'
		},
		dataType: 'jsonp',
		success: injectTumblr,
		error: ajaxError
	});
	if (count < 2) {
		// Prevents ajax requests from being called too quickly
		// Gives time for the previous ajax request to finish before starting the next one
		setTimeout(function() {fetchTumblr(count + 1)}, 1000); 
	}
}

// Injects Tumblr Images of actors into the gallery
// Sets TIMESTAMP
function injectTumblr(data) {
	var count = 0;
	$.each(data.response, function(i, post) {
		if (post.type == "photo") {
			$.each(post.photos, function(j, size) {	
				// Code to get the icon-sized pictures and places them in the gallery
				$.each(size.alt_sizes, function(k, icon) {
					if (icon.width == 75) {	
						count++;
						$iconpic = $('<a>', {'href' : icon.url});
						$('<img>', {'src' : icon.url}).appendTo($iconpic);
						$iconpic.appendTo('#gallery');
							
						// Adds all the original-sized images to a list of images so we can load and navigate these images
						IMAGES[IMAGES.length] = size.original_size.url;
						var length = IMAGES.length - 1;
						// Calls the function to allow the original-sized image to pop up
						$iconpic.click(function(event) {
							enlarge(event, length);
							setNavigation(length);
						});	
					} 	
				});		
			});	
		}
		TIMESTAMP = post.timestamp;
	});
	if (count == 0) {
		$('#centerMessages').show();
	} else {
		$('#centerMessages').hide();
	}

}

// Creates pop-up image from gallery image
function enlarge(event, index) {
	event.preventDefault();	// prevents hyperlink from working	
	$popup = $('<img>', {'src' : IMAGES[index]});
	$popup.appendTo('#container');
	setNavigation(index);
	$('#popOutPic').show();
}

// Hides the pop-up image if you click out of its container
function hide(event) {
	if (event.target == $('#popOutPic')[0]) {
		$('#popOutPic').hide();
		$('#container img').remove();
	}
}

// Allows the pop-up images to move forward and backward
function setNavigation(index) {
	var previous = index - 1;
	if (previous < 0) {
		previous = IMAGES.length - 1;
	}
	var nxt = index + 1;
	if (nxt == IMAGES.length) {
		nxt = 0;
	}
	
	$('#prev').unbind('click');
	$('#prev').click(function(event) {
		loadImage(event, previous);
	});
	$('#next').unbind('click');
	$('#next').click(function(event) {
		loadImage(event, nxt);
	});
	
	$('#prev').attr('href', IMAGES[previous]);
	$('#next').attr('href', IMAGES[nxt]);
}

// Loads all the images on the page
function loadImage(event, index) {
	event.preventDefault();
	$containerimg = $('#container img');
	$containerimg.attr('src', IMAGES[index]);
	setNavigation(index);
}

// Provided Ajax error handler function (displays useful debugging information).
function ajaxError(jqxhr, type, error) {
  var msg = "An Ajax error occurred!\n\n";
  if (type == 'error') {
    if (jqxhr.readyState == 0) {
      // Request was never made - security block?
      msg += "Looks like the browser security-blocked the request.";
    } else {
      // Probably an HTTP error.
      msg += 'Error code: ' + jqxhr.status + "\n" + 
             'Error text: ' + error + "\n" + 
             'Full content of response: \n\n' + jqxhr.responseText;
    }
  } else {
    msg += 'Error type: ' + type;
    if (error != "") {
      msg += "\nError text: " + error;
    }
  }
}