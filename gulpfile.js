var gulp          = require('gulp');
var path          = require('path');
var nodemon       = require('gulp-nodemon');

var Env = {};
try{
    Env = require('./env');
}catch(e){}


gulp.task('default', ['run:node']);

gulp.task('run:node', function() {

    var env = {
        'NODE_ENV': 'development'
    };
    for (var envKey in Env) env[envKey] = Env[envKey];

    var stream = nodemon({
        env: env
        ,   script: './index.js'
        ,   watch: 'src'
        ,   ext: 'js'
//      ,   ignore: ['ignored.js']
        ,   tasks: ['build:node']
    });

    stream.on('start',   function(){ console.log('[nodemon] started'   ); });
    stream.on('restart', function(){ console.log('[nodemon] restarted' ); });
    stream.on('exit',    function(){ console.log('[nodemon] quit'      ); });
    stream.on('crash',   function(){ console.log('[nodemon] crashed'   ); });

    return stream;
});
