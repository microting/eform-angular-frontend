const express = require('express');
const compression = require('compression');
const path = require('path');
var httpProxy = require('http-proxy');
const app = express();
const defaultPort = $$port$$;

// proxy
var apiProxy = httpProxy.createProxyServer();
var apiForwardingUrl = 'http://localhost:$$apiport$$/';
apiProxy.on('error', function(e) {
  console.error('Error:');
  console.info(e);
  console.log('-------------------------------------');
});

// gzip
app.use(compression());
app.use(express.static(__dirname + '/dist'));

// api handler
app.all('/api/*', function (req, res) {
  try {
    apiProxy.web(req, res, {target: apiForwardingUrl});
  } catch (ex) {
    return next(ex)
  }
});

// so that PathLocationStrategy can be used
app.all('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Start the app by listening
app.listen(defaultPort, function () {
  console.log('Application started on port: ' + defaultPort);
});
