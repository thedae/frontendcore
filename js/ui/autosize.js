;(function (window, document, oGlobalSettings, FrontendTools, FrontendCore, $) {
	'use strict';

	FrontendCore.define('autosize', [], function () {
		return {
			onStart: function () {

				var aTargets = FrontendTools.getDataModules('autosize'),
					self = this;

				FrontendTools.trackModule('JS_Libraries', 'call', 'autosize');

				$(aTargets).each(function () {
					self.autobind(this);
				});

			},
			autobind: function (oTarget, sData) {

				$(oTarget).addClass('animated height');

				$(oTarget).autosize();

				FrontendTools.removeLoading(oTarget);

			}
		};
	});

})(window, document, oGlobalSettings, FrontendTools, FrontendCore, $);
