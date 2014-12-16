'use strict';
module.exports = function (grunt) {
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            js: {
                src: ['*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        mochacli: {
            options: {
                reporter: 'spec',
                bail: true
            },
            all: ['test/*.js']
        },
        watch: {
            files: ['*.js', 'test/**/*.js'],
            tasks: ['jshint', 'mochacli']
        },
        release: {
            options: {}
        }
    });

    grunt.registerTask('default', ['jshint', 'mochacli']);
};
