/*
 * Globals
 */
	strobo = {};
	strobo.blink = 0;
	strobo.timer = null;
	strobo.frequency = 1;

/*
 * Set the config area
 */
function setConfig() {
	$('#slider').slider({
		max: 720,
		min: 1,
		slide: function(event, ui) {
					$('#frequency').html(ui.value+' BPM');
					strobo.frequency = ui.value;
					modifyStrobo();
				}
	});
	
	$('button', '#launch').button(); // button withing launch div
	$('#launch').click(launchStrobo);
}

function launchStrobo(skipButton) {
	blink = 0;
	
	if (skipButton == true)
	{
		// set stop button
		$('#launch').unbind('click'); // destroy previous handler
		$('#launch').click(stopStrobo);
		$('#launch').html('<button>Stop animation</button>');
		$('button', '#launch').button();
	}
	
	$('body').each(function() {
	    strobo.timer = setInterval(function() {
	        if (strobo.blink === 0) {
				$('body').css('background', 'white');
	            strobo.blink = 1;
	        } else {
				$('body').css('background', '#111');
	            strobo.blink = 0;
	        }
		}, 60000/strobo.frequency);
	})
}

function stopStrobo(skipButton) {
	$('body').each(function() {
		clearInterval(strobo.timer);
	})
	
	if (skipButton == true)
	{
		// reset start button
		$('#launch').unbind('click'); // destroy previous handler
		$('#launch').click(launchStrobo);
		$('#launch').html('<button>Launch animation</button>');
		$('button', '#launch').button();
	}
}

function modifyStrobo() {
	stopStrobo(true);
	launchStrobo(true);
}
