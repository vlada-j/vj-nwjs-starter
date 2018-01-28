exports.Logger = Logger;

function Logger(ele) {
	let container = ele || document.querySelector( '#Logger' );
	console.log('container', container);
	if (!container) {
		container = document.createElement('ul');
		container.id = 'Logger';
		document.body.appendChild( container );
	}
	this.container = container;

	this.errorTracking = function(enabled) {
	//	if (enabled) {
		global.WINDOW.onerror = log;
	//	} else {
	//		global.window.onerror = null;
	//	}
	};

	this.log = log;
	function log(msg) {
		let item = document.createElement('li');
		item.innerText = '' + msg;
		container.appendChild(item);
	}
}
