module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        nodemon: {
            dev: {
                script: 'app.js'
            }
        },
        jshint: {
        	options : {
        		force : true
        	},
        	myFiles : ['model/*.js','email/*.js','db/*.js','routes/*.js','static/js/**/*.js']
        }
    });

    grunt.registerTask('default', ['jshint','nodemon']);

}
