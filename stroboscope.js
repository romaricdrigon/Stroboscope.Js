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
    strobo.dancer = new Dancer();
    strobo.kick_config = {
        threshold: 0.001,
        frequency: [0,10],
        decay: 0.0003,
        onKick: function (mag) {
            $('body').css('background', '#'+$.jPicker.List[1].color.active.val('hex'));
            strobo.blink = 1;
        },
        offKick: function (mag) {
            $('body').css('background', '#'+$.jPicker.List[0].color.active.val('hex'));
            strobo.blink = 0;
        }
    };
    strobo.kick = strobo.dancer.createKick(strobo.kick_config);

/*
 * Set the config area
 */
function setConfig() {
    /*
        Common controls
     */

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

    // save values when user leaves the page
    window.onbeforeunload = function() {
        // we save editor content to localStorage
        if (localStorage) {
            localStorage['frequency'] = strobo.frequency;
            localStorage['kick_config'] = JSON.stringify(strobo.kick_config);
            localStorage['picker0'] = $.jPicker.List[0].color.active.val('hex');
            localStorage['picker1'] = $.jPicker.List[1].color.active.val('hex');

            return "Do you really want to end the party?\nYour settings were saved to localStorage";
        }

        return "Do you really want to end the party?\nYou will lost your settings!";
    };
    // and load saved settings
    if (localStorage) {
        if (localStorage['frequency']) {
            strobo.frequency = localStorage['frequency'];
            strobo.kick_config = JSON.parse(localStorage['kick_config']);
            $.jPicker.List[0].color.active.val('hex', localStorage['picker0']);
            $.jPicker.List[1].color.active.val('hex', localStorage['picker1']);

            // set texts
            $('#frequency').html(strobo.frequency+' BPM');
            $('#beat-threshold').html('Threshold: '+strobo.kick_config.threshold);
            $('#beat-frequency').html('Frequency: '+strobo.kick_config.frequency+' kHz');
            $('#beat-decay').html('Decay: '+strobo.kick_config.decay);
        }
    }

    /*
        Controls for manual mode
     */

	// create the slider
	$('#slider').slider({
		max: 2000,
		min: 1,
        value: strobo.frequency,
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

    /*
        Controls for microphone mode
     */

    // beat button
    $('button', '#beat').button();
    $('#beat').click(beatStrobo);

    // threshold slider
    $('#slider-threshold').slider({
        max: 0.5,
        min: 0.001,
        step: 0.001,
        slide: function(event, ui) {
            $('#beat-threshold').html('Threshold: '+ui.value);
            strobo.kick_config.threshold = ui.value;
            configKick();
        }
    });

    // frequency slider
    $('#slider-frequency').slider({
        max: 400,
        min: 0,
        step: 1,
        slide: function(event, ui) {
            $('#beat-frequency').html('Frequency: '+ui.value+' kHz');
            strobo.kick_config.frequency = ui.value;
            configKick();
        }
    });

    // threshold slider
    $('#slider-decay').slider({
        max: 0.5,
        min: 0.0001,
        step: 0.0001,
        slide: function(event, ui) {
            $('#beat-decay').html('Decay: '+ui.value);
            strobo.kick_config.decay = ui.value;
            configKick();
        }
    });

    // reset [0 - 10] link
    $('#reset-frequency').on('click', function(e) {
        e.preventDefault();
        strobo.kick_config.frequency = [0,10];
        configKick();
        $('#beat-frequency').html('Frequency: [0,10] kHz');
    });

    /*
        Open!
     */
	
	// open it as a dialog
	$( "#config" ).dialog({
		autoOpen: true,
		minWidth: 250,
		width: 350,
		minHeight: 180
	});

	// link to the button
	$('#open')
        .button({icons: {primary: 'ui-icon-extlink'}})
	    .click(function() {$('#config').dialog('open'); return false;});
}

/*
 * Pretty straight-forward functions about the stroboscope
 */
function startStrobo() {
	strobo.blink = 0;
	
	// set stop button
	$('#launch')
        .unbind('click')
	    .click(stopStrobo)
	    .html('<button>Stop animation</button>');
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
		$('#launch')
            .unbind('click') // destroy previous handler
		    .click(startStrobo)
		    .html('<button>Launch animation</button>');
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
    // set stop button
    $('#beat')
        .unbind('click')
        .click(pauseBeat)
        .html('<button>Stop animation</button>');
    $('button', '#beat').button();

    strobo.kick.on();
    strobo.dancer.load({microphone: true});
    strobo.running = true;
    strobo.dancer.play(); // same bug even without
}
function configKick() {
    strobo.kick.set(strobo.kick_config);
}
function pauseBeat() {
    strobo.running = false;

    $('#beat')
        .unbind('click')
        .click(beatStrobo)
        .html('<button>Resume animation</button>');
    $('button', '#beat').button();

    strobo.kick.off();
}