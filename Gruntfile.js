module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-lib-phantomjs']
    });
    require('time-grunt')(grunt);

    var config = {
        src: 'src',
        spec: 'spec',
        web: 'web',
        pkg: require('./package.json'),
        banner: grunt.file.read('./LICENSE_BANNER'),
        jsFiles: module.exports.jsFiles
    };

    grunt.initConfig({
        conf: config,

        concat: {
            options : {
                process: true,
                sourceMap: true,
                banner : '<%= conf.banner %>'
            },
            js: {
                src: '<%= conf.jsFiles %>',
                dest: '<%= conf.pkg.name %>.js'
            }
        },
        uglify: {
            jsmin: {
                options: {
                    mangle: true,
                    compress: true,
                    sourceMap: true,
                    banner : '<%= conf.banner %>'
                },
                src: '<%= conf.pkg.name %>.js',
                dest: '<%= conf.pkg.name %>.min.js'
            }
        },
        jscs: {
            old: {
                src: ['<%= conf.spec %>/**/*.js'],
                options: {
                    validateIndentation: 4
                }
            },
            source: {
                src: ['<%= conf.src %>/**/*.js', '!<%= conf.src %>/{banner,footer}.js', 'Gruntfile.js',
                      'grunt/*.js', '<%= conf.web %>/stock.js'],
                options: {
                    config: '.jscsrc'
                }
            }
        },
        jshint: {
            source: {
                src: ['<%= conf.src %>/**/*.js', 'Gruntfile.js', 'grunt/*.js', '<%= conf.web %>/stock.js'],
                options: {
                    jshintrc: '.jshintrc',
                    ignores: ['<%= conf.src %>/banner.js', '<%= conf.src %>/footer.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['<%= conf.src %>/**/*.js'],
                tasks: ['docs']
            },
            tests: {
                files: ['<%= conf.src %>/**/*.js', '<%= conf.spec %>/**/*.js'],
                tasks: ['test']
            },
            reload: {
                files: ['<%= conf.pkg.name %>.js',
                        '<%= conf.pkg.name %>css',
                        '<%= conf.web %>/js/<%= conf.pkg.name %>.js',
                        '<%= conf.web %>/css/<%= conf.pkg.name %>.css',
                        '<%= conf.pkg.name %>.min.js'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8888,
                    base: '.'
                }
            }
        },
        emu: {
            api: {
                src: '<%= conf.pkg.name %>.js',
                dest: '<%= conf.web %>/docs/api-latest.md'
            }
        },
        toc: {
            api: {
                src: '<%= emu.api.dest %>',
                dest: '<%= emu.api.dest %>'
            }
        },
        markdown: {
            html: {
                src: '<%= emu.api.dest %>',
                dest: '<%= conf.web %>/docs/index.html'
            },
            options: {markdownOptions: {highlight: 'manual'}}
        },
        copy: {
            'dc-to-gh': {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: [
                            '<%= conf.pkg.name %>.css',
                            'node_modules/dc/dc.css',
                            'node_modules/datatables/media/css/jquery.dataTables.css',
                        ],
                        dest: '<%= conf.web %>/css/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: [
                            '<%= conf.pkg.name %>.js',
                            '<%= conf.pkg.name %>.js.map',
                            '<%= conf.pkg.name %>.min.js',
                            '<%= conf.pkg.name %>.min.js.map',
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/d3/dist/d3.js',
                            'node_modules/dc/dc.js',
                            'node_modules/datatables/media/js/jquery.dataTables.js',
                            'node_modules/crossfilter2/crossfilter.js'
                        ],
                        dest: '<%= conf.web %>/js/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            'node_modules/datatables/media/images/*'
                        ],
                        dest: '<%= conf.web %>/images'
                    },
                ]
            }
        },
        'gh-pages': {
            options: {
                base: '<%= conf.web %>',
                message: 'Synced from from master branch.'
            },
            src: ['**']
        },
        shell: {
            merge: {
                command: function (pr) {
                    return [
                        'git fetch origin',
                        'git checkout master',
                        'git reset --hard origin/master',
                        'git fetch origin',
                        'git merge --no-ff origin/pr/' + pr + ' -m \'Merge pull request #' + pr + '\''
                    ].join('&&');
                },
                options: {
                    stdout: true,
                    failOnError: true
                }
            },
            amend: {
                command: 'git commit -a --amend --no-edit',
                options: {
                    stdout: true,
                    failOnError: true
                }
            },
            hooks: {
                command: 'cp -n scripts/pre-commit.sh .git/hooks/pre-commit' +
                    ' || echo \'Cowardly refusing to overwrite your existing git pre-commit hook.\''
            }
        },
        browserify: {
            dev: {
                src: '<%= conf.pkg.name %>.js',
                dest: 'bundle.js',
                options: {
                    browserifyOptions: {
                        standalone: 'dc'
                    }
                }
            }
        }
    });

    // custom tasks
    grunt.registerMultiTask('emu', 'Documentation extraction by emu.', function () {
        var emu = require('emu'),
            srcFile = this.files[0].src[0],
            destFile = this.files[0].dest,
            source = grunt.file.read(srcFile);
        grunt.file.write(destFile, emu.getComments(source));
        grunt.log.writeln('File \'' + destFile + '\' created.');
    });
    grunt.registerTask('merge', 'Merge a github pull request.', function (pr) {
        grunt.log.writeln('Merge Github Pull Request #' + pr);
        grunt.task.run(['shell:merge:' + pr, 'test' , 'shell:amend']);
    });
    grunt.registerMultiTask('toc', 'Generate a markdown table of contents.', function () {
        var marked = require('marked'),
            slugify = function (s) { return s.trim().replace(/[-_\s]+/g, '-').toLowerCase(); },
            srcFile = this.files[0].src[0],
            destFile = this.files[0].dest,
            source = grunt.file.read(srcFile),
            tokens = marked.lexer(source),
            toc = tokens.filter(function (item) {
                return item.type === 'heading' && item.depth === 2;
            }).reduce(function (toc, item) {
                return toc + '  * [' + item.text + '](#' + slugify(item.text) + ')\n';
            }, '');

        grunt.file.write(destFile, '# dc.datatables.js API\n' + toc + '\n' + source);
        grunt.log.writeln('Added TOC to \'' + destFile + '\'.');
    });
    grunt.registerTask('test-stock-example', 'Test a new rendering of the stock example web page against a ' +
                       'baseline rendering', function (option) {
                           require('./regression/stock-regression-test.js').testStockExample(this.async(), option === 'diff');
                       });
    grunt.registerTask('update-stock-example', 'Update the baseline stock example web page.', function () {
        require('./regression/stock-regression-test.js').updateStockExample(this.async());
    });

    // task aliases
    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('docs', ['build', 'copy', 'emu', 'toc', 'markdown']);
    grunt.registerTask('web', ['docs', 'gh-pages']);
    grunt.registerTask('server', ['docs', 'connect:server', 'watch:scripts']);
    grunt.registerTask('test', ['build', 'jasmine:specs', 'shell:hooks']);
    grunt.registerTask('test-browserify', ['build', 'browserify', 'jasmine:browserify']);
    grunt.registerTask('coverage', ['build', 'jasmine:coverage']);
    grunt.registerTask('ci', ['test', 'jasmine:specs:build', 'connect:server', 'saucelabs-jasmine']);
    grunt.registerTask('ci-pull', ['test', 'jasmine:specs:build', 'connect:server']);
    grunt.registerTask('lint', ['build', 'jshint', 'jscs']);
    grunt.registerTask('default', ['build']);
};

module.exports.jsFiles = [
    'src/banner.js',   // NOTE: keep this first
    'src/core.js', // then this!
    'src/datatable.js',
    'src/footer.js'  // NOTE: keep this last
];
