module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-usemin");
    grunt.loadNpmTasks("grunt-rev");


    grunt.initConfig({
        concurrent: {
            dev: {
                tasks: ['nodemon:debug','node-inspector'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'app.js'
            },
            debug: {
                script: 'app.js',
                options: {
                    nodeArgs: ['--debug']
                }
            }
        },
        jshint: {
        	options : {
        		force : true
        	},
        	myFiles : ['model/*.js','email/*.js','db/*.js','routes/*.js','static/js/**/*.js']
        },
        'node-inspector': {
            dev: {}
        },
        clean: {
            main: ["build", '.tmp'],
            build: ["build/static/js","build/static/css","build/static/lib",
                '.tmp'],
            dist: ["dist"]
        },
        copy: {
            main: {
                expand: true,
                src: [ "**","!node_modules/"],
                dest: "build/"
            },
            dist: {
                expand: true,
                cwd: "dist",
                src: ["**"],
                dest: "build/static"
            }
        },
        rev: {
            files: {
                src: ["build/**/**/*.{js.css}"]
            }
        },

        useminPrepare: {
            html: "build/views/index.html",
            options: {
                root: "static"
            }
        },
        usemin: {
            html: ["build/views/index.html"]
        },
        uglify: {
            options: {
                report: "min",
                mangle: false
            }
        }

    });

    grunt.registerTask('jshint', ['jshint']);
    grunt.registerTask('debug', ['concurrent']);
    grunt.registerTask('default',['nodemon:dev']);
    grunt.registerTask("minify", [
        "copy:main", "useminPrepare", "concat", "uglify", "cssmin", "rev", "usemin", "clean:build", "copy:dist", "clean:dist"
    ]);
}
