modules.define('i-bem__dom', function(provide, DOM) {

/**
 * @namespace
 * @name Contacts
 */
DOM.decl('contacts', /** @lends Contacts.prototype */ {

    onSetMod : {

        js : {
            inited : function() {
                this.listenShowContact();
                this.listenAddContact();
            }
        }

    },

    /**
     * Подписаться на событие разворачивания детальной информации по контакту
     */
    listenShowContact : function() {

        this._contacts = this.findBlocksInside('contact');

        var that = this;
        this._contacts.forEach(function(contact) {
            contact.on('show', that.hideAllDetails.bind(that));
        });
    },

    /**
     * Подписаться на событие добавления контакта
     */
    listenAddContact : function() {
        var addContact = this.findBlockInside('add-contact');
        if(addContact) addContact.on('add', this.addContact.bind(this));
    },

    /**
     * Добавить контакт
     * @param {Object} e Объект события
     * @param {Object} data Объект данных по событию
     */
    addContact : function(e, data) {
        this.elem('list').append(data.html);
    },

    /**
     * Скрыть все детальные данные по всем контактам
     */
    hideAllDetails : function() {
        this._contacts.forEach(function(contact) {
            contact.hide();
        });
    }

});

provide(DOM);

});
