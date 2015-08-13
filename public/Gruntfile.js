module.exports = function(grunt){
    var appConfig = {
        projectName: require('./bower.json').name + 'App',//added by stone
        cwd: 'javascripts',
        dest: 'build',
        pkg: grunt.file.readJSON('package.json')
    };

	// 项目配置
    grunt.initConfig({
        config: appConfig,
        uglify : {
            build : {
                src : 'javascripts/**/*.js',
                dest : 'dest/<%= pkg.name %>.min.js'
            }
        },
        clean: {
            server: '<%= config.dest %>'
        },
        ngtemplates: {//后期添加，打包模板
            dist: {
                cwd: '<%= config.cwd %>',
                src: [
                    './app/view/**/*.html'//这里的./很重要，必须和指令里的templateUrl等一致，否则应用运行时，模板无法加载
                ],
                dest: '<%= config.dest %>/ngtemplates.js',
                options: {
                    module: '<%= config.projectName %>',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: false,//必须为false，否则usemin的正则无法匹配
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: false, //removing this as it can removes properties that can be used when styling
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }
        },
        ngAnnotate: {
            dist: {
                files: [
                    {

                        expand: true,
                        src: ['app/**/*.js'],
                        ext: '.annotated.js', // Dest filepaths will have this extension.
                        extDot: 'last',
                        cwd: '<%= config.cwd %>',
                        dest: '<%= config.dest %>'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-templates');

    // 默认任务
    grunt.registerTask('default', ['clean','ngtemplates','ngAnnotate']);
}
