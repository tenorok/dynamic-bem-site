var path = require('path'),
    fs = require('fs'),
    vm = require('vm'),

    bem = require('bem'),
    bemLevel = bem.require('./level'),
    vow = require('vow');

/**
 * @class Bundle
 * @property {String} bundlesPath   Путь до всех бандлов
 * @property {String} bundlePath    Путь до текущего бандла
 * @property {String} BEMHTMLFile   Путь до BEMHTML-файла бандла
 * @property {String} BEMTREEFile   Путь до BEMTREE-файла бандла
 * @property {String} jsFileName    Имя JS-файла бандла
 * @property {String} cssFileName   Имя CSS-файла бандла
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
            bundlePath = path.join(bundlesPath, this.name);

        this.path = bundlePath;

        this.BEMHTMLFile = path.join(bundlePath, this.name + '.bemhtml.js');
        this.BEMTREEFile = path.join(bundlePath, this.name + '.bemtree.js');

        this.depsFile = path.join(bundlePath, this.name + '.deps.js');

        this.jsFileName = '_' + this.name + '.js';
        this.cssFileName = '_' + this.name + '.css';

        this.jsFile = path.join(bundlePath, this.jsFileName);
        this.cssFile = path.join(bundlePath, this.cssFileName);
    },

    /**
     * Установить информацию по собранным файлам
     */
    setInfo: function() {
        delete require.cache[this.BEMHTMLFile];
        this.BEMHTML = require(this.BEMHTMLFile).BEMHTML;
        this.BEMTREE = this._getBEMTREE();
    },

    /**
     * Собрать бандл
     * @returns {Function}
     */
    make: function() {
        return function(req, res, next) {

            if(process.env.NODE_ENV === 'production') {
                this.setInfo();
                next();
                return;
            }

            process.env.BEMHTML_ENV = 'development';

            bemLevel.resetLevelsCache();
            bem.api.make({ verbosity: 'debug' }, [this.path]).then(function() {
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
