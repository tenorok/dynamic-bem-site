var mongo = require('mongodb'),
    fs = require('fs'),

    database = 'dynamic-bem-site',
    collection = 'contacts';

mongo.MongoClient.connect('mongodb://localhost/' + database, function(err, db) {
    if(err) throw err;

    fs.readFile(__dirname + '/data.json', function(error, data) {
        db.collection(collection).insert(JSON.parse(data), function(err, records) {
            if(err) throw err;

            console.log('Created database: ' + database);
            console.log('Created collection: ' + collection);
            console.log('Records count: ' + records.length);
            db.close();
        });
    });
});
