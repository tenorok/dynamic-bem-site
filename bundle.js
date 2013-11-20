var path = require('path'),
    fs = require('fs'),
    vm = require('vm'),

    bem = require('bem'),
    vow = require('vow');

/**
 * Добавляет новый бандл
 * @param {String} name Имя бандла
 * @param {Object} [context] Объект переменных, которые будут доступны глобально в BEMTREE
 *  по умолчанию в глобальный контекст пробрасываются: console, require, Vow
 * @constructor
 */
function Bundle(name, context) {
    this.name = name;
    this.context = context || {};
}

Bundle.prototype = {

    _getBEMTREE: function(BEMTREEPath) {

        var BEMTREEContent = fs.readFileSync(BEMTREEPath, 'utf-8'),

            context = bem.util.extend({

                console: console,
                require: require,

                Vow: vow

            }, this.context);

        vm.runInNewContext(BEMTREEContent, context);

        return context.BEMTREE;
    },

    getPath: function() {

        var bundlesPath = path.join(__dirname, 'desktop.bundles'),
            bundlePath = path.join(bundlesPath, this.name),

            BEMHTMLPath = path.join(bundlePath, this.name + '.bemhtml.js'),
            BEMTREEPath = path.join(bundlePath, this.name + '.bemtree.js');

        return {

            bundlesPath: bundlesPath,
            bundlePath: bundlePath,

            BEMHTMLPath: BEMHTMLPath,
            BEMTREEPath: BEMTREEPath,

            BEMHTML: require(BEMHTMLPath).BEMHTML,

            jsFile: '_' + this.name + '.js',
            cssFile: '_' + this.name + '.css'
        };
    },

    /**
     * Получить информацию по бандлу
     * @returns {Object}
     */
    getInfo: function() {

        var path = this.getPath();

        path.BEMTREE = this._getBEMTREE(path.BEMTREEPath);

        return this.info = path;
    },

    make: function() {
        return function(req, res, next) {
            if(process.env.NODE_ENV === 'production') { next(); return; }

            var info = this.info || this.getInfo();
            vow.when(bem.api.make({ verbosity: 'debug' }, [info.bundlePath])).then(function() {
                delete require.cache[info.BEMHTMLPath];
                this.info.BEMTREE = this._getBEMTREE(info.BEMTREEPath);
                next();
            }.bind(this));
        }.bind(this);
    }

};

module.exports.Bundle = Bundle;
