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
                    'src/js/app/routeService.js',
                    'src/js/app/apiService.js',
                    'src/js/app/eventService.js',
                    'src/js/app/AppController.js',
                    'src/js/app/HomeController.js'
                ],
                dest: 'www/assets/js/build/<%= pkg.name %>-app-src.js',
                build: 'www/assets/js/build/<%= pkg.name %>-app-min.js'
            },
            plugins: {
                src: [
                    'src/js/plugins/log.js'

                ],
                dest: 'www/assets/js/build/<%= pkg.name %>-plugins-src.js',
                build: 'www/assets/js/build/<%= pkg.name %>-plugins-min.js'
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
                    {expand: false, src: 'www/index.html', dest: 'www/index-dev.html', filter: 'isFile'}

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
                src: 'www/assets/css/site.css',
                dest: 'www/assets/css/site.css'
            }
        },

        scriptlinker: {
            src: {
                options: {
                    startTag: '<!--SCRIPTS-->',
                    endTag: '<!--SCRIPTS END-->',
                    fileTmpl: '<script src="../%s"></script>',
                    appRoot: ''
                },
                files: {
                    // Target-specific file lists and/or options go here.
                    'www/index-dev.html': ['<%= concat.plugins.src %>', '<%= concat.app.src %>']
                }
            }
        },

        imagemin: {                          // Task

            dynamic: {                         // Another target
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'www/assets/img/',                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'www/assets/img/'                  // Destination path prefix
                }]
            }
        },

        exec: {
            test:  "ls -l"
        }


    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-scriptlinker')
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('build', ['newer:copy', 'newer:scriptlinker', 'newer:concat', 'newer:uglify', 'autoprefixer']);

    grunt.registerTask('dist', ['copy', 'scriptlinker', 'concat', 'uglify', 'compass', 'autoprefixer']);



};