var oGlobalSettings = {
	sPathJs: '../static/js/',
	sPathJsCore: '../',
	sPathJsModules: '../static/js/modules/',
	sPathJsLibs: '../static/js/libs/',
	sPathCss: '../static/css/',
	bResponsiveImages: true
};

window.define = function (sModuleName, aDependencies, fpCreator) {
	fpCreator.apply(null, aDependencies);
};

window.require = function (aModulesNames, fpCallback) {
	if (fpCallback !== undefined) {
		fpCallback.apply(null, aModulesNames);
	}
};

window.require.config = function () {
};