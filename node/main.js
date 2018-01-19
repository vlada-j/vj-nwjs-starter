var gui = require('nw.gui');

document.querySelector('#Info').innerText =
    'NodeJS: ' + process.versions.node +
    '\nNW: ' + process.versions.nw +
    '\nChromium: ' + process.versions.chromium;

console.log('nw.gui', gui);