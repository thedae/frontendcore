; (function (window, document,oGlobalSettings, FrontendTools, FrontendCore, FrontendMediator, $, Pen) {
	'use strict';

	FrontendCore.define('wysiwyg', [], function () {
		return {
			sPathCss: oGlobalSettings.sPathCssUI + '?v=' + oGlobalSettings.sHash,
			mediator :  FrontendMediator,
			bResize : false,
			_oConstants : {
				EDITOR_SUFIX : '-editor',
				TEXTAREA_SUFIX : '-textarea',
				TEXTAREA_CLASS : 'fc-wysiwyg-textarea',
				FULLSCREEN_EDITABLE_CLASS: 'fc-wysiwyg-full-screen',
				TextHelp : 'Select some text to get some formatting options.',
				TextVisual : '<i class="icon-eye"></i> VISUAL',
				TextHtml : '<i class="icon-code"></i> HTML',
				TextFullscreen : '<i class="icon-arrows-alt"></i> FULLSCREEN',
				TextMinscreen : '<i class="icon-minus"></i> MINIMIZE'
			},
			oDefault: {
				class: 'fc-wysiwyg', // {String} class of the editor,
				debug: false, // {Boolean} false by default
				stay: false, // {Boolean} false by default
				list: ['bold', 'italic', 'underline','insertunorderedlist','createlink'] // editor menu lis
			},
			onStart: function () {

				var aTargets = FrontendTools.getDataModules('wysiwyg'),
					self = this;

				FrontendTools.loadCSS(this.sPathCss);

				FrontendTools.trackModule('JS_Libraries', 'call', 'wysiwyg' );

				$(aTargets).each(function () {
					if ( this.getAttribute('data-fc-active') !== 'true') {

						this.setAttribute('data-fc-active', 'true');
						self.autobind(this);
					}
				});

				self.fDatePollyfill();

				self.mediator.subscribe( 'close:wysiwyg', this.closeFormatOptions );

			},
			fDatePollyfill: function() {
				if (!Date.now) {
					Date.now = function() { return new Date().getTime(); };
				}
			},
			closeFormatOptions : function() {
				$('.fc-wysiwyg-menu').hide();
			},
			updateTextarea : function(sId, oTarget) {

				oTarget.value = document.getElementById(sId).innerHTML == '<br>' ? '' : document.getElementById(sId).innerHTML;
			},
			updateEditArea : function(sId, oTarget) {

				document.getElementById(sId).innerHTML = $('#' + oTarget.id).val();
			},
			createEditArea: function(sId, oTarget, oText){
				var oEditArea = document.createElement('div');

				oEditArea.id = sId;
				oEditArea.className = 'fc-wysiwyg';
				oEditArea.innerHTML = $(oTarget).text();
				oEditArea.setAttribute('data-help', oText.help );

				return oEditArea;
			},
			createLink: function( sId, sName, sText ) {

				var oLink = document.createElement('a');

				oLink.innerHTML = sText;
				oLink.href = '#';
				oLink.id = sName + '-' + sId;
				oLink.className = 'button button-slim';

				return oLink;
			},
			createLinkGroup : function ( aElements) {
				var oLinkGroup = document.createElement('div');
				oLinkGroup.className= 'fc-wysiwyg-switch button-group ph-n';

				for (var nKey = 0; nKey < aElements.length; nKey++) {
					oLinkGroup.appendChild(aElements[nKey]);
				}
				return oLinkGroup;
			},
			bindForm : function(sId, oTarget) {

				var self = this;

				$('#' + sId).parents('form').on('submit', function() {

					if ( $('#' + sId).is(':visible') ) {
						self.updateEditArea(sId, oTarget );
					} else {
						self.updateTextarea(sId, oTarget);
					}

				});
			},
			bindHtmlButton : function(sId, oTarget, oText) {

				var self = this;


				$(oTarget).on('focus', function(){
					$(this).parent().find('.fc-wysiwyg-switch').fadeIn();
				}).on('blur', function(){
					$(this).parent().find('.fc-wysiwyg-switch').fadeOut();
					self.updateEditArea(sId, oTarget );
				});

				$('#html-' + sId).on('click', function (event) {

					event.preventDefault();

					$('#' + sId).toggle();

					$('#'+ oTarget.id).toggleClass(self._oConstants.TEXTAREA_CLASS);

					if ( $('#' + sId).is(':visible') ) {
						this.innerHTML = oText.html;
						self.updateEditArea(sId, oTarget );
						$('#' + sId).focus();
					} else {

						$(oTarget).focus();

						if (self.bResize === false ) {

							// @todo not to call directly to autosize
							require(['autosize'], function() {
								$(oTarget).autosize();
							});
							self.bResize = true;
						}

						self.closeFormatOptions();
						this.innerHTML = oText.visual;
						self.updateTextarea(sId, oTarget);
					}
				});

			},
			bindScreenButton: function(sId, oTarget, oText) {

				var self = this;

				$('#screen-' + sId).on('click', function (event) {

					event.preventDefault();

					$('#' + sId).toggleClass(self._oConstants.FULLSCREEN_EDITABLE_CLASS);

					$('#'+ oTarget.id).toggleClass(self._oConstants.FULLSCREEN_EDITABLE_CLASS);

					$(this).parent().toggleClass('fc-wysiwyg-switch-full-screen');

					$('.pen-menu').toggleClass('pen-menu-full-screen');

					if (this.innerHTML.indexOf(oText.minscreen) == -1) {

						$('body').css({'overflow':'hidden', 'height':'100%'});
						this.innerHTML = oText.minscreen;

					} else {

						$('body').css({'overflow':'auto', 'height':'auto'});
						this.innerHTML = oText.fullscreen;

					}

				});
			},
			bindTextarea: function(sId, oTarget) {

				var self = this;

				$('#' + sId).on('blur', function() {
					self.updateTextarea(sId, oTarget);
					$(this).parent().find('.fc-wysiwyg-switch').fadeOut();

				}).on('focus', function(){
					$(this).parent().find('.fc-wysiwyg-switch').fadeIn();
				});

			},
			getText: function(oTarget) {
				var self = this,
					oText = {},
					sName;

				var aText = ['visual','help','fullscreen','minscreen','html'];

				for (var nKey = 0; nKey < aText.length; nKey++) {

					sName = aText[nKey];

					if ( oTarget.getAttribute('data-fc-text-' + sName ) !== null) {
						oText[ sName ] = oTarget.getAttribute('data-fc-text-' + sName );
					} else {
						oText[ sName ] = self._oConstants['Text' + sName.charAt(0).toUpperCase() + sName.slice(1) ];
					}

				}

				return oText;
			},
			autobind: function (oTarget) {

				// To help CSS to position the buttons
				$(oTarget).parent().css('position','relative');

				var oOptions = {},
					self = this,
					oText = self.getText(oTarget),
					sDate = Math.floor(Date.now() / 1000),
					sId = oTarget.id ? oTarget.id + self._oConstants.EDITOR_SUFIX : sDate + self._oConstants.EDITOR_SUFIX,
					sValues = oTarget.getAttribute('data-fc-format-options'),
					oEditArea = self.createEditArea(sId, oTarget, oText),
					oSettings,
					editor,
					aValues,
					oLinkHTML,
					oLinkScreen,
					oLinkGroup,
					aLinks = [];

				// If the textarea has no id we assigned a new one
				if (oTarget.id === '') {
					oTarget.id = sDate + self._oConstants.TEXTAREA_SUFIX;
				}

				if (window.navigator.userAgent.indexOf('MSIE') === -1) {
					// check if the HTML option is enabled and creates the button
					if (oTarget.getAttribute("data-fc-html") !== null) {
						if (oTarget.getAttribute("data-fc-html") !== 'false') {
							oLinkHTML = self.createLink(sId, 'html', oText.html);
							aLinks.push(oLinkHTML);
						}
					} else {
						oLinkHTML = self.createLink(sId, 'html', oText.html);
						aLinks.push(oLinkHTML);
					}

					// check if the Fullscreen option is enabled and creates the button
					if (oTarget.getAttribute("data-fc-fullscreen") !== null) {
						if (oTarget.getAttribute("data-fc-fullscreen") !== 'false') {
							oLinkScreen = self.createLink(sId, 'screen', oText.fullscreen);
							aLinks.push(oLinkScreen);
						}
					} else {
						oLinkScreen = self.createLink(sId, 'screen', oText.fullscreen);
						aLinks.push(oLinkScreen);
					}
				}

				// If there are buttons append all of them after the Target
				if (aLinks.length > 0 ) {
					oLinkGroup = self.createLinkGroup(aLinks);
					$(oTarget).after(oLinkGroup);
				}

				// Add the class to the textarea
				oTarget.className = self._oConstants.TEXTAREA_CLASS + ' fc-wysiwyg-html';


				// Append the link group and the edit area
				$(oTarget).before(oEditArea);

				// Set the editor and the textarea target
				oOptions.editor = document.getElementById(sId);
				oOptions.textarea = oTarget;

				// Get the format options to show the buttons on the toolbox
				if (sValues !== null) {

					aValues = sValues.split(',');

					oOptions.list = [];

					for( var nKey = 0; aValues.length > nKey; nKey++){
						oOptions.list.push(aValues[nKey]);
					}

				}

				// Call the editor with the options
				oSettings = FrontendTools.mergeOptions(self.oDefault, oOptions);

				editor = new Pen(oSettings);

				self.bindForm(sId, oTarget, oText);
				self.bindTextarea(sId, oTarget, oText);

				if (window.navigator.userAgent.indexOf('MSIE') === -1) {

					if ( oTarget.getAttribute("data-fc-html") !== null ) {
						if (oTarget.getAttribute("data-fc-html") !== 'false') {
							self.bindHtmlButton(sId, oTarget, oText);
						}
					} else {
						self.bindHtmlButton(sId, oTarget, oText);
					}


					if ( oTarget.getAttribute("data-fc-fullscreen") !== null ) {
						if (oTarget.getAttribute("data-fc-fullscreen") !== 'false') {
							self.bindScreenButton(sId, oTarget, oText);
						}
					} else {
						self.bindScreenButton(sId, oTarget, oText);
					}
				}

				// Clean Paste

				$('div[contenteditable]').bind("paste", function(e){
					e.preventDefault();
					var text = e.originalEvent.clipboardData.getData('text');
					document.execCommand("insertHTML", false, text);
				});

				FrontendTools.removeLoading(oTarget);

			},
			onStop: function () {
				this.sPathCss = null;
			},
			onDestroy: function () {
				delete this.sPathCss;
			}
		};
	});

})(window, document, oGlobalSettings, FrontendTools, FrontendCore, FrontendMediator, $, Pen );
