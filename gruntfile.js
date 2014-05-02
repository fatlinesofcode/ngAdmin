/*
 Config.js
 ParallaxScroll.js
 FormUtil.js
 booter.js
 */
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            app: {
                src: [
                    'src/js/app/booter.js',
                    'src/js/app/AppConfig.js',
                    'src/js/app/filters.js',
                    'src/js/app/directives/ngCkeditor.js',
                    'src/js/app/directives/ngFileReaderImage.js',
                    'src/js/app/directives/ngInputName.js',
                    'src/js/app/directives/ngSvgLoading.js',
                    'src/js/app/routeService.js',
                    'src/js/app/apiService.js',
                    'src/js/app/eventService.js',
                    'src/js/app/AppController.js',
                    'src/js/app/SidebarController.js',
                    'src/js/app/ModalInstanceController.js',
                    'src/js/app/EditController.js',
                    'src/js/app/ListController.js',
                    'src/js/app/LoginController.js',
                    'src/js/app/HomeController.js'
                ],
                dest: 'www/_cms/assets/js/build/<%= pkg.name %>-app-src.js',
                build: 'www/_cms/assets/js/build/<%= pkg.name %>-app-min.js'
            },
            plugins: {
                src: [
                    'src/bower/angular-deferred-bootstrap/angular-deferred-bootstrap.js',
                    'src/js/plugins/ui-bootstrap-tpls-0.11.0-SNAPSHOT.js',
                    'src/js/plugins/log.js',
                    'src/js/utils/md5.js',
                    'src/js/plugins/canvasResize/binaryajax.js',
                    'src/js/plugins/canvasResize/exif.js',
                    'src/js/plugins/canvasResize/canvasResize.js'

                ],
                dest: 'www/_cms/assets/js/build/<%= pkg.name %>-plugins-src.js',
                build: 'www/_cms/assets/js/build/<%= pkg.name %>-plugins-min.js'
            }
        },
        uglify: {
            app: {
                files: {
                    '<%= concat.app.build %>': ['<%= concat.app.dest %>']
                }
            },
            plugins: {
                files: {
                    '<%= concat.plugins.build %>': ['<%= concat.plugins.dest %>']
                }
            }
        },

        watch: {
            options: { nospawn: true },
            scripts: {
                files: ['<%= concat.app.src %>'],
                tasks: ['scriptlinker', 'concat', 'uglify']
            }
        },

        copy: {
            index: {
                files: [
                    // includes files within path
                    {expand: false, src: 'www/_cms/index.html', dest: 'www/_cms/index.dev.html', filter: 'isFile'}

                ]
            },
            cms: {
                files: [
                    {expand: true, src: ['www/_cms/**'], dest: '/Users/phil/Sites/git/clients/project/'}

                ]
            }

        },

        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        autoprefixer: {
            options: {
                // Task-specific options go here.
            },
            files: {
                src: 'www/_cms/assets/css/site.css',
                dest: 'www/_cms/assets/css/site.css'
            }
        },

        scriptlinker: {
            src: {
                options: {
                    startTag: '<!--SCRIPTS-->',
                    endTag: '<!--SCRIPTS END-->',
                    fileTmpl: '<script src="../../%s"></script>',
                    appRoot: ''
                },
                files: {
                    // Target-specific file lists and/or options go here.
                    'www/_cms/index.dev.html': ['<%= concat.plugins.src %>', '<%= concat.app.src %>']
                }
            }
        },

        imagemin: {                          // Task

            dynamic: {                         // Another target
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'www/_cms/assets/img/',                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'www/_cms/assets/img/'                  // Destination path prefix
                }]
            }
        },

        minjson: {
            build: {
                files: {
                    'www/_cms/assets/config.min.json':
                        'www/_cms/assets/config.json'
                }
            }
        },


        protractor: {
            options: {
                configFile: "node_modules/protractor/referenceConf.js", // Default config file
                keepAlive: true, // If false, the grunt process stops when the test fails.
                noColor: false, // If true, protractor will not use colors in its output.
                args: {
                    // Arguments passed to the command
                }
            },
            your_target: {
                options: {
                    configFile: "test/protractor-conf.js", // Target-specific config file
                    args: {} // Target-specific arguments
                }
            },
        },

        exec: {
            gitpush : 'git push origin master',
            pushgithub : 'git push github master',
            pushheroku : 'git push heroku master'
        }




    });



    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    grunt.registerTask('build', ['newer:copy:index', 'newer:scriptlinker', 'newer:concat', 'newer:uglify', 'autoprefixer']);

    grunt.registerTask('dist', ['copy:index', 'scriptlinker', 'concat', 'uglify', 'compass', 'autoprefixer']);

    grunt.registerTask('test', ['protractor']);

    grunt.registerTask('deploy', ['exec:gitpush', 'exec:pushgithub', 'exec:pushheroku']);

    grunt.registerTask('default', ['dist']);

};