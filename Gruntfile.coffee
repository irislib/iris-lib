'use strict'

module.exports = (grunt) ->
  # Show elapsed time at the end
  require('time-grunt') grunt
  # Load all grunt tasks
  require('load-grunt-tasks') grunt
  grunt.initConfig
    jshint:
      options:
        jshintrc: '.jshintrc'
        reporter: require('jshint-stylish')
      js: src: [ '*.js' ]
    mochaTest:
      options:
        reporter: 'spec'
        bail: true
        require: 'coffee-script/register'
      all: [ 'test/*.coffee' ]
    watch:
      files: [
        '*.js'
        'test/**/*.coffee'
      ]
      tasks: [
        'jshint'
        'mochaTest'
      ]
    release: options: {}
  grunt.registerTask 'default', [
    'jshint'
    'mochaTest'
  ]
