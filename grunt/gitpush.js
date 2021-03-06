module.exports = {
		scss: {
			options: {
				cwd: "./../scss",
				remote: "origin",
				branch: "master",
				tags: true
			}
		},
		js: {
			options: {
				cwd: "./../js",
				remote: "origin",
				branch: "master",
				tags: true
			}
		},
		site: {
			options: {
				cwd: "./../site/build/",
				remote: "origin",
				branch: "master",
				tags: true
			}
		},
		generator: {
			options: {
				cwd: "./../generator/",
				remote: "origin",
				branch: "master",
				tags: true
			}
		},
		workspace: {
			options: {
				cwd: "./",
				remote: "origin",
				branch: "master",
				tags: true
			}
		}
};