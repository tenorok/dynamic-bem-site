modules.define('i-bem__dom', function(provide, BEMDOM) {

/**
 * @namespace
 * @name Contacts
 */
BEMDOM.decl('contacts', /** @lends Contacts.prototype */ {

    onSetMod: {

        js: {
            inited: function() {
                this.listenShowContact();
                this.listenAddContact();
            }
        }

    },

    /**
     * Подписаться на событие разворачивания детальной информации по контакту
     */
    listenShowContact: function() {
        BEMDOM.blocks['contact'].on(this.domElem, 'show', this.hideAllDetails, this);
    },

    /**
     * Подписаться на событие добавления контакта
     */
    listenAddContact: function() {
        var addContact = this.findBlockInside('add-contact');
        if(addContact) addContact.on('add', this.addContact, this);
    },

    /**
     * Добавить контакт
     * @param {Object} e Объект события
     * @param {Object} data Объект данных по событию
     */
    addContact: function(e, data) {
        this.elem('list').append(data.html);
    },

    /**
     * Скрыть все детальные данные по всем контактам
     */
    hideAllDetails: function() {
        this.findBlocksInside('contact').forEach(function(contact) {
            contact.hide();
        });
    }

});

provide(BEMDOM);

});
