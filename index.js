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

app.get('/:id?', bundleIndex.make(), sendContacts);
app.get('/api/contacts/:id?', sendContactsJSON);

app.listen(3000, function() {
    console.log('Express server listening on port 3000');
});

/**
 * Отправить HTML-страницу с контактами
 * @param req
 * @param res
 */
function sendContacts(req, res) {

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
            res.send(bundleIndexInfo.BEMHTML.apply(bemjson));
        });
    });
}

/**
 * Отправить JSON с данными по контактам или одному контакту
 * @param req
 * @param res
 */
function sendContactsJSON(req, res) {
    contacts.getContacts(req, function(data) {
        res.header('Content-Type', 'application/json');
        res.send(data);
    });
}
