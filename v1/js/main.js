// A $( document ).ready() block.
$( document ).ready(function() {

var inst1 = 'git init';

	initUser();
	initStory(0);

  	$('input#git1').keydown(function(e) {
	    if(e.keyCode === 13) {
	      if ($(this).val() == inst1) {
	      	initStory(1);
	      	$('.terminal .content .response').html('<p>Moving on.</p>');
	      } else {
	      	$('.terminal .content .response').html('<p>Wrong.</p>');
	      }
  		  	
	    }
  	});

  	function initUser() {
  		console.log( "ready!" );

  		$.get("http://ipinfo.io", function (response) {
		    $(".ip").html(response.ip);
		    //$("#address").html("Location: " + response.city + ", " + response.region);
		    //$("#details").html(JSON.stringify(response, null, 4));
		}, "jsonp");
  	}

  	function initStory(num) {
  		var num;
  		$('.row .directions .content').html(s_dialogue[num].scene.script);
  	}
  	

});
	
