TinyCore.AMD.define('dropdown', ['devicePackage'], function () {
	return {
		oOpened: false,
		onStart: function () {

			var aTargets = FC.getDataModules('dropdown'),
				self = this;

			self.bindClickOutside();

			$(aTargets).each(function () {

				var oThis = this;

				$('.navigation-dropdown > a', oThis).bind('click', function (event) {

					event.preventDefault();

					self.hideDropdowns(oThis, this);

					self.slideToggle(this);
				});

			});

			FC.trackEvent('JS_Libraries', 'call', 'dropdown');

		},
		bindClickOutside: function () {
			var self = this;
			$(document).bind('click', function (event) {
				if (event.target != self.oOpened && event.target.nodeName !== 'A') {
					self.hideDropdowns();
				}
			});
		},
		hideDropdowns: function (oContainer, oTarget) {

			$('.navigation-dropdown ul', oContainer).each(function () {

				var sTarget = oTarget !== undefined? oTarget.href.split('#')[1] : '';

				if (sTarget != this.id){
					this.style.display = 'none';
				}
			});

			this.oOpened = false;

		},
		slideToggle: function (oTarget) {

			var sHref = oTarget.href;

			if (sHref.indexOf('#') !== -1) {
				$(document.getElementById(sHref.split('#')[1])).slideToggle('fast');
				this.oOpened = oTarget;
			}

		}
	};
});