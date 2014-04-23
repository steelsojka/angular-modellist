module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		jshint: {
			files: ["src/*.js"],
			options: grunt.file.readJSON(".jshintrc")
		},
		uglify: {
			dist: {
				files: {
					'build/<%= pkg.name %>.min.js': ["src/ModelList.js"]
				}
			}
		},
		karma: {
			unit: {
				configFile: "karma.conf.js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-karma");

	grunt.registerTask("default", ["uglify"]);
};
