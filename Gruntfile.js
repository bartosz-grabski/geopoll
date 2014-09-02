module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-concurrent');

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
        }
    });

    grunt.registerTask('jshint', ['jshint']);
    grunt.registerTask('debug', ['concurrent']);
    grunt.registerTask('default',['nodemon:dev']);
}
