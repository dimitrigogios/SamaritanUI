module.exports = function(grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        //
        // watch for changes
        //
        watch: {
            options: {
                atBegin: true
            },
            sass: {
                files: './origin/scss/**/*.{scss,sass}',
                tasks: ['compass:watch']
            },
            js: {
                files: ['./origin/js/*.js',
                        './origin/js/plugins/**/*.js',
                        './origin/js/custom/**/*.js',
                        './origin/js/modules/**/*.js'],
                tasks: ['uglify:watch']
            }
        },

        //
        // sass compilation with compass
        //
        compass: {
            options: {
                require: 'breakpoint-slicer',
                sassDir: 'origin/scss',
                cssDir: 'properties/css',
                imagesDir: 'properties/images',
                specify: ['origin/scss/samaritanui.scss'],
                relativeAssets: true,
                noLineComments: true,
                bundleExec: true
            },
            watch: {
                options: {
                    environment: 'development',
                    noLineComments: false
                }
            },
            build: {
                options: {
                    outputStyle: 'compressed',
                    environment: 'production',
                    noLineComments: true
                }
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    './properties/css/samaritanui.min.css': ['./properties/css/samaritanui.css']
                }
            }
        },

        concat: {
            appjs: {
                src : ['./origin/js/components/jquery/*.js',
                      './origin/js/components/jqueryTouchEvents/jquery.mobile.events.min.js',
                      './origin/js/components/jqueryIdletimer/jquery.IdleTimer.min.js',
                      './origin/js/components/jqueryDateFormat/jqueryDateFormat.min.js',
                      './origin/js/components/jquery-ui/jquery-ui.min.js',
                      './origin/js/components/scrollTo/jquery.scrollTo.min.js',
                      './origin/js/components/angular/angular.min.js',
                      './origin/js/components/angular/angular.route.min.js',
                      './origin/js/components/angular/angular.touch.min.js',
                      './origin/js/components/angular/angulartics.min.js',
                      './origin/js/components/angular/angulartics-google-analytics.min.js',
                      './origin/js/components/angular/angular-scrollto.min.js',
                      './origin/js/components/angular/angular-scroll.min.js'],
                dest : 'properties/js/libs.min.js'
            }
        },

        uglify: {
            watch: {
                files: {
                    'properties/js/samaritanui.js': ['./origin/js/plugins/**/*.js',
                                             './origin/js/custom/**/*.js',
                                             './origin/js/modules/**/*.js',
                                             './origin/js/*.js']
                },
                options: {
                    compress: false,
                    mangle: false,
                    beautify: true
                }
            },
            build: {
                files: {
                    'properties/js/samaritanui.js': ['./origin/js/plugins/**/*.js',
                                             './origin/js/custom/**/*.js',
                                             './origin/js/modules/**/*.js',
                                             './origin/js/*.js']
                },
                options: {
                    sourceMap: true,
                    preserveComments: false,
                    mangle: true,
                    compress: {
                        drop_console: true
                    }
                }
            }
        },

        // Bower install/copy/move
        bowercopy: {
            options: {
                // Bower components folder will be removed afterwards 
                clean: true
            },
            // jQuery
            jquery: {
                options: {
                    destPrefix: 'origin/js/components/jquery/'
                },
                files: {
                    'jquery.min.js': 'jquery/dist/jquery.min.js'
                }
            },
            // jQuery idler
            jqueryIdleTimer: {
                options: {
                    destPrefix: 'origin/js/components/jqueryIdletimer/'
                },
                files: {
                    'jquery.idleTimer.min.js': 'jquery-idletimer/dist/idle-timer.min.js'
                }
            },
            // jquery Touch events
            jqueryTouchEvents: {
                options: {
                    destPrefix: 'origin/js/components/jqueryTouchEvents/'
                },
                files: {
                    'jquery.mobile.events.min.js': 'jquery-touch-events/src/1.0.1/jquery.mobile-events.min.js'
                }
            },
            // dateFormat
            jqueryDateFormat: {
                options: {
                    destPrefix: 'origin/js/components/jqueryDateFormat/'
                },
                files: {
                    'jqueryDateFormat.min.js': 'jquery-dateFormat/dist/jquery-dateFormat.min.js'
                }
            },
            // jquery-UI
            jqueryUI: {
                options: {
                    destPrefix: 'origin/js/components/jquery-ui/'
                },
                files: {
                    'jquery-ui.min.js': 'jquery-ui/jquery-ui.min.js'
                }
            },
            // AngularJS
            angular: {
                options: {
                    destPrefix: 'origin/js/components/angular/'
                },
                files: {
                    'angular.min.js': 'angular/angular.min.js',
                    'angular.route.min.js': 'angular-route/angular-route.min.js',
                    'angular.touch.min.js': 'angular-touch/angular-touch.min.js',
                    'angulartics.min.js': 'angulartics/dist/angulartics.min.js',
                    'angulartics-google-analytics.min.js': 'angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
                    'angular-scrollto.min.js': 'angular-scrollto/angular-scrollto.min.js',
                    'angular-scroll.min.js': 'angular-scroll/angular-scroll.min.js'
                },
            },
            // scrollTo
            scrollTo: {
                options: {
                    destPrefix: 'origin/js/components/scrollTo/'
                },
                files: {
                    'jquery.scrollTo.min.js': 'jquery.scrollTo/jquery.scrollTo.min.js'
                }
            }
        }

    });

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    grunt.registerTask('default', ['watch']);

    grunt.registerTask('build', ['compass:build', 'uglify:build', 'cssmin']);
    //grunt.registerTask('build', ['uglify:build', 'cssmin']);

    grunt.registerTask('bowr', ['bowercopy', 'build', 'concat:appjs']);
};
