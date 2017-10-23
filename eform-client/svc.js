var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name: 'eForm angular($$serviceName$$)',
  description: 'eForm angular frontend application',
  script: 'server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  console.log('Installation complete.');
  console.log('The service exists: ', svc.exists);
  svc.start();
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

var args = process.argv.slice(2);
switch (args[0]) {
  case 'install':
    console.log('Service will be installed');
    svc.install();
    break;
  case 'uninstall':
    console.log('Service will be uninstalled');
    svc.uninstall();
    break;
}
