if (!oGlobalSettings.sPathJs) oGlobalSettings.sPathJs = 'js/';
if (!oGlobalSettings.sPathJsModules) oGlobalSettings.sPathJsModules = oGlobalSettings.sPathJs + 'modules';
if (!oGlobalSettings.sPathJsLibs) oGlobalSettings.sPathJsLibs = oGlobalSettings.sPathJs + '../../';
if (!oGlobalSettings.sPathJsCore) oGlobalSettings.sPathJsCore = oGlobalSettings.sPathJs + '../../';
if (!oGlobalSettings.sPathCss) oGlobalSettings.sPathCss = './css/';
if (!oGlobalSettings.sPathCssUI) oGlobalSettings.sPathCssUI = oGlobalSettings.sPathCss + 'ui.css';
if (!oGlobalSettings.bTrackModules) oGlobalSettings.bTrackModules = false;
if (!oGlobalSettings.sHash) oGlobalSettings.sHash = '1';
if (!oGlobalSettings.oPaths) oGlobalSettings.oPaths = {};

var oDefaultPaths = {
		libs: oGlobalSettings.sPathJs,
		polyfillsLibs : oGlobalSettings.sPathJsCore + "shims/polyfiller"
	},
	aModules = [
		'code',
		'sortable',
		'charts',
		'chartLibs',
		'tags',
		'modal',
		'autocomplete',
		'autosize',
		'graph',
		'stats',
		'wysiwyg',
		'truncate',
		'tip',
		'cart',
		'polyfills',
		'parallax',
		'carousel',
		'table',
		'table-responsive',
		'toggle',
		'tabs','notification',
		'dropdown',
		'center-box',
		'side-panel',
		'form-validation',
		'form-validation-libs',
		'responsive-images-libs',
		'image-zoom',
		'image-edit',
		'select-search'
	];

for (var nKey = 0; nKey < aModules.length; nKey++) {

	oDefaultPaths[aModules[nKey]] = oGlobalSettings.oPaths[aModules[nKey]] !== undefined ? oGlobalSettings.oPaths[aModules[nKey]] : oGlobalSettings.sPathJsCore + 'ui/' + aModules[nKey].replace('', '');
}

var oPaths = FrontendTools.mergeJSON( oDefaultPaths, oGlobalSettings.oPaths);

FrontendCore.config( {
	require : {
		urlArgs: "v=" + oGlobalSettings.sHash,
		baseUrl : oGlobalSettings.sPathJsModules,
		paths : oPaths,
		shim: {
			"parsley": {
				"deps" : ["jquery"],
				"exports" : "parsley"
			}
		}
	}
});
