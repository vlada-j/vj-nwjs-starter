const { NsisCompatUpdater } = require('nsis-compat-updater');
const EventEmitter = require('events');
// const extend = require('util')._extend;

class CompatUpdater extends EventEmitter {

	constructor( settings ) {
		super();

		let self = this,
			defSett = {
			url: 'http://127.0.0.1:8080/',
			manifest: 'versions.nsis.json',
			arch: (require('os').arch() === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')) ? 'x64' : 'x86',
			version: '0.0.0'
		};

		this.settings = Object.assign( defSett, settings );
		this.updater = new NsisCompatUpdater(this.settings.url + this.settings.manifest, this.settings.version, this.settings.arch);

		this._checking = false;
		this._downloading = false;
		this._errorHandler = function(err) { self._checking = false; self.emit('error', '' + err); }
	}

//--------------------------------------------------------------------------------------------------

	check() {
		let self = this;
		if( this._checking ) { return false; }

		this.emit('status', 'start checking');
		this._checking = true;

		this.updater.checkForUpdates()
			.then( checkingSucces )
			.catch( this._errorHandler );

		function checkingSucces(version) {
			self._checking = false;
			if(version) {
				self.emit('status', `New version of ${ version.version } is available`);
				self.download(version);
			} else {
				self.emit('status', 'No new version available');
			}
		}
	}

//--------------------------------------------------------------------------------------------------

	download(version) {
		let self = this;
		if( this._downloading ) { return false; }

		self.emit('status', 'start download');
		this._downloading = true;

		this.updater.onDownloadProgress.subscribe( handleDownloadProgress );
		return this.updater.downloadUpdate(version.version)
			.then( downloadSucces )
			.catch( downloadErrorHandler );

		function handleDownloadProgress(state) {
		//	log('Downloading: ' + state.percentage + '%');
		}

		function downloadErrorHandler(err) {
			self.updater.onDownloadProgress.unsubscribe( handleDownloadProgress );
			self._downloading = false;
			self._errorHandler(err);
		}

		function downloadSucces(path) {
			self.emit('status', 'update is downloaded');
			self.updater.onDownloadProgress.unsubscribe(handleDownloadProgress);
			self._downloading = false;
			self.install(path);
		}
	}

//--------------------------------------------------------------------------------------------------

	install(path) {
		this.emit('status', 'start install');
		this.updater.quitAndInstall(path);
	}
}

module.exports = CompatUpdater;

