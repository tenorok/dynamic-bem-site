var PATH = require('path'),
    environ = require('bem-environ'),
    join = PATH.join,

    BEMCORE_TECHS = environ.getLibPath('bem-core', '.bem/techs');

exports.getTechs = function() {

    return {
        'bemjson.js'         : '',
        'bemdecl.js'         : 'v2/bemdecl.js',
        'deps.js'            : 'v2/deps.js',
        'js'                 : 'v2/js-i',
        'vanilla.js'         : join(BEMCORE_TECHS, 'vanilla.js.js'),
        'browser.js'         : join(BEMCORE_TECHS, 'browser.js.js'),
        'browser.js+bemhtml' : join(BEMCORE_TECHS, 'browser.js+bemhtml.js'),
        'css'                : 'v2/css',
        'bemhtml'            : join(BEMCORE_TECHS, 'bemhtml.js'),
        'bemtree'            : join(BEMCORE_TECHS, 'bemtree.js'),
        'html'               : join(BEMCORE_TECHS, 'html.js')
    };

};

exports.defaultTechs = ['bemjson.js'];
