let gui = require('nw.gui');
let win = gui.Window.get();


// SETUP LOGGER
const {Logger} = require('../node/logger.js');

let logger = new Logger(document.querySelector('#Logger'));
logger.errorTracking(true);
global.module.paths.forEach(logger.log);

//--------------------------------------------------------------------------------------------------

// SETUP UPDATER
const Updater = require('../node/compat-updater.js');
let updater = new Updater( { version: nw.App.manifest.version } );
updater.on('status', function(status){ logger.log('Updater status: ' + status); });
updater.on('error', function(error){ logger.log('Updater error: ' + error); });

//--------------------------------------------------------------------------------------------------

// SETUP MENU BAR
let menubar = {
	'Help': {
		'Update': function() { updater.check(); },
		'DevTool': win.showDevTools,
		'About': function() { alert(nw.App.manifest.name + ' ' + nw.App.manifest.version); }
	}
};
gui.Window.get().menu = require('../node/menubar')(menubar, gui);


//--------------------------------------------------------------------------------------------------

// MAIN
// win.enterFullscreen();
// win.leaveFullscreen();
// win.enterKioskMode();
// win.leaveKioskMode();
win.resizeTo(800,600);
win.maximize();
// win.showDevTools();
win.setProgressBar(.5);


document.querySelector('#Info').innerText =
	'NodeJS: ' + process.versions.node +
	'\nNW: ' + process.versions.nw +
	'\nChromium: ' + process.versions.chromium;







// CONTEXT MENU
var menu = new nw.Menu();

// Add some items
menu.append(new nw.MenuItem({ label: 'Item A' }));
menu.append(new nw.MenuItem({ label: 'Item B' }));
menu.append(new nw.MenuItem({ type: 'separator' }));
menu.append(new nw.MenuItem({ label: 'Item C' }));

// nw.Window.get().menu = menu;
document.body.addEventListener('contextmenu', function(ev) {
	ev.preventDefault();
	menu.popup(ev.x, ev.y);
	return false;
});