modules.define('i-bem__dom', function(provide, DOM) {

/**
 * @namespace
 * @name Contact
 */
DOM.decl('contact', /** @lends Contact.prototype */ {

    getDefaultParams: function() {
        return {
            slideDuration: 200
        };
    },

    /**
     * Скрыть/показать детальные данные по контакту
     * @returns {this}
     */
    toggle: function() {
        return this.hasMod('details') ? this.hide() : this.show();
    },

    /**
     * Показать детальные данные по контакту
     * @returns {this}
     */
    show: function() {
        this.emit('show');
        this.elem('more').slideDown(this.params.slideDuration);
        return this.setMod('details');
    },

    /**
     * Скрыть детальные данные по контакту
     * @returns {this}
     */
    hide: function() {
        this.emit('hide');
        this.elem('more').slideUp(this.params.slideDuration);
        return this.delMod('details');
    }

}, /** @lends Contact */ {

    live: function() {

        this
            .liveBindTo('click', function() {
                this.toggle();
            })
            .liveBindTo('phone-button email-link', 'click', function(e) {
                e.stopPropagation();
            });

        return false;
    }

});

provide(DOM);

});
