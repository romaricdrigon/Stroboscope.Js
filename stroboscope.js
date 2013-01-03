/*
 * Stroboscope.js
 * Code by Romaric Drigon
 * http://github.com/romaricdrigon/
 */


/*
 * Globals
 */
	strobo = {};
	strobo.blink = 0;
	strobo.timer = null;
	strobo.frequency = 1;
	strobo.running = false;

/*
 * Set the config area
 */
function setConfig() {	
	// create the slider
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

    // beat button
    $('button', '#beat').button();
    $('#beat').click(beatStrobo);
	
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
	
	// open it as a dialog
	$( "#config" ).dialog({
		autoOpen: true,
		minWidth: 250,
		width: 350,
		minHeight: 180
	});

	// link to the button
	$('#open').button({icons: {primary: 'ui-icon-extlink'}});
	$('#open').click(function() {$('#config').dialog('open'); return false;});
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
	// change background color
	if (strobo.blink == 0) {
		$('body').css('background', '#'+$.jPicker.List[0].color.active.val('hex'));
	} else {
		$('body').css('background', '#'+$.jPicker.List[1].color.active.val('hex'));		
	}
	
	if (strobo.running == true) { // relaunch only if it was running
		stopStrobo(true);
		launchStrobo();
	}
}

/*
 * Sync the stroboscope using time
 */
function syncStrobo() {
	if (strobo.running === true) {
		// will run during max 1 second, to sync the chrono
		var _i = 0; // in case unable to get time, to prevent from an undefinite loop
		while (((new Date().getMilliseconds() % 100) != 0) && (_i < 10000000)) {
			_i++;
		}
	
		modifyStrobo();
	}
}

/*
 * Let's dance!
 * Sync with music BPM
 */
function beatStrobo() {
    var
        dancer = new Dancer(),
        kick = dancer.createKick({
            onKick: function (mag) {
                console.log('kick');
                //$('body').css('background', '#'+$.jPicker.List[1].color.active.val('hex'));
            },
            offKick: function (mag) {
                console.log('off');
                //$('body').css('background', '#'+$.jPicker.List[0].color.active.val('hex'));
            }
        }).on(); // and kick in!

    dancer.load({microphone: true});
    dancer.play(); // same bug even without
}