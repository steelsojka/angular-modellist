module.exports = function(grunt) {

	var buildHeader = [
		"/**",
		" * <%= pkg.name %> v<%= pkg.version %> by <%= pkg.author %>",
		" * <%= pkg.repository.url %>",
		" * License: <%= pkg.license %>",
		" */"
	].join("\n");

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		jshint: {
			files: ["src/*.js"],
			options: grunt.file.readJSON(".jshintrc")
		},
		uglify: {
			options: {
				banner: buildHeader,
				sourceMap: true,
				sourceMapName: "build/<%= pkg.name %>.map"
			},
			dist: {
				files: {
					'build/<%= pkg.name %>.min.js': ["src/ModelList.js"]
				}
			}
		},
    clean: ["build"],
		karma: {
      angular: {
        configFile: "karma.conf.js"
      }
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-karma");

  grunt.registerTask("test", ["jshint", "karma"]);

  grunt.registerTask("build", [
    "clean",
    "uglify"
  ]);

	grunt.registerTask("default", ["build"]);
};
