// let gui = require('nw.gui');

module.exports = Menubar;

function Menubar(data, gui) {
	let menubar = new gui.Menu({ type: 'menubar' });

	data = reformat( data );

	console.log('menu data', data);

	createItems(data, menubar);

	return menubar;


//--------------------------------------------------------------------------------------------------

	function createItems(items, parent) {
		items.forEach(function(itemData) {
			let itemOption = {
				label: itemData.label
			};

			if( itemData.submenu ) { itemOption.submenu = createSubmenu( itemData.submenu ); }
			if( itemData.click ) { itemOption.click = itemData.click; }

			parent.append( new nw.MenuItem( itemOption ) );
		});
	}

//--------------------------------------------------------------------------------------------------

	function createSubmenu(subData) {
		let submenu = new nw.Menu();

		createItems(subData, submenu);

		return submenu;
	}

//--------------------------------------------------------------------------------------------------

	function reformat(d) {
		let reformated = [];

		Object.keys(d).forEach(function(key) {
			let value = d[key];
			let item = {};

			item.label = key;
			typeof value === 'function' ? item.click = value : 0;
			typeof value === 'object' ? item.submenu = reformat(value) : 0;

			reformated.push(item);
		});

		return reformated;
	}

/*	var your_menu = new gui.Menu({ type: 'menubar' });
	var submenu = new nw.Menu();
	submenu.append(new nw.MenuItem({ label: 'Item A' }));
	submenu.append(new nw.MenuItem({ label: 'Item B' }));

// Create and append the 1st level menu to the menubar
	menubar.append(new nw.MenuItem({
		label: 'First Menu',
		submenu: submenu
	}));*/
}
