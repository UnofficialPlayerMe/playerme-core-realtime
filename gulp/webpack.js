var fs = require('fs');
var path = require('path');
var projectRoot = process.cwd();
var nodeExternals = require('webpack-node-externals');

var make = function(filename, target, externals, alias, excludes){
    // https://webpack.github.io/docs/configuration.html
    var jsExcludes = [/node_modules/, /bower_components/];
    if (excludes){
        jsExcludes = jsExcludes.concat(excludes);
    }
    return {
        output: {
            filename: filename,
            library: ['PlayerMe', 'realtime']
        },
        module: {
            loaders: [
                {test: /\.js$/, loader: 'babel', exclude: jsExcludes}
            ]
        },
        resolve: {
            alias: alias
        },
        externals: externals,
        target: target
    };
};

var makeWeb = function(filename){
    var externals = {
        "player-core-models": "PlayerMe.models"
    };
    return make(filename, 'web', externals, {});
};
var makeNode = function(filename){
    var alias = {
        'player-core-models': path.join(projectRoot, 'dist/playerme.models.js')
    };
    var externals = nodeExternals();
    return make(filename, 'node', externals, alias, []);
};

module.exports = {
    make: make,
    makeWeb: makeWeb,
    makeNode: makeNode
};