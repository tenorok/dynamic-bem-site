/* jshint node:true */
/* global MAKE */

require('bem-environ/lib/nodes');

MAKE.decl('Arch', {

    blocksLevelsRegexp: /^.+?\.blocks/,
    bundlesLevelsRegexp: /^.+?\.bundles$/,

    getLibraries: function() {

        return {
            'libs/bem-core': {
                type: 'git',
                url: 'git://github.com/bem/bem-core.git',
                treeish: '7584dfc71b5e971a45bf3a3571dcabd39a6a75f0'
            },
            'libs/bem-components': {
                type: 'git',
                url: 'git://github.com/bem/bem-components.git',
                treeish: '231b03867325a51a33ae6bdd300b12946944a4de'
            }
        };

    }

});


MAKE.decl('BundleNode', {

    getTechs: function() {

        return [
            'bemjson.js',
            'bemdecl.js',
            'deps.js',
            'bemhtml',
            'bemtree',
            'browser.js+bemhtml',
            'css',
            'html'
        ];

    },

    'create-browser.js+bemhtml-optimizer-node': function(tech, sourceNode, bundleNode) {
        sourceNode.getFiles().forEach(function(f) {
            this['create-js-optimizer-node'](tech, this.ctx.arch.getNode(f), bundleNode);
        }, this);
    }

});
