var express = require('express'),
    params = require('express-params'),

    contacts = require('./contacts'),

    Bundle = require('./bundle').Bundle,
    bundleIndex = new Bundle('index'),

    app = express();

app.use(express.static(__dirname));
app.use(express.static(bundleIndex.path));
params.extend(app);

app.param('id', Number);

app.get('/:id?', bundleIndex.make(), sendContactsHTML);
app.get('/api/contacts/:id?', sendContactsJSON);
['/.bemjson', '/:id.bemjson'].forEach(function(route) { app.get(route, bundleIndex.make(), sendContactsBEMJSON); });

app.listen(3000, function() {
    console.log('Express server listening on port 3000');
});

/**
 * Отправить сформированный HTML
 * @param req
 * @param res
 */
function sendContactsHTML(req, res) {
    sendContacts(req, res, function(bemjson) {
        return bundleIndex.BEMHTML.apply(bemjson);
    });
}

/**
 * Отправить сформированный BEMJSON
 * @param req
 * @param res
 */
function sendContactsBEMJSON(req, res) {
    sendContacts(req, res, function(bemjson) {
        return '<pre>' + JSON.stringify(bemjson, null, 4) + '</pre>';
    });
}

/**
 * Отправить JSON с данными по контактам или одному контакту
 * @param req
 * @param res
 */
function sendContactsJSON(req, res) {
    contacts.getContacts(req, function(data) {
        res.send(data);
    });
}

/**
 * Отправить HTML-страницу с контактами
 * @param req
 * @param res
 * @param {Function} sender Колбек определяющий преобразование BEMJSON в отправляемые данные
 */
function sendContacts(req, res, sender) {

    contacts.getContacts(req, function(data) {

        var indexPage = data.length > 1,

            params = {
                block: 'page',
                js: bundleIndex.jsFileName,
                css: bundleIndex.cssFileName,
                title: indexPage ? 'Все контакты' : data[0].name,
                index: indexPage,
                contacts: data
            };

        return bundleIndex.BEMTREE.apply(params).then(function(bemjson) {
            res.send(sender.call(this, bemjson));
        });
    });
}
