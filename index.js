var path = require('path'),
    express = require('express'),
    params = require('express-params'),
    app = express(),

    bundlesPath = path.join(__dirname, 'desktop.bundles'),
    bundleName = 'index',
    bundlePath = path.join(bundlesPath, bundleName),
    bundleBEMHTMLPath = path.join(bundlePath, bundleName + '.bemhtml.js'),
    bundleBEMTREEPath = path.join(bundlePath, bundleName + '.bemtree.js'),

    BEMHTML = require(bundleBEMHTMLPath).BEMHTML,
    BEMTREE = require(bundleBEMTREEPath).BEMTREE;

app.use(express.static(bundlePath));
params.extend(app);

app.param('id', Number);

app.get('/:id?', response);
['/.bemjson', '/:id.bemjson'].forEach(function(route) {
    app.get(route, responseBemjson);
});

app.listen(3000, function() {
    console.log('Express server listening on port 3000');
});

function response(req, res) {
    BEMTREEApply(req, res, function(bemjson) {
        return BEMHTML.apply(bemjson);
    });
}

function responseBemjson(req, res) {
    BEMTREEApply(req, res, function(bemjson) {
        return '<pre>' + JSON.stringify(bemjson, null, 4) + '</pre>';
    });
}

function BEMTREEApply(req, res, cb) {

    BEMTREE.bundleName = bundleName;
    BEMTREE.id = req.params.id;

    BEMTREE.apply().then(function(bemjson) {
        res.send(cb.call(this, bemjson));
    });
}
