var path = require('path'),
    fs = require('fs'),
    vm = require('vm'),

    bem = require('bem'),
    vow = require('vow');

/**
 * @class Bundle
 * @property {String} bundlesPath   Путь до всех бандлов
 * @property {String} bundlePath    Путь до текущего бандла
 * @property {String} BEMHTMLFile   Путь до BEMHTML-файла бандла
 * @property {String} BEMTREEFile   Путь до BEMTREE-файла бандла
 * @property {String} jsFile        Путь до JS-файла бандла
 * @property {String} cssFile       Путь до CSS-файла бандла
 * @property {Object} BEMHTML       Объект для работы с BEMHTML
 * @property {Object} BEMTREE       Объект для работы с BEMTREE
 */

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

    this._setPath();
}

Bundle.prototype = {

    /**
     * Установить информацию по путям до директорий и файлов бандла
     */
    _setPath: function() {

        var bundlesPath = path.join(__dirname, 'desktop.bundles'),
            bundlePath = path.join(bundlesPath, this.name),

            BEMHTMLFile = path.join(bundlePath, this.name + '.bemhtml.js'),
            BEMTREEPath = path.join(bundlePath, this.name + '.bemtree.js');

        this.path = bundlePath;

        this.BEMHTMLFile = BEMHTMLFile;
        this.BEMTREEFile = BEMTREEPath;

        this.jsFile = '_' + this.name + '.js';
        this.cssFile = '_' + this.name + '.css';
    },

    /**
     * Установить информацию по собранным файлам
     */
    setInfo: function() {
        this.BEMHTML = require(this.BEMHTMLFile).BEMHTML;
        this.BEMTREE = this._getBEMTREE();
    },

    /**
     * Очистить собранные до этого файлы
     * @private
     */
    _clearInfoCache: function() {
        delete require.cache[this.BEMHTMLFile];
        fs.existsSync(this.BEMTREEFile) && fs.unlinkSync(this.BEMTREEFile);
    },

    /**
     * Собрать бандл
     * @returns {Function}
     */
    make: function() {
        return function(req, res, next) {
            if(process.env.NODE_ENV === 'production') { next(); return; }

            this._clearInfoCache();
            vow.when(bem.api.make({ verbosity: 'debug' }, [this.path])).then(function() {
                this.setInfo();
                next();
            }.bind(this)).done();
        }.bind(this);
    },

    /**
     * Получить переменную BEMTREE с нужным контекстом
     * @returns {Object}
     * @private
     */
    _getBEMTREE: function() {

        var BEMTREEContent = fs.readFileSync(this.BEMTREEFile, 'utf-8'),

            context = bem.util.extend({

                console: console,
                require: require,

                Vow: vow

            }, this.context);

        vm.runInNewContext(BEMTREEContent, context);

        return context.BEMTREE;
    }

};

module.exports.Bundle = Bundle;
