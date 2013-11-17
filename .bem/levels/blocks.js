var PATH = require('path'),
    environ = require('bem-environ'),
    join = PATH.join,

    BEMCORE_TECHS = environ.getLibPath('bem-core', '.bem/techs');

exports.getTechs = function() {

    return {
        'vanilla.js'    : join(BEMCORE_TECHS, 'vanilla.js.js'),
        'browser.js'    : join(BEMCORE_TECHS, 'browser.js.js'),
        'node.js'       : join(BEMCORE_TECHS, 'node.js.js'),
        'css'           : 'css',
        'bemhtml'       : join(BEMCORE_TECHS, 'bemhtml.js')
    };

};

exports.defaultTechs = ['css', 'js', 'bemhtml'];
