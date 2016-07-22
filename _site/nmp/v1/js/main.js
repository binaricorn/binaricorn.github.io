// A $( document ).ready() block.
$( document ).ready(function() {

var inst1 = 'git init';

	initUser();
	initStory(0);

	$('button').on('click', function() {
		$('.story .content').html(story[1].scene.script);		
	});

  	$('input#git1').keydown(function(e) {
	    if(e.keyCode === 13) {
	      if ($(this).val() == inst1) {
	      	initStory(2);
	      	$('.directions .content').html(directions[1].scene.script);
	      } else {
	      	$('.directions .content').html("<p>Wrong, try again.</p>");
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
  		$('.directions .content').html(directions[num].scene.script);
  		$('.story .content').html(story[num].scene.script);
  	}
  	
  	$(function() {
	    $('body').on('mousedown', '.directions', function() {
	        $(this).addClass('draggable').parents().on('mousemove', function(e) {
	            $('.draggable').offset({
	                top: e.pageY - $('.draggable').outerHeight() / 2,
	                left: e.pageX - $('.draggable').outerWidth() / 2
	            }).on('mouseup', function() {
	                $(this).removeClass('draggable');
	            });
	        });
	        e.preventDefault();
	    }).on('mouseup', function() {
	        $('.draggable').removeClass('draggable');
	    });
	});

});
	
