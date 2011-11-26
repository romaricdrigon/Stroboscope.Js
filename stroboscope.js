/*
 * Globals
 */
	strobo = {};
	strobo.blink = 0;
	strobo.timer = null;
	strobo.frequency = 1;
	strobo.clock = null;
	strobo.running = false;

/*
 * Set the config area
 */
function setConfig() {
	$('#slider').slider({
		max: 2000,
		min: 1,
		slide: function(event, ui) {
					$('#frequency').html(ui.value+' BPM');
					strobo.frequency = ui.value;
					modifyStrobo();
				}
	});
	
	// launch (or stop) animation button
	$('button', '#launch').button(); // button withing launch div
	$('#launch').click(startStrobo);
	
	// synchronize button
	$('button', '#sync').button();
	$('#sync').click(syncStrobo);
	
	// set the two color pickers
	$('#picker1').jPicker({
		window:
		{
			expandable: true,
			position:
			{
				x: 'right',
				y: 'bottom'
			}
		},
		color:
		{
			active: new $.jPicker.Color({hex: '111111'})
		},
		images:
		{
			clientPath: 'jpicker/images/'
		}

	}, modifyStrobo); // don't forget the callback
	$('#picker2').jPicker({
		window:
		{
			expandable: true,
			position:
			{
				x: 'right',
				y: 'bottom'
			}
		},
		color:
		{
			active: new $.jPicker.Color({hex: 'ffffff'})
		},
		images:
		{
			clientPath: 'jpicker/images/'
		}

	}, modifyStrobo);
}

/*
 * Pretty straight-forward functions about the stroboscope
 */
function startStrobo() {
	blink = 0;
	
	// set stop button
	$('#launch').unbind('click'); // destroy previous handler
	$('#launch').click(stopStrobo);
	$('#launch').html('<button>Stop animation</button>');
	$('button', '#launch').button();
	
	launchStrobo();
}
function launchStrobo() {	
	$('body').each(function() {
	    strobo.timer = setInterval(function() {
	        if (strobo.blink === 0) {
				$('body').css('background', '#'+$.jPicker.List[1].color.active.val('hex'));
	            strobo.blink = 1;
	        } else {
				$('body').css('background', '#'+$.jPicker.List[0].color.active.val('hex'));
	            strobo.blink = 0;
	        }
		}, 60000/strobo.frequency);
	});
	
	strobo.running = true;
}
function stopStrobo(skipButton) {
	if (strobo.running = true) {
		$('body').each(function() {
			clearInterval(strobo.timer);
		});
		
		strobo.running = false;
	}
	
	if (skipButton != true)
	{
		// reset start button
		$('#launch').unbind('click'); // destroy previous handler
		$('#launch').click(startStrobo);
		$('#launch').html('<button>Launch animation</button>');
		$('button', '#launch').button();
	}
}
function modifyStrobo() {
	if (strobo.running == true) { // relaunch only if it was running
		stopStrobo(true);
		launchStrobo();
	}
}

/*
 * Let's the fun begin: will sync the stroboscope using time
 */
function syncStrobo() {
	strobo.clock = window.setInterval(checkTime, 1000);
}
function checkTime() {
	 var currentTime = new Date ();
	 var currentSeconds = currentTime.getSeconds ();
	 
	 if (currentSeconds === 0)
	 {
	 	modifyStrobo();
	 	window.clearInterval(strobo.clock);
	 }
}
