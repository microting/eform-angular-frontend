const express = require('express');
const compression = require('compression');
const path = require('path');
var httpProxy = require('http-proxy');

const app = express();

// proxy
var apiProxy = httpProxy.createProxyServer();
var apiForwardingUrl = 'http://localhost:5000/';

// gzip
app.use(compression());

app.use(express.static(__dirname + '/dist'));

// api handler
app.all('/api/*', function (req, res) {
  apiProxy.web(req, res, {target: apiForwardingUrl});
});

// so that PathLocationStrategy can be used
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Start the app by listening on the default
app.listen(process.env.PORT || 80);
