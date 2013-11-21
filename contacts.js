var mongodb = require('mongodb'),
    vow = require('vow');

/**
 * Получить данные по контактам в JSON
 * @param req
 * @param {Function} callback Функция будет вызвана с аргументом полученных данных
 */
function getContacts(req, callback) {

    var promise = vow.promise();

    mongodb.MongoClient.connect('mongodb://localhost/dynamic-bem-site', function(err, db) {
        if(err) throw err;

        db.collection('contacts').find().toArray(function(err, data) {
            if(err) throw err;

            promise.fulfill(req.params.id !== undefined ? [data[req.params.id]] : data);
        });
    });

    vow.when(promise).then(callback).done();
}

module.exports.getContacts = getContacts;
