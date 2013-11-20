modules.define('i-bem__dom', ['jquery', 'BEMHTML'], function(provide, $, BEMHTML, DOM) {

/**
* @namespace
* @name Add-contact
*/
DOM.decl('add-contact', /** @lends Add-contact.prototype */ {}, /** @lends Add-contact */ {

    live : function() {

        this
            .liveBindTo('button', 'click', function() {

                var that = this;

                $.ajax('/api/contacts').done(function(data) {

                    var contact = data[Math.floor(Math.random() * data.length)];

                    contact.block = 'contact';

                    that.emit('add', {
                        html: BEMHTML.apply(contact)
                    });
                });
            });

        return false;
    }

});

provide(DOM);

});
