var express = require('express'),
    params = require('express-params'),

    contacts = require('./contacts'),

    Bundle = require('./bundle').Bundle,
    bundleIndex = new Bundle('index'),
    bundleIndexInfo = bundleIndex.getInfo(),

    app = express();

app.use(express.static(__dirname));
app.use(express.static(bundleIndexInfo.bundlePath));
params.extend(app);

app.param('id', Number);

app.get('/:id?', bundleIndex.make(), sendContactsHTML);
app.get('/api/contacts/:id?', sendContactsJSON);
['/.bemjson', '/:id?.bemjson'].forEach(function(route) { app.get(route, sendContactsBEMJSON); });

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
        return bundleIndexInfo.BEMHTML.apply(bemjson);
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
                js: bundleIndexInfo.jsFile,
                css: bundleIndexInfo.cssFile,
                title: indexPage ? 'Все контакты' : data[0].name,
                addButton: indexPage,
                contacts: data
            };

        return bundleIndexInfo.BEMTREE.apply(params).then(function(bemjson) {
            res.send(sender.call(this, bemjson));
        });
    });
}
