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

    /**
     * @typedef bundlePathInfo
     * @type {Object}
     * @property {String} bundlesPath Путь до всех бандлов
     * @property {String} bundlePath Путь до текущего бандла
     * @property {String} BEMHTMLFile Путь до BEMHTML-файла бандла
     * @property {String} BEMTREEFile Путь до BEMTREE-файла бандла
     * @property {String} jsFile Путь до JS-файла бандла
     * @property {String} cssFile Путь до CSS-файла бандла
     */

    /**
     * Получить информацию по путям до директорий и файлов бандла
     * @returns {bundlePathInfo} Объект с информацией по путям для бандла
     */
    getPath: function() {

        var bundlesPath = path.join(__dirname, 'desktop.bundles'),
            bundlePath = path.join(bundlesPath, this.name),

            BEMHTMLFile = path.join(bundlePath, this.name + '.bemhtml.js'),
            BEMTREEPath = path.join(bundlePath, this.name + '.bemtree.js');

        return {

            bundlesPath: bundlesPath,
            bundlePath: bundlePath,

            BEMHTMLFile: BEMHTMLFile,
            BEMTREEFile: BEMTREEPath,

            jsFile: '_' + this.name + '.js',
            cssFile: '_' + this.name + '.css'
        };
    },

    /**
     * Получить информацию по бандлу
     * @property {Object} bundlePathInfo.BEMHTML Объект для работы с BEMHTML
     * @property {Object} bundlePathInfo.BEMTREE Объект для работы с BEMTREE
     * @returns {bundlePathInfo}
     */
    getInfo: function() {

        var path = this.getPath();

        path.BEMHTML = require(path.BEMHTMLFile).BEMHTML;
        path.BEMTREE = this._getBEMTREE(path.BEMTREEFile);

        return this.info = path;
    },

    /**
     * Собрать бандл
     * @returns {Function}
     */
    make: function() {
        return function(req, res, next) {
            if(process.env.NODE_ENV === 'production') { next(); return; }

            var info = this.info || this.getInfo();
            vow.when(bem.api.make({ verbosity: 'debug' }, [info.bundlePath])).then(function() {
                delete require.cache[info.BEMHTMLPath];
                this.info.BEMTREE = this._getBEMTREE(info.BEMTREEFile);
                next();
            }.bind(this)).done();
        }.bind(this);
    },

    /**
     * Получить переменную BEMTREE с нужным контекстом
     * @param {String} BEMTREEFile Путь до BEMTREE-файла бандла
     * @returns {Object}
     * @private
     */
    _getBEMTREE: function(BEMTREEFile) {

        var BEMTREEContent = fs.readFileSync(BEMTREEFile, 'utf-8'),

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
