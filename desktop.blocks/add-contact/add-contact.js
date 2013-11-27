modules.define('i-bem__dom', ['jquery', 'BEMHTML'], function(provide, $, BEMHTML, BEMDOM) {

/**
* @namespace
* @name Add-contact
*/
BEMDOM.decl('add-contact', /** @lends Add-contact.prototype */ {}, /** @lends Add-contact */ {

    live: function() {

        this
            .liveBindTo('button', 'click', function() {

                $.ajax('/api/contacts').done(function(data) {

                    var contact = data[Math.floor(Math.random() * data.length)];

                    contact.block = 'contact';

                    this.emit('add', {
                        html: BEMHTML.apply(contact)
                    });

                }.bind(this));
            });

        return false;
    }

});

provide(BEMDOM);

});
