TinyCore.AMD.define('toggle', [], function () {
	return {
		aAnimations: ['flash','bounce','shake','tada','pulse','rubberband','fade','swing','tada','wobble','flip','rotate','slide','hinge','roll'],
		aVariations: [
			['-in', '-out'],
			['-up', '-down'],
			['-left', '-right']
		],
		onStart: function () {

			var aTargets = oTools.getDataModules('toggle'),
				self = this;

			$(aTargets).each(function () {

				var oThis = this;

                $(oThis).bind('click', function (event) {

                    event.preventDefault();

                    if (oThis.getAttribute("data-tc-class") !== null) {
                        self.toggleClass(oThis);
                    } else if (oThis.getAttribute("data-tc-animation") !== null) {
                        self.toggleAnimation(oThis);
                    } else {
                        self.slideToggle(oThis);
                    }
                });

			});

            oTools.trackModule('JS_Libraries', 'call', 'toggle');

		},
		getOpositeAnimation: function (sClass) {

			var sClassOposite = sClass || '',
				sWhite,
				sBlack,
				aVariations = this.aVariations;

			for (var nKey = 0; nKey < aVariations.length; nKey++) {
				sWhite = aVariations[nKey][0];
				sBlack = aVariations[nKey][1];

				if (sClass.indexOf(sWhite) !== -1) {
					sClassOposite = sClassOposite.replace(sWhite, sBlack);
				} else if (sClass.indexOf(sBlack) !== -1) {
					sClassOposite = sClassOposite.replace(sBlack, sWhite);
				}
			}

			return sClassOposite;
		},
		cleanAnimations: function (sClass) {
			var aAnimations = this.aAnimations,
				aClassNames = sClass.split(' '),
				nIndex;

			for (var nKey = 0; nKey < aAnimations.length; nKey++) {
				nIndex = aClassNames.indexOf(aAnimations[nKey]);
				if ( nIndex !== -1) {
					aClassNames.splice(nIndex, 1);
				}
			}

			nIndex = aClassNames.indexOf('animated');

			if (nIndex == -1) {
				aClassNames.push('animated');
			}


			return aClassNames.toString().replace(',',' ');

		},
		toggleAnimation: function (oThis) {

			var self = this,
				sClassOposite = '',
                sHref = oThis.href,
				sClassName = oThis.getAttribute('data-tc-animation') || '',
				$Target = null,
				sTargetClassName;

				if (sHref.indexOf('#') !== -1) {
					$Target = $(document.getElementById(sHref.split('#')[1]));
				}

				sTargetClassName = $Target.attr('class');

				sClassOposite = self.getOpositeAnimation(sClassName);

				$Target.attr('class',self.cleanAnimations(sTargetClassName));

				$Target.removeClass(sClassOposite).addClass(sClassName);

				$(oThis).attr('data-tc-animation', sClassOposite);

		},
		toggleClass: function (oThis) {

			var self = this,
                sHref = oThis.href,
                sClassName = oThis.getAttribute('data-tc-class') || '';

            if (sHref.indexOf('#') !== -1) {
                $(document.getElementById(sHref.split('#')[1])).toggleClass(sClassName, 'bounce-out');
            }

		},
		slideToggle: function (oThis) {

			var self = this,
                sHref = oThis.href;

            if (sHref.indexOf('#') !== -1) {
                $(document.getElementById(sHref.split('#')[1])).slideToggle();
            }

		}
	};
});