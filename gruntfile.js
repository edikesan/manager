module.exports = function (grunt) {
    grunt.initConfig({

    // package name define
    pkg: grunt.file.readJSON('package.json'),   

    // define source files and their destinations
    uglify: {
       min: {
            options: {
                banner: '/*\n' +
                    ' * <%= pkg.name %> - v<%= pkg.version %>\n' +
                    ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    ' * <%= pkg.description %>\n' +
                    ' *\n' +
                    ' * All right reserved. Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                    ' */\n'
            },
            files: grunt.file.expandMapping(['assets/**/**/**/*.js','!assets/**/**/**/*.min.js','!assets/**/**/**/bootstrap.js'], '', {
                rename: function(destBase, destPath) {
                    return destBase+destPath.replace('.js', '.min.js');
                }
            })
        }
    },
    watch: {
        files:['assets/**/**/**/*.min.js'],
        tasks: ['default']
    },
    clean: ["assets/vendors"],   
    jshint: {
      // You get to make the name
      // The paths tell JSHint which files to validate
        all: ['assets/**/**/**/*.js'],
        options: {
            reporter: require('jshint-stylish'),
            globals: {
                jQuery: true
            },
        }
    },
    cssmin:{
        target: {
            files: grunt.file.expandMapping(['assets/vendors/**/**/*.css','!assets/vendors/**/**/*.min.css'], '', {
                rename: function(destBase, destPath) {
                    return destBase+destPath.replace('.css', '.min.css','');
                }
            })
        }
    },
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');


// register at least this one task
grunt.registerTask('default', [ 'jshint','uglify','cssmin' ]);


};