var path = require('path');
var projectRoot = process.cwd();

var make = function(filename, target, externals, alias){
    // https://webpack.github.io/docs/configuration.html
    var jsExcludes = [/node_modules/, /bower_components/];
    return {
        output: {
            filename: filename,
            library: ['PlayerMe', 'Realtime']
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
        // "player-core-models": "PlayerMe.models",
    };
    return make(filename, 'web', externals, {});
};
var makeNode = function(filename){
    var alias = {
        // 'player-core-models': path.join(projectRoot, 'node_modules/playerme-core-models/src/entry')
    };
    return make(filename, 'node', {}, alias);
};

module.exports = {
    make: make,
    makeWeb: makeWeb,
    makeNode: makeNode
};